-- Búsqueda: insensible a acentos y acotada a la propia carrera.

-- ─────────────────────────────────────────────────────────────────────────
-- Sin acentos
-- ─────────────────────────────────────────────────────────────────────────
-- "martin" tiene que encontrar a "Martín" y "gonzalez" a "González".
create extension if not exists unaccent;

-- unaccent() es STABLE, y una columna generada exige IMMUTABLE. El wrapper
-- fija el diccionario, que es lo único que la volvía inestable.
create or replace function inmutable_unaccent(texto text)
returns text
language sql
immutable
strict
parallel safe
set search_path = public, extensions
as $$
  select unaccent('unaccent'::regdictionary, texto);
$$;

alter table perfiles_publicos
  add column if not exists nombre_normalizado text
  generated always as (lower(inmutable_unaccent(nombre))) stored;

comment on column perfiles_publicos.nombre_normalizado is
  'Nombre en minúsculas y sin acentos. Es la columna contra la que se busca.';

-- ponytail: sin índice de trigramas. Con el padrón actual el escaneo es
-- instantáneo; si la búsqueda se pone lenta, pg_trgm + índice gin sobre
-- nombre_normalizado.

-- ─────────────────────────────────────────────────────────────────────────
-- Sólo gente de la misma carrera
-- ─────────────────────────────────────────────────────────────────────────
-- La búsqueda deja de ser global: sólo aparece (y sólo se le puede mandar
-- solicitud a) quien tenga la misma carrera activa. Además de acotar el
-- padrón, es lo que tiene sentido para lo que se busca: gente con la que se
-- cursa.
-- Va drop + create y no "create or replace": la vista suma una columna
-- (nombre_normalizado) y Postgres no deja cambiar la lista de columnas de una
-- vista existente.
drop view if exists perfiles_buscables;

create view perfiles_buscables
with (security_invoker = false) as
select p.user_id, p.nombre, p.nombre_normalizado, p.carrera_id
from perfiles_publicos p
where p.buscable
  and not hay_bloqueo(auth.uid(), p.user_id)
  and p.carrera_id is not null
  and p.carrera_id = (
    select yo.carrera_id from perfiles_publicos yo where yo.user_id = auth.uid()
  );

comment on view perfiles_buscables is
  'Perfiles visibles para el usuario actual: misma carrera, sin bloqueados.';

revoke all on perfiles_buscables from anon;
grant select on perfiles_buscables to authenticated;

-- La misma regla en la policy, para que no alcance con conocer el id de
-- alguien de otra carrera para mandarle solicitud.
drop policy if exists "amistades: pedir en nombre propio" on amistades;
create policy "amistades: pedir en nombre propio"
  on amistades for insert
  to authenticated
  with check (
    auth.uid() = solicitante_id
    and estado = 'pendiente'
    and not hay_bloqueo(auth.uid(), destinatario_id)
    and exists (
      select 1
      from perfiles_publicos destino
      join perfiles_publicos yo on yo.user_id = auth.uid()
      where destino.user_id = destinatario_id
        and destino.buscable
        and destino.carrera_id is not null
        and destino.carrera_id = yo.carrera_id
    )
  );
