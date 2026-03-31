import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidad | Mi Estado Académico',
  description: 'Conocé cómo gestionamos y protegemos tus datos en Mi Estado Académico. No manipulamos datos sensibles y utilizamos servicios oficiales.',
};

export default function PrivacidadPage() {
  return (
    <main style={{ paddingTop: '120px', paddingBottom: '80px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh', color: 'var(--text)' }}>
      
      <Link href="/" style={{ textDecoration: 'none' }}>
        <button className="btn-secondary" style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', marginBottom: '30px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m12 19-7-7 7-7"/>
            <path d="M19 12H5"/>
          </svg>
          Volver
        </button>
      </Link>

      <h1 style={{ color: 'var(--text-strong)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>Política de Privacidad</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '40px' }}>Última actualización: {new Date().toLocaleDateString('es-AR')}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', lineHeight: '1.6' }}>
        <section>
          <h2 style={{ color: 'var(--text-strong)', fontSize: '1.5rem', marginBottom: '10px' }}>1. Información que recopilamos</h2>
          <p>En <strong style={{ color: 'var(--text-strong)' }}>Mi Estado Académico</strong> NO manipulamos ni almacenamos datos sensibles. Al registrarte (ya sea mediante correo electrónico o usando el servicio de autenticación de Google), lo único que guardamos de forma encriptada es tu dirección de email para poder asociarla a tu perfil de usuario, junto con el progreso académico (materias aprobadas, cursadas, notas) que vos mismo decidís ingresar en la plataforma.</p>
        </section>

        <section>
          <h2 style={{ color: 'var(--text-strong)', fontSize: '1.5rem', marginBottom: '10px' }}>2. Transparencia y Servicios de Terceros</h2>
          <p>La aplicación está construida integrando servicios públicos y seguros de terceros, como Supabase para la base de datos y la autenticación. Fomentamos la transparencia, por lo que tus datos están protegidos bajo los más estrictos estándares de seguridad y encriptación de la industria actual.</p>
        </section>

        <section>
          <h2 style={{ color: 'var(--text-strong)', fontSize: '1.5rem', marginBottom: '10px' }}>3. Uso de la información</h2>
          <p>Tus datos son utilizados exclusivamente para generar tu panel de control personalizado, calcular tus estadísticas y sincronizar tu información en la nube para que puedas acceder desde cualquier dispositivo. <strong style={{ color: 'var(--text-strong)' }}>No vendemos, alquilamos ni compartimos tus datos personales con terceros.</strong></p>
        </section>

        <section>
          <h2 style={{ color: 'var(--text-strong)', fontSize: '1.5rem', marginBottom: '10px' }}>4. Cookies y Google AdSense</h2>
          <p>Este sitio web utiliza cookies propias para mantener tu sesión activa y cookies de terceros para mostrar anuncios publicitarios. Los proveedores de terceros, incluido <strong style={{ color: 'var(--text-strong)' }}>Google</strong>, utilizan cookies para mostrar anuncios relevantes basándose en las visitas anteriores de un usuario a este sitio web o a otros sitios de Internet.</p>
          <p>El uso de cookies de publicidad permite a Google y a sus socios mostrar anuncios basados en tu navegación por nuestros sitios y otros sitios de Internet. Podés inhabilitar la publicidad personalizada visitando la <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cursando)' }}>Configuración de anuncios de Google</a> o visitando <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cursando)' }}>www.aboutads.info</a>.</p>
        </section>

        <section>
          <h2 style={{ color: 'var(--text-strong)', fontSize: '1.5rem', marginBottom: '10px' }}>5. Seguridad</h2>
          <p>Te recomendamos utilizar contraseñas fuertes o iniciar sesión a través del proveedor seguro de Google, ya que estas credenciales son la llave de acceso a tu perfil personal en nuestra plataforma.</p>
        </section>
      </div>
    </main>
  );
}