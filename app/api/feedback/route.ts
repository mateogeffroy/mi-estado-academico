import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { titulo, descripcion, userName, userEmail } = await request.json();

    const data = await resend.emails.send({
      // 🔥 ACÁ ESTÁ EL CAMBIO: Usamos tu dominio verificado 🔥
      from: 'Feedback App <noreply@miestadoacademico.com.ar>', 
      to: ['mateogeffroy.dev@gmail.com'],
      subject: `💡 Nuevo Feedback: ${titulo}`,
      html: `
        <h2>Nuevo mensaje de feedback</h2>
        <p><strong>Usuario:</strong> ${userName} (${userEmail})</p>
        <p><strong>Título:</strong> ${titulo}</p>
        <hr />
        <p><strong>Crítica/Observación:</strong></p>
        <p style="white-space: pre-wrap;">${descripcion}</p>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}