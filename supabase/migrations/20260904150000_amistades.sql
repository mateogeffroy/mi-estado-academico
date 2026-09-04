-- Amistades: perfil público mínimo (nombre + carrera) y solicitudes.
--
-- Es autocontenida a propósito: NO depende de usuarios_perfil ni del catálogo
-- relacional de 20260809*, que todavía no están aplicados en producción. Sólo
-- usa auth.users y usuario_carreras, que sí existen.
--
-- Alcance decidido: un amigo ve nombre y carrera. Nada de progreso, notas ni
-- horarios.

-- ─────────────────────────────────────────────────────────────────────────
-- Perfil público (opt-in)
-- ─────────────────────────────────────────────────────────────────────────
-- buscable arranca en false: nadie aparece en las búsquedas hasta que lo
-- activa a mano. Son nombres de personas reales, así que opt-in y no opt-out.
-- carrera_id se guarda acá, denormalizado, en vez de leerse de
-- usuario_carreras: esa tabla es privada de cada usuario y abrirla para que
-- terceros la lean sería exponer todas las carreras de todos. Acá viaja sólo
-- la carrera activa, y sólo de quien se ofreció a aparecer.
create table if not exists perfiles_publicos (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  carrera_id text,
  buscable boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table perfiles_publicos is 'Nombre visible para la búsqueda de gente. buscable = opt-in explícito.';

alter table perfiles_publicos enable row level security;

-- Se puede leer el propio perfil siempre, y el de terceros sólo si se
-- ofrecieron a aparecer en las búsquedas.
create policy "perfiles_publicos: leer buscables y el propio"
  on perfiles_publicos for select
  to authenticated
  using (buscable or auth.uid() = user_id);

create policy "perfiles_publicos: insertar el propio"
  on perfiles_publicos for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "perfiles_publicos: actualizar el propio"
  on perfiles_publicos for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on perfiles_publicos to authenticated;

-- Búsqueda por nombre: ilike sobre lower(nombre).
-- ponytail: índice simple, alcanza para el padrón actual. Si la búsqueda se
-- pone lenta, pasar a pg_trgm (create extension pg_trgm; índice gin
-- lower(nombre) gin_trgm_ops).
create index if not exists perfiles_publicos_nombre_idx
  on perfiles_publicos (lower(nombre))
  where buscable;

-- ─────────────────────────────────────────────────────────────────────────
-- Amistades
-- ─────────────────────────────────────────────────────────────────────────
-- Una fila por relación, con dirección: quién la pidió y quién la recibió.
-- El par ordenado es la PK, así que no puede haber dos solicitudes iguales.
create table if not exists amistades (
  solicitante_id uuid not null references auth.users(id) on delete cascade,
  destinatario_id uuid not null references auth.users(id) on delete cascade,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aceptada')),
  created_at timestamptz not null default now(),
  primary key (solicitante_id, destinatario_id),
  constraint amistades_no_uno_mismo check (solicitante_id <> destinatario_id)
);

comment on table amistades is 'Solicitudes de amistad y amistades aceptadas.';

-- Para listar "solicitudes que me llegaron" sin escanear la tabla entera.
create index if not exists amistades_destinatario_idx on amistades (destinatario_id);

alter table amistades enable row level security;

-- Cada uno ve sólo las relaciones en las que participa.
create policy "amistades: leer las propias"
  on amistades for select
  to authenticated
  using (auth.uid() = solicitante_id or auth.uid() = destinatario_id);

-- Sólo se puede pedir amistad en nombre propio, y sólo a alguien que se
-- ofreció a aparecer en las búsquedas.
create policy "amistades: pedir en nombre propio"
  on amistades for insert
  to authenticated
  with check (
    auth.uid() = solicitante_id
    and estado = 'pendiente'
    and exists (
      select 1 from perfiles_publicos p
      where p.user_id = destinatario_id and p.buscable
    )
  );

-- Aceptar es lo único que se puede actualizar, y sólo lo hace quien recibió
-- la solicitud. Rechazar y desamigarse son un delete.
create policy "amistades: aceptar la que me llegó"
  on amistades for update
  to authenticated
  using (auth.uid() = destinatario_id)
  with check (auth.uid() = destinatario_id and estado = 'aceptada');

create policy "amistades: borrar las propias"
  on amistades for delete
  to authenticated
  using (auth.uid() = solicitante_id or auth.uid() = destinatario_id);

grant select, insert, update, delete on amistades to authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- Alta automática del perfil
-- ─────────────────────────────────────────────────────────────────────────
-- El nombre sale de los metadatos de auth (full_name o name los completa el
-- login con Google); si no hay ninguno, queda la parte local del mail.
create or replace function public.crear_perfil_publico()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.perfiles_publicos (user_id, nombre)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(new.raw_user_meta_data ->> 'name', ''),
      split_part(new.email, '@', 1)
    )
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_perfil_publico on auth.users;
create trigger on_auth_user_created_perfil_publico
  after insert on auth.users
  for each row execute function public.crear_perfil_publico();

-- Backfill de los usuarios que ya existen. Siguen en buscable = false hasta
-- que cada uno lo active.
insert into public.perfiles_publicos (user_id, nombre, carrera_id)
select
  u.id,
  coalesce(
    nullif(u.raw_user_meta_data ->> 'full_name', ''),
    nullif(u.raw_user_meta_data ->> 'name', ''),
    split_part(u.email, '@', 1)
  ),
  (select c.carrera_id from public.usuario_carreras c where c.user_id = u.id limit 1)
from auth.users u
on conflict (user_id) do nothing;
