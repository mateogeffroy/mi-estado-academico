// Momento en que el usuario miró por última vez sus solicitudes. El badge
// del nav sólo cuenta lo que llegó después, así que mirar la pestaña lo
// apaga aunque las solicitudes sigan sin responder.
const KEY = 'solicitudes_vistas_at';

export const EVENTO_SOLICITUDES_VISTAS = 'solicitudes-vistas';

export const solicitudesVistasAt = (): string | null => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

export const marcarSolicitudesVistas = () => {
  try {
    localStorage.setItem(KEY, new Date().toISOString());
  } catch {
    // Modo incógnito o storage bloqueado: sin memoria, el badge sigue
    // mostrando el total. No es motivo para romper la pantalla.
  }
  window.dispatchEvent(new Event(EVENTO_SOLICITUDES_VISTAS));
};
