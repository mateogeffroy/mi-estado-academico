import { describe, it, expect } from 'vitest';
import { FORMATOS_APUNTE, extensionDe } from './ApuntesRepository';

describe('extensionDe', () => {
  it('toma la última extensión y la normaliza a minúsculas', () => {
    expect(extensionDe('Resumen Final.PDF')).toBe('pdf');
    expect(extensionDe('apunte.v2.final.docx')).toBe('docx');
  });

  it('un archivo sin extensión no cae en ningún formato permitido', () => {
    // Sin punto, split devuelve el nombre entero: lo que importa es que no
    // matchee ningún MIME, porque eso es lo que corta la subida.
    expect(FORMATOS_APUNTE[extensionDe('apunte')]).toBeUndefined();
    expect(FORMATOS_APUNTE[extensionDe('virus.exe')]).toBeUndefined();
  });

  it('acepta los cuatro formatos de texto acordados', () => {
    expect(Object.keys(FORMATOS_APUNTE).sort()).toEqual(['docx', 'md', 'pdf', 'txt']);
  });
});
