// Punto único de composición: instancia los adaptadores concretos y los
// expone ya armados. Los casos de uso y componentes importan desde acá en
// vez de construir un repositorio Supabase en cada lugar que lo necesita.
import { supabase } from '../lib/supabase';
import { SupabaseProgresoRepository } from './supabase/SupabaseProgresoRepository';
import { SupabaseCarrerasRepository } from './supabase/SupabaseCarrerasRepository';
import { SupabaseEventosRepository } from './supabase/SupabaseEventosRepository';
import { SupabaseDificultadRepository } from './supabase/SupabaseDificultadRepository';
import { SupabaseAuthAdapter } from './supabase/SupabaseAuthAdapter';
import { HttpFeedbackAdapter } from './http/HttpFeedbackAdapter';

export const progresoRepository = new SupabaseProgresoRepository(supabase);
export const carrerasRepository = new SupabaseCarrerasRepository(supabase);
export const eventosRepository = new SupabaseEventosRepository(supabase);
export const dificultadRepository = new SupabaseDificultadRepository(supabase);
export const authPort = new SupabaseAuthAdapter(supabase);
export const feedbackPort = new HttpFeedbackAdapter();
