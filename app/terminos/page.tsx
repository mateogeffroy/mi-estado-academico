import Link from 'next/link';

export const metadata = {
  title: 'Términos y Condiciones | Mi Estado Académico',
  description: 'Términos de uso de Mi Estado Académico, una herramienta no oficial para estudiantes de Ingeniería en Sistemas de la UTN FRLP.',
};

export default function TerminosPage() {
  return (
    <main style={{ paddingTop: '120px', paddingBottom: '80px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh', color: 'var(--text)' }}>
      
      <Link href="/" style={{ textDecoration: 'none' }}>
        <button className="btn-primary" style={{ padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', border: 'none', cursor: 'pointer', marginBottom: '30px' }}>
          ← Volver
        </button>
      </Link>

      <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>Términos y Condiciones</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', lineHeight: '1.6', marginTop: '30px' }}>
        <section>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>1. Naturaleza del Proyecto</h2>
          <p><strong>Mi Estado Académico</strong> es una aplicación web completamente independiente. Se trata de un proyecto personal desarrollado por un alumno, utilizando como base el plan de estudios público de la carrera de Ingeniería en Sistemas de Información. <strong>Esta plataforma NO es oficial y no tiene ningún tipo de vínculo institucional con la Universidad Tecnológica Nacional (UTN) ni con la Facultad Regional La Plata (FRLP).</strong></p>
        </section>

        <section>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>2. Responsabilidad del Usuario</h2>
          <p>La información reflejada en esta plataforma depende enteramente de la carga manual realizada por el usuario. El creador de esta plataforma no se hace responsable por discrepancias, errores de cálculo, correlatividades mal aplicadas o fechas incorrectas. El usuario comprende y acepta que <strong>el único medio oficial, vinculante y válido para consultar su estado académico es el sistema SYSACAD proporcionado por la facultad</strong>.</p>
        </section>

        <section>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>3. Disponibilidad del Servicio</h2>
          <p>El servicio se ofrece de forma gratuita y "tal cual es", apoyándose en servicios de infraestructura pública. Nos reservamos el derecho de modificar, suspender o discontinuar la plataforma (o cualquier funcionalidad de la misma) en cualquier momento. No se garantizan tiempos de actividad ininterrumpidos ni se asume responsabilidad por la pérdida temporal o permanente de los datos cargados.</p>
        </section>

        <section>
          <h2 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '10px' }}>4. Cuentas de Usuario y Abuso</h2>
          <p>El usuario accede al sistema mediante un inicio de sesión oficial proporcionado por Google. Nos reservamos el derecho de suspender o eliminar el acceso a aquellas cuentas que realicen un uso abusivo del sistema (como spam, intentos de vulneración de la seguridad, uso de bots o sobrecarga intencional de la base de datos).</p>
        </section>
      </div>
    </main>
  );
}