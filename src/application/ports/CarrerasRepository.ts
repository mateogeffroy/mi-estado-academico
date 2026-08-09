export interface CarrerasRepository {
  obtenerCarrerasDeUsuario(userId: string): Promise<string[]>;
  agregarCarrera(userId: string, carreraId: string): Promise<void>;
  borrarCarrera(userId: string, carreraId: string): Promise<{ error: string | null }>;
}
