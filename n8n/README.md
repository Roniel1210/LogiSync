# n8n local para LogiSync

## Objetivo

El frontend espera webhooks locales en `http://localhost:5678`.

Esta carpeta deja listo el lado `n8n` para trabajar localmente con artefactos versionados:

- workflows importables
- `docker-compose.n8n.yml` para levantar `n8n`
- `data/` como fuente local
- `scripts/` como capa operativa portable

## Levantar n8n local

Desde la raiz del proyecto:

```powershell
docker compose -f docker-compose.n8n.yml up -d
```

o:

```powershell
npm run n8n:up
```

Luego abre:

```text
http://localhost:5678
```

Verificacion rapida:

```powershell
npm run n8n:health
```

En el primer arranque puede tardar unos segundos extra mientras `n8n` inicializa SQLite y la configuracion local.

## Volumenes montados

Dentro del contenedor `n8n`:

- `./data` del proyecto queda montado en `/files`
- `./scripts` del proyecto queda montado en `/workspace/scripts`

Persistencia de `n8n`:

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

Los workflows importables ya estan preparados para ejecutar scripts `Node.js` del repo con `Execute Command`. Esa es la base portable para cualquier PC que levante el proyecto con Docker.

## Header opcional

Si activas autenticacion por header en tus webhooks, usa:

```text
x-logisync-key
```

y define el mismo valor en:

```text
VITE_N8N_API_KEY
```

## Siguiente paso

Sigue [WORKFLOW_SETUP.md](./WORKFLOW_SETUP.md) para la configuracion y pruebas de los 6 webhooks.
