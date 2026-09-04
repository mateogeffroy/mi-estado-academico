# 001 — Red social (buscar/agregar gente)

- **Estado**: Funcionando, a validar con usuarios reales
- **Rama**: `feature/rediseno-ux/ui`

## Contexto

Capa social del sistema: buscar compañeros por nombre y agregarlos como
amigos.

**Alcance decidido**: se ve *nombre, carrera y qué materias/comisiones cursa*
cada uno. Nunca notas ni horarios. La visibilidad viene **activada por
default** y se apaga desde el perfil; apagada, sólo te ven tus amigos.

## Implementado (2026-09-04)

- SQL, aplicado en producción:
  - `20260904150000_amistades.sql`: `perfiles_publicos` (nombre, carrera
    activa, `buscable` en false por default) y `amistades` (par ordenado
    solicitante/destinatario, estado `pendiente` o `aceptada`), con RLS y
    trigger de alta del perfil al registrarse.
  - `20260904160000_amistades_ver_perfil_de_amigos.sql`: policy para leer el
    perfil de alguien con quien ya tenés relación, aunque haya apagado
    "buscable" (si no, un amigo desaparecía de tu lista al ocultarse).
- `AmistadesRepository` (puerto) + `SupabaseAmistadesRepository`, registrado
  en `repositorios.ts` como el resto de los adaptadores.
- `/buscar`: pestañas Buscar / Solicitudes / Amigos. Búsqueda con debounce de
  300ms a partir de 2 letras; acciones agregar, aceptar, cancelar, rechazar y
  quitar.
- Perfil: tarjeta "Aparecer en las búsquedas" (activada por default) con el
  conteo de amigos y solicitudes. Además mantiene la carrera del perfil
  público sincronizada con la carrera activa.
- Badge con las solicitudes sin responder en el nav de escritorio y en la tab
  bar mobile.
- `20260904170000_comisiones_publicas.sql`: la visibilidad pasa a estar
  activada por default, y se agrega la vista `comisiones_publicas`, que
  expone sólo quién cursa qué materia en qué comisión. Es una vista y no una
  policy sobre `usuario_materias` porque RLS es por fila: no hay forma de
  dejar leer la comisión y esconder la nota de la misma fila.
- Página de materia: listados de amigos y compañeros de la comisión elegida,
  con los mismos botones de agregar/aceptar/quitar.
- `20260904180000_bloqueos_y_realtime.sql`: tabla `bloqueos` (con trigger que
  corta la amistad al bloquear), vista `perfiles_buscables` que saca a los
  bloqueados en las dos direcciones sin revelar quién bloqueó a quién, y
  `amistades` publicada en realtime para el badge.
- Bloquear y desbloquear desde la tarjeta de persona, con pestaña
  "Bloqueados" en `/buscar`.
- El badge del nav se actualiza por realtime y se apaga al abrir la pestaña
  de solicitudes (guarda la fecha de la última vista en localStorage).
- Política de privacidad: sección nueva sobre perfil visible y amistades.
- `UpdateModal` (v3): carrusel con las funciones nuevas y qué ven los demás.
- `20260904190000_busqueda_por_carrera.sql`: la búsqueda ignora acentos
  (columna generada `nombre_normalizado` + `unaccent`) y sólo muestra gente de
  la misma carrera activa. La regla de carrera también está en la policy de
  solicitudes, así que no alcanza con conocer el id de alguien de otra
  carrera.
- Borrado el mockup: `mockPeople.ts`, `PersonList.tsx`, la sección "Gente en
  tu comisión" de la página de materia y la pestaña "Amigos" del perfil.

## Falta

- Probar el flujo completo con dos cuentas reales (ver más abajo).
- Reportar usuarios: por ahora no hay más interacción que los apuntes, así
  que se decidió que alcanza con bloquear.
- La búsqueda sigue sin índice de trigramas. Con el filtro por carrera el
  padrón por consulta es chico; si se pone lenta, `pg_trgm` (anotado en la
  migración).
- Si alguien cambia de carrera activa, deja de ver (y de aparecerle a) la
  gente de la anterior. Las amistades ya hechas no se tocan.

## Cómo probarlo

1. Entrar a `/perfil` con dos cuentas distintas y activar "Aparecer en las
   búsquedas" en ambas.
2. Desde una, buscar a la otra por nombre en `/buscar` y darle Agregar.
3. Desde la otra, pestaña Solicitudes → Aceptar.
4. Verificar que aparece en Amigos de las dos, y que al apagar "buscable" en
   una, la otra la sigue viendo en su lista de amigos (esa es la policy de
   `20260904160000`).
