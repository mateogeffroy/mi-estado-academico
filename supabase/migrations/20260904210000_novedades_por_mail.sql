-- Opt-out de los avisos por mail. Arranca en true (los avisos de cambios en
-- la plataforma son esperables), pero tiene que poder apagarse desde el
-- perfil: mandar novedades sin forma de darse de baja no corresponde.
alter table perfiles_publicos
  add column if not exists recibir_novedades boolean not null default true;

comment on column perfiles_publicos.recibir_novedades is
  'Si es false, el script de anuncios saltea a este usuario.';
