import { AuthChangeEvent, Session, SupabaseClient } from '@supabase/supabase-js';
import { AuthPort, EventoAuth, UsuarioAutenticado } from '../../application/ports/AuthPort';

function aUsuarioAutenticado(session: Session | null): UsuarioAutenticado | null {
  const user = session?.user;
  if (!user) return null;
  return {
    id: user.id,
    email: user.email ?? null,
    fullName: (user.user_metadata?.full_name as string | undefined) || user.email || 'Usuario',
    avatarUrl: (user.user_metadata?.avatar_url as string | undefined) || '',
  };
}

function aEventoAuth(evento: AuthChangeEvent): EventoAuth {
  if (evento === 'SIGNED_IN') return 'SIGNED_IN';
  if (evento === 'SIGNED_OUT') return 'SIGNED_OUT';
  if (evento === 'USER_UPDATED') return 'USER_UPDATED';
  return 'OTRO';
}

export class SupabaseAuthAdapter implements AuthPort {
  constructor(private readonly client: SupabaseClient) {}

  async obtenerSesionActual(): Promise<UsuarioAutenticado | null> {
    const { data } = await this.client.auth.getSession();
    return aUsuarioAutenticado(data.session);
  }

  onCambioDeSesion(callback: (evento: EventoAuth, usuario: UsuarioAutenticado | null) => void): () => void {
    const { data } = this.client.auth.onAuthStateChange((evento, session) => {
      if (evento === 'INITIAL_SESSION') return; // ya se resolvió con obtenerSesionActual()
      callback(aEventoAuth(evento), aUsuarioAutenticado(session));
    });
    return () => data.subscription.unsubscribe();
  }

  async cerrarSesion(): Promise<void> {
    await this.client.auth.signOut();
  }

  async actualizarNombre(nombre: string): Promise<void> {
    const { error } = await this.client.auth.updateUser({ data: { full_name: nombre } });
    if (error) throw new Error(`No se pudo actualizar el nombre: ${error.message}`);
  }
}
