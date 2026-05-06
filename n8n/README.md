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

## Gemini para el chatbot

El workflow `chatbot-query` ejecuta `scripts/chatbot-query.cjs`. Si defines `GEMINI_API_KEY`, ese script consulta Gemini y usa `data/chatbot/knowledge.json` como contexto local. Si la clave no existe o Gemini falla, responde con el fallback local.

El chatbot tambien carga `data/predictive/summary.json`, `data/dashboard/summary.json`, `data/reports/summary.json` y `data/repository/index.json`, por lo que puede responder sobre semanas disponibles, estimar semanas futuras marcandolas como estimacion y simular mensajes de compra/contacto a proveedores sin ejecutar acciones reales.

En `.env` de la raiz del proyecto:

```text
GEMINI_API_KEY="TU_API_KEY"
GEMINI_MODEL="gemini-2.5-flash"
```

Despues de editar `.env`, recrea el contenedor para que n8n reciba las variables:

```powershell
docker compose -f docker-compose.n8n.yml up -d --force-recreate
```

Si ya importaste `chatbot-query` antes de este cambio, vuelve a importar `n8n/workflows/chatbot-query.json` o edita el nodo `Execute Chatbot Script` para usar el comando actualizado.

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
