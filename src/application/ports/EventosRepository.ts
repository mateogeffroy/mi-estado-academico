import { EventoAcademico } from '../../domain/entities/Progreso';

export interface EventosRepository {
  obtenerEventosDeUsuario(userId: string): Promise<EventoAcademico[]>;
  crearEvento(userId: string, evento: Omit<EventoAcademico, 'id'>): Promise<EventoAcademico>;
  borrarEvento(userId: string, eventoId: string): Promise<void>;
  borrarTodo(userId: string): Promise<void>;
  borrarPorPrefijo(userId: string, prefijo: string): Promise<{ error: string | null }>;
}
