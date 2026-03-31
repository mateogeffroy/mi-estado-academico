import Link from 'next/link';

export const metadata = {
  title: 'Blog y Novedades | Mi Estado Académico',
  description: 'Guías útiles, actualizaciones del sistema y artículos sobre la vida universitaria en la UTN.',
};

const NOVEDADES = [
  {
    id: 'como-se-hizo',
    href: '/blog/como-se-hizo',
    tag: 'Desarrollo',
    tagColor: 'var(--cursando)',
    titulo: 'Detrás del código: Cómo construí Mi Estado Académico',
    descripcion: 'Un repaso por las tecnologías, desafíos y la historia de cómo nació esta herramienta para alumnos de la UTN.',
    iconColor: 'var(--cursando)',
  },
  {
    id: 'correlatividades',
    href: '/blog/correlatividades',
    tag: 'Guía UTN',
    tagColor: 'var(--aprobada)',
    titulo: 'Correlatividades UTN: El mapa para no trabarte',
    descripcion: 'Elegir mal una materia te puede costar un año. Analizamos los cuellos de botella del Plan 2023 de Sistemas.',
    iconColor: 'var(--aprobada)',
  },
  {
    id: 'creando-frontend',
    href: '/blog/creando-frontend',
    tag: 'Desarrollo',
    tagColor: 'var(--cursando)',
    titulo: 'Creando Frontends Premium con Antigravity + Skills',
    descripcion: 'Una guía metodológica para transformar los diseños aburridos de IA en interfaces estéticas y originales utilizando skills de desarrollo.',
    iconColor: 'var(--cursando)',
  }
];

export default function BlogIndex() {
  return (
    <>
      <style>{`
        .no-hover-card:hover {
          transform: none !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          box-shadow: none !important;
        }
      `}</style>
      
      <main style={{ paddingBottom: '80px', display: 'flex', flexDirection: 'column', gap: '40px', minHeight: '100vh', paddingTop: '40px' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>
          
          <section style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ background: 'var(--bg)', borderRadius: '20px', padding: '20px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '10px' }}>
                <h1 style={{ color: 'white', margin: 0, fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>
                  Blog y Novedades
                </h1>
                
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    Volver al inicio
                  </button>
                </Link>
              </div>

              <p style={{ color: 'var(--muted)', fontSize: '1.05rem', marginBottom: '30px' }}>
                Explorá nuestras guías, tutoriales y artículos escritos por la comunidad para mejorar tu cursada y tus habilidades de desarrollo.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {NOVEDADES.map((post) => (
                  <Link key={post.id} href={post.href} style={{ textDecoration: 'none' }}>
                    <article className="premium-card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid var(--border)' }}>
                      <div style={{ opacity: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ color: post.tagColor, fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>
                          {post.tag}
                        </div>
                        <h4 style={{ color: 'white', margin: '0 0 12px 0', fontSize: '1.2rem', lineHeight: '1.3' }}>
                          {post.titulo}
                        </h4>
                        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 20px 0', flex: 1 }}>
                          {post.descripcion}
                        </p>
                        <div style={{ color: 'white', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          Leer artículo 
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={post.iconColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {/* 🔥 NUEVA SECCIÓN: INVITACIÓN A APORTAR 🔥 */}
              <div style={{ marginTop: '40px', background: 'radial-gradient(circle at top left, rgba(59, 130, 246, 0.05) 0%, transparent 70%), rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', borderRadius: '16px', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '15px' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '50%' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--cursando)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                </div>
                <div>
                  <h3 style={{ color: 'white', fontSize: '1.3rem', margin: '0 0 8px 0', fontWeight: 'bold' }}>¿Tenés algo para compartir?</h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.95rem', margin: 0, maxWidth: '500px', lineHeight: '1.5' }}>
                    Si escribiste un apunte útil, un tutorial de código o tenés tips para alguna materia en particular, podés publicarlo acá.
                  </p>
                </div>
                <a href="mailto:mateogeffroy.dev@gmail.com?subject=Aporte%20para%20el%20Blog%20-%20Mi%20Estado%20Académico" style={{ textDecoration: 'none', marginTop: '5px' }}>
                  <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', borderRadius: '10px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    Enviar artículo por Mail
                  </button>
                </a>
              </div>

            </div>
          </section>

        </div>
      </main>
    </>
  );
}