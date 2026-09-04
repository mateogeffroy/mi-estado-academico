# 005 — Anuncio por mail de las funciones nuevas

- **Estado**: Listo para enviar
- **Rama**: `feature/rediseno-ux/ui`

## Contexto

Los usuarios existentes pasaron a ser visibles para el resto sin haberlo
pedido, y hay funciones nuevas (amistades, gente por comisión, apuntes). Hace
falta avisarles, y no sólo dentro de la app.

## Implementado

- `perfiles_publicos.recibir_novedades` (`20260904210000_novedades_por_mail.sql`),
  en true por default, con un check en Mi Perfil para darse de baja. Mandar
  novedades sin forma de baja no corresponde.
- `scripts/enviar-anuncio.ts`: lee los usuarios con la service role key,
  saltea a los dados de baja y manda con Resend, el mismo remitente
  verificado que ya usa el formulario de feedback.
  - Simulacro por default; `--enviar` para mandar de verdad, `--limite N`
    para una prueba chica.
  - Espera 600ms entre mails: el plan gratuito de Resend permite 2 por
    segundo.
- Términos: sección nueva sobre contenido subido por usuarios (responsabilidad
  del que sube, prohibición de material con derechos, derecho a borrar,
  contacto para reclamos).

## Cómo enviarlo

```bash
# 1. Simulacro: cuántos son y quiénes
NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... RESEND_API_KEY=... \
  npx tsx scripts/enviar-anuncio.ts

# 2. Prueba real, sólo a los primeros 2 (que seas vos)
... npx tsx scripts/enviar-anuncio.ts --enviar --limite 2

# 3. A todos
... npx tsx scripts/enviar-anuncio.ts --enviar
```

## Falta

- **Mandarlo**: al 2026-09-04 todavía no se envió ningún mail. Queda para el
  día siguiente, arrancando por el simulacro y una prueba con `--limite 2`.
- Revisar el texto del mail antes de mandarlo.
- El plan gratuito de Resend permite 100 mails por día: si el padrón crece,
  hay que partir el envío en tandas.
