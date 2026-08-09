export interface UsuarioAutenticado {
  id: string;
  email: string | null;
  fullName: string;
  avatarUrl: string;
}

export type EventoAuth = 'SIGNED_IN' | 'SIGNED_OUT' | 'USER_UPDATED' | 'OTRO';

export interface AuthPort {
  obtenerSesionActual(): Promise<UsuarioAutenticado | null>;
  onCambioDeSesion(callback: (evento: EventoAuth, usuario: UsuarioAutenticado | null) => void): () => void;
  cerrarSesion(): Promise<void>;
  actualizarNombre(nombre: string): Promise<void>;
}
