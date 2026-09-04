-- 1) La visibilidad pasa a estar activada por default.
-- 2) Se expone qué comisión cursa cada uno, para los listados de gente por
--    materia, sin exponer nada más de usuario_materias.

-- ─────────────────────────────────────────────────────────────────────────
-- Visible por default
-- ─────────────────────────────────────────────────────────────────────────
alter table perfiles_publicos alter column buscable set default true;

-- Los perfiles ya creados estaban en false porque ese era el default
-- anterior, no porque alguien lo hubiera elegido. Se los pasa a true; a
-- partir de acá, el que quiera ocultarse lo hace desde su perfil.
update perfiles_publicos set buscable = true where buscable = false;

-- ─────────────────────────────────────────────────────────────────────────
-- Qué cursa cada uno
-- ─────────────────────────────────────────────────────────────────────────
-- usuario_materias tiene notas y dificultad además de la comisión, y RLS es
-- por fila: no hay forma de dejar leer una columna y esconder las otras. Por
-- eso se expone una vista con la proyección mínima (quién, qué materia, qué
-- comisión) en vez de abrir la tabla.
--
-- La vista corre con los privilegios de su dueño (no security_invoker), así
-- que el filtro de quién puede aparecer va acá adentro:
--   - perfiles visibles, o
--   - amigos aceptados del usuario que consulta, aunque estén ocultos:
--     ocultarse es no aparecerle a desconocidos, no desaparecer para la
--     gente que uno ya aceptó.
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

comment on view comisiones_publicas is
  'Proyección pública de usuario_materias: sólo quién cursa qué y en qué comisión.';

revoke all on comisiones_publicas from anon;
grant select on comisiones_publicas to authenticated;
