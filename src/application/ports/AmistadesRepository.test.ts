import { describe, it, expect } from 'vitest';
import { Amistad, relacionCon } from './AmistadesRepository';

const YO = 'yo';
const OTRO = 'otro';

const amistad = (solicitanteId: string, destinatarioId: string, estado: Amistad['estado']): Amistad =>
  ({ solicitanteId, destinatarioId, estado });

describe('relacionCon', () => {
  it('distingue la solicitud que mandé de la que me mandaron', () => {
    expect(relacionCon([amistad(YO, OTRO, 'pendiente')], YO, OTRO)).toBe('enviada');
    expect(relacionCon([amistad(OTRO, YO, 'pendiente')], YO, OTRO)).toBe('recibida');
  });

  it('da "amigos" sin importar quién la pidió', () => {
    expect(relacionCon([amistad(YO, OTRO, 'aceptada')], YO, OTRO)).toBe('amigos');
    expect(relacionCon([amistad(OTRO, YO, 'aceptada')], YO, OTRO)).toBe('amigos');
  });

  it('ignora las relaciones de terceros', () => {
    expect(relacionCon([amistad('a', 'b', 'aceptada')], YO, OTRO)).toBe('ninguna');
    expect(relacionCon([], YO, OTRO)).toBe('ninguna');
  });
});
