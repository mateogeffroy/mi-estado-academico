# 001 — Red social (buscar/agregar gente)

- **Estado**: Funcionando, a validar con usuarios reales
- **Rama**: `feature/rediseno-ux/ui`

## Contexto

Capa social del sistema: buscar compañeros por nombre y agregarlos como
amigos.

**Alcance decidido**: un amigo ve *nombre y carrera*. Nada de progreso, notas
ni horarios. La búsqueda es opt-in: nadie aparece hasta que lo activa.

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
- Perfil: tarjeta de opt-in "Aparecer en las búsquedas". Además mantiene la
  carrera del perfil público sincronizada con la carrera activa.
- Borrado el mockup: `mockPeople.ts`, `PersonList.tsx`, la sección "Gente en
  tu comisión" de la página de materia y la pestaña "Amigos" del perfil.

## Falta

- Probar el flujo completo con dos cuentas reales (ver más abajo).
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
