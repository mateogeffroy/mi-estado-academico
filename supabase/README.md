# Base de datos

El esquema vive versionado en `supabase/migrations/*.sql`. Nunca se edita el
esquema a mano desde el dashboard de Supabase: todo cambio es una migración
nueva.

## Desarrollo local

Requiere [Docker](https://docs.docker.com/get-docker/) corriendo.

```bash
npx supabase start   # levanta Postgres + Auth + API local, la primera vez baja las imágenes
npx supabase db reset # aplica todas las migraciones + supabase/seed.sql desde cero
npx supabase stop     # apaga el stack local
```

`supabase db reset` corre después de cada migración nueva y cada vez que se
regenera `supabase/seed.sql`. La URL/keys del stack local las imprime
`supabase start` (no son las de producción).

## Regenerar el seed del catálogo

Mientras el catálogo de carreras/materias siga existiendo también como
archivos TypeScript en `src/lib/data/`, `supabase/seed.sql` se genera desde
ahí, no se edita a mano:

```bash
npx tsx scripts/generar-seed-catalogo.ts > supabase/seed.sql
npx supabase db reset
```

## Estado de esta migración (Fase 1 de la auditoría)

Las migraciones actuales son **puramente aditivas**: agregan el catálogo
relacional (`universidades`, `carreras`, `materias`, `correlatividades`,
`comisiones`, `comision_horarios`) y tablas de progreso nuevas
(`usuarios_perfil`, `materia_dificultad_votos`, `usuario_horarios_custom`).
**No tocan ni modifican** `usuario_materias`, `usuario_carreras` ni
`usuario_eventos`, que son las tablas que usa la app hoy en producción. El
cutover de esas tablas para que referencien `materias(id)` por FK real en
vez del string histórico (`materia_id`) queda para una migración posterior,
en conjunto con el refactor de la capa de aplicación que las consume.

## Aplicar esto al proyecto de Supabase real

Esto todavía **no se aplicó** al proyecto remoto — solo se probó contra el
stack local. Para llevarlo a producción:

```bash
npx supabase login                       # abre el navegador para autenticarse
npx supabase link --project-ref <ref>    # <ref> está en la URL del dashboard del proyecto
npx supabase db push                     # aplica las migraciones pendientes al remoto
```

`db push` es seguro de correr en cualquier momento porque las migraciones
actuales no alteran ni borran nada existente. Igual, antes de correrlo por
primera vez contra el proyecto real:

1. Sacar un backup desde el dashboard de Supabase (Database → Backups).
2. Correr `supabase db push` primero, verificar en el dashboard que las
   tablas nuevas aparecieron con los datos del catálogo.
3. Recién ahí seguir con la Fase 2 (que si va a tocar las tablas existentes).
