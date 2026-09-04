export type TipoApunte = 'resumen' | 'ejercicios' | 'codigo' | 'otro';
export type VisibilidadApunte = 'publico' | 'amigos';

export interface Apunte {
  id: string;
  materiaId: string;
  userId: string;
  titulo: string;
  descripcion: string | null;
  tipo: TipoApunte;
  visibilidad: VisibilidadApunte;
  archivoPath: string;
  /** Tamaño del archivo en bytes. */
  tamano: number;
  createdAt: string;
}

export interface NuevoApunte {
  materiaId: string;
  titulo: string;
  descripcion?: string;
  tipo: TipoApunte;
  visibilidad: VisibilidadApunte;
  archivo: File;
}

/** Extensiones aceptadas, con el tipo MIME que espera el bucket. */
export const FORMATOS_APUNTE: Record<string, string> = {
  pdf: 'application/pdf',
  md: 'text/markdown',
  txt: 'text/plain',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export const TAMANO_MAXIMO_APUNTE = 10 * 1024 * 1024; // 10 MB, igual que el bucket

export const extensionDe = (nombreArchivo: string) =>
  nombreArchivo.split('.').pop()?.toLowerCase() ?? '';

export interface ApuntesRepository {
  /** Los apuntes de la materia que el usuario tiene permitido ver. */
  listarDeMateria(materiaId: string): Promise<Apunte[]>;
  subir(userId: string, apunte: NuevoApunte): Promise<Apunte>;
  /** Borra la fila y el archivo. */
  borrar(userId: string, apunte: Apunte): Promise<void>;
  /** URL temporal de descarga; el bucket es privado. */
  urlDeDescarga(archivoPath: string): Promise<string>;
}
