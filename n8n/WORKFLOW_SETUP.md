# Configuracion recomendada de workflows n8n

Esta guia deja los workflows listos para cualquier instalacion local sin depender de rutas Windows ni de una maquina especifica.

La base recomendada es:

1. Levantar `n8n` con `docker-compose.n8n.yml`
2. Importar los JSON de `n8n/workflows/`
3. Activar los 6 workflows

Si el frontend va a llamar los webhooks desde `http://localhost:3000`, deja `Allowed Origins (CORS)` en `*` o agrega ese origen explicitamente en cada Webhook node.

## Requisito operativo

El `docker-compose.n8n.yml` monta estas carpetas del proyecto dentro del contenedor:

- `./data` en `/files`
- `./scripts` en `/workspace/scripts`

Los workflows importables ya llaman scripts `Node.js` del repo mediante `Execute Command`, que es portable dentro del contenedor de `n8n`.

## Workflows incluidos

Importa estos archivos desde `n8n/workflows/`:

- `dashboard-summary.json`
- `predictive-summary.json`
- `reports-summary.json`
- `generate-report.json`
- `repository-search.json`
- `chatbot-query.json`

## Paths y metodos

Todos usan `Response mode = Using Respond to Webhook node`.

### 1. dashboard-summary

- Method: `GET`
- Path: `dashboard-summary`
- Command:

```sh
node /workspace/scripts/get-dashboard-summary.cjs
```

### 2. predictive-summary

- Method: `GET`
- Path: `predictive-summary`
- Command:

```sh
node /workspace/scripts/get-predictive-summary.cjs
```

### 3. reports-summary

- Method: `GET`
- Path: `reports-summary`
- Command:

```sh
node /workspace/scripts/get-reports-summary.cjs
```

### 4. generate-report

- Method: `POST`
- Path: `generate-report`
- Command:

```sh
node /workspace/scripts/generate-report.cjs --type "{{$json.body.type || 'Operaciones'}}"
```

Resultado esperado:

- crea un CSV en `data/reports/generated`
- actualiza `data/reports/summary.json`
- devuelve `ok`, `fileName` y `path`
- el CSV ya no usa indicadores fijos: se arma con los datos actuales de `dashboard`, `predictive` y `reports`

Nota practica:

- si el campo `type` no llega bien desde `n8n`, el script cae en `Operaciones`
- eso evita nombres corruptos de archivo durante una instalacion nueva

### 5. repository-search

- Method: `GET`
- Path: `repository-search`
- Command:

```sh
node /workspace/scripts/search-repository.cjs --query "{{$json.query.q || ''}}"
```

### 6. chatbot-query

- Method: `POST`
- Path: `chatbot-query`
- Command:

```sh
={{'node /workspace/scripts/chatbot-query.cjs --question ' + JSON.stringify($json.body.question || $json.question || '')}}
```

## Parseo de salida

Despues del `Execute Command`, cada workflow usa un `Code` node para parsear `stdout`:

```javascript
const raw = $json.stdout || $json.data || $json.output || Object.values($json)[0];
return [{ json: JSON.parse(raw) }];
```

## Verificacion local antes de n8n

Desde la raiz del proyecto:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\test-local-data.ps1
```

o si prefieres directo en Node:

```powershell
node .\scripts\get-dashboard-summary.cjs
node .\scripts\get-predictive-summary.cjs
node .\scripts\get-reports-summary.cjs
node .\scripts\search-repository.cjs --query contrato
node .\scripts\chatbot-query.cjs --question "Explicame la semana 3"
node .\scripts\generate-report.cjs --type Operaciones
```

Si esto responde bien, cualquier fallo restante ya esta en la configuracion de `n8n`, no en los datos o scripts del repo.
