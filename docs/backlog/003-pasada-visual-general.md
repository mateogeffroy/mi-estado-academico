# 003 — Pasada visual general

- **Estado**: En progreso
- **Rama**: `feature/rediseno-ux/ui`

## Contexto

Ajustes de diseño transversales, posteriores al rediseño de la grilla
([002](002-rediseno-grilla-horaria.md)).

## Hecho

- **Marca del día elegido**: era un anillo (`outline`) alrededor de la
  columna; ahora es sombra azul + fondo tenue. El padding lo tienen todas las
  columnas, no sólo la marcada, para que al moverse no se corra nada.
- **Chips de evento**: muestran sólo el tipo (`Parcial`, `TP`), no el nombre
  completo, que rompía el ancho de la card. El nombre queda en el `title`
  (tooltip nativo del navegador).
- **Color por cuatrimestre**: vuelve el borde verde para 1º cuatrimestre,
  rojo para 2º y azul para las anuales (`getDuracionColor` en `DayAgenda`).
- **Fuentes modularizadas**: `--font-display` (logo), `--font-sans` (texto),
  `--font-mono` (números/horarios) en `globals.css`. Ningún otro archivo
  nombra fuentes: cambiar la tipografía de toda la app son 2 lugares (el
  `@import` y las variables).
  - Default nuevo: **Manrope** (texto) + **JetBrains Mono** (números). Syne
    queda sólo en el logo, como marca.

## Falta

- Confirmar si Manrope/JetBrains Mono convencen o probar otra combinación.
  Candidatas anotadas en el comentario del `@import` de `globals.css`.
- Revisar si el borde por cuatrimestre se lee bien junto al color del chip de
  evento (dos colores en la misma card).
