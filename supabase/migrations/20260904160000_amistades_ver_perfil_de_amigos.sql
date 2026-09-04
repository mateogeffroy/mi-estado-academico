-- Completa 20260904150000_amistades.sql.
--
-- La policy de lectura de perfiles_publicos sólo dejaba ver a los buscables.
-- Con eso, alguien que te mandó una solicitud (o que ya es tu amigo) y después
-- apaga "aparecer en las búsquedas" desaparece de tu lista: la relación existe
-- pero no podés leer su nombre. Esta policy agrega ese caso, y sólo ese: el
-- perfil de gente con la que ya tenés una relación.
--
-- No es recursiva: la policy de select de amistades no consulta
-- perfiles_publicos, así que la evaluación termina.
create policy "perfiles_publicos: leer el de mis relaciones"
  on perfiles_publicos for select
  to authenticated
  using (
    exists (
      select 1 from amistades a
      where (a.solicitante_id = auth.uid() and a.destinatario_id = perfiles_publicos.user_id)
         or (a.destinatario_id = auth.uid() and a.solicitante_id = perfiles_publicos.user_id)
    )
  );
