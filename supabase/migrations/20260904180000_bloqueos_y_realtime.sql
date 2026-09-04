-- 1) Bloquear usuarios: dejás de verlo y deja de verte.
-- 2) Realtime en amistades, para el badge de solicitudes.

-- ─────────────────────────────────────────────────────────────────────────
-- Bloqueos
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists bloqueos (
  bloqueador_id uuid not null references auth.users(id) on delete cascade,
  bloqueado_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (bloqueador_id, bloqueado_id),
  constraint bloqueos_no_uno_mismo check (bloqueador_id <> bloqueado_id)
);

comment on table bloqueos is 'Bloqueos entre usuarios. Se aplican en las dos direcciones.';

create index if not exists bloqueos_bloqueado_idx on bloqueos (bloqueado_id);

alter table bloqueos enable row level security;

-- Sólo se leen los bloqueos propios: nadie tiene forma de enterarse de que
-- lo bloquearon. El ocultamiento en la otra dirección lo hacen las vistas.
create policy "bloqueos: leer los propios"
  on bloqueos for select to authenticated
  using (auth.uid() = bloqueador_id);

create policy "bloqueos: bloquear en nombre propio"
  on bloqueos for insert to authenticated
  with check (auth.uid() = bloqueador_id);

create policy "bloqueos: desbloquear los propios"
  on bloqueos for delete to authenticated
  using (auth.uid() = bloqueador_id);

grant select, insert, delete on bloqueos to authenticated;

-- Para poder listar (y desbloquear) a los bloqueados hay que poder leer su
-- nombre, aunque no sean visibles y ya no haya amistad entre medio.
create policy "perfiles_publicos: leer el de los que bloqueé"
  on perfiles_publicos for select
  to authenticated
  using (
    exists (
      select 1 from bloqueos b
      where b.bloqueador_id = auth.uid() and b.bloqueado_id = perfiles_publicos.user_id
    )
  );

-- Helper: ¿hay bloqueo entre estos dos, en cualquier dirección? Va como
-- security definer porque las policies que lo usan necesitan ver también los
-- bloqueos que el usuario no puede leer (los que le hicieron a él).
create or replace function hay_bloqueo(a uuid, b uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from bloqueos x
    where (x.bloqueador_id = a and x.bloqueado_id = b)
       or (x.bloqueador_id = b and x.bloqueado_id = a)
  );
$$;

-- Bloquear también corta la relación que hubiera: amistad o solicitud.
create or replace function cortar_amistad_al_bloquear()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from amistades
  where (solicitante_id = new.bloqueador_id and destinatario_id = new.bloqueado_id)
     or (solicitante_id = new.bloqueado_id and destinatario_id = new.bloqueador_id);
  return new;
end;
$$;

drop trigger if exists on_bloqueo_cortar_amistad on bloqueos;
create trigger on_bloqueo_cortar_amistad
  after insert on bloqueos
  for each row execute function cortar_amistad_al_bloquear();

-- No se puede volver a mandar solicitud a alguien con quien hay un bloqueo.
drop policy if exists "amistades: pedir en nombre propio" on amistades;
create policy "amistades: pedir en nombre propio"
  on amistades for insert
  to authenticated
  with check (
    auth.uid() = solicitante_id
    and estado = 'pendiente'
    and not hay_bloqueo(auth.uid(), destinatario_id)
    and exists (
      select 1 from perfiles_publicos p
      where p.user_id = destinatario_id and p.buscable
    )
  );

-- ─────────────────────────────────────────────────────────────────────────
-- Las vistas dejan de mostrar a los bloqueados
-- ─────────────────────────────────────────────────────────────────────────
-- La búsqueda pasa a leer esta vista en vez de la tabla, para que el filtro
-- de bloqueos valga en las dos direcciones sin exponer quién bloqueó a quién.
create or replace view perfiles_buscables
with (security_invoker = false) as
select p.user_id, p.nombre, p.carrera_id
from perfiles_publicos p
where p.buscable
  and not hay_bloqueo(auth.uid(), p.user_id);

comment on view perfiles_buscables is 'Perfiles visibles para el usuario actual, ya sin los bloqueados.';

revoke all on perfiles_buscables from anon;
grant select on perfiles_buscables to authenticated;

create or replace view comisiones_publicas
with (security_invoker = false) as
select
  um.user_id,
  um.materia_id,
  um.comision
from usuario_materias um
join perfiles_publicos p on p.user_id = um.user_id
where um.estado = 'cursando'
  and um.comision is not null
  and not hay_bloqueo(auth.uid(), um.user_id)
  and (
    p.buscable
    or exists (
      select 1 from amistades a
      where a.estado = 'aceptada'
        and (
          (a.solicitante_id = auth.uid() and a.destinatario_id = um.user_id) or
          (a.destinatario_id = auth.uid() and a.solicitante_id = um.user_id)
        )
    )
  );

revoke all on comisiones_publicas from anon;
grant select on comisiones_publicas to authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- Realtime en amistades
-- ─────────────────────────────────────────────────────────────────────────
-- Para que el badge de solicitudes se entere sin esperar a que el usuario
-- navegue. Realtime respeta las policies: a cada uno le llegan sólo las
-- filas que ya podía leer.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'amistades'
  ) then
    alter publication supabase_realtime add table amistades;
  end if;
end $$;
