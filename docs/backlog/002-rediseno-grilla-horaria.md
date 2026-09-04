# 002 — Rediseño de la grilla horaria

- **Estado**: En progreso (a validar visualmente)
- **Rama**: `feature/rediseno-ux/ui`
- **Commit para volver atrás**: `6a95c64` (versión con la grilla por tiempo)

## Contexto

La grilla dibujaba cada clase como un bloque posicionado por hora, con altura
proporcional a la duración. Una clase de 1 hora quedaba en una caja muy baja:
el nombre de la materia no entraba, se desbordaba sobre los bloques vecinos
(`.event-card` tenía `overflow: visible`) y el texto quedaba ilegible.

## Cambio aplicado

- Fuera el eje de horas en desktop. La semana ahora son 7 columnas (una por
  día) con cards apiladas por horario, de alto automático: el nombre wrapea
  entero (`overflow-wrap: anywhere`).
- `DayAgenda` (`src/components/DayAgenda.tsx`): componente único que renderiza
  las clases de un día. Lo usan la columna de desktop, la agenda mobile y la
  sección "Hoy" de la home.
- `buildDayData` (mismo archivo) centraliza la lógica de clases + eventos
  fantasma + día no hábil, que antes vivía sólo dentro de `HorarioCalendar`.
- Home: sección "Hoy" arriba de todo, con la fecha en texto, las clases del
  día y sus eventos.
- Estilos compartidos (`.agenda-item`, `.week-columns`) movidos a
  `globals.css`; nuevo token `--warning` para el ámbar que estaba hardcodeado.
- Borrado: posicionamiento por tiempo (`calcularPosicion`), columna de horas,
  líneas de la grilla, tooltips de hover, estado `tappedCard` y su listener
  de click afuera. `HorarioCalendar` pasó de 809 a ~525 líneas.

## Trade-off asumido

Se pierde la lectura "a qué hora del día" de un vistazo (el eje vertical de
horas). El horario de cada clase se lee en la card. Si molesta, el commit
`6a95c64` tiene la versión anterior.

## Falta

- Validar visualmente en desktop y mobile con horarios reales cargados.
- Decidir si las columnas necesitan mostrar la duración de la clase de alguna
  forma (hoy sólo aparece "inicio-fin" como texto).
