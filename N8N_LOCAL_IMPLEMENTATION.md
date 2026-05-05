# Integracion Local de n8n para LogiSync

## 1. Analisis rapido de la app

Este proyecto hoy es un frontend React/Vite sin backend operativo real.

Puntos importantes del analisis:

- [src/App.tsx](C:/Users/PC6 - 2/LogiSync/src/App.tsx) solo cambia vistas en memoria.
- [src/components/DashboardView.tsx](C:/Users/PC6 - 2/LogiSync/src/components/DashboardView.tsx) usa arreglos locales para KPIs, graficas y cotizaciones.
- [src/components/RepositoryView.tsx](C:/Users/PC6 - 2/LogiSync/src/components/RepositoryView.tsx) usa documentos mock.
- [src/components/PredictiveView.tsx](C:/Users/PC6 - 2/LogiSync/src/components/PredictiveView.tsx) usa forecast mock.
- [src/components/ReportsView.tsx](C:/Users/PC6 - 2/LogiSync/src/components/ReportsView.tsx) usa reportes mock y no descarga archivos reales.
- [src/components/ChatbotView.tsx](C:/Users/PC6 - 2/LogiSync/src/components/ChatbotView.tsx) simula respuestas con `setTimeout`.

Conclusion tecnica:

1. n8n no debe entrar como "extra", sino como capa backend/orquestador local.
2. La forma mas rapida de implementarlo es exponer endpoints locales con Webhook en n8n.
3. El frontend pasa de usar mocks a usar `fetch()` contra `http://localhost:5678/webhook/...`.
4. Todo puede ser local y gratis con n8n Community Edition self-hosted.

## 2. Arquitectura recomendada

### Opcion mas rapida

- Frontend actual: `http://localhost:3000`
- n8n local: `http://localhost:5678`
- Datos locales:
  - CSV/JSON para KPIs, inventario y reportes
  - carpeta local para documentos
  - SQLite interno de n8n para workflows/credenciales
- IA local opcional:
  - Ollama local para chatbot y resumenes

### Que gana este proyecto con n8n

- Programar reportes sin montar backend propio completo
- Automatizar lectura de archivos locales
- Crear endpoints para dashboard/predicciones/chatbot
- Generar archivos CSV o PDF desde workflows
- Ejecutar tareas por horario

## 3. Stack local y gratis recomendado

### Obligatorio

- Node.js para este frontend
- Docker Desktop o `npx n8n`
- n8n Community Edition

### Recomendado

- Docker para n8n, porque es mas estable en Windows
- Ollama local si quieres IA sin pagar API

## 4. Instalacion local de n8n

## Camino A: Docker (recomendado)

Segun la documentacion oficial de n8n, para arrancar localmente puedes usar Docker con volumen persistente y acceso en `localhost:5678`.

Pasos:

1. Instala Docker Desktop.
2. Abre PowerShell.
3. Ejecuta:

```powershell
docker volume create n8n_data
docker run -it --rm `
  --name n8n `
  -p 5678:5678 `
  -e GENERIC_TIMEZONE="America/Santo_Domingo" `
  -e TZ="America/Santo_Domingo" `
  -e N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true `
  -e N8N_RUNNERS_ENABLED=true `
  -v n8n_data:/home/node/.n8n `
  docker.n8n.io/n8nio/n8n
```

4. Abre `http://localhost:5678`
5. Crea el usuario admin.

Notas:

- n8n usa SQLite por defecto para guardar workflows, ejecuciones y credenciales.
- Eso ya cumple con el requisito de local y gratis.

## Camino B: npm/npx

La documentacion oficial indica que n8n requiere Node.js entre `20.19` y `24.x`, y que puedes probarlo con:

```powershell
npx n8n
```

Luego abres:

```text
http://localhost:5678
```

Si quieres dejarlo instalado:

```powershell
npm install -g n8n
n8n
```

## 5. Estrategia de implementacion en este proyecto

No intentes automatizar todo al mismo tiempo. Hazlo en este orden:

1. `Workflow 1`: API local para dashboard
2. `Workflow 2`: API local para predicciones
3. `Workflow 3`: generacion de reportes
4. `Workflow 4`: chatbot local
5. `Workflow 5`: indexacion de documentos del repositorio

Ese orden es el mas rapido porque reemplaza primero los mocks visibles.

## 6. Estructura local recomendada

Crea esta estructura dentro del proyecto:

```text
LogiSync/
  data/
    dashboard/
      kpis.json
      analytics.json
      quotes.json
      transport.json
    predictive/
      forecast.json
    reports/
      generated/
    repository/
      docs/
      index.json
    chatbot/
      knowledge.json
```

## 7. Workflow 1: Dashboard API local

### Objetivo

Reemplazar los datos mock del dashboard por datos servidos desde n8n.

### Endpoint final

```text
GET http://localhost:5678/webhook/dashboard-summary
```

### Nodos del workflow

1. `Webhook`
2. `Code`
3. `Respond to Webhook`

### Paso a paso en n8n

1. Entra a n8n.
2. Crea un workflow nuevo llamado `dashboard-summary`.
3. Agrega un nodo `Webhook`.
4. Configuralo asi:
   - HTTP Method: `GET`
   - Path: `dashboard-summary`
   - Authentication: `None` al principio
5. Agrega un nodo `Code`.
6. Pega esto:

```javascript
return [
  {
    json: {
      kpis: [
        { label: "Sincronizacion Inventario", value: "98.4%", change: "+2.1%", trend: "up", subtitle: "Vs mes anterior" },
        { label: "SLA de Entregas", value: "96.5%", change: "+0.5%", trend: "up", subtitle: "Vs mes anterior" },
        { label: "Optimizacion Compras", value: "$42.5k", change: "-1.5%", trend: "down", subtitle: "Vs mes anterior" },
        { label: "Nodos Activos", value: "1,248", change: "+7%", trend: "up", subtitle: "Vs mes anterior" }
      ],
      analyticsData: [
        { day: "1", value: 160 },
        { day: "2", value: 380 },
        { day: "3", value: 190 }
      ],
      quotes: [
        { provider: "GlobalTech Solutions", req: "Semiconductores A", confidence: 98, cost: "$4,500" }
      ],
      transport: [
        { name: "Terrestre", value: 65, color: "#4f46e5" },
        { name: "Aereo", value: 20, color: "#8b5cf6" },
        { name: "Maritimo", value: 15, color: "#c4b5fd" }
      ]
    }
  }
];
```

7. Agrega `Respond to Webhook`.
8. Configuralo:
   - Respond With: `JSON`
   - Response Body: `{{$json}}`
9. Conecta `Webhook -> Code -> Respond to Webhook`.
10. Guarda.
11. Pulsa `Test workflow`.
12. Abre la URL de prueba del webhook.
13. Si responde JSON correcto, activa el workflow.

### Resultado

Tu frontend ya puede pedir los datos del dashboard a n8n.

## 8. Workflow 2: Predicciones locales

### Objetivo

Servir el contenido de `PredictiveView` desde n8n.

### Endpoint final

```text
GET http://localhost:5678/webhook/predictive-summary
```

### Nodos

1. `Webhook`
2. `Code`
3. `Respond to Webhook`

### Logica

El `Code` devuelve:

- serie `forecastData`
- semana critica
- mensaje del motor de decision
- matriz de sensibilidad

### Ejemplo de salida JSON

```javascript
return [
  {
    json: {
      forecastData: [
        { name: "Sem 1", inventario: 4000, demanda: 2400 },
        { name: "Sem 2", inventario: 3000, demanda: 1398 },
        { name: "Sem 3", inventario: 2000, demanda: 4800 }
      ],
      alert: {
        active: true,
        week: "Sem 3",
        shortageUnits: 2800
      },
      decisionText: "La demanda inferida para la Semana 3 supera el stock de seguridad en 2,800 unidades.",
      sensitivity: {
        projectionConfidence: 89,
        climateRisk: 22
      }
    }
  }
];
```

## 9. Workflow 3: Generacion de reportes

### Objetivo

Cuando el usuario pulse `Generar Nuevo`, n8n crea un archivo local y devuelve metadatos.

### Endpoint final

```text
POST http://localhost:5678/webhook/generate-report
```

### Nodos

1. `Webhook`
2. `Code`
3. `Convert to File`
4. `Read/Write Files from Disk`
5. `Respond to Webhook`

### Paso a paso

1. Crea workflow `generate-report`.
2. `Webhook`:
   - Method: `POST`
   - Path: `generate-report`
3. `Code`: arma el contenido CSV.

Ejemplo:

```javascript
const reportName = `reporte-${Date.now()}.csv`;
const csv = [
  "indicador,valor",
  "sincronizacion_inventario,98.4",
  "sla_entregas,96.5",
  "optimizacion_compras,42500"
].join("\n");

return [
  {
    json: {
      fileName: reportName,
      mimeType: "text/csv",
      content: csv
    }
  }
];
```

4. `Convert to File`:
   - Operation: convertir texto a archivo
   - Input Field: `content`
   - File Name: `{{$json.fileName}}`
   - MIME Type: `{{$json.mimeType}}`
5. `Read/Write Files from Disk`:
   - Operation: `Write File to Disk`
   - File Path and Name:

```text
C:/Users/PC6 - 2/LogiSync/data/reports/generated/{{$json.fileName}}
```

6. `Respond to Webhook`:

```json
{
  "ok": true,
  "fileName": "{{$json.fileName}}",
  "path": "C:/Users/PC6 - 2/LogiSync/data/reports/generated/{{$json.fileName}}"
}
```

### Importante

El nodo oficial `Read/Write Files from Disk` funciona en self-hosted y no existe en n8n Cloud. Para este caso local te sirve perfecto.

## 10. Workflow 4: Chatbot local y gratis

### Opcion mas simple

Usar `Webhook + Code` con respuestas basadas en reglas.

### Opcion util de verdad

Usar Ollama local con n8n.

La documentacion oficial de n8n tiene credenciales para Ollama y el URL por defecto es:

```text
http://localhost:11434
```

### Flujo recomendado

1. `Webhook`
2. `Code` para limpiar el prompt
3. `Read/Write Files from Disk` o fuente local de contexto
4. `Chat Ollama`
5. `Respond to Webhook`

### Endpoint final

```text
POST http://localhost:5678/webhook/chatbot-query
```

### Body que envia el frontend

```json
{
  "question": "Explicame la prediccion de stock de la semana 3"
}
```

### Paso a paso del workflow

1. Crea workflow `chatbot-query`.
2. `Webhook`:
   - Method: `POST`
   - Path: `chatbot-query`
3. `Code`:

```javascript
const question = $json.body?.question || $json.question || "";

const systemPrompt = `
Eres el asistente de LogiSync.
Responde solo con informacion del contexto local.
Si no hay datos suficientes, dilo claramente.
`.trim();

return [
  {
    json: {
      question,
      systemPrompt,
      context: "Semana 3: demanda 4800, inventario 2000, ruptura estimada de 2800 unidades."
    }
  }
];
```

4. `Chat Ollama`:
   - Credentials: Ollama local
   - Base URL: `http://localhost:11434`
   - Model: por ejemplo `llama3.1`
   - System Message: `{{$json.systemPrompt}}`
   - User Message:

```text
Contexto:
{{$json.context}}

Pregunta:
{{$json.question}}
```

5. `Respond to Webhook`:

```json
{
  "answer": "={{$json.text || $json.response || $json.output || ''}}"
}
```

## 11. Workflow 5: Repositorio documental local

### Objetivo

Indexar archivos locales y devolver resultados simples al frontend.

### Enfoque rapido

No montes una base vectorial primero. Haz una version 1 local.

### Workflow A: indexador

Trigger recomendado:

- `Local File Trigger`

Nodos:

1. `Local File Trigger`
2. `Read/Write Files from Disk`
3. `Code`
4. `Write File to Disk` o persistencia en JSON

### Que hace

- escucha cambios en `data/repository/docs`
- lee nombre, ruta, fecha, tamano
- genera un `index.json`

### Workflow B: busqueda

Endpoint:

```text
GET http://localhost:5678/webhook/repository-search?q=contrato
```

Nodos:

1. `Webhook`
2. `Code`
3. `Respond to Webhook`

El `Code`:

- lee el termino `q`
- filtra coincidencias sobre `index.json`
- devuelve lista ordenada

## 12. Como conectar el frontend actual

Debes cambiar los componentes para que dejen de leer arreglos locales y consuman n8n.

## Cambios minimos por archivo

### Dashboard

En [src/components/DashboardView.tsx](C:/Users/PC6 - 2/LogiSync/src/components/DashboardView.tsx):

1. mover mocks a `useState`
2. usar `useEffect`
3. cargar desde:

```ts
fetch('http://localhost:5678/webhook/dashboard-summary')
```

### Predictive

En [src/components/PredictiveView.tsx](C:/Users/PC6 - 2/LogiSync/src/components/PredictiveView.tsx):

```ts
fetch('http://localhost:5678/webhook/predictive-summary')
```

### Reports

En [src/components/ReportsView.tsx](C:/Users/PC6 - 2/LogiSync/src/components/ReportsView.tsx):

al hacer click en `Generar Nuevo`:

```ts
fetch('http://localhost:5678/webhook/generate-report', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'operaciones' })
})
```

### Chatbot

En [src/components/ChatbotView.tsx](C:/Users/PC6 - 2/LogiSync/src/components/ChatbotView.tsx):

reemplaza el `setTimeout` por:

```ts
fetch('http://localhost:5678/webhook/chatbot-query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question: input })
})
```

## 13. Seguridad minima local

Aunque sea local, no dejes webhooks abiertos sin control si luego abres acceso de red.

La documentacion oficial indica que el nodo Webhook soporta:

- `Basic auth`
- `Header auth`
- `JWT auth`
- `None`

Para rapido y local:

1. empieza con `Header auth`
2. usa un header como:

```text
x-logisync-key: mi-clave-local
```

3. manda ese header desde React

## 14. Plan de trabajo en 1 dia

## Bloque 1 - 1 hora

1. Instalar n8n
2. Levantar `localhost:5678`
3. Crear workflows vacios

## Bloque 2 - 2 horas

1. Crear `dashboard-summary`
2. Crear `predictive-summary`
3. Probar endpoints en navegador o Postman

## Bloque 3 - 2 horas

1. Conectar dashboard y predictive desde React
2. Verificar que desaparezcan los mocks de esas vistas

## Bloque 4 - 2 horas

1. Crear `generate-report`
2. Escribir CSV a disco
3. Conectar boton de reportes

## Bloque 5 - 2 horas

1. Crear `chatbot-query`
2. Conectar con Ollama local o reglas simples
3. Integrar con `ChatbotView`

## 15. Orden recomendado de ejecucion real

Haz exactamente esto:

1. Levanta n8n
2. Crea `dashboard-summary`
3. Haz que `DashboardView` use ese endpoint
4. Crea `predictive-summary`
5. Haz que `PredictiveView` use ese endpoint
6. Crea `generate-report`
7. Conecta `ReportsView`
8. Crea `chatbot-query`
9. Conecta `ChatbotView`
10. Deja `RepositoryView` para despues

## 16. Lo que no te recomiendo para empezar

- montar PostgreSQL desde el dia 1
- vector database desde el dia 1
- RAG complejo antes de tener endpoints basicos
- PDF complejo antes de que CSV funcione
- autenticar con OAuth para uso local

## 17. Riesgos reales de este proyecto

1. La app actual no tiene capa de servicios ni hooks de datos, asi que cada vista necesita adaptacion.
2. Si n8n corre en Docker, el acceso a archivos del host hay que mapearlo bien.
3. El chatbot actual esta completamente mockeado, asi que la mayor ganancia funcional real vendra de conectarlo a Ollama o a reglas locales.
4. El "repositorio vectorial" del diseño no existe todavia; eso debe implementarse por fases.

## 18. Implementacion minima viable

Si tienes muy poco tiempo, haz solo esto:

1. Instala n8n local
2. Crea 3 webhooks:
   - `/dashboard-summary`
   - `/predictive-summary`
   - `/chatbot-query`
3. Conecta solo estas 3 vistas desde React
4. Deja reportes con CSV como segunda fase

Con eso pasas de demo estatica a app conectada con automatizacion local real.

## 19. Fuentes oficiales usadas

- n8n npm install: https://docs.n8n.io/hosting/installation/npm/
- n8n Docker install: https://docs.n8n.io/hosting/installation/docker/
- n8n Community Edition: https://docs.n8n.io/hosting/community-edition-features/
- n8n Webhook credentials: https://docs.n8n.io/integrations/builtin/credentials/webhook/
- Read/Write Files from Disk: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.readwritefile/
- Local File Trigger: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.localfiletrigger/
- Ollama credentials en n8n: https://docs.n8n.io/integrations/builtin/credentials/ollama/
