import Link from 'next/link';
import AdBanner from '../../../src/components/AdBanner';

// 🔥 MAGIA SEO
export const metadata = {
  title: 'Correlatividades UTN Plan 2023 | Guía para no trabarte',
  description: 'Análisis de los cuellos de botella y materias críticas del Plan 2023 de Ingeniería en Sistemas en la UTN FRLP.',
};

export default function CorrelatividadesPost() {
  return (
    <>
      <style>{`
        .blog-content h2 { color: var(--text-strong); margin-top: 40px; font-size: 1.6rem; font-weight: 800; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
        .blog-content h3 { color: var(--cursando); margin-top: 30px; font-size: 1.3rem; font-weight: 700; }
        .blog-content p { margin-bottom: 20px; color: var(--muted); font-size: 1.1rem; line-height: 1.8; }
        .blog-content ul { margin-bottom: 20px; padding-left: 20px; color: var(--muted); }
        .blog-content li { margin-bottom: 12px; font-size: 1.05rem; }
        .blog-content strong { color: var(--text-strong); }
        
        .highlight-box {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          border-left: 4px solid var(--aprobada);
          padding: 20px;
          border-radius: 12px;
          margin: 30px 0;
        }

        .collab-row {
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
          <AdBanner dataAdSlot="CORREL_MOB_TOP" dataAdFormat="horizontal" style={{ minHeight: '100px' }} />
        </div>
        */}

        {/* CONTENEDOR RELATIVO (Ancla para los anuncios absolutos) */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>
          
          {/* ==========================================
              LOS 6 ANUNCIOS ESTRATÉGICAMENTE REPARTIDOS (COMENTADOS)
              ========================================== */}
          {/* Lado Izquierdo
          <div className="scatter-ad-left" style={{ top: '2%' }}>
            <AdBanner dataAdSlot="CORREL_L_1" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
          <div className="scatter-ad-left" style={{ top: '40%' }}>
            <AdBanner dataAdSlot="CORREL_L_2" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
          <div className="scatter-ad-left" style={{ top: '75%' }}>
            <AdBanner dataAdSlot="CORREL_L_3" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
          */}

          {/* Lado Derecho
          <div className="scatter-ad-right" style={{ top: '2%' }}>
            <AdBanner dataAdSlot="CORREL_R_1" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
          <div className="scatter-ad-right" style={{ top: '40%' }}>
            <AdBanner dataAdSlot="CORREL_R_2" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
          <div className="scatter-ad-right" style={{ top: '75%' }}>
            <AdBanner dataAdSlot="CORREL_R_3" dataAdFormat="vertical" style={{ height: '100%' }} />
          </div>
          */}

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
                    background: 'var(--glass-bg)', color: 'var(--aprobada)', 
                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', 
                    fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px',
                    border: `1px solid var(--aprobada)`
                  }}>
                    Guía UTN
                  </span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>17 de Marzo, 2026</span>
                </div>
                <h1 style={{ color: 'var(--text-strong)', fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
                  Correlatividades UTN: El mapa para <span style={{ color: 'var(--aprobada)' }}>no trabarte</span>
                </h1>
              </div>
              
              <Link href="/blog">
                <button className="btn-secondary">← Volver al Blog</button>
              </Link>
            </div>

            {/* CONTENIDO DEL POST */}
            <div className="blog-content">
              <p>Elegir qué cursar no es solo cuestión de gustos. En Ingeniería en Sistemas de Información (Plan 2023), una materia mal elegida o un final colgado puede costarte un año entero de cursada. En este post, analizamos los "cuellos de botella" reales basados en la experiencia de trinchera.</p>
              <p>Quiero aclarar que este post es solamente las materias que mi experiencia y la de compañeros nos han demorado en algún trayecto de la carrera, no es un post que tenga la intención de provocar miedo o angustia por una materia. Todas las materias son espacios en los que podés crecer como profesional y es importante recalcar que cada persona es un mundo, lo que a uno se le hace fácil, al otro se le dificulta.</p>
              
              <h2>1er Nivel</h2>
              <h3>Algoritmos y Estructuras de Datos</h3>
              <p>Es la madre de la programación. Si no la aprobás (o firmás la cursada), te quedás fuera de la rama de desarrollo en 2do año, ya que bloquea <strong>Sintaxis</strong> y <strong>Paradigmas</strong>. Además, es necesaria para la integradora de 2do.</p>

              {/* ANUNCIO IN-ARTICLE 1 (Móvil/Fluido) (COMENTADO TEMPORALMENTE)
              <div className="mobile-ad-container" style={{ margin: '30px auto', display: 'block' }}>
                <AdBanner dataAdSlot="CORREL_INSIDE_1" dataAdFormat="fluid" style={{ minHeight: '100px' }} />
              </div>
              */}

              <h3>Álgebra y Geometría Analítica</h3>
              <p>La "llave" silenciosa. Muchos la descuidan por las materias de código, pero sin Álgebra aprobada no podés tocar <strong>Economía</strong> ni <strong>Análisis Numérico</strong> en 3ro. Esto es crítico porque ambas son requisitos para el Título Intermedio.</p>

              <h3>Arquitectura de Computadoras</h3>
              <p>Parece una materia aislada de hardware, pero traba <strong>Sistemas Operativos</strong>. Y es esta misma, la que es el portero de 3er año: sin ella, no podés cursar las Electivas de 3er nivel, dejando tu horario muy vacío.</p>

              <h2>2do Nivel</h2>
              <p>Si pasaste 1ro, mi recomendación es que priorices:</p>

              <h3>Análisis Matemático II</h3>
              <p>A diferencia de lo que muchos creen, es un bloqueador mucho más potente que Física II. Te frena el acceso a <strong>Análisis Numérico</strong> y, más adelante, a materias de 4to como <strong>Simulación</strong>.</p>

              {/* ANUNCIO IN-ARTICLE 2 (Móvil/Fluido) (COMENTADO TEMPORALMENTE)
              <div className="mobile-ad-container" style={{ margin: '30px auto', display: 'block' }}>
                <AdBanner dataAdSlot="CORREL_INSIDE_2" dataAdFormat="rectangle" style={{ minHeight: '100px' }} />
              </div>
              */}

              <div className="highlight-box">
                <strong style={{ fontSize: '1.2rem', display: 'block', marginBottom: '10px' }}>🎯 El camino al Título Intermedio</strong>
                Para recibirte de Analista Universitario de Sistemas, no podés dejar de lado el bloque de 3er año: 
                <br/><br/>
                <strong>Álgebra (1ro) → Análisis Numérico y Economía (3ro)</strong>.
                <br/><br/>
                En mi caso personal, al no aprobar Álgebra, el título de analista se aleja automáticamente un año.
              </div>

              <h2>Tips de Supervivencia</h2>
              <ul>
                <li><strong>Priorizá Finales Críticos:</strong> Rendí Álgebra y Algoritmos antes que Inglés o Sistemas y Procesos. Las materias bloqueadoras siempre van primero.</li>
                <li><strong>Usá el Simulador:</strong> No esperes a que llegue el día de la inscripción. Usá nuestra herramienta dinámica para marcar qué tenés pensado rendir y fijate qué cuadraditos se ponen verdes.</li>
              </ul>
            </div>

            <div className="collab-row">
              <div className="collab-box">
                <strong style={{ color: 'var(--cursando)', fontSize: '1.1rem', display: 'block', marginBottom: '10px' }}>¿Dudas con el Plan?</strong>
                <span style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Si encontrás algún error en las correlativas del Plan 2023, ¡avisame para corregirlo en el motor!</span>
              </div>
              <div className="collab-box">
                <strong style={{ color: 'var(--cursando)', fontSize: '1.1rem', display: 'block', marginBottom: '10px' }}>Sumá tu experiencia</strong>
                <span style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>¿Te trabó alguna otra materia? Escribime para agregar tu caso a esta guía.</span>
              </div>
            </div>

            {/* FOOTER DEL POST / AUTOR */}
            <div style={{ 
              marginTop: '60px', paddingTop: '30px', borderTop: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: '15px' 
            }}>
              <div style={{ 
                width: '56px', height: '56px', borderRadius: '50%', background: 'var(--cursando)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 'bold', fontSize: '1.4rem'
              }}>
                MG
              </div>
              <div>
                <div style={{ color: 'var(--text-strong)', fontWeight: 'bold', fontSize: '1.1rem' }}>Mateo Arturo Geffroy</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Analista de Sistemas y Estudiante de Ing. en Sistemas (UTN-FRLP)</div>
              </div>
            </div>

          </article>
        </div>

        {/* ANUNCIO BOT (Móvil) (COMENTADO TEMPORALMENTE)
        <div className="mobile-ad-container" style={{ marginTop: '20px' }}>
          <AdBanner dataAdSlot="CORREL_MOB_BOT" dataAdFormat="horizontal" style={{ minHeight: '100px' }} />
        </div>
        */}

      </main>
    </>
  );
}