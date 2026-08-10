-- Catálogo académico: universidades, carreras, materias, correlatividades y comisiones.
--
-- Migración puramente aditiva: no modifica ni referencia las tablas usuario_*
-- existentes (usuario_materias, usuario_carreras, usuario_eventos). El cutover
-- de esas tablas para que referencien este catálogo por FK real, en vez de por
-- convención de nombres, queda para una migración posterior junto con el
-- refactor de la capa de aplicación que las consume (ver ARCHITECTURE.md).

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────
-- Universidades
-- ─────────────────────────────────────────────────────────────────────────
create table universidades (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nombre text not null,
  created_at timestamptz not null default now()
);

comment on table universidades is 'Instituciones educativas soportadas (UTN, UNLP, etc.).';

alter table universidades enable row level security;
create policy "universidades: lectura pública" on universidades for select using (true);

-- ─────────────────────────────────────────────────────────────────────────
-- Carreras
-- ─────────────────────────────────────────────────────────────────────────
create table carreras (
  id uuid primary key default gen_random_uuid(),
  universidad_id uuid not null references universidades(id) on delete restrict,
  -- id histórico tipo 'utn-sistemas-2023': se conserva como slug estable
  -- porque hoy vive en localStorage y en las tablas usuario_* existentes.
  slug text not null unique,
  nombre text not null,
  plan text,
  titulo_intermedio text,
  titulo_final text,
  creditos_totales integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_carreras_universidad on carreras(universidad_id);
comment on table carreras is 'Carreras/planes de estudio ofrecidos por cada universidad.';

alter table carreras enable row level security;
create policy "carreras: lectura pública" on carreras for select using (true);

-- ─────────────────────────────────────────────────────────────────────────
-- Materias
-- ─────────────────────────────────────────────────────────────────────────
-- Cada materia pertenece a exactamente una carrera. Contenidos dictados en
-- más de una carrera (ej. "Matemática 1" en Licenciatura en Sistemas y en
-- Licenciatura en Informática de UNLP, mismo código 'SI101') se modelan como
-- filas independientes: se verificó contra los datos reales que, aunque
-- nombre y contenido coinciden, la correlatividad exigida difiere según la
-- carrera (una la pide como "cursada", otra como "aprobada"). Compartir la
-- materia vía una tabla puente habría forzado una única correlatividad para
-- ambas carreras, corrompiendo esa regla. Ver ARCHITECTURE.md.
create table materias (
  id uuid primary key default gen_random_uuid(),
  carrera_id uuid not null references carreras(id) on delete cascade,
  -- id histórico dentro del archivo TS de origen (ej. 'SIS-13', 'SI101', 'CNE').
  -- Único dentro de una carrera, NO globalmente.
  codigo text not null,
  numero text, -- orden de presentación en el plan (ej. '01', 'E1', 'SEM', 'PPS'); no siempre numérico
  nombre text not null,
  nivel integer,
  carga_horaria text, -- texto libre tal cual la fuente ('5 hs/sem', '200Hrs', 'Extra'...)
  duracion text, -- '1', '2', 'A', 'C', 'Ingreso'... cuando la materia (no la comisión) define una duración fija
  es_electiva boolean not null default false,
  es_placeholder_electiva boolean not null default false,
  horas_anuales_electiva integer,
  horas_anuales_requeridas integer, -- 'targetHours' de los placeholders de electivas
  es_seminario boolean not null default false,
  fuera_de_plan boolean not null default false, -- 'isOutdated'
  solo_ingenieria boolean not null default false, -- 'onlyIngenieria', flag muy específico de electivas UTN Sistemas
  created_at timestamptz not null default now(),
  unique (carrera_id, codigo)
);

create index idx_materias_carrera on materias(carrera_id);
comment on table materias is 'Materias de cada carrera. codigo es único dentro de una carrera, no globalmente.';

alter table materias enable row level security;
create policy "materias: lectura pública" on materias for select using (true);

-- ─────────────────────────────────────────────────────────────────────────
-- Correlatividades
-- ─────────────────────────────────────────────────────────────────────────
create type tipo_correlatividad as enum ('cursada', 'aprobada');

create table correlatividades (
  materia_id uuid not null references materias(id) on delete cascade,
  requisito_id uuid not null references materias(id) on delete cascade,
  tipo tipo_correlatividad not null,
  primary key (materia_id, requisito_id, tipo),
  check (materia_id <> requisito_id)
);

comment on table correlatividades is 'Para cursar/aprobar materia_id se necesita requisito_id en el estado "tipo".';

alter table correlatividades enable row level security;
create policy "correlatividades: lectura pública" on correlatividades for select using (true);

-- ─────────────────────────────────────────────────────────────────────────
-- Comisiones y horarios
-- ─────────────────────────────────────────────────────────────────────────
create table comisiones (
  id uuid primary key default gen_random_uuid(),
  materia_id uuid not null references materias(id) on delete cascade,
  codigo text not null, -- 'S10', 'S21'... único dentro de la materia, NO global
  duracion text, -- '1', '2', 'A'
  created_at timestamptz not null default now(),
  unique (materia_id, codigo)
);

create index idx_comisiones_materia on comisiones(materia_id);

alter table comisiones enable row level security;
create policy "comisiones: lectura pública" on comisiones for select using (true);

create table comision_horarios (
  id uuid primary key default gen_random_uuid(),
  comision_id uuid not null references comisiones(id) on delete cascade,
  -- texto libre porque la fuente incluye variantes como 'Viernes (1°C)'
  dia text not null,
  hora_inicio time not null,
  hora_fin time not null
);

create index idx_comision_horarios_comision on comision_horarios(comision_id);

alter table comision_horarios enable row level security;
create policy "comision_horarios: lectura pública" on comision_horarios for select using (true);

-- ─────────────────────────────────────────────────────────────────────────
-- Permisos
-- ─────────────────────────────────────────────────────────────────────────
-- Las policies de RLS de arriba solo filtran FILAS; sin el GRANT de nivel
-- de tabla, anon/authenticated no pueden acceder ni siquiera a las filas
-- permitidas. Este catálogo es de solo lectura para el cliente: nunca se
-- otorga insert/update/delete a anon ni a authenticated.
grant select on universidades, carreras, materias, correlatividades, comisiones, comision_horarios
  to anon, authenticated;
