# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [2.1.0] - 2026-08-09

### Added
- Domingo en la grilla del Horario Semanal y en la agenda mobile: antes la
  semana cortaba en sábado, así que si el día actual caía domingo no
  aparecía en ningún lado.
- Bottom tab bar mobile-first (Inicio, Plan, Blog, Perfil), pensada para
  navegarse con el pulgar como una app nativa.

### Changed
- El menú hamburguesa + drawer lateral en mobile se reemplaza por la bottom
  tab bar. El avatar (Mi Perfil / Cerrar Sesión) y, sin sesión, los botones
  de Blog/Login, quedan visibles en el header también en mobile.
- La stats-bar de Plan de Estudios y el botón de scroll-to-top se corren
  hacia arriba en mobile para no quedar tapados por la tab bar nueva.

## [2.0.0] - 2026-08-09

Primera versión formalmente versionada del proyecto tras una auditoría
completa (Fases 0 a 11).

### Added
- **Arquitectura hexagonal**: dominio puro (`src/domain`), casos de uso
  (`src/application/useCases`) sobre puertos (`src/application/ports`),
  adaptadores de Supabase (`src/infrastructure`). Ver `ARCHITECTURE.md`.
- **Catálogo relacional preparado** en `supabase/migrations/` (aditivo, sin
  aplicar todavía a producción — ver `ARCHITECTURE.md`).
- **49 tests** (Vitest) sobre servicios de dominio y casos de uso, incluida
  la cascada de borrado de carrera y la máquina de estados de progreso.
- **Observabilidad de producción**: Sentry (errores, tracing con spans por
  caso de uso, tunnel anti-adblock) + Vercel Speed Insights, cubriendo
  Rate/Errors/Duration end-to-end.
- Plan de Estudios: acordeón de niveles con progressive disclosure, y el
  hint "¿Qué destrabo?" al aprobar/cursar una materia.
- Sistema de diseño mínimo: modal compartido, confirmación de borrado
  consistente, tokens de color/tipografía centralizados.

### Changed
- Home: horario semanal y lista de "Materias" unificados bajo un solo
  filtro de cuatrimestre (antes había dos toggles redundantes); agenda
  vertical por día en mobile en vez de una grilla con scroll horizontal;
  aviso de materias cursando sin horario cargado.
- Vista de materia: "Horarios de Cursada" pasa a ser la sección principal
  (antes era secundaria detrás de un formulario de evento siempre
  expandido); los formularios de agendar evento / agregar horario ahora son
  colapsables.
- El color de cuatrimestre deja de mostrarse como badge de color y pasa a
  texto plano en toda la app, para no colisionar con los colores de estado
  de progreso y tipo de evento.

### Fixed
- Auditoría de comentarios: se eliminan comentarios decorativos que solo
  repetían lo que el código ya decía; los pocos que explicaban una decisión
  real quedan reescritos sin el ruido.
