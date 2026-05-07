# Checklist local de n8n para LogiSync

Esta es la ruta minima para dejar el proyecto funcional con `n8n` en local.

## Lo que ya debe existir

- Docker Desktop instalado y corriendo
- Node.js instalado
- Dependencias del frontend instaladas con `npm install`
- `.env.local` con:

```env
VITE_N8N_BASE_URL="http://localhost:5678"
VITE_N8N_API_KEY="MY_LOCAL_N8N_KEY"
```

Si no vas a usar auth por header en los webhooks, puedes dejar `VITE_N8N_API_KEY` vacio.

## Paso 1: levantar n8n

Desde la raiz del proyecto:

```powershell
npm run n8n:up
```

Comprobar salud:

```powershell
npm run n8n:health
```

Respuesta esperada:

```json
{"status":"ok"}
```

## Paso 2: entrar a la UI de n8n

Abre:

```text
http://localhost:5678
```

En el primer arranque `n8n` te pedira crear el usuario admin.

## Paso 3: importar workflows

Importa estos archivos desde `n8n/workflows/`:

1. `dashboard-summary.json`
2. `predictive-summary.json`
3. `reports-summary.json`
4. `generate-report.json`
5. `repository-search.json`
6. `chatbot-query.json`

## Paso 4: activar workflows

Activa los 6 workflows despues de importarlos.

Sin ese paso el frontend seguira usando fallback local.

## Paso 5: revisar webhooks

Verifica que queden asi:

1. `GET /webhook/dashboard-summary`
2. `GET /webhook/predictive-summary`
3. `GET /webhook/reports-summary`
4. `POST /webhook/generate-report`
5. `GET /webhook/repository-search`
6. `POST /webhook/chatbot-query`

Todos deben usar `Respond to Webhook`.

## Paso 6: auth opcional

Si quieres proteger los webhooks:

1. Configura auth por header en cada Webhook node
2. Usa el header `x-logisync-key`
3. Pon el mismo valor en `.env.local` como `VITE_N8N_API_KEY`

## Paso 7: arrancar frontend

```powershell
npm run dev
```

## Paso 8: comprobacion funcional

En la app:

1. Dashboard debe indicar `Datos servidos por n8n`
2. Predictive debe indicar `Predicciones servidas por n8n`
3. Reports debe cargar el listado desde `reports-summary`
4. `Generar Nuevo` debe crear un CSV en `data/reports/generated`
5. Repository debe consultar `repository-search`
6. Chatbot debe responder via `chatbot-query`

## Como cambiar los datos y verlos reflejados

La app no deberia depender de datos visuales inventados cuando `n8n` esta operativo. La fuente local real esta en:

- `data/dashboard/summary.json`
- `data/predictive/summary.json`
- `data/reports/summary.json`
- `data/repository/index.json`
- `data/chatbot/knowledge.json`

Regla practica:

1. Cambia el JSON fuente
2. Guarda el archivo
3. Pulsa `Actualizar` en la vista correspondiente o vuelve a cargar la pagina

Mapeo rapido:

- Dashboard: `data/dashboard/summary.json`
- Predictive: `data/predictive/summary.json`
- Reports: `data/reports/summary.json`
- Repository: `data/repository/index.json`
- Chatbot: `data/chatbot/knowledge.json`

Si generas un reporte nuevo:

- el CSV se crea en `data/reports/generated/`
- el catalogo visible se actualiza en `data/reports/summary.json`
- el contenido del CSV se construye con los datos reales de `dashboard`, `predictive` y `reports`

## Diagnostico rapido

Si `npm run n8n:health` falla:

- revisa Docker Desktop
- revisa `docker compose -f docker-compose.n8n.yml ps`
- espera 20 a 40 segundos en el primer arranque

Si la UI abre pero el frontend muestra fallback:

- faltan workflows importados
- o faltan workflows activados
- o el auth/header no coincide

Si `Generar Nuevo` falla:

- revisa que `data/reports/generated` exista y sea escribible
- revisa el workflow `generate-report`
- revisa que `scripts/generate-report.cjs` pueda escribir en disco
