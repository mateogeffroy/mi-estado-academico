-- Apuntes por materia: resúmenes, ejercicios resueltos y código.
--
-- Alcance decidido (ver docs/backlog/004-apuntes-por-materia.md):
--   - cada apunte se publica para todos o sólo para los amigos del autor
--   - sólo documentos de texto: pdf, md, txt, docx
--   - el autor puede borrar el suyo; la moderación es manual desde el panel

-- ─────────────────────────────────────────────────────────────────────────
-- Bucket
-- ─────────────────────────────────────────────────────────────────────────
-- Los límites van en el bucket y no sólo en el formulario: puestos acá no se
-- pueden saltear llamando a la API directamente.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'apuntes',
  'apuntes',
  false,
  10485760, -- 10 MB
  array[
    'application/pdf',
    'text/markdown',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types,
      public = excluded.public;

-- ─────────────────────────────────────────────────────────────────────────
-- Metadatos
-- ─────────────────────────────────────────────────────────────────────────
create table if not exists apuntes (
  id uuid primary key default gen_random_uuid(),
  materia_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  titulo text not null,
  descripcion text,
  tipo text not null default 'resumen' check (tipo in ('resumen', 'ejercicios', 'codigo', 'otro')),
  visibilidad text not null default 'publico' check (visibilidad in ('publico', 'amigos')),
  archivo_path text not null unique,
  tamano bigint not null,
  created_at timestamptz not null default now()
);

comment on table apuntes is 'Material subido por los usuarios en cada materia.';

create index if not exists apuntes_materia_idx on apuntes (materia_id, created_at desc);
create index if not exists apuntes_autor_idx on apuntes (user_id);

alter table apuntes enable row level security;

-- Se ve el propio siempre; el ajeno según su visibilidad, y nunca el de
-- alguien con quien hay un bloqueo de por medio.
create policy "apuntes: leer los visibles"
  on apuntes for select
  to authenticated
  using (
    user_id = auth.uid()
    or (
      not hay_bloqueo(auth.uid(), user_id)
      and (
        visibilidad = 'publico'
        or exists (
          select 1 from amistades a
          where a.estado = 'aceptada'
            and (
              (a.solicitante_id = auth.uid() and a.destinatario_id = apuntes.user_id) or
              (a.destinatario_id = auth.uid() and a.solicitante_id = apuntes.user_id)
            )
        )
      )
    )
  );

create policy "apuntes: subir en nombre propio"
  on apuntes for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "apuntes: editar los propios"
  on apuntes for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "apuntes: borrar los propios"
  on apuntes for delete
  to authenticated
  using (user_id = auth.uid());

grant select, insert, update, delete on apuntes to authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- Archivos
-- ─────────────────────────────────────────────────────────────────────────
-- Las policies del bucket tienen que decir lo mismo que las de la tabla: si
-- sólo se protege la fila, el archivo sigue siendo accesible por su path.
--
-- El path es 'materia_id/user_id/uuid.ext', así que la segunda carpeta tiene
-- que ser el id de quien sube.
drop policy if exists "apuntes: subir a la carpeta propia" on storage.objects;
create policy "apuntes: subir a la carpeta propia"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'apuntes'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

-- El exists corre con las policies de la tabla aplicadas al usuario actual,
-- así que "puede leer el archivo" es exactamente "puede ver el apunte".
drop policy if exists "apuntes: leer el archivo de un apunte visible" on storage.objects;
create policy "apuntes: leer el archivo de un apunte visible"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'apuntes'
    and exists (select 1 from public.apuntes a where a.archivo_path = name)
  );

drop policy if exists "apuntes: borrar el archivo propio" on storage.objects;
create policy "apuntes: borrar el archivo propio"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'apuntes'
    and (storage.foldername(name))[2] = auth.uid()::text
  );
