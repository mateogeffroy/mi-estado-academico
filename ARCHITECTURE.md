# Arquitectura

Este documento explica cómo está organizado el código y por qué, para que
las decisiones no vivan solo dispersas en comentarios. Varios archivos del
código (`ProgresoRepository.ts`, `SupabaseEventosRepository.ts`,
`Materia.ts`, `SupabaseProgresoRepository.ts`) ya te van a mandar acá.

## Capas (arquitectura hexagonal)

El código de negocio está separado de los detalles de framework/infraestructura
en tres capas, todas debajo de `src/`:

```
src/domain/          → reglas de negocio puras, sin dependencias externas
src/application/      → casos de uso que orquestan el dominio + los puertos
src/infrastructure/    → adaptadores concretos (Supabase, HTTP)
src/context/          → PlanContext.tsx, el borde entre React y todo lo anterior
```

### `src/domain/`

Funciones puras, sin React ni Supabase ni nada externo. Reciben datos, devuelven
datos. Por eso son las más fáciles de testear (`*.test.ts` al lado de cada una):

- `evaluarCorrelatividades.ts` — motor de correlatividades: dado el estado de
  todas las materias de un usuario, calcula cuáles quedan disponibles,
  bloqueadas, o completadas (para electivas por nivel).
- `calcularEstadisticas.ts` — aprobadas/cursadas/en curso/porcentaje/promedio.
- `calcularDesbloqueos.ts` — para el hint "qué destrabo" del Plan de Estudios:
  reutiliza `evaluarCorrelatividades` en vez de reimplementar la lógica de
  dependencias hacia adelante.

### `src/application/`

- `ports/` — interfaces (`ProgresoRepository`, `CarrerasRepository`,
  `EventosRepository`, `AuthPort`, `FeedbackPort`, `DificultadRepository`).
  El dominio y los casos de uso dependen de estas interfaces, nunca de
  Supabase directamente — eso es lo que permite testearlos con fakes en
  memoria (ver `src/application/useCases/*.test.ts`).
- `useCases/` — orquestación: `cambiarEstadoMateria`, `borrarCarrera`,
  `cargarEstadoAcademico`, etc. Cada uno combina el dominio con los puertos y
  decide qué se persiste. Están pensados para no saber nada de React.

### `src/infrastructure/`

Implementaciones reales de los puertos: `Supabase*Repository.ts` le pegan a
Supabase, `HttpFeedbackAdapter.ts` le pega a la API route de feedback.
`repositorios.ts` es el único lugar que instancia estos adaptadores y se los
inyecta a todo lo demás.

### `src/context/PlanContext.tsx`

El borde entre React y la arquitectura de arriba. Llama a los casos de uso,
mapea sus resultados a `useState`, y es donde vive la instrumentación de
observabilidad (ver más abajo) porque es infraestructura de UI, no lógica de
negocio — no tiene sentido que el dominio o los casos de uso sepan que existe
Sentry.

## Catálogo de materias: dos representaciones, una activa

Hoy el catálogo de carreras/materias/correlatividades/comisiones que
efectivamente usa la app en producción vive como **archivos TypeScript
estáticos** en `src/lib/data/**` (uno por carrera), agregados en
`src/lib/data/registry.ts`.

En paralelo existe un **esquema relacional preparado** en
`supabase/migrations/` (`universidades`, `carreras`, `materias`,
`correlatividades`, `comisiones`, `comision_horarios`) pensado para
reemplazar esos archivos estáticos más adelante. Es importante entender el
estado real de esto:

- Las migraciones son **puramente aditivas**: no tocan `usuario_materias`,
  `usuario_carreras` ni `usuario_eventos` (las tablas que la app usa hoy).
- **Todavía no se aplicaron al proyecto de Supabase de producción** — solo se
  probaron contra el stack local de Supabase. Confirmado en vivo: la tabla
  `universidades` no existe en la base real (ver `supabase/README.md` para
  el procedimiento de `db push`).
- Ningún código de la app consulta esas tablas nuevas todavía. El cutover
  real (que el catálogo se sirva desde la base en vez de desde código, con
  `usuario_materias.materia_id` como FK real en vez de string por
  convención) es una migración + refactor de capa de aplicación aparte, no
  hecho todavía.

Hasta que eso pase, cualquier cambio al catálogo (agregar una carrera, una
materia, una comisión) se hace editando los archivos de `src/lib/data/`, no
la base.

## Limitación conocida: borrado por prefijo de `materia_id`

`ProgresoRepository.borrarPorPrefijo` y `EventosRepository.borrarPorPrefijo`
borran filas por convención de nombre (`materia_id` empieza con `'SIS-'`,
`'CIV-'`, etc. — ver `src/lib/data/registry.ts:CAREER_MATERIA_PREFIX`), no
por una relación real a `carreras(id)`. Es una limitación conocida y
deliberada mientras el catálogo siga siendo estático: algunas carreras
(UNLP) no tienen un prefijo seguro y quedan con `null`, en cuyo caso
`borrarCarrera` no intenta el borrado por prefijo — ver el caso de uso en
`src/application/useCases/gestionarCarreras.ts` para el detalle exacto.
El cutover al catálogo relacional (sección anterior) es lo que reemplaza
esto por una FK real.

## Testing

`npm run test` corre Vitest. La cobertura hoy es deliberadamente sobre las
capas sin React:

- `src/domain/services/*.test.ts` — funciones puras del dominio.
- `src/application/useCases/*.test.ts` — casos de uso, con fakes en memoria
  de los puertos (no se mockea Supabase, se implementa la interfaz del
  puerto directamente).

No hay tests de componentes React todavía (ni jsdom/Testing Library
configurado). `PlanContext.tsx` — la pieza que conecta React con todo lo de
arriba — tampoco tiene tests propios: es el hueco de cobertura más
importante a día de hoy.

## Observabilidad

Sentry (`@sentry/nextjs`) cubre Rate/Errors/Duration (ver `instrumentation.ts`,
`instrumentation-client.ts`, `next.config.ts`):

- Cada método de `PlanContext` que le pega a Supabase está envuelto en un
  `Sentry.startSpan({ name: 'usecase.<nombre>', op: 'usecase' }, ...)`, así
  las métricas de Performance quedan agrupadas por operación de negocio en
  vez de por URL cruda de Supabase.
- Los `catch` que antes solo seteaban un mensaje de error para el usuario
  ahora también llaman a `Sentry.captureException` — son los puntos reales
  donde antes un fallo real quedaba invisible fuera de la sesión del usuario.
- `Sentry.setUser({ id })` correlaciona errores/traces por sesión sin mandar
  datos personales.
- El tunnel (`/monitoring`) evita que un adblocker descarte los reportes.

`@vercel/speed-insights` cubre Web Vitals reales de usuarios (complementa,
no reemplaza, a Sentry).

## Diseño

Tokens de color/tipografía en `app/globals.css` (`--cursando`, `--cursada`,
`--aprobada`, `--bg`, `--panel`, `--border`, `--text*`, `--muted`, fuentes
Syne/Space Mono). Un principio que se aplicó de forma consistente en los
rediseños de Home/Plan/Materia: **el color de un dato nunca se reutiliza
para dos dimensiones distintas** — por ejemplo, el cuatrimestre de una clase
se muestra como texto plano, no como color, porque el color ya está
reservado para el tipo de evento (parcial/TP/exposición) y para el estado
de progreso (cursando/cursada/aprobada). Mezclar ambos generaba colisiones
visuales reales, no solo estéticas.
