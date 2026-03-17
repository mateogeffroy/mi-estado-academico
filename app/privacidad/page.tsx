import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidad | Mi Estado Académico',
  description: 'Conocé cómo gestionamos y protegemos tus datos en Mi Estado Académico. No manipulamos datos sensibles y utilizamos servicios oficiales.',
};

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
          <p>En <strong>Mi Estado Académico</strong> NO manipulamos ni almacenamos datos sensibles. Al registrarte, utilizamos el servicio oficial y seguro de Google. Lo único que guardamos en nuestra base de datos es tu dirección de correo electrónico para poder asociarla a tu perfil de usuario, junto con el progreso académico (materias aprobadas, cursadas, notas) que vos mismo decidís ingresar en la plataforma.</p>
        </section>

        <section>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>2. Transparencia y Código Abierto</h2>
          <p>La aplicación está construida integrando servicios públicos y seguros de terceros. Fomentamos la transparencia, por lo que el código fuente de este proyecto es abierto y de acceso público. Cualquier persona que desee auditar cómo funciona la aplicación o cómo se procesan los datos está invitada a revisar los repositorios oficiales.</p>
        </section>

        <section>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>3. Uso de la información</h2>
          <p>Tus datos son utilizados exclusivamente para generar tu panel de control personalizado, calcular tus estadísticas y sincronizar tu información en la nube para que puedas acceder desde cualquier dispositivo. <strong>No vendemos, alquilamos ni compartimos tus datos con terceros.</strong></p>
        </section>

        <section>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>4. Cookies y Google AdSense</h2>
          <p>Este sitio web utiliza cookies propias para mantener tu sesión activa y cookies de terceros, específicamente de <strong>Google AdSense</strong>, para mostrar anuncios. Los proveedores de terceros, incluido Google, utilizan cookies para mostrar anuncios en función de las visitas anteriores de un usuario a este sitio web o a otros sitios de Internet.</p>
          <p>Podés inhabilitar la publicidad personalizada visitando la <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--cursando)' }}>Configuración de anuncios de Google</a>.</p>
        </section>

        <section>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>5. Seguridad</h2>
          <p>El almacenamiento de datos es gestionado a través de Supabase, que cumple con los más altos estándares de seguridad y encriptación de la industria. Te recomendamos proteger tu cuenta de Google, ya que es la llave de acceso a tu perfil en nuestra plataforma.</p>
        </section>
      </div>
    </main>
  );
}