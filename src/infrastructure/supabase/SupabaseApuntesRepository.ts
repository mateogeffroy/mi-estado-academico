import { SupabaseClient } from '@supabase/supabase-js';
import {
  Apunte,
  ApuntesRepository,
  FORMATOS_APUNTE,
  NuevoApunte,
  TAMANO_MAXIMO_APUNTE,
  TipoApunte,
  VisibilidadApunte,
  extensionDe,
} from '../../application/ports/ApuntesRepository';

const BUCKET = 'apuntes';

interface FilaApunte {
  id: string;
  materia_id: string;
  user_id: string;
  titulo: string;
  descripcion: string | null;
  tipo: TipoApunte;
  visibilidad: VisibilidadApunte;
  archivo_path: string;
  tamano: number;
  created_at: string;
}

const aApunte = (fila: FilaApunte): Apunte => ({
  id: fila.id,
  materiaId: fila.materia_id,
  userId: fila.user_id,
  titulo: fila.titulo,
  descripcion: fila.descripcion,
  tipo: fila.tipo,
  visibilidad: fila.visibilidad,
  archivoPath: fila.archivo_path,
  tamano: fila.tamano,
  createdAt: fila.created_at,
});

const COLUMNAS = 'id, materia_id, user_id, titulo, descripcion, tipo, visibilidad, archivo_path, tamano, created_at';

export class SupabaseApuntesRepository implements ApuntesRepository {
  constructor(private readonly client: SupabaseClient) {}

  async listarDeMateria(materiaId: string): Promise<Apunte[]> {
    // Las policies ya filtran por visibilidad, amistad y bloqueos.
    const { data, error } = await this.client
      .from('apuntes')
      .select(COLUMNAS)
      .eq('materia_id', materiaId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(`No se pudieron cargar los apuntes: ${error.message}`);
    return (data as FilaApunte[] | null ?? []).map(aApunte);
  }

  async subir(userId: string, apunte: NuevoApunte): Promise<Apunte> {
    const extension = extensionDe(apunte.archivo.name);
    const contentType = FORMATOS_APUNTE[extension];
    if (!contentType) {
      throw new Error(`Formato no permitido: sólo ${Object.keys(FORMATOS_APUNTE).join(', ')}.`);
    }
    if (apunte.archivo.size > TAMANO_MAXIMO_APUNTE) {
      throw new Error('El archivo supera los 10 MB.');
    }

    const path = `${apunte.materiaId}/${userId}/${crypto.randomUUID()}.${extension}`;

    // El contentType va explícito porque el navegador no siempre lo completa
    // (los .md suelen llegar vacíos) y el bucket rechaza lo que no reconoce.
    const { error: errorArchivo } = await this.client.storage
      .from(BUCKET)
      .upload(path, apunte.archivo, { contentType, upsert: false });
    if (errorArchivo) throw new Error(`No se pudo subir el archivo: ${errorArchivo.message}`);

    const { data, error } = await this.client
      .from('apuntes')
      .insert({
        materia_id: apunte.materiaId,
        user_id: userId,
        titulo: apunte.titulo,
        descripcion: apunte.descripcion || null,
        tipo: apunte.tipo,
        visibilidad: apunte.visibilidad,
        archivo_path: path,
        tamano: apunte.archivo.size,
      })
      .select(COLUMNAS)
      .single();

    if (error) {
      // Si la fila no entra, el archivo quedaría huérfano ocupando lugar.
      await this.client.storage.from(BUCKET).remove([path]);
      throw new Error(`No se pudo guardar el apunte: ${error.message}`);
    }

    return aApunte(data as FilaApunte);
  }

  async borrar(userId: string, apunte: Apunte): Promise<void> {
    const { error } = await this.client.from('apuntes').delete().match({ id: apunte.id, user_id: userId });
    if (error) throw new Error(`No se pudo borrar el apunte: ${error.message}`);

    // El archivo se borra después: si esto falla, queda un huérfano que no
    // aparece en ninguna vista, mucho menos grave que una fila que apunta a
    // un archivo que ya no está.
    await this.client.storage.from(BUCKET).remove([apunte.archivoPath]);
  }

  async urlDeDescarga(archivoPath: string): Promise<string> {
    const { data, error } = await this.client.storage.from(BUCKET).createSignedUrl(archivoPath, 60);
    if (error || !data) throw new Error(`No se pudo abrir el archivo: ${error?.message ?? 'sin URL'}`);
    return data.signedUrl;
  }
}
