# n8n local para LogiSync

## Objetivo

El frontend ya espera webhooks locales en `http://localhost:5678`.

Esta carpeta deja listo el lado n8n para trabajar 100% local:

- workflows base para importar
- `docker-compose.n8n.yml` para levantar n8n
- `data/` como fuente local
- `scripts/` como capa operativa versionada

## Levantar n8n local

Desde la raiz del proyecto:

```powershell
docker compose -f docker-compose.n8n.yml up -d
```

Luego abre:

```text
http://localhost:5678
```

## Volumenes montados

Dentro del contenedor n8n:

- `./data` del proyecto queda montado en `/files`
- `./scripts` del proyecto queda montado en `/workspace/scripts`

Persistencia de n8n:

- `./n8n/storage`

## Workflows base

Importa estos archivos desde `n8n/workflows/`:

- `dashboard-summary.json`
- `predictive-summary.json`
- `reports-summary.json`
- `generate-report.json`
- `repository-search.json`
- `chatbot-query.json`

## Recomendacion practica

Los JSON importables te sirven para arrancar rapido, pero para la version estable local conviene reemplazar la logica inline de los `Code` nodes por `Execute Command` usando los scripts del proyecto.

## Comandos recomendados por workflow

### dashboard-summary

Usa `Execute Command` con:

```powershell
powershell -ExecutionPolicy Bypass -File C:\workspace\scripts\get-dashboard-summary.ps1
```

### predictive-summary

```powershell
powershell -ExecutionPolicy Bypass -File C:\workspace\scripts\get-predictive-summary.ps1
```

### reports-summary

```powershell
powershell -ExecutionPolicy Bypass -File C:\workspace\scripts\get-reports-summary.ps1
```

### repository-search

```powershell
powershell -ExecutionPolicy Bypass -File C:\workspace\scripts\search-repository.ps1 -Query "{{$json.query.q || ''}}"
```

### chatbot-query

```powershell
powershell -ExecutionPolicy Bypass -File C:\workspace\scripts\chatbot-query.ps1 -Question "{{$json.body.question || $json.question || ''}}"
```

### generate-report

```powershell
powershell -ExecutionPolicy Bypass -File C:\workspace\scripts\generate-report.ps1 -Type "{{$json.body.type || 'Operaciones'}}"
```

## Salida esperada

Cada script devuelve JSON. Despues del `Execute Command`, usa:

1. `Code` node para hacer `JSON.parse()` de la salida si hace falta
2. `Respond to Webhook` para devolver `{{$json}}`

## Header opcional

Si activas autenticacion por header en tus webhooks, usa:

```text
x-logisync-key
```

y define el mismo valor en:

```text
VITE_N8N_API_KEY
```
