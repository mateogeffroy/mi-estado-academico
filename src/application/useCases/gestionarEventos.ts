import { EventoAcademico } from '../../domain/entities/Progreso';
import { EventosRepository } from '../ports/EventosRepository';

export async function agregarEvento(
  userId: string,
  evento: Omit<EventoAcademico, 'id'>,
  eventosRepository: EventosRepository
): Promise<EventoAcademico> {
  return eventosRepository.crearEvento(userId, evento);
}

export async function borrarEvento(userId: string, eventoId: string, eventosRepository: EventosRepository): Promise<void> {
  await eventosRepository.borrarEvento(userId, eventoId);
}
