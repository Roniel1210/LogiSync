
# 📦 LogiSync: Gestión Logística con IA

LogiSync es una plataforma de control logístico inteligente que utiliza IA para optimizar inventarios, predecir demanda y gestionar documentos mediante búsqueda vectorial.

Para una descripción detallada de la arquitectura, tecnologías y funcionalidades, consulta la **[Documentación Completa (DOCUMENTATION.md)](./DOCUMENTATION.md)**.

## 🚀 Inicio Rápido

## Run Locally

### Frontend solamente

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Review `.env.local`
3. Run the app:
   `npm run dev`

### Frontend + n8n local

1. Levanta `n8n`:
   `npm run n8n:up`
2. Verifica salud:
   `npm run n8n:health`
3. Abre `http://localhost:5678`
4. Crea el usuario admin de `n8n`
5. Importa los 6 workflows desde `n8n/workflows/`
6. Activa los 6 workflows
7. Arranca el frontend:
   `npm run dev`

Guia detallada:

- [n8n/README.md](./n8n/README.md)
- [n8n/WORKFLOW_SETUP.md](./n8n/WORKFLOW_SETUP.md)
- [LOCAL_N8N_CHECKLIST.md](./LOCAL_N8N_CHECKLIST.md)

## Fuente de datos real

La app ya esta preparada para consumir datos coherentes desde `n8n`. Los archivos que actuan como fuente local de verdad son:

- `data/dashboard/summary.json`
- `data/predictive/summary.json`
- `data/reports/summary.json`
- `data/repository/index.json`
- `data/chatbot/knowledge.json`

Como funciona:

1. Editas uno de esos JSON
2. `n8n` lo lee mediante los scripts de `scripts/*.cjs`
3. El frontend vuelve a pedir el webhook
4. La vista se actualiza con ese contenido

Para probar cambios rapido:

1. Edita el JSON
2. En la app pulsa `Actualizar`
3. O vuelve a llamar el webhook correspondiente

Los reportes CSV generados por `generate-report` ya salen de `dashboard`, `predictive` y `reports`, no de valores hardcodeados sin contexto.
