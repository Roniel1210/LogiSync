# Configuracion manual recomendada de workflows n8n

Esta guia te deja los workflows listos usando los scripts locales del proyecto. Es mas estable que mantener la logica completa dentro de `Code` nodes.

## Patron comun

Cada workflow usa:

1. `Webhook`
2. `Execute Command`
3. `Code` opcional para parsear salida
4. `Respond to Webhook`

## 1. dashboard-summary

### Webhook

- Method: `GET`
- Path: `dashboard-summary`
- Response mode: `Using Respond to Webhook node`

### Execute Command

```powershell
powershell -ExecutionPolicy Bypass -File C:\workspace\scripts\get-dashboard-summary.ps1
```

### Code

```javascript
const raw = $json.data || $json.stdout || $json.output || Object.values($json)[0];
return [{ json: JSON.parse(raw) }];
```

### Respond to Webhook

- Respond with: `JSON`
- Response body: `{{$json}}`

## 2. predictive-summary

Misma estructura.

### Execute Command

```powershell
powershell -ExecutionPolicy Bypass -File C:\workspace\scripts\get-predictive-summary.ps1
```

## 3. reports-summary

### Execute Command

```powershell
powershell -ExecutionPolicy Bypass -File C:\workspace\scripts\get-reports-summary.ps1
```

## 4. generate-report

### Webhook

- Method: `POST`
- Path: `generate-report`

### Execute Command

```powershell
powershell -ExecutionPolicy Bypass -File C:\workspace\scripts\generate-report.ps1 -Type "{{$json.body.type || 'Operaciones'}}"
```

### Code

```javascript
const raw = $json.data || $json.stdout || $json.output || Object.values($json)[0];
return [{ json: JSON.parse(raw) }];
```

### Resultado

Ese script:

- crea el CSV en `data/reports/generated`
- actualiza `data/reports/summary.json`
- devuelve `ok`, `fileName` y `path`

## 5. repository-search

### Webhook

- Method: `GET`
- Path: `repository-search`

### Execute Command

```powershell
powershell -ExecutionPolicy Bypass -File C:\workspace\scripts\search-repository.ps1 -Query "{{$json.query.q || ''}}"
```

## 6. chatbot-query

### Webhook

- Method: `POST`
- Path: `chatbot-query`

### Execute Command

```powershell
powershell -ExecutionPolicy Bypass -File C:\workspace\scripts\chatbot-query.ps1 -Question "{{$json.body.question || $json.question || ''}}"
```

## Verificacion rapida

Prueba fuera de n8n primero:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\test-local-data.ps1
```

Si eso responde bien, el problema ya no estara en los datos ni en los scripts, sino en la configuracion del workflow.
