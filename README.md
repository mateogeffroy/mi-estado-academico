# 🎓 Mi Estado Académico

> La herramienta definitiva para trackear y organizar tu progreso en Ingeniería en Sistemas de Información (UTN FRLP - Plan 2023).

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?style=for-the-badge)

## 📌 Sobre el proyecto

**Mi Estado Académico** nace para solucionar el problema clásico de la organización universitaria: depender de PDFs desactualizados o planillas de Excel para saber qué materias podés cursar. 

Esta plataforma web ofrece un plan de estudios dinámico y personalizado donde los estudiantes pueden llevar un control exacto de su cursada, correlatividades y promedios, con una interfaz moderna y adaptada a dispositivos móviles.

## ✨ Funcionalidades Principales

- 🗺️ **Plan de Estudios Dinámico:** Visualizá la grilla completa de materias. El sistema calcula automáticamente qué materias se desbloquean basándose en tus finales y cursadas aprobadas.
- 📊 **Estadísticas en Tiempo Real:** Seguimiento automático de tu porcentaje de avance en la carrera, cantidad de materias aprobadas y cálculo de promedio.
- 📅 **Gestión de Cursada:** Agregá tu comisión, horarios y fechas de parciales/entregas por cada materia.
- 📱 **Mobile First:** Diseño fluido y responsivo, pensado para usarse cómodamente desde el celular entre clases.
- 🔒 **Autenticación:** Sistema de usuarios seguro mediante email o Google Auth, guardando tu progreso en la nube.

## 🛠️ Stack Tecnológico

- **Frontend:** React, Next.js (App Router), TypeScript.
- **Backend / Base de Datos:** Supabase (PostgreSQL, Auth, RLS).
- **Estilos:** CSS Modules y Variables CSS (Custom UI).

## 🚀 Instalación y Desarrollo Local

Si querés correr este proyecto en tu máquina para probarlo o aportar mejoras:

1. Cloná el repositorio:
   \`\`\`bash
   git clone https://github.com/TU_USUARIO/mi-estado-academico.git
   \`\`\`
2. Instalá las dependencias:
   \`\`\`bash
   npm install
   \`\`\`
3. Configurá las variables de entorno:
   Creá un archivo \`.env.local\` en la raíz del proyecto y agregá tus credenciales de Supabase:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   \`\`\`
4. Iniciá el servidor de desarrollo:
   \`\`\`bash
   npm run dev
   \`\`\`

## 📄 Licencia y Uso

Este proyecto es Open Source y se distribuye bajo la licencia **[GNU AGPLv3](LICENSE)**. 

Siendo un proyecto de código abierto, sos libre de estudiarlo, usarlo y modificarlo, **siempre y cuando se cumplan estrictamente las siguientes condiciones**:

1. **Atribución:** Debés dar el crédito correspondiente al autor original del código (Mateo Geffroy).
2. **Copyleft (Código Abierto):** Si modificás este código o lo utilizás como base para brindar un servicio a través de una red (por ejemplo, lo subís a otra página web), **estás obligado legalmente a hacer público el código fuente de tu versión** bajo esta misma licencia AGPLv3.

*Para conocer los términos legales completos, revisá el archivo `LICENSE` incluido en este repositorio.*

---
Desarrollado por **Mateo Geffroy**