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
