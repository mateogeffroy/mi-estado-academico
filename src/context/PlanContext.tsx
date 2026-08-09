'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';
import { getCareerData, CareerData } from '../lib/data/registry';
import { UsuarioAutenticado } from '../application/ports/AuthPort';
import { DetalleMateria, DetallesMaterias, EstadisticasCarrera, MateriasEstado } from '../domain/entities/Progreso';
import { calcularEstadisticas } from '../domain/services/calcularEstadisticas';
import { cargarEstadoAcademico, reevaluarParaCarrera } from '../application/useCases/cargarEstadoAcademico';
import { AccionMateria, actualizarDetalleMateria as actualizarDetalleMateriaUseCase, cambiarEstadoMateria as cambiarEstadoMateriaUseCase, marcarMultiplesAprobadas as marcarMultiplesAprobadasUseCase, reiniciarProgreso as reiniciarProgresoUseCase } from '../application/useCases/actualizarProgreso';
import { agregarCarrera as agregarCarreraUseCase, borrarCarrera as borrarCarreraUseCase } from '../application/useCases/gestionarCarreras';
import { authPort, carrerasRepository, eventosRepository, progresoRepository } from '../infrastructure/repositorios';
import MaintenanceScreen from '../components/MaintenanceScreen';

const STATS_INICIALES: EstadisticasCarrera = {
  aprobadas: 0, cursadas: 0, cursando: 0, porcentaje: 0, promedio: 0, totalMaterias: 0,
};

interface PlanContextType {
  materias: MateriasEstado;
  detalles: DetallesMaterias;
  stats: EstadisticasCarrera;
  user: UsuarioAutenticado | null;
  loading: boolean;
  error: string | null;
  careerId: string;
  careerData: CareerData;
  todasLasCarreras: string[];
  setCarreraActiva: (id: string) => void;
  agregarCarrera: (id: string) => Promise<void>;
  borrarCarrera: (id: string) => Promise<void>;
  cambiarEstadoMateria: (id: string, accion: AccionMateria) => Promise<void>;
  actualizarDetalleMateria: (id: string, info: DetalleMateria) => Promise<void>;
  reiniciarProgreso: () => Promise<void>;
  marcarMultiplesAprobadas: (ids: string[]) => Promise<void>;
  limpiarError: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [careerId, setCareerId] = useState('');
  const [todasLasCarreras, setTodasLasCarreras] = useState<string[]>([]);
  const careerData = getCareerData(careerId || 'utn-sistemas-2023');

  const [materias, setMaterias] = useState<MateriasEstado>({});
  const [detalles, setDetalles] = useState<DetallesMaterias>({});
  const [user, setUser] = useState<UsuarioAutenticado | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<EstadisticasCarrera>(STATS_INICIALES);

  const cargarDatosUsuario = async (userId: string) => {
    try {
      const activeIdGuardado = localStorage.getItem('active_career_id');
      const resultado = await cargarEstadoAcademico(userId, activeIdGuardado, {
        carrerasRepository, progresoRepository, eventosRepository, obtenerCareerData: getCareerData,
      });

      if (!resultado.tieneCarreras) {
        router.replace('/onboarding');
        return;
      }

      localStorage.setItem('active_career_id', resultado.careerIdActiva);
      setTodasLasCarreras(resultado.carreras);
      setCareerId(resultado.careerIdActiva);
      setMaterias(resultado.materias);
      setDetalles(resultado.detalles);
      setStats(calcularEstadisticas(resultado.materias, resultado.detalles, getCareerData(resultado.careerIdActiva)));
      setLoading(false);
    } catch (e) {
      Sentry.captureException(e);
      setIsOffline(true);
    }
  };

  useEffect(() => {
    let isMounted = true;

    authPort.obtenerSesionActual().then((usuario) => {
      if (!isMounted) return;
      if (usuario) {
        setUser(usuario);
        cargarDatosUsuario(usuario.id);
      } else {
        setLoading(false);
      }
    });

    const desuscribir = authPort.onCambioDeSesion((evento, usuario) => {
      if (!isMounted || !usuario) return;
      if (evento === 'SIGNED_IN' || evento === 'USER_UPDATED') {
        setUser((prevUser) => {
          if (prevUser?.id !== usuario.id) cargarDatosUsuario(usuario.id);
          return usuario;
        });
      }
    });

    return () => {
      isMounted = false;
      desuscribir();
    };
  }, []);

  const setCarreraActiva = (id: string) => {
    setCareerId(id);
    localStorage.setItem('active_career_id', id);
    const currentData = getCareerData(id);
    const { materias: materiasEvaluadas, stats: nuevasStats } = reevaluarParaCarrera(materias, detalles, currentData);
    setMaterias(materiasEvaluadas);
    setStats(nuevasStats);
  };

  const agregarCarrera = async (nuevaId: string) => {
    if (!user || todasLasCarreras.includes(nuevaId)) return;
    const nuevasCarreras = await agregarCarreraUseCase(user.id, nuevaId, todasLasCarreras, carrerasRepository);
    setTodasLasCarreras(nuevasCarreras);
    setCarreraActiva(nuevaId);
  };

  const borrarCarrera = async (idAEliminar: string) => {
    if (!user) return;
    try {
      const nuevasCarreras = await borrarCarreraUseCase(user.id, idAEliminar, todasLasCarreras, {
        carrerasRepository, progresoRepository, eventosRepository,
      });
      setTodasLasCarreras(nuevasCarreras);
      if (careerId === idAEliminar && nuevasCarreras.length > 0) {
        setCarreraActiva(nuevasCarreras[0]);
      }
    } catch (e) {
      Sentry.captureException(e);
      setError(e instanceof Error ? e.message : 'No se pudo borrar la carrera.');
      throw e;
    }
  };

  const cambiarEstadoMateria = async (id: string, accion: AccionMateria) => {
    try {
      const { materias: nuevasMaterias, stats: nuevasStats } = await cambiarEstadoMateriaUseCase(
        user!.id, id, accion, materias, detalles, careerData, progresoRepository
      );
      setMaterias(nuevasMaterias);
      setStats(nuevasStats);
    } catch (e) {
      Sentry.captureException(e);
      setError(e instanceof Error ? e.message : 'No se pudo guardar el cambio.');
    }
  };

  const actualizarDetalleMateria = async (id: string, info: DetalleMateria) => {
    try {
      const { detalles: nuevosDetalles, stats: nuevasStats } = await actualizarDetalleMateriaUseCase(
        user!.id, id, info, materias, detalles, careerData, progresoRepository
      );
      setDetalles(nuevosDetalles);
      setStats(nuevasStats);
    } catch (e) {
      Sentry.captureException(e);
      setError(e instanceof Error ? e.message : 'No se pudo guardar el cambio.');
    }
  };

  const marcarMultiplesAprobadas = async (ids: string[]) => {
    if (!user) return;
    try {
      const { materias: nuevasMaterias, stats: nuevasStats } = await marcarMultiplesAprobadasUseCase(
        user.id, ids, materias, detalles, careerData, progresoRepository
      );
      setMaterias(nuevasMaterias);
      setStats(nuevasStats);
    } catch (e) {
      Sentry.captureException(e);
      setError(e instanceof Error ? e.message : 'No se pudieron guardar las materias.');
    }
  };

  const reiniciarProgreso = async () => {
    if (!user) return;
    await reiniciarProgresoUseCase(user.id, progresoRepository, eventosRepository);
    setMaterias({});
    setDetalles({});
    cargarDatosUsuario(user.id);
  };

  if (isOffline) return <MaintenanceScreen />;

  return (
    <PlanContext.Provider value={{
      materias, detalles, stats, user, loading, error, careerId, careerData, todasLasCarreras,
      setCarreraActiva, agregarCarrera, borrarCarrera, cambiarEstadoMateria, actualizarDetalleMateria,
      reiniciarProgreso, marcarMultiplesAprobadas, limpiarError: () => setError(null),
    }}>
      {children}
    </PlanContext.Provider>
  );
}

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) throw new Error('usePlan debe usarse dentro de PlanProvider');
  return context;
};
