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
- Página de materia: listados de "Amigos que la cursan" y "Compañeros de
  comisión", con los mismos botones de agregar/aceptar/quitar.
- Borrado el mockup: `mockPeople.ts`, `PersonList.tsx`, la sección "Gente en
  tu comisión" de la página de materia y la pestaña "Amigos" del perfil.

## Falta

- Probar el flujo completo con dos cuentas reales (ver más abajo).
- Avisar del cambio de visibilidad: ahora los usuarios existentes pasaron a
  visibles sin haberlo pedido. Corresponde un aviso en la app (y revisar la
  política de privacidad) antes de que se sumen usuarios nuevos.
- "Gente en tu comisión" quedó sin reemplazo: haría falta publicar qué
  comisión cursa cada uno, que es más superficie de privacidad que la
  decidida.
- No hay aviso de solicitud nueva: te enterás entrando a `/buscar`.
- Bloquear y reportar usuarios.
- La búsqueda usa `ilike` sin índice de trigramas. Alcanza para el padrón
  actual; si se pone lenta, `pg_trgm` (anotado en la migración).

## Cómo probarlo

1. Entrar a `/perfil` con dos cuentas distintas y activar "Aparecer en las
   búsquedas" en ambas.
2. Desde una, buscar a la otra por nombre en `/buscar` y darle Agregar.
3. Desde la otra, pestaña Solicitudes → Aceptar.
4. Verificar que aparece en Amigos de las dos, y que al apagar "buscable" en
   una, la otra la sigue viendo en su lista de amigos (esa es la policy de
   `20260904160000`).
