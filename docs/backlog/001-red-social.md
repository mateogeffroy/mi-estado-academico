# 001 — Red social (buscar/agregar gente)

- **Estado**: En progreso
- **Rama**: `feature/rediseno-ux/ui` (cambios sin commitear al 2026-09-03;
  no está en `develop` todavía pese a lo que se pensaba)

## Contexto

Agregar una capa social al sistema: buscar compañeros, ver relación
(amigo/compañero/ninguno) y, a futuro, agregar como amigo.

## Hecho

- `app/buscar/page.tsx`: página de búsqueda de gente por nombre.
- `src/lib/data/mockPeople.ts`: dataset mock determinístico (40 nombres,
  carrera, relación) + `mockPeople.test.ts`.
- Componentes nuevos: `Avatar`, `Badge`, `Card`, `PersonCard`, `PersonList`,
  `Tabs`.
- Link "Buscar" en el nav (`LayoutClient.tsx`), con ícono de lupa.
- `Avatar` reemplaza el render inline de iniciales/foto en el nav y (a
  revisar) en perfil.

## Qué falta para que funcione de verdad (orden sugerido)

1. **Confirmar qué hay en producción.** La migración
   `20260809082037_progreso_usuario.sql` crea `usuarios_perfil` pero, según
   `ARCHITECTURE.md`, el catálogo relacional todavía no se aplicó. Sin esa
   tabla (o una equivalente) no hay a quién buscar.
2. **Perfil buscable, opt-in.** `usuarios_perfil` hoy tiene RLS de "leer
   propio", así que nadie puede buscar a nadie. Hace falta una columna
   `buscable boolean default false` y una policy de SELECT para
   `authenticated` limitada a `buscable = true` y a las columnas públicas
   (nombre, carrera). Opt-in y no opt-out: son nombres de personas reales.
3. **Tabla `amistades`**: `(solicitante_id, destinatario_id, estado, created_at)`,
   PK compuesta, `check (solicitante_id <> destinatario_id)`, estado en
   `pendiente | aceptada`. RLS: leer si sos una de las dos partes; insertar
   sólo como solicitante; aceptar (update) sólo como destinatario.
4. **Índice de búsqueda por nombre**: `lower(full_name)` con `pg_trgm`, o un
   RPC `buscar_personas(query)` que ya devuelva el estado de relación con el
   usuario actual en una sola consulta.
5. **Capa de aplicación**: puerto `AmistadesRepository` +
   `SupabaseAmistadesRepository`, registrados en `repositorios.ts` como el
   resto. Casos de uso: `buscarPersonas`, `enviarSolicitud`,
   `responderSolicitud`, `eliminarAmistad`.
6. **UI**: botón de acción en `PersonCard` según el estado (agregar /
   pendiente / aceptar / amigos), y una vista de solicitudes recibidas.
   Recién ahí se borra `mockPeople.ts`.

Decisión de alcance pendiente: qué ve un amigo. La versión chica es sólo
nombre y carrera (nada de progreso ni horarios), y es la que menos preguntas
de privacidad abre.

## Falta

- Reemplazar `mockPeople.ts` por datos reales (Supabase: tabla de usuarios
  buscables + relación de amistad).
- Acción de "agregar amigo" / "aceptar solicitud" (hoy `PersonCard` es
  solo lectura).
- Persistir relaciones (tabla `amistades` o similar) — no existe todavía
  en `supabase/migrations/`.
- Decidir si esto vive en `develop` o se mergea directo a `feature/rediseno-ux/ui`.
- Actualizar `ARCHITECTURE.md` si se agrega dominio nuevo (ej.
  `src/domain/services` para relaciones).

## Decisiones abiertas

- ¿Amistad es bidireccional con solicitud (como hoy sugiere el mock:
  amigo/compañero/ninguno) o unidireccional (seguir)?
- ¿"Compañero" se infiere automático (comparten materias cursadas) o es
  manual?
