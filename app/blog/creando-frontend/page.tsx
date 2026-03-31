import Link from 'next/link';
import AdBanner from '../../../src/components/AdBanner';

// 🔥 MAGIA SEO: Esto es lo que Google mostrará en los resultados de búsqueda
export const metadata = {
  title: 'Creando Frontends Premium con Antigravity + Skills | Blog UTN',
  description: 'Una guía metodológica para transformar los diseños aburridos de IA en interfaces estéticas y originales utilizando skills de desarrollo.',
};

export default function CreandoFrontendPost() {
  return (
    <>
      <style>{`
        .blog-content h2 { color: var(--text-strong); margin-top: 40px; font-size: 1.5rem; font-weight: 800; }
        .blog-content h3 { color: var(--text-strong); margin-top: 30px; font-size: 1.25rem; font-weight: 700; }
        .blog-content h4 { color: var(--text-strong); margin-top: 25px; font-size: 1.1rem; font-weight: 700; }
        .blog-content p { margin-bottom: 20px; }
        .blog-content ul { margin-bottom: 20px; padding-left: 20px; }
        .blog-content li { margin-bottom: 10px; }
        .blog-content strong { color: var(--text-strong); }
        .blog-content a { color: var(--cursando); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color 0.2s; }
        .blog-content a:hover { border-color: var(--cursando); }
        
        .code-snippet { 
          background: var(--glass-bg); 
          padding: 15px; 
          border-radius: 8px; 
          font-family: 'Space Mono', monospace; 
          font-size: 0.9rem; 
          border: 1px solid var(--glass-border);
          margin: 20px 0;
          overflow-x: auto;
          color: var(--text-strong);
        }

        .code-inline {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          color: #ef4444;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Space Mono', monospace;
          font-size: 0.9em;
        }

        .quote-box {
          border-left: 4px solid var(--cursando);
          background: var(--glass-bg);
          padding: 20px 24px;
          border-radius: 0 12px 12px 0;
          margin: 30px 0;
          font-style: italic;
          color: var(--text-strong);
        }

        /* 🔥 NUEVOS ESTILOS PARA VIDEOS PREMIUM 🔥 */
        .video-container {
          width: 100%;
          margin: 40px 0;
          border-radius: 16px;
          overflow: hidden; /* Esto asegura que las esquinas redondeadas apliquen al video */
          background: var(--panel);
          border: 1px solid var(--border);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); /* Sombra elegante adaptada */
        }
        
        .video-player {
          width: 100%;
          height: auto;
          display: block; /* Evita márgenes fantasma debajo del video */
          border-radius: inherit; /* Hereda las esquinas redondeadas del contenedor */
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
        
        {/* CONTENEDOR RELATIVO (Ancla para los anuncios absolutos) */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'center' }}>
          
          <article style={{ maxWidth: '800px', width: '100%' }}>
            
            {/* ENCABEZADO DE PÁGINA */}
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', 
              marginBottom: '40px', gap: '20px', flexWrap: 'wrap'
            }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ 
                    background: 'var(--glass-bg)', color: 'var(--cursando)', 
                    padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', 
                    fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px',
                    border: `1px solid var(--cursando)`
                  }}>
                    Desarrollo
                  </span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>30 de Marzo, 2026</span>
                </div>
                <h1 style={{ color: 'var(--text-strong)', fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, lineHeight: 1.1, margin: 0 }}>
                  Creando Frontends Premium con <span style={{ color: 'var(--cursando)' }}>Antigravity + Skills</span>
                </h1>
              </div>
              
              <Link href="/#blog">
                <button className="btn-secondary">← Volver al Dashboard</button>
              </Link>
            </div>

            {/* CONTENIDO DEL POST */}
            <div className="blog-content" style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: '1.8' }}>
              <p>
                Durante 2025, el mundo del desarrollo experimentó un boom con la llegada de los AI Agents, sistemas capaces de trascender las limitaciones de los chatbots de AI tradicionales, al emplear tools e integraciones externas para operar dentro de un marco más amplio. Estos agentes acceden a carpetas, archivos y arquitecturas completas, teniendo en su poder un contexto mucho más abarcativo para realizar tareas más complejas y específicas, siendo capaces de crear, modificar y mejorar nuestras ideas de formas extraordinarias.
              </p>

              <p>
                En este artículo, te quiero compartir una metodología de creación que he estado utilizando, que potenciará el uso de tus AI Agents a niveles fascinantes. Este sistema consiste en la integración de Antigravity, el IDE agéntico de Google para desarrollo lanzado a finales del año pasado, junto con skills de frontend.
              </p>

              <p>
                Pero… ¿qué son exactamente las skills? Son instrucciones en un archivo de texto (generalmente markdown) que estandarizan conocimientos, procedimientos y capacidades de un dominio específico, actuando como “know-how” para tu agente. Estos archivos portables potencian el desarrollo agéntico de maneras espectaculares, otorgándole una suerte de (no joke) superpoder en cualquiera de las áreas o etapas de creación de un proyecto: frontend, backend, APIs, planificación, y muchísimo más.
              </p>

              <p>
                A continuación, voy a presentar tres casos sencillos, directos y replicables, para que puedas imitar y sacarle el máximo provecho a tus proyectos de desarrollo.
              </p>

              <h2>Antigravity: Nuestro IDE agéntico</h2>
              <p>
                En primer lugar, debemos tener Antigravity instalado en nuestra máquina, disponible en <a href="https://antigravity.google/" target="_blank" rel="noopener noreferrer">https://antigravity.google/</a>. Si bien no es estrictamente necesario para recrear esta metodología, el IDE de Google proporciona ciertas ventajas y funcionalidades que otros entornos no tienen (al menos de manera nativa): en primer lugar, Antigravity ofrece acceso a Gemini 3.1 Pro y Flash, así como Claude Opus 4.6 y Sonnet 4.6 de manera gratuita. Por supuesto, el uso de dichos modelos varía considerablemente dependiendo del tier de nuestra cuenta: sin suscripción, el tier gratuito ofrece una quota significativa para sus modelos, que se recarga semanalmente y tiene un límite de uso semanal. Y a su vez, la duración de estas quotas dependen de la complejidad y tamaño de las tareas realizadas por el agente. Por otro lado, los usuarios de suscripción (Google AI Pro y Ultra) tienen quotas más generosas que se recargan cada 5 horas para los modelos de Gemini (mientras que los modelos de Claude pueden variar y restablecer sus limites luego de unos días), así como créditos de AI adicionales por mes en caso de tener que usar algún modelo luego de haber acabado la quota. En fin, para profundizar más sobre esta cuestión, puede consultarse la documentación oficial en: <a href="https://antigravity.google/docs/plans" target="_blank" rel="noopener noreferrer">https://antigravity.google/docs/plans</a>.
              </p>

              <p>
                En segundo lugar, Antigravity proporciona por defecto dos modos de conversación: Fast y Planning. En modo Planning, nuestro agente evalúa e investiga en profundidad las tareas que le enviemos en el prompt, creando un plan de implementación detallado que luego seguirá a la hora de construir nuestras ideas.
              </p>

              <h2>Skills: Esteroides para nuestro agente</h2>
              <p>
                Teniendo ya nuestro IDE preparado, vamos a integrar dos skills que nos ayudarán a crear frontends premium, únicos, que solucionan el clásico problema de los diseños genéricos y aburridos de AI que estamos acostumbrados a ver. La primera skill se llama <span className="code-inline">frontend-design</span>, que recomiendo usar enfáticamente junto con Claude (Opus o Sonnet). Mientras que la segunda se llama <span className="code-inline">ui-ux-pro-max</span>, que recomiendo emplear junto con los modelos de Gemini (Flash o Pro). Usadas de esta manera, vas a conseguir mejores resultados en el diseño final de las UI.
              </p>

              <div className="quote-box">
                Por supuesto, entre más potente y sofisticado sea el modelo de AI que utilicemos, mejores serán nuestros resultados.
              </div>

              <p>
                La frontend-design skill fue diseñada por Anthropic, y se encuentra disponible de manera gratuita en su repositorio de GitHub: <a href="https://github.com/anthropics/skills" target="_blank" rel="noopener noreferrer">https://github.com/anthropics/skills</a>. Y la ui-ux-pro-max-skill, desarrollada por NextLevelBuilder Core Team, se encuentra en <a href="https://github.com/nextlevelbuilder/ui-ux-pro-max-skill" target="_blank" rel="noopener noreferrer">https://github.com/nextlevelbuilder/ui-ux-pro-max-skill</a>.
              </p>

              <h2>Construyendo tu Frontend Estético: Paso a paso</h2>
              
              <h3>Paso 1: Nuevo proyecto</h3>
              <p>
                Una vez instalado Antigravity e iniciado sesión con tu cuenta de Google, vamos a crear un nuevo proyecto en Antigravity. Para esto, podemos abrir una carpeta o clonar un repo. Para este ejemplo, vamos a abrir una carpeta recién creada, llamada <span className="code-inline">premium-frontend</span>.
              </p>
              <p>
                A la derecha, vamos a ver abierto a nuestro chat agéntico, donde podemos seleccionar el modo de conversación, el modelo de AI, e incluso vamos a poder añadir imágenes o mencionar archivos existentes en nuestro proyecto.
              </p>

              <h3>Paso 2: Instalando skills</h3>
              <p>
                Luego, vamos a tener que instalar las skills. Para eso, vamos a abrir una nueva terminal, yendo a la barra en la parte superior como <span className="code-inline">Terminal &gt; New Terminal</span> y vamos a abrirla en la carpeta de nuestro proyecto. Para este caso, y cualquier otro donde se requiera la instalación de distintas skills, recomiendo utilizar <span className="code-inline">find-skills</span>, un buscador e instalador open-source que nos permitirá agregarlas de manera sencilla a nuestro proyecto. Para ello, vamos a ejecutar el comando:
              </p>

              <div className="code-snippet">
                npx skills add https://github.com/vercel-labs/skills --skill find-skills
              </div>

              <p>
                Nos va a preguntar si queremos continuar, y para hacerlo vamos a presionar <span className="code-inline">y</span>. Luego, aparecerá una lista con distintos IDEs y plataformas, y deberemos seleccionar Antigravity para esta ocasión (moviéndonos con las flechas arriba y abajo, y seleccionado con enter). Después, nos preguntará si la instalación será a nivel proyecto o a nivel global. Recomiendo la instalación <span className="code-inline">global</span> de estas skills en particular, ya que nos serán útiles en cualquier proyecto de desarrollo que hagamos, permitiéndonos acceder a ellas de manera sencilla. Posteriormente, como método de instalación seleccionamos el recomendado que es <span className="code-inline">Symlink</span>. Finalmente, confirmamos para que continúe con la instalación.
              </p>

              <p>
                Ya teniendo instalado esta herramienta, vamos a poder agregar las skills de diseño. Para eso, vamos a poner en nuestra terminal:
              </p>

              <div className="code-snippet">
                npx skills add anthropics/skills@frontend-design
              </div>

              <p>
                Y vamos a seleccionar nuevamente los mismos parámetros de instalación (Antigravity, global, symlink). Ahora, para la siguiente skill, ejecutamos:
              </p>

              <div className="code-snippet">
                npx skills add nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max
              </div>

              <p>
                Con los mismos parámetros, como hicimos anteriormente.
              </p>

              <p>
                <strong>NOTA:</strong> En caso de no saber cuál es el package / repo de GitHub donde se halla la skill, podés ejecutar <span className="code-inline">npx skills find [query]</span>, un comando inteligente que facilita la búsqueda de estas skills a partir de una descripción, un nombre o alguna necesidad. Después te van a aparecer una serie de resultados que coinciden con tu búsqueda, pudiendo copiar el package de la skill que te interese, con el formato <span className="code-inline">owner/repo@reference</span>. Luego, lo podés instalar con <span className="code-inline">npx skills add owner/repo@reference</span>.
              </p>

              <h3>Paso 3: Haciendo magia con las skills</h3>

              <h4>Ejemplo 1: Sello Discográfico Boutique</h4>
              <p>
                Teniendo todo ya en su lugar, es hora de entrar a la acción. Vamos a acceder a nuestro agente de Antigravity (Ctrl + L para abrir y cerrar), y seleccionamos el modelo que deseemos (en mi caso, <span className="code-inline">Claude Sonnet 4.6</span>) junto con el modo Planning. Y vamos a escribir nuestro prompt con la idea de front que queramos realizar. Yo generé un prompt para un sello discográfico boutique, describiendo un poco su dirección artística y de diseño, pero nada específico, para ver los resultados que pueden conseguirse con estas skills. Pero la parte clave debe estar al inicio: debemos pedir explícitamente que utilice la skill <span className="code-inline">frontend-design</span> para el desarrollo de este front. De esta manera, nuestro prompt debería verse así:
              </p>

              <div className="quote-box">
                Para la generación de esta interfaz, debes utilizar de manera estricta la skill frontend-design instalada globalmente en .agents/skills.<br/><br/>
                Concepto: Crea una webpage estilo vitrina digital inmersiva para una fábrica independiente de prensado de vinilos o un sello discográfico boutique. La atmósfera debe estar profundamente impregnada de nostalgia cinematográfica, melancolía de madrugada y la estética vintage de la 'Americana'. Visualmente, el sitio debe sentirse como una fotografía antigua descolorida: utiliza texturas cálidas y granuladas, paletas de colores en tonos sepia y pasteles apagados, todo combinado con una tipografía elegante y de glamour retro que evoque la sensación de un verano brumoso e interminable.
              </div>

              <p>
                Tras enviar el prompt, veremos que el agente comienza a ejecutar sub-tareas y a consultar el directorio donde se hallan las skills. Probablemente te pida permisos manuales de ejecución para determinados scripts de búsqueda o de creación, así que atento al agente mientras corre. Por otro lado, aparecerá la leyenda <span className="code-inline">Analyzed SKILL.md</span>, que indica que el agente efectivamente accedió a la skill que instalamos.
              </p>

              <p>
                Luego de varios minutos (sé paciente! no te desesperes ni intentes apurar el proceso), y tras haber terminado, vamos a verificar y ver el resultado final de este front corriéndolo en local. Generalmente, esto ocurre de manera automática, pero si no es así, podés pedírselo también (en este caso, tenía un simple único html, que fue abierto directamente en el navegador).
              </p>

              {/* 🔥 VIDEO 1: AUTOPLAY, MUTED, LOOP, SIN CONTROLES 🔥 */}
              <div className="video-container">
                <video 
                  className="video-player"
                  src="/creando-frontend-1.webm" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  controls={false}
                />
              </div>

              <p>
                Todo esto ha sido generado con un único prompt, one-shoteado. Verdaderamente impresionante.
              </p>

              <h4>Ejemplo 2: Santuario Agrícola Urbano</h4>
              <p>
                Para este segundo caso, utilicé el mismo modelo y skill. Cerrando la anterior carpeta del workspace, y abriendo una nueva carpeta recién creada, que llamé <span className="code-inline">premium-frontend-2</span>, le pedí al agente lo siguiente:
              </p>

              <div className="quote-box">
                Para la generación de esta interfaz, debes utilizar de manera estricta la skill frontend-design instalada globalmente en .agents/skills.<br/><br/>
                Concepto: Una experiencia digital inmersiva para un "santuario agrícola urbano" y centro de bienestar comunitario. La identidad de la marca debe transmitir vitalidad bruta, esperanza y la sensación de renovación cíclica. La estética debe equilibrar la arquitectura cruda de la ciudad (texturas de concreto o acero) con la explosión vibrante e indomable de la vida vegetal. Utiliza una tipografía moderna pero orgánica, paletas de colores basadas en verdes intensos, terracota y toques de luz solar directa, creando una sensación de conexión profunda entre el entorno urbano y la nutrición natural.
              </div>

              <p>
                Nuevamente, una página obtenida en prácticamente un prompt. A diferencia del caso anterior, le pedí luego que al hero le colocara una imagen custom que generé, y que cambiara ciertos detalles de diseño con respecto a las cards rectangulares y detalles menores. El resto de la página fue obtenida por el prompt inicial. Otro resultado espectacular.
              </p>

              {/* 🔥 VIDEO 2: AUTOPLAY, MUTED, LOOP, SIN CONTROLES 🔥 */}
              <div className="video-container">
                <video 
                  className="video-player"
                  src="/creando-frontend-2.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  controls={false}
                />
              </div>

              <h4>Ejemplo 3: Atelier Automotriz Ultra Exclusivo</h4>
              <p>
                Finalmente, haremos un último caso, esta vez utilizando <span className="code-inline">Gemini 3 Flash</span> junto con la skill <span className="code-inline">ui-ux-pro-max</span>, para mostrar las diferencias en los estilos y UIs generados, utilizando un modelo aparentemente inferior, ni siquiera en su versión Pro. En este caso, decidí enfocarme en un front elegante y vanguardista, como propuesta para un negocio de lujo y alta gama. Nuevamente, cerré la anterior carpeta, y abrí una nueva carpeta recién creada, <span className="code-inline">premium-frontend-3</span>. Y el prompt que envié al agente fue el siguiente:
              </p>

              <div className="quote-box">
                Para la generación de esta interfaz, debes utilizar de manera estricta la skill ui-ux-pro-max instalada globalmente en .agents/skills.<br/><br/>
                Concepto: Una sala de exposición digital inmersiva para un atelier automotriz ultra exclusivo que diseña y personaliza vehículos a medida. La identidad de la marca debe exudar lujo silencioso, ingeniería de precisión y una elegancia agresiva pero sofisticada. La estética visual debe centrarse en el minimalismo aerodinámico, empleando un uso extremo del espacio negativo, reflejos de metal líquido, texturas casi imperceptibles de fibra de carbono y una paleta de colores dominada por el negro obsidiana, cromo oscuro y un único tono de acento intenso. La tipografía debe ser geométrica, moderna y de líneas finas, transmitiendo una sensación de velocidad congelada en el tiempo, exclusividad absoluta y estatus inalcanzable.
              </div>

              <p>
                Y el resultado que obtuvimos, a pesar de tratarse de un modelo menos potente, fue impresionante. Tras el prompt inicial, únicamente cambié la imagen del hero por una de alta calidad que generé, y luego le pedí que corrija leves detalles en la aplicación general del CSS. Casi one-shooteado.
              </p>

              {/* 🔥 VIDEO 3: AUTOPLAY, MUTED, LOOP, SIN CONTROLES 🔥 */}
              <div className="video-container">
                <video 
                  className="video-player"
                  src="/creando-frontend-3.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  controls={false}
                />
              </div>

              <h2>Conclusión</h2>
              <p>
                En vista de los fronts que hemos logrado crear, no cabe duda que el uso de skills potencia al máximo las capacidades de nuestro agente, ampliando el horizonte de desarrollo como nunca antes, facilitando la transformación de ideas en interfaces estéticas, premium y originales, adaptándolas a identidades visuales únicas. El uso iterado y creativo de esta metodología propuesta nos ayudará finalmente a salir de la monotonía de las típicas interfaces que estamos acostumbrados a producir, dando lugar a una nueva era de diseños elaborados y de alta calidad.
              </p>

              <p>
                Ahora, es tu turno de probar y testear estas herramientas para tus proyectos, para escalar la calidad de tus fronts al próximo nivel. Nos vemos la próxima.
              </p>

              <p>
                <i><strong>P.D.:</strong> En un futuro artículo subiremos la apuesta y cubriremos una nueva metodología utilizando Antigravity y Stitch. Stay tuned.</i>
              </p>

              {/* SECCIÓN DE COLABORACIÓN EN FILA */}
              <div className="collab-container">
                <div className="collab-box">
                  <strong style={{ display: 'block', marginBottom: '10px', color: 'var(--cursando)', fontSize: '1.1rem' }}>¿Querés colaborar?</strong>
                  Si sos estudiante y tenés ideas para mejorar el sistema de horarios o el contenido del blog, ¡tu feedback es bienvenido! Este espacio lo construimos entre todos.
                </div>

                <div className="collab-box">
                  <strong style={{ display: 'block', marginBottom: '10px', color: 'var(--cursando)', fontSize: '1.1rem' }}>¿Te interesa elaborar un artículo?</strong>
                  ¡Escribime! Cualquier dinámica relacionada al ámbito del desarrollo y de la enseñanza es bienvenido.
                </div>
              </div>
            </div>

            {/* FOOTER DEL POST / AUTOR - SIMÓN OCAMPO */}
            <div style={{ 
              marginTop: '60px', paddingTop: '30px', borderTop: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: '15px' 
            }}>
              <div style={{ 
                width: '56px', height: '56px', borderRadius: '50%', background: 'var(--cursando)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 'bold', fontSize: '1.4rem'
              }}>
                SO
              </div>
              <div>
                <div style={{ color: 'var(--text-strong)', fontWeight: 'bold', fontSize: '1.1rem' }}>Simón Ocampo</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Analista en Sistemas, Desarrollador Full-Stack y Estudiante de Ing. en Sistemas (UTN-FRLP)</div>
              </div>
            </div>

          </article>
        </div>

      </main>
    </>
  );
}