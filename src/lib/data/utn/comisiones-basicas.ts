// src/lib/data/utn/comisiones-basicas.ts

export const COMISIONES_BASICAS: Record<string, any[]> = {
  'UTN-AM1': [
    { id: 'S10 (Sistemas)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '08:00', fin: '12:00' }] },
    { id: 'S11 (Sistemas)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '08:00', fin: '12:00' }] },
    { id: 'S12 (Sistemas)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '12:30' }] },
    { id: 'S13 (Sistemas)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '21:00' }] },
    { id: 'S14 (Sistemas)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '19:15', fin: '23:15' }] },
    { id: 'S15 (Sistemas)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '13:15', fin: '17:15' }] },
    { id: 'S16 (Sistemas)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '13:00', fin: '15:15' }, { nombre: 'Miércoles', inicio: '09:45', fin: '11:15' }] },
    { id: 'Q11 (Química)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '16:45', fin: '20:45' }] },
    { id: 'C11 (Civil)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '12:00' }] },
    { id: 'C12 (Civil)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:15', fin: '21:15' }] },
    { id: 'E11 (Eléctrica)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '18:15', fin: '22:00' }] },
    { id: 'I11 (Industrial)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '12:00' }] },
    { id: 'I12 (Industrial)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '21:00' }] },
    { id: 'M11 (Mecánica)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '08:00', fin: '12:00' }] },
    { id: 'M12 (Mecánica)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '19:00', fin: '23:00' }] }
  ],

  'UTN-AGA': [
    { id: 'S10 (Sistemas)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '08:00', fin: '12:00' }] },
    { id: 'S11 (Sistemas)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '08:00', fin: '12:00' }] },
    { id: 'Q11 (Química)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '18:00', fin: '22:00' }] },
    { id: 'C11 (Civil)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '08:00', fin: '12:00' }] },
    { id: 'C12 (Civil)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '20:45' }] },
    { id: 'E11 (Eléctrica)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:30', fin: '21:30' }] },
    { id: 'I11 (Industrial)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '08:00', fin: '12:00' }] },
    { id: 'I12 (Industrial)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:00', fin: '21:00' }] },
    { id: 'M11 (Mecánica)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '08:00', fin: '12:00' }] },
    { id: 'M12 (Mecánica)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '17:00', fin: '21:00' }] }
  ],

  'UTN-F1': [
    { id: 'S10 (Sistemas)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '09:00', fin: '13:00' }] },
    { id: 'Q11 (Química)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '18:45', fin: '22:45' }] },
    { id: 'C11 (Civil)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '08:30', fin: '12:30' }] },
    { id: 'C12 (Civil)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '18:00', fin: '21:45' }] },
    { id: 'E11 (Eléctrica)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '18:00', fin: '21:45' }] },
    { id: 'I11 (Industrial)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '09:30', fin: '13:30' }] },
    { id: 'I12 (Industrial)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '16:30', fin: '20:30' }] },
    { id: 'M11 (Mecánica)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '09:30', fin: '13:30' }] },
    { id: 'M12 (Mecánica)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '17:30', fin: '21:30' }] }
  ],

  'UTN-QG': [
    { id: 'Q11 (Química)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '17:00', fin: '21:00' }] },
    { id: 'C11 (Civil)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '08:00', fin: '12:00' }] },
    { id: 'C12 (Civil)', duration: 'A', dias: [{ nombre: 'Miércoles', inicio: '20:45', fin: '23:00' }, { nombre: 'Jueves', inicio: '20:45', fin: '22:15' }] },
    { id: 'E11 (Eléctrica)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '17:15', fin: '21:00' }] },
    { id: 'I11 (Industrial)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '08:00', fin: '09:30' }, { nombre: 'Jueves', inicio: '10:30', fin: '12:45' }] },
    { id: 'I12 (Industrial)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '18:00', fin: '22:00' }] },
    { id: 'M11 (Mecánica)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '08:00', fin: '12:00' }] },
    { id: 'M12 (Mecánica)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '18:00', fin: '22:00' }] }
  ],

  'UTN-SDR': [
    { id: 'Q21 (Química)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '15:30', fin: '17:45' }] },
    { id: 'C11 (Civil)', duration: 'A', dias: [{ nombre: 'Lunes', inicio: '13:00', fin: '15:15' }] },
    { id: 'C12 (Civil)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '18:30', fin: '20:45' }] },
    { id: 'E11 (Eléctrica)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '16:00', fin: '18:15' }] },
    { id: 'I11 (Industrial)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '08:00', fin: '10:15' }] },
    { id: 'I12 (Industrial)', duration: 'A', dias: [{ nombre: 'Viernes', inicio: '18:00', fin: '20:15' }] },
    { id: 'M11 (Mecánica)', duration: 'A', dias: [{ nombre: 'Jueves', inicio: '08:00', fin: '10:15' }] },
    { id: 'M12 (Mecánica)', duration: 'A', dias: [{ nombre: 'Martes', inicio: '16:45', fin: '19:00' }] }
  ]
};