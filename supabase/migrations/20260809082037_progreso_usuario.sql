-- Tablas nuevas de progreso de usuario que se apoyan en el catálogo
-- relacional (materia_id como FK real en vez de string por convención).
--
-- Migración puramente aditiva: NO toca usuario_materias, usuario_carreras ni
-- usuario_eventos (las tablas de progreso que usa la app hoy). El cutover de
-- esas tablas para que referencien materias(id) por FK real, en vez del
-- string histórico, queda para cuando el refactor de la capa de aplicación
-- (Fase 2, arquitectura hexagonal) esté listo para consumirlas. Ver
-- ARCHITECTURE.md.

-- ─────────────────────────────────────────────────────────────────────────
-- Perfil de usuario
-- ─────────────────────────────────────────────────────────────────────────
-- Reemplaza el uso de auth.user_metadata como único lugar para datos de
-- perfil, que no escala si se agregan más campos más adelante.
create table usuarios_perfil (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  universidad_activa_id uuid references universidades(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table usuarios_perfil is 'Datos de perfil de la app, separados de auth.users.';

alter table usuarios_perfil enable row level security;
create policy "usuarios_perfil: leer propio" on usuarios_perfil for select using (auth.uid() = user_id);
create policy "usuarios_perfil: insertar propio" on usuarios_perfil for insert with check (auth.uid() = user_id);
create policy "usuarios_perfil: actualizar propio" on usuarios_perfil for update using (auth.uid() = user_id);
grant select, insert, update on usuarios_perfil to authenticated;

-- Crea automáticamente la fila de perfil cuando se registra un usuario nuevo.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.usuarios_perfil (user_id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill para usuarios que ya existían antes de esta migración.
insert into usuarios_perfil (user_id, full_name)
select id, raw_user_meta_data ->> 'full_name' from auth.users
on conflict (user_id) do nothing;

-- ─────────────────────────────────────────────────────────────────────────
-- Votos de dificultad
-- ─────────────────────────────────────────────────────────────────────────
-- Separa el voto personal (privado, uno por usuario y materia) del promedio
-- público que hoy se calcula reutilizando la columna usuario_materias.dificultad
-- para dos cosas a la vez (progreso propio + estadística comunitaria).
create table materia_dificultad_votos (
  user_id uuid not null references auth.users(id) on delete cascade,
  materia_id uuid not null references materias(id) on delete cascade,
  voto smallint not null check (voto between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, materia_id)
);

comment on table materia_dificultad_votos is 'Voto privado de dificultad de un usuario para una materia (1 a 5).';

alter table materia_dificultad_votos enable row level security;
create policy "materia_dificultad_votos: leer propio" on materia_dificultad_votos for select using (auth.uid() = user_id);
create policy "materia_dificultad_votos: insertar propio" on materia_dificultad_votos for insert with check (auth.uid() = user_id);
create policy "materia_dificultad_votos: actualizar propio" on materia_dificultad_votos for update using (auth.uid() = user_id);
create policy "materia_dificultad_votos: borrar propio" on materia_dificultad_votos for delete using (auth.uid() = user_id);
grant select, insert, update, delete on materia_dificultad_votos to authenticated;

-- Vista agregada de solo lectura: no expone el voto individual de nadie,
-- solo el promedio y el total. Al ser una vista (no RLS-invoker), calcula
-- sobre todas las filas aunque el llamador solo pueda leer las propias en
-- la tabla base, igual que la RPC obtener_estadisticas_materia actual.
create view materia_dificultad_stats as
  select materia_id, avg(voto)::numeric(3, 2) as promedio, count(*)::integer as total_votos
  from materia_dificultad_votos
  group by materia_id;

comment on view materia_dificultad_stats is 'Promedio público de dificultad por materia. No expone votos individuales.';

grant select on materia_dificultad_stats to anon, authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- Horarios personalizados de cursada
-- ─────────────────────────────────────────────────────────────────────────
-- Reemplaza la columna usuario_materias.horarios_custom (jsonb sin esquema)
-- por filas propias, validables y consultables.
create table usuario_horarios_custom (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  materia_id uuid not null references materias(id) on delete cascade,
  dia text not null,
  hora_inicio time not null,
  hora_fin time not null,
  cuatrimestre text, -- 'Anual', '1º Cuatrimestre', '2º Cuatrimestre'
  created_at timestamptz not null default now(),
  check (hora_fin > hora_inicio)
);

comment on table usuario_horarios_custom is 'Bloques horarios que un usuario arma a mano para una materia sin comisiones precargadas.';

create index idx_horarios_custom_usuario_materia on usuario_horarios_custom(user_id, materia_id);

alter table usuario_horarios_custom enable row level security;
create policy "usuario_horarios_custom: propio" on usuario_horarios_custom
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select, insert, update, delete on usuario_horarios_custom to authenticated;
