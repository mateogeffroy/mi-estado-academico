# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [2.2.0] - 2026-09-04

### Added
- **Red social**: búsqueda de compañeros por nombre (dentro de la propia
  carrera, ignorando acentos), solicitudes de amistad, listado de amigos y
  bloqueo de usuarios. El perfil público muestra sólo nombre, carrera y las
  comisiones que se cursan; nunca notas, promedio ni horarios.
- **Gente por materia**: en cada materia, los amigos y los compañeros que
  cursan en la comisión elegida, con los mismos botones de agregar y aceptar.
- **Apuntes por materia**: subida de resúmenes, ejercicios resueltos y código
  (pdf, md, txt, docx, hasta 10 MB), con visibilidad para todos o sólo para
  los amigos del autor. Los archivos viven en un bucket privado de Supabase y
  las policies del bucket replican las de la tabla, así que ver el archivo
  requiere lo mismo que ver el apunte.
- **Sección "Hoy" en el inicio**: fecha, clases del día y sus eventos, arriba
  de la grilla semanal.
- Badge de solicitudes de amistad sin responder en el nav y en la tab bar,
  actualizado por realtime y apagado al abrir la pestaña de solicitudes.
- Controles de privacidad en Mi Perfil: aparecer o no en las búsquedas, y
  baja de los avisos por mail.
- `scripts/enviar-anuncio.ts` para avisar por mail de las funciones nuevas,
  respetando la baja.

### Changed
- **Grilla horaria**: se reemplaza el eje de horas por siete columnas, una por
  día, con tarjetas de alto automático. El nombre de la materia ya no queda
  cortado ni se desborda sobre los bloques vecinos. Las flechas dobles mueven
  la semana y las simples el día marcado, sin reordenar las columnas.
- Los colores por cuatrimestre vuelven al borde de cada tarjeta (verde 1º,
  rojo 2º, azul anuales) y las etiquetas de evento muestran sólo el tipo.
- Tipografía centralizada en variables (`--font-sans`, `--font-mono`,
  `--font-display`): Inter para texto, Roboto Mono para números, Syne queda
  reservada al logo.
- La bottom tab bar se despega más del borde inferior, para que los botones
  nativos del teléfono no la tapen.
- Login: las columnas dejan de recortarse en pantallas de 768px de alto y el
  botón de Google queda blanco en los dos temas.
- Términos y política de privacidad: qué ven los demás, cómo ocultarse y
  responsabilidad sobre el material subido.

### Removed
- Tour de bienvenida del inicio y el botón "?" del nav que abría las
  novedades.
- Componentes sin uso: `AnimatedList`, `CountUp`, `MiniCalendar` y el CSS
  muerto asociado.

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
