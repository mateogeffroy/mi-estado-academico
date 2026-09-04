// Manda un mail de novedades a los usuarios registrados que no se dieron de
// baja (perfiles_publicos.recibir_novedades).
//
// Uso:
//   npx tsx scripts/enviar-anuncio.ts                 # simulacro, no manda nada
//   npx tsx scripts/enviar-anuncio.ts --enviar        # manda de verdad
//   npx tsx scripts/enviar-anuncio.ts --enviar --limite 20
//
// Necesita en el entorno:
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY   (panel de Supabase → Settings → API)
//   RESEND_API_KEY
//
// La service role key saltea RLS y puede leer todos los mails: no va al
// cliente ni se commitea, se pasa por entorno al correr el script.

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const ASUNTO = 'Novedades en Mi Estado Académico';

const cuerpo = (nombre: string) => `
  <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937; line-height: 1.6;">
    <h2 style="color: #0f172a;">Hola${nombre ? ` ${nombre}` : ''} 👋</h2>

    <p>Hay funciones nuevas en <strong>Mi Estado Académico</strong>:</p>

    <ul>
      <li><strong>Buscar compañeros</strong>: encontrá gente de tu carrera por su nombre y agregala como amigo.</li>
      <li><strong>Gente en tu comisión</strong>: en cada materia vas a ver quiénes cursan con vos.</li>
      <li><strong>Apuntes</strong>: subí resúmenes, ejercicios resueltos y código, y elegí si los ven todos o sólo tus amigos.</li>
    </ul>

    <p><strong>Sobre tu privacidad:</strong> el resto de los usuarios puede ver tu nombre, tu carrera y las
    materias y comisiones que cursás. Nunca tus notas, tu promedio ni tus horarios. Podés ocultarte, bloquear
    a alguien o darte de baja de estos mails desde <em>Mi Perfil</em>.</p>

    <p style="margin-top: 24px;">
      <a href="https://miestadoacademico.com.ar" style="background: #3b82f6; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">Entrar a la app</a>
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;" />
    <p style="font-size: 12px; color: #6b7280;">
      Recibís este mail porque tenés una cuenta en Mi Estado Académico. Para no recibir más avisos de
      novedades, entrá a Mi Perfil y desmarcá "Avisarme por mail cuando haya funciones nuevas".
    </p>
  </div>
`;

const requerido = (nombre: string) => {
  const valor = process.env[nombre];
  if (!valor) {
    console.error(`Falta la variable de entorno ${nombre}.`);
    process.exit(1);
  }
  return valor;
};

const dormir = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const enviarDeVerdad = process.argv.includes('--enviar');
  const indiceLimite = process.argv.indexOf('--limite');
  const limite = indiceLimite === -1 ? Infinity : Number(process.argv[indiceLimite + 1]);

  const supabase = createClient(
    requerido('NEXT_PUBLIC_SUPABASE_URL'),
    requerido('SUPABASE_SERVICE_ROLE_KEY')
  );
  const resend = new Resend(requerido('RESEND_API_KEY'));

  // Los que se dieron de baja. Se listan los false, que son los menos.
  const { data: bajas, error: errorBajas } = await supabase
    .from('perfiles_publicos')
    .select('user_id')
    .eq('recibir_novedades', false);
  if (errorBajas) throw new Error(`No se pudieron leer las bajas: ${errorBajas.message}`);
  const dadosDeBaja = new Set((bajas ?? []).map(f => f.user_id as string));

  // listUsers pagina de a 1000; se recorre hasta que devuelva una página corta.
  const destinatarios: { id: string; email: string; nombre: string }[] = [];
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`No se pudieron listar los usuarios: ${error.message}`);

    for (const usuario of data.users) {
      if (!usuario.email || dadosDeBaja.has(usuario.id)) continue;
      const nombre = (usuario.user_metadata?.full_name || usuario.user_metadata?.name || '')
        .toString()
        .split(' ')[0];
      destinatarios.push({ id: usuario.id, email: usuario.email, nombre });
    }

    if (data.users.length < 1000) break;
  }

  const aEnviar = destinatarios.slice(0, limite);

  console.log(`Usuarios con mail: ${destinatarios.length + dadosDeBaja.size}`);
  console.log(`Dados de baja: ${dadosDeBaja.size}`);
  console.log(`A enviar: ${aEnviar.length}`);

  if (!enviarDeVerdad) {
    console.log('\nSimulacro: no se mandó nada. Agregá --enviar para mandar de verdad.');
    console.log('Primeros destinatarios:', aEnviar.slice(0, 5).map(d => d.email));
    return;
  }

  let enviados = 0;
  let fallados = 0;

  for (const destinatario of aEnviar) {
    try {
      await resend.emails.send({
        // Mismo remitente verificado que usa el formulario de feedback.
        from: 'Mi Estado Académico <noreply@miestadoacademico.com.ar>',
        to: [destinatario.email],
        subject: ASUNTO,
        html: cuerpo(destinatario.nombre),
      });
      enviados++;
    } catch (error) {
      fallados++;
      console.error(`Falló ${destinatario.email}:`, (error as Error).message);
    }

    // El plan gratuito de Resend limita a 2 mails por segundo.
    await dormir(600);
  }

  console.log(`\nEnviados: ${enviados}. Fallados: ${fallados}.`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
