import Link from 'next/link';
import AdBanner from '../../../src/components/AdBanner';

// 🔥 MAGIA SEO: Esto es lo que Google mostrará en los resultados de búsqueda
export const metadata = {
  title: 'Cómo construí Mi Estado Académico | Blog UTN',
  description: 'Descubrí cómo pasamos de un HTML estático a una plataforma en Next.js y Supabase para los alumnos de Sistemas de la UTN FRLP.',
};

export default function ComoSeHizoPost() {
  return (
    <>
      <style>{`
        .blog-content h2 { color: white; margin-top: 40px; font-size: 1.5rem; font-weight: 800; }
        .blog-content h3 { color: white; margin-top: 30px; font-size: 1.25rem; font-weight: 700; }
        .blog-content p { margin-bottom: 20px; }
        .blog-content ul { margin-bottom: 20px; padding-left: 20px; }
        .blog-content li { margin-bottom: 10px; }
        .blog-content strong { color: white; }
        
        .code-snippet { 
          background: rgba(0,0,0,0.3); 
          padding: 15px; 
          border-radius: 8px; 
          font-family: 'Space Mono', monospace; 
          font-size: 0.9rem; 
          border: 1px solid var(--border);
          margin: 20px 0;
        }

        .collab-container {
          display: flex;
          gap: 20px;
          margin: 40px 0;
          flex-wrap: wrap;
        }

        .collab-box {
          flex: 1;
          min-width: 300px;
          padding: 25px;
          background: rgba(0, 229, 255, 0.05);
          border-radius: 16px;
          border-left: 4px solid var(--cursando);
        }

        .repo-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 15px;
        }

        @media (max-width: 600px) {
          .collab-box { min-width: 100%; }
        }

        /* --- CLASES PUBLICITARIAS --- */
        .mobile-ad-container { width: 100%; max-width: 800px; margin: 0 auto; padding: 0 16px; }
        @media (min-width: 1450px) { .mobile-ad-container { display: none; } }

        .scatter-ad-left, .scatter-ad-right {
          position: absolute;
          width: 160px;
          height: 600px;
          display: none;
          z-index: 10;
        }
        @media (min-width: 1450px) {
          .scatter-ad-left, .scatter-ad-right { display: block; }
        }
        .scatter-ad-left { right: 100%; margin-right: 40px; }
        .scatter-ad-right { left: 100%; margin-left: 40px; }
      `}</style>

      <main style={{ paddingBottom: '80px', display: 'flex', flexDirection: 'column', gap: '40px', minHeight: '100vh', paddingTop: '20px' }}>
        
        {/* ANUNCIO TOP (Móvil) */}
        <div className="mobile-ad-container">
          <AdBanner dataAdSlot="BLOG_MOB_TOP" dataAdFormat="horizontal" style={{ minHeight: '100px' }} />
        </div>

        {/* CONTENEDOR RELATIVO (Ancla para los anuncios absolutos) */}
        {/* Usamos maxWidth 1000px para que las torres queden un poco más cerca del texto (que tiene 800px) */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>
          
          {/* ==========================================
              LOS 6 ANUNCIOS ESTRATÉGICAMENTE REPARTIDOS
              ========================================== */}
          <div className="scatter-ad-left" style={{ top: '2%' }}>
            <AdBanner dataAdSlot="BLOG_L_1" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
          <div className="scatter-ad-left" style={{ top: '40%' }}>
            <AdBanner dataAdSlot="BLOG_L_2" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
          <div className="scatter-ad-left" style={{ top: '75%' }}>
            <AdBanner dataAdSlot="BLOG_L_3" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>

          <div className="scatter-ad-right" style={{ top: '2%' }}>
            <AdBanner dataAdSlot="BLOG_R_1" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
          <div className="scatter-ad-right" style={{ top: '40%' }}>
            <AdBanner dataAdSlot="BLOG_R_2" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
          <div className="scatter-ad-right" style={{ top: '75%' }}>
            <AdBanner dataAdSlot="BLOG_R_3" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>

          {/* ==========================================
              CONTENIDO CENTRAL DEL ARTÍCULO
              ========================================== */}
          <article style={{ maxWidth: '800px', width: '100%' }}>
            
            {/* ENCABEZADO DE PÁGINA */}
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', 
              marginBottom: '40px', gap: '20px', flexWrap: 'wrap'
            }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ 
                    background: 'rgba(255,255,255,0.05)', color: 'var(--cursando)', 
                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', 
                    fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px',
                    border: `1px solid var(--cursando)`
                  }}>
                    Desarrollo
                  </span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>16 de Marzo, 2026</span>
                </div>
                <h1 style={{ color: 'white', fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
                  Detrás del código: La evolución de <span style={{ color: 'var(--cursando)' }}>Mi Estado Académico</span>
                </h1>
              </div>
              
              <Link href="/#blog">
                <button className="btn-secondary">← Volver al Dashboard</button>
              </Link>
            </div>

            {/* CONTENIDO DEL POST */}
            <div className="blog-content" style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
              <p>
                Para gestionar la carrera elegí usar plataformas como <i>Notion</i> y al pasar los años, siempre me han dicho que les interesaba tener una solución como la mía. Aventurado, decidí transformar el PDF estático del plan de estudios de la carrera a una aplicación web y así nació <strong>Plan de estudios dinámico</strong>. Si bien era una herramienta interesante, entre las sugerencias y al ver el apoyo recibido, decidí evolucionar la idea a <strong>Mi Estado Académico</strong>, una herramienta para poder organizar horarios, cursadas y estado del plan de estudios todo en un mismo portal pensada principalmente para estudiantes de <i>Ingeniería en Sistemas de Información</i> de la UTN-FRLP.
              </p>

              <h2>El Origen: Del HTML estático a React</h2>
              <p>
                El proyecto, al comenzar como un prototipo sencillo, fue desarrollado con <strong>HTML, CSS y JavaScript</strong>. El objetivo inicial era recrear el plan de estudios de forma clara, que al presionar una materia, pueda cambiar su estado y desbloquear las correlativas. Sin embargo, la interactividad necesaria para generar rutas, incluir librerías y funcionalidades avanzadas exigía un enfoque más moderno.
              </p>
              
              {/* ANUNCIO IN-ARTICLE 1 (Muy efectivo en blogs) */}
              <div className="mobile-ad-container" style={{ margin: '30px auto', display: 'block' }}>
                <AdBanner dataAdSlot="BLOG_INSIDE_1" dataAdFormat="fluid" style={{ minHeight: '100px' }} />
              </div>

              <p>
                La transición a <strong>React</strong> fue el punto de inflexión. Esto permitió descomponer la interfaz en componentes reutilizables, como las tarjetas de las materias que hoy ves en el plan, facilitando el mantenimiento y la escalabilidad del proyecto para poder ampliarlos, eventualmente, a otros planes de estudios, sean de la UTN-FRLP o de otras instituciones.
              </p>

              <h2>La Ingeniería de Datos: data.ts y las comisiones</h2>
              <p>
                Uno de los mayores desafíos fue modelar la realidad académica de la facultad. Inicialmente, la información estaba dispersa, pero logré centralizarla en un archivo dentro del proyecto llamado <code>data.ts</code>. Esta práctica, llamada hardcoding, permite definir de forma estática la estructura y los datos de las materias sin cargar una base de datos externa, lo que agiliza el desarrollo y facilita la implementación de nuevas funcionalidades.
              </p>
              <div className="code-snippet">
                // Estructura optimizada de materias y comisiones<br/>
                {`// Cada materia: { id, num, name, hours, level, correlCursada: [ids], correlAprobada: [ids], comisiones?: [...] }`}
              </div>
              <p>
                En este proceso, no solo incluí los nombres de las materias, sino también sus correlativas, comisiones y horarios específicos, lo que permitió una representación más fiel y dinámica del plan de estudios y realizar la menor cantidad de consultas a la base de datos.
              </p>

              <h2>Persistencia con Supabase</h2>
              <p>
                Para que el progreso no se pierda al cerrar el navegador, inicialmente utilicé la función del <i>LocalStorage</i> que si bien fue útil para el comienzo del desarrollo, para el enfoque final del proyecto se quedaba chico. Por eso integré <strong>Supabase</strong> (un <i>BaaS, Backend as a Service</i>).
              </p>

              {/* ANUNCIO IN-ARTICLE 2 */}
              <div className="mobile-ad-container" style={{ margin: '30px auto', display: 'block' }}>
                <AdBanner dataAdSlot="BLOG_INSIDE_2" dataAdFormat="rectangle" style={{ minHeight: '100px' }} />
              </div>

              <p>
                Esta tecnología, basada en PostgreSQL, nos permite manejar la base de datos y la autenticación de forma segura utilizando servicios de login de <i>Google OAuth</i> y <i>Resend</i>. Cada vez que marcás una materia como "Aprobada" o agendás un parcial, la información se sincroniza en tiempo real con la base de datos, así es portable a todos tus dispositivos a través de un sistema de cuentas.
              </p>

              <h2>Un Proyecto Académico y Open Source</h2>
              <p>
                <strong>Mi Estado Académico</strong> es un espacio con una orientación gratuita para la comunidad estudiantil de los alumnos de Ingeniería en Sistemas de la UTN-FRLP. El enfoque es 100% abierto:
              </p>
              <ul>
                <li><strong>Open Source:</strong> El código está disponible para que pueda ser una herramienta para entender el desarrollo de aplicaciones web.</li>
                <li><strong>Espacio Estudiantil:</strong> Diseñado respetando las necesidades reales de nuestra carrera.</li>
                <li><strong>Evolución Constante:</strong> Desde el motor de correlatividades hasta el nuevo sistema de horario semanal automático, cada cambio busca mejorar la experiencia.</li>
              </ul>

              {/* SECCIÓN DE LINKS A REPOSITORIOS */}
              <div style={{ marginTop: '50px', padding: '30px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>🔗 Links a los repositorios</h3>
                <p style={{ fontSize: '0.95rem', marginTop: '10px' }}>
                  Si te interesa revisar el código fuente o ver cómo evolucionó la lógica del proyecto, podés acceder a los repositorios oficiales en GitHub:
                </p>
                <div className="repo-buttons">
                  <Link href="https://github.com/mateogeffroy/plan-estudios-dinamico" target="_blank">
                    <button className="btn-secondary" style={{ fontSize: '0.85rem' }}>Versión HTML / JS</button>
                  </Link>
                  <Link href="https://github.com/mateogeffroy/mi-estado-academico" target="_blank">
                    <button className="btn-primary" style={{ fontSize: '0.85rem' }}>Versión React (Next.js)</button>
                  </Link>
                </div>
              </div>

              {/* SECCIÓN DE COLABORACIÓN EN FILA */}
              <div className="collab-container">
                <div className="collab-box">
                  <strong style={{ display: 'block', marginBottom: '10px' }}>¿Querés colaborar?</strong>
                  Si sos estudiante y tenés ideas para mejorar el sistema de horarios o el contenido del blog, ¡tu feedback es bienvenido! Este espacio lo construimos entre todos.
                </div>

                <div className="collab-box">
                  <strong style={{ display: 'block', marginBottom: '10px' }}>¿Te interesa elaborar un artículo?</strong>
                  ¡Escribime! Cualquier dinámica relacionada al ámbito del desarrollo y de la enseñanza es bienvenido.
                </div>
              </div>
            </div>

            {/* FOOTER DEL POST / AUTOR */}
            <div style={{ 
              marginTop: '60px', paddingTop: '30px', borderTop: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: '15px' 
            }}>
              <div style={{ 
                width: '56px', height: '56px', borderRadius: '50%', background: 'var(--cursando)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold', fontSize: '1.4rem'
              }}>
                MG
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>Mateo Arturo Geffroy</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Desarrollador Full-Stack y Estudiante de Ing. en Sistemas (UTN-FRLP)</div>
              </div>
            </div>

          </article>
        </div>

        {/* ANUNCIO BOT (Móvil) */}
        <div className="mobile-ad-container" style={{ marginTop: '20px' }}>
          <AdBanner dataAdSlot="BLOG_MOB_BOT" dataAdFormat="horizontal" style={{ minHeight: '100px' }} />
        </div>

      </main>
    </>
  );
}