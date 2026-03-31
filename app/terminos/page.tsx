import Link from 'next/link';

export const metadata = {
  title: 'Términos y Condiciones | Mi Estado Académico',
  description: 'Términos de uso de Mi Estado Académico, una herramienta no oficial para estudiantes universitarios (UTN, UNLP y más).',
};

export default function TerminosPage() {
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

      <h1 style={{ color: 'var(--text-strong)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '20px' }}>Términos y Condiciones</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', lineHeight: '1.6', marginTop: '30px' }}>
        <section>
          <h2 style={{ color: 'var(--text-strong)', fontSize: '1.5rem', marginBottom: '10px' }}>1. Naturaleza del Proyecto</h2>
          <p><strong>Mi Estado Académico</strong> es una aplicación web completamente independiente. Se trata de un proyecto personal desarrollado para facilitar el seguimiento estudiantil, utilizando como base los planes de estudio públicos de diversas facultades y universidades (como la Universidad Tecnológica Nacional y la Universidad Nacional de La Plata). <strong style={{ color: 'var(--text-strong)' }}>Esta plataforma NO es oficial y no tiene ningún tipo de vínculo institucional, administrativo ni legal con dichas universidades o sus respectivas facultades.</strong></p>
        </section>

        <section>
          <h2 style={{ color: 'var(--text-strong)', fontSize: '1.5rem', marginBottom: '10px' }}>2. Responsabilidad del Usuario</h2>
          <p>La información reflejada en esta plataforma depende enteramente de la carga manual realizada por el usuario. El creador de esta plataforma no se hace responsable por discrepancias, errores de cálculo, correlatividades desactualizadas o fechas incorrectas. El usuario comprende y acepta que <strong style={{ color: 'var(--text-strong)' }}>el único medio oficial, vinculante y válido para consultar su estado académico es el sistema de gestión académica oficial (ej. SYSACAD, SIU Guaraní) proporcionado por su respectiva facultad</strong>.</p>
        </section>

        <section>
          <h2 style={{ color: 'var(--text-strong)', fontSize: '1.5rem', marginBottom: '10px' }}>3. Disponibilidad del Servicio</h2>
          <p>El servicio se ofrece de forma gratuita y "tal cual es", apoyándose en servicios de infraestructura en la nube. Nos reservamos el derecho de modificar, suspender o discontinuar la plataforma (o cualquier funcionalidad de la misma) en cualquier momento. No se garantizan tiempos de actividad ininterrumpidos ni se asume responsabilidad técnica por la pérdida temporal o permanente de los datos cargados.</p>
        </section>

        <section>
          <h2 style={{ color: 'var(--text-strong)', fontSize: '1.5rem', marginBottom: '10px' }}>4. Cuentas de Usuario y Abuso</h2>
          <p>Nos reservamos el derecho absoluto de suspender, bloquear o eliminar el acceso a aquellas cuentas que realicen un uso abusivo del sistema (como envío de spam, intentos de vulneración de la seguridad, uso de bots, scripts automatizados o sobrecarga intencional de nuestras bases de datos).</p>
        </section>
      </div>
    </main>
  );
}