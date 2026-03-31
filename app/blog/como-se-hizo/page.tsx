import Link from 'next/link';
import AdBanner from '../../../src/components/AdBanner';

// 🔥 MAGIA SEO: Esto es lo que Google mostrará en los resultados de búsqueda
export const metadata = {
  title: 'Cómo construí Mi Estado Académico | Blog UTN',
  description: 'Descubrí cómo pasamos de un HTML estático a una plataforma Full-Stack en Next.js y Supabase para los alumnos de Sistemas de la UTN FRLP.',
};

export default function ComoSeHizoPost() {
  return (
    <>
      <style>{`
        .blog-content h2 { color: var(--text-strong); margin-top: 45px; font-size: 1.6rem; font-weight: 800; line-height: 1.3; }
        .blog-content h3 { color: var(--text-strong); margin-top: 35px; font-size: 1.3rem; font-weight: 700; }
        .blog-content p { margin-bottom: 24px; font-size: 1.05rem; }
        .blog-content ul { margin-bottom: 24px; padding-left: 20px; }
        .blog-content li { margin-bottom: 12px; line-height: 1.6; }
        .blog-content strong { color: var(--text-strong); }
        
        .code-snippet { 
          background: var(--glass-bg); 
          padding: 20px; 
          border-radius: 12px; 
          font-family: 'Space Mono', monospace; 
          font-size: 0.9rem; 
          border: 1px solid var(--glass-border);
          margin: 25px 0;
          color: var(--accent);
          overflow-x: auto;
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
          background: var(--glass-bg);
          border-radius: 16px;
          border-left: 4px solid var(--cursando);
          border-top: 1px solid var(--glass-border);
          border-right: 1px solid var(--glass-border);
          border-bottom: 1px solid var(--glass-border);
          transition: transform 0.2s;
        }
        .collab-box:hover { transform: translateY(-5px); }

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
        
        {/* ANUNCIO TOP (Móvil) (COMENTADO TEMPORALMENTE)
        <div className="mobile-ad-container">
          <AdBanner dataAdSlot="BLOG_MOB_TOP" dataAdFormat="horizontal" style={{ minHeight: '100px' }} />
        </div>
        */}

        {/* CONTENEDOR RELATIVO (Ancla para los anuncios absolutos) */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>
          
          {/* Lado Izquierdo
          <div className="scatter-ad-left" style={{ top: '2%' }}>
            <AdBanner dataAdSlot="BLOG_L_1" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
          <div className="scatter-ad-left" style={{ top: '40%' }}>
            <AdBanner dataAdSlot="BLOG_L_2" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
          <div className="scatter-ad-left" style={{ top: '75%' }}>
            <AdBanner dataAdSlot="BLOG_L_3" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
          */}

          {/* Lado Derecho
          <div className="scatter-ad-right" style={{ top: '2%' }}>
            <AdBanner dataAdSlot="BLOG_R_1" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
          <div className="scatter-ad-right" style={{ top: '40%' }}>
            <AdBanner dataAdSlot="BLOG_R_2" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
          <div className="scatter-ad-right" style={{ top: '75%' }}>
            <AdBanner dataAdSlot="BLOG_R_3" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
          */}

          <article style={{ maxWidth: '800px', width: '100%' }}>
            
            {/* ENCABEZADO DE PÁGINA */}
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', 
              marginBottom: '40px', gap: '20px', flexWrap: 'wrap'
            }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ 
                    background: 'var(--glass-bg)', color: 'var(--cursando)', 
                    padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', 
                    fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px',
                    border: `1px solid var(--cursando)`
                  }}>
                    Desarrollo
                  </span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>16 de Marzo, 2026</span>
                </div>
                <h1 style={{ color: 'var(--text-strong)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
                  Detrás del código: La evolución de <span style={{ color: 'var(--cursando)' }}>Mi Estado Académico</span>
                </h1>
              </div>
              
              <Link href="/blog">
                <button className="btn-secondary" style={{ padding: '10px 18px', borderRadius: '10px' }}>← Volver al Blog</button>
              </Link>
            </div>

            {/* CONTENIDO DEL POST */}
            <div className="blog-content" style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
              <p>
                Para gestionar el progreso de la carrera elegí usar en su momento plataformas genéricas como <i>Notion</i>. Al pasar los años y ver que la organización de correlativas se volvía un dolor de cabeza, siempre me comentaban lo útil que sería tener una solución automatizada. Aventurado, decidí transformar el clásico PDF estático del plan de estudios en una aplicación web interactiva, y así nació la primera versión de <strong>Plan de Estudios Dinámico</strong>.
              </p>
              <p>
                Si bien era una herramienta interesante, el feedback constante y el apoyo de la comunidad me impulsaron a evolucionar la idea hacia algo mucho más robusto: <strong>Mi Estado Académico</strong>. Una plataforma integral pensada no solo para marcar materias aprobadas, sino para organizar horarios, visualizar comisiones reales y proyectar la cursada de los estudiantes universitarios.
              </p>

              <h2>El Origen: Del HTML estático a React y Next.js</h2>
              <p>
                El proyecto comenzó como un prototipo sencillo desarrollado puramente con <strong>HTML, CSS y JavaScript Vanilla</strong>. El objetivo inicial era recrear el diseño del plan de estudios de forma clara y que, al presionar una materia, el algoritmo evaluara instantáneamente su estado y desbloqueara las correlativas.
              </p>
              <p>
                Sin embargo, a medida que la aplicación crecía, la interactividad necesaria para manejar estados globales, calcular promedios en tiempo real e incluir un sistema de rutas exigía un enfoque más moderno. 
              </p>
              
              {/* ANUNCIO IN-ARTICLE 1 (COMENTADO TEMPORALMENTE)
              <div className="mobile-ad-container" style={{ margin: '30px auto', display: 'block' }}>
                <AdBanner dataAdSlot="BLOG_INSIDE_1" dataAdFormat="fluid" style={{ minHeight: '100px' }} />
              </div>
              */}

              <p>
                La transición a <strong>React (utilizando el framework Next.js)</strong> fue el punto de inflexión definitivo. Este stack tecnológico me permitió descomponer la interfaz en componentes reutilizables, aprovechar el Server-Side Rendering (SSR) para un rendimiento óptimo y tipar todo el código de forma estricta utilizando <strong>TypeScript</strong>. Esto no solo facilitó el mantenimiento, sino que preparó el terreno para escalar la plataforma a nuevas carreras como las de la UNLP.
              </p>

              <h2>La Ingeniería de Datos: Modelando la realidad universitaria</h2>
              <p>
                Uno de los mayores desafíos arquitectónicos fue modelar la compleja realidad académica de la facultad. Inicialmente, la información estaba dispersa, pero logré centralizar y normalizar todo en un archivo de configuración llamado <code>data.ts</code>.
              </p>
              <div className="code-snippet">
                // Estructura optimizada de materias mediante TypeScript<br/><br/>
                {`export interface Subject {
  id: string | number;
  name: string;
  level: number;
  correlCursada: (string | number)[];
  correlAprobada: (string | number)[];
  comisiones?: Comision[];
}`}
              </div>
              <p>
                Esta práctica de hardcoding inicial permite definir de forma estática la estructura sin sobrecargar una base de datos con peticiones constantes e innecesarias. Al incluir no solo los nombres, sino identificadores únicos y requisitos lógicos, logramos que el motor del Contexto en React evalúe en milisegundos si un alumno está en condiciones de cursar una materia o no.
              </p>

              <h2>Persistencia y Seguridad con Supabase</h2>
              <p>
                Para que el progreso del alumno no se evapore al cerrar el navegador, la primera versión dependía del <i>LocalStorage</i>. Era útil para pruebas, pero limitante. La verdadera magia ocurrió al integrar <strong>Supabase</strong>, el Backend as a Service (BaaS) de código abierto basado en PostgreSQL.
              </p>

              {/* ANUNCIO IN-ARTICLE 2 (COMENTADO TEMPORALMENTE)
              <div className="mobile-ad-container" style={{ margin: '30px auto', display: 'block' }}>
                <AdBanner dataAdSlot="BLOG_INSIDE_2" dataAdFormat="rectangle" style={{ minHeight: '100px' }} />
              </div>
              */}

              <p>
                Implementamos un sistema de autenticación seguro utilizando <i>Google OAuth</i>. Gracias a las políticas de seguridad de nivel de fila (Row Level Security o RLS) de Supabase, garantizamos que cada alumno solo pueda ver y modificar sus propios datos. Ahora, cada vez que marcás un final como "Aprobado", el cambio se sincroniza en la nube al instante, permitiéndote acceder a tu estado académico tanto desde la PC de tu casa como desde tu celular viajando en el colectivo.
              </p>

              <h2>Un Proyecto Open Source para la Comunidad</h2>
              <p>
                A pesar de todo su crecimiento tecnológico, <strong>Mi Estado Académico</strong> mantiene su esencia: ser un espacio gratuito, colaborativo y sin fines de lucro para la comunidad estudiantil.
              </p>
              <ul>
                <li><strong>Open Source:</strong> El código fuente es público. Sirve como herramienta de estudio para aquellos alumnos que estén dando sus primeros pasos en el desarrollo web.</li>
                <li><strong>Espacio Estudiantil:</strong> Fue diseñado iterando sobre las necesidades y el feedback real de los estudiantes universitarios.</li>
                <li><strong>Evolución Constante:</strong> Desde el motor de correlatividades hasta el gestor de "Mi Cursada", el proyecto sigue vivo y recibiendo actualizaciones.</li>
              </ul>

              {/* SECCIÓN DE LINKS A REPOSITORIOS */}
              <div style={{ marginTop: '50px', padding: '30px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-strong)' }}>🔗 Links a los repositorios</h3>
                <p style={{ fontSize: '0.95rem', marginTop: '10px' }}>
                  Si te interesa revisar el código fuente o auditar cómo evolucionó la arquitectura del proyecto, podés acceder a los repositorios oficiales en GitHub:
                </p>
                <div className="repo-buttons">
                  <Link href="https://github.com/mateogeffroy/plan-estudios-dinamico" target="_blank">
                    <button className="btn-secondary" style={{ fontSize: '0.9rem', padding: '10px 16px' }}>Versión Legacy (HTML / JS)</button>
                  </Link>
                  <Link href="https://github.com/mateogeffroy/mi-estado-academico" target="_blank">
                    <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '10px 16px' }}>Versión Actual (Next.js)</button>
                  </Link>
                </div>
              </div>

              {/* SECCIÓN DE COLABORACIÓN EN FILA */}
              <div className="collab-container">
                <div className="collab-box">
                  <strong style={{ display: 'block', marginBottom: '10px', color: 'var(--cursando)', fontSize: '1.1rem' }}>¿Querés colaborar con código?</strong>
                  <span style={{ fontSize: '0.95rem' }}>Si sos desarrollador y tenés ideas para mejorar el sistema de horarios o detectar bugs, podés clonar el repositorio y enviar un Pull Request. ¡Toda ayuda suma!</span>
                </div>

                <div className="collab-box">
                  <strong style={{ display: 'block', marginBottom: '10px', color: 'var(--cursando)', fontSize: '1.1rem' }}>¿Te interesa aportar al Blog?</strong>
                  <span style={{ fontSize: '0.95rem' }}>Buscamos artículos sobre tips de estudio, resúmenes de materias o guías técnicas. Podés enviar tu propuesta redactada al correo oficial del proyecto.</span>
                </div>
              </div>
            </div>

            {/* FOOTER DEL POST / AUTOR */}
            <div style={{ 
              marginTop: '60px', paddingTop: '30px', borderTop: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: '20px' 
            }}>
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '50%', background: 'var(--cursando)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 'bold', fontSize: '1.5rem', flexShrink: 0
              }}>
                MG
              </div>
              <div>
                <div style={{ color: 'var(--text-strong)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '4px' }}>Mateo Arturo Geffroy</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: '1.4' }}>Desarrollador Full-Stack y Creador de Mi Estado Académico. Estudiante de Ingeniería en Sistemas de Información (UTN-FRLP).</div>
              </div>
            </div>

          </article>
        </div>

        {/* ANUNCIO BOT (Móvil) (COMENTADO TEMPORALMENTE)
        <div className="mobile-ad-container" style={{ marginTop: '20px' }}>
          <AdBanner dataAdSlot="BLOG_MOB_BOT" dataAdFormat="horizontal" style={{ minHeight: '100px' }} />
        </div>
        */}

      </main>
    </>
  );
}