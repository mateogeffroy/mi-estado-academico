// app/privacidad/page.tsx
'use client';

import Link from 'next/link';

export default function PrivacidadPage() {
  return (
    <main style={{ paddingTop: '120px', paddingBottom: '80px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh', color: 'var(--text)' }}>
      
      <Link href="/" style={{ textDecoration: 'none' }}>
        <button className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginBottom: '30px' }}>
          ← Volver
        </button>
      </Link>

      <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>Política de Privacidad</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '40px' }}>Última actualización: {new Date().toLocaleDateString('es-AR')}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', lineHeight: '1.6' }}>
        <section>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>1. Información que recopilamos</h2>
          <p>En <strong>Mi Estado Académico</strong> recopilamos la información estrictamente necesaria para brindar el servicio de seguimiento de la carrera. Esto incluye tu dirección de correo electrónico (utilizada para la autenticación a través de Supabase o Google) y los datos de tu progreso académico (materias aprobadas, en curso, notas y agenda) que vos mismo ingresás en la plataforma.</p>
        </section>

        <section>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>2. Uso de la información</h2>
          <p>Tus datos son utilizados exclusivamente para: generar tu panel de control personalizado, calcular tus estadísticas de progreso y sincronizar tu información en la nube para que puedas acceder desde cualquier dispositivo. <strong>No vendemos, alquilamos ni compartimos tus datos personales con terceros.</strong></p>
        </section>

        <section>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>3. Cookies y Google AdSense</h2>
          <p>Este sitio web utiliza cookies propias para mantener tu sesión activa y cookies de terceros, específicamente de <strong>Google AdSense</strong>, para mostrar anuncios relevantes. Los proveedores de terceros, incluido Google, utilizan cookies para mostrar anuncios en función de las visitas anteriores de un usuario a este sitio web o a otros sitios web.</p>
          <p>Podés inhabilitar la publicidad personalizada visitando la <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cursando)' }}>Configuración de anuncios de Google</a>.</p>
        </section>

        <section>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>4. Seguridad de los datos</h2>
          <p>El almacenamiento de datos y la autenticación son gestionados a través de Supabase, que cumple con los más altos estándares de seguridad y encriptación de la industria. Sin embargo, ninguna transmisión por internet es 100% segura, por lo que te recomendamos proteger tu contraseña y cuenta de Google.</p>
        </section>
      </div>
    </main>
  );
}