# 004 — Apuntes por materia

- **Estado**: Planeado (decisiones tomadas, sin código)
- **Depende de**: [001](001-red-social.md) — la visibilidad "sólo amigos" usa
  la tabla `amistades`.

## Contexto

Sección de apuntes dentro de cada materia: la gente sube resúmenes,
ejercicios resueltos y código, y el resto los descarga.

## Decisiones tomadas

- **Visibilidad por publicación**: quien sube elige `publico` (todos los
  usuarios) o `amigos` (sólo sus amigos aceptados).
- **Formatos**: sólo documentos de texto — `pdf`, `md`, `txt`, `docx`. Se
  restringe en el bucket, no sólo en el formulario.
- **Moderación**: botón de reportar en cada apunte; la revisión es manual
  (Mateo) y el criterio es que no se suban libros. Un apunte reportado y no
  aceptado se borra.
- **Almacenamiento**: bucket del plan gratuito de Supabase. El día que el
  espacio o la transferencia se acaben, se cambia a que la gente suba links
  (Drive u otro) y el sistema de reportes queda igual.

## Infra necesaria

Nada de backend nuevo: la subida y la descarga van directo del browser a
Supabase Storage con la misma sesión que ya usa la app.

1. **Bucket** `apuntes`, privado, con `file_size_limit` (p. ej. 10 MB) y
   `allowed_mime_types` limitados a los 4 formatos. Que el límite esté en el
   bucket es lo que impide saltear la validación del formulario.
2. **Tabla** `apuntes`: `id`, `materia_id`, `user_id`, `titulo`,
   `descripcion`, `tipo` (resumen / ejercicios / código / otro),
   `visibilidad` (`publico` | `amigos`), `archivo_path`, `tamano`,
   `created_at`. El archivo vive en `materia_id/user_id/uuid.ext`.
3. **Tabla** `apuntes_reportes`: `apunte_id`, `user_id`, `motivo`,
   `created_at`, PK compuesta para que nadie reporte dos veces lo mismo.
4. **RLS**: leer un apunte si es `publico`, o si es propio, o si es de
   `amigos` y existe una amistad aceptada con el autor. Insertar y borrar,
   sólo lo propio. Las policies de `storage.objects` tienen que replicar lo
   mismo, si no el archivo queda accesible aunque la fila no lo esté.
5. **Borrado por moderación**: hoy no hay rol de admin en la app. La opción
   barata es borrar desde el panel de Supabase (fila + archivo); si se vuelve
   frecuente, una columna `oculto boolean` y una policy que sólo deje verlo a
   su autor.

## Límites del plan gratuito

1 GB de almacenamiento y 5 GB de transferencia por mes. Con PDFs de 2-5 MB
son unos 250 archivos guardados, pero el techo real es la transferencia:
1.000-2.500 descargas mensuales. Conviene mostrar el peso de cada archivo y
tener a mano el número de cuánto queda.

## Riesgo a tener presente

Si alguien sube un libro escaneado, el reclamo de copyright le llega al dueño
del proyecto, no a quien lo subió. Por eso el botón de reportar y el borrado
son parte del alcance mínimo, no un extra para después.
