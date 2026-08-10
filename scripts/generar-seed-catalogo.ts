// Genera supabase/seed.sql a partir de los archivos estáticos de catálogo en
// src/lib/data/{utn,unlp}/*.ts. Es un script de un solo uso durante la
// migración del catálogo a la base de datos (Fase 1): mientras el catálogo
// siga viviendo también en estos archivos TS, este script se puede volver a
// correr para regenerar el seed si se corrige algo en el origen.
//
// Uso: npx tsx scripts/generar-seed-catalogo.ts > supabase/seed.sql

import { careersRegistry } from '../src/lib/data/registry';

type Subject = {
  id: string | number;
  num?: string;
  name: string;
  level?: number;
  hours?: string;
  duration?: string;
  correlCursada?: (string | number)[];
  correlAprobada?: (string | number)[];
  annualHours?: number;
  targetHours?: number;
  isElectivePlaceholder?: boolean;
  isSeminario?: boolean;
  isOutdated?: boolean;
  onlyIngenieria?: boolean;
  comisiones?: {
    id: string;
    duration?: string;
    dias: { nombre: string; inicio: string; fin: string }[];
  }[];
};

const UNIVERSIDADES: Record<string, { slug: string; nombre: string }> = {
  'UTN FRLP': { slug: 'utn-frlp', nombre: 'UTN - Facultad Regional La Plata' },
  UNLP: { slug: 'unlp', nombre: 'Universidad Nacional de La Plata' },
  'UNLP - Facultad de Artes': { slug: 'unlp', nombre: 'Universidad Nacional de La Plata' },
};

// Escapa un string para un literal SQL, o devuelve NULL si es nullish.
function sqlStr(v: unknown): string {
  if (v === null || v === undefined) return 'null';
  return `'${String(v).replace(/'/g, "''")}'`;
}

function sqlBool(v: unknown): string {
  return v ? 'true' : 'false';
}

function sqlNum(v: unknown): string {
  return v === null || v === undefined ? 'null' : String(Number(v));
}

const lines: string[] = [];
lines.push('-- Generado por scripts/generar-seed-catalogo.ts a partir de src/lib/data/**');
lines.push('-- No editar a mano: volver a correr el script si cambia el origen.');
lines.push('');

// ── Universidades ──────────────────────────────────────────────────────
const universidadesUnicas = new Map<string, { slug: string; nombre: string }>();
for (const mod of Object.values(careersRegistry)) {
  const info = UNIVERSIDADES[mod.careerInfo.universidad];
  if (!info) throw new Error(`Universidad no mapeada: "${mod.careerInfo.universidad}"`);
  universidadesUnicas.set(info.slug, info);
}

lines.push('insert into universidades (slug, nombre) values');
lines.push(
  Array.from(universidadesUnicas.values())
    .map((u) => `  (${sqlStr(u.slug)}, ${sqlStr(u.nombre)})`)
    .join(',\n') + '\non conflict (slug) do nothing;'
);
lines.push('');

// ── Carreras ────────────────────────────────────────────────────────────
lines.push('insert into carreras (universidad_id, slug, nombre, plan, titulo_intermedio, titulo_final, creditos_totales) values');
const carrerasRows: string[] = [];
for (const [careerId, mod] of Object.entries(careersRegistry)) {
  const info = mod.careerInfo;
  const uniSlug = UNIVERSIDADES[info.universidad].slug;
  carrerasRows.push(
    `  ((select id from universidades where slug = ${sqlStr(uniSlug)}), ${sqlStr(careerId)}, ${sqlStr(info.nombre)}, ${sqlStr(info.plan)}, ${sqlStr(info.tituloIntermedio)}, ${sqlStr(info.tituloFinal)}, ${sqlNum(info.creditosTotales ?? 0)})`
  );
}
lines.push(carrerasRows.join(',\n') + '\non conflict (slug) do nothing;');
lines.push('');

// ── Materias, correlatividades y comisiones por carrera ────────────────
for (const [careerId, mod] of Object.entries(careersRegistry)) {
  const subjects: Subject[] = mod.ALL;
  if (!subjects || subjects.length === 0) continue;

  lines.push(`-- ── ${careerId} ──`);
  lines.push('do $$');
  lines.push('declare');
  lines.push('  v_carrera_id uuid;');
  lines.push('begin');
  lines.push(`  select id into v_carrera_id from carreras where slug = ${sqlStr(careerId)};`);
  lines.push('');

  // Materias
  lines.push('  insert into materias (carrera_id, codigo, numero, nombre, nivel, carga_horaria, duracion, es_electiva, es_placeholder_electiva, horas_anuales_electiva, horas_anuales_requeridas, es_seminario, fuera_de_plan, solo_ingenieria) values');
  const matRows = subjects.map((s) => {
    const esElectiva = s.annualHours !== undefined;
    return `    (v_carrera_id, ${sqlStr(s.id)}, ${sqlStr(s.num)}, ${sqlStr(s.name)}, ${sqlNum(s.level)}, ${sqlStr(s.hours)}, ${sqlStr(s.duration)}, ${sqlBool(esElectiva)}, ${sqlBool(s.isElectivePlaceholder)}, ${sqlNum(s.annualHours)}, ${sqlNum(s.targetHours)}, ${sqlBool(s.isSeminario)}, ${sqlBool(s.isOutdated)}, ${sqlBool(s.onlyIngenieria)})`;
  });
  lines.push(matRows.join(',\n') + '\n  on conflict (carrera_id, codigo) do nothing;');
  lines.push('');

  // Correlatividades
  const correlRows: string[] = [];
  for (const s of subjects) {
    for (const req of s.correlCursada ?? []) {
      correlRows.push(`    (${sqlStr(s.id)}, ${sqlStr(req)}, 'cursada')`);
    }
    for (const req of s.correlAprobada ?? []) {
      correlRows.push(`    (${sqlStr(s.id)}, ${sqlStr(req)}, 'aprobada')`);
    }
  }
  if (correlRows.length > 0) {
    lines.push('  insert into correlatividades (materia_id, requisito_id, tipo)');
    lines.push('  select m.id, r.id, x.tipo::tipo_correlatividad');
    lines.push('  from (values');
    lines.push(correlRows.join(',\n'));
    lines.push('  ) as x(materia_codigo, requisito_codigo, tipo)');
    lines.push('  join materias m on m.carrera_id = v_carrera_id and m.codigo = x.materia_codigo');
    lines.push('  join materias r on r.carrera_id = v_carrera_id and r.codigo = x.requisito_codigo');
    lines.push('  on conflict do nothing;');
    lines.push('');
  }

  // Comisiones
  const comisionRows: string[] = [];
  for (const s of subjects) {
    for (const c of s.comisiones ?? []) {
      comisionRows.push(`    (${sqlStr(s.id)}, ${sqlStr(c.id)}, ${sqlStr(c.duration)})`);
    }
  }
  if (comisionRows.length > 0) {
    lines.push('  insert into comisiones (materia_id, codigo, duracion)');
    lines.push('  select m.id, x.codigo, x.duracion');
    lines.push('  from (values');
    lines.push(comisionRows.join(',\n'));
    lines.push('  ) as x(materia_codigo, codigo, duracion)');
    lines.push('  join materias m on m.carrera_id = v_carrera_id and m.codigo = x.materia_codigo');
    lines.push('  on conflict (materia_id, codigo) do nothing;');
    lines.push('');

    // Horarios (dependen de que las comisiones ya existan)
    const horarioRows: string[] = [];
    for (const s of subjects) {
      for (const c of s.comisiones ?? []) {
        for (const d of c.dias ?? []) {
          horarioRows.push(`    (${sqlStr(s.id)}, ${sqlStr(c.id)}, ${sqlStr(d.nombre)}, ${sqlStr(d.inicio)}, ${sqlStr(d.fin)})`);
        }
      }
    }
    if (horarioRows.length > 0) {
      lines.push('  insert into comision_horarios (comision_id, dia, hora_inicio, hora_fin)');
      lines.push('  select c.id, x.dia, x.hora_inicio::time, x.hora_fin::time');
      lines.push('  from (values');
      lines.push(horarioRows.join(',\n'));
      lines.push('  ) as x(materia_codigo, comision_codigo, dia, hora_inicio, hora_fin)');
      lines.push('  join materias m on m.carrera_id = v_carrera_id and m.codigo = x.materia_codigo');
      lines.push('  join comisiones c on c.materia_id = m.id and c.codigo = x.comision_codigo;');
      lines.push('');
    }
  }

  lines.push('end $$;');
  lines.push('');
}

process.stdout.write(lines.join('\n') + '\n');
