const { fromData } = require('./lib/paths.cjs');
const { readJson } = require('./lib/read-json.cjs');

function getArgValue(flagName) {
  const index = process.argv.indexOf(flagName);
  return index >= 0 ? process.argv[index + 1] ?? '' : '';
}

const rawQuestion = getArgValue('--question').trim();
const question = rawQuestion.toLowerCase();
const knowledge = readJson(fromData('chatbot', 'knowledge.json'));
const predictive = readJson(fromData('predictive', 'summary.json'));
const dashboard = readJson(fromData('dashboard', 'summary.json'));
const reports = readJson(fromData('reports', 'summary.json'));
const repository = readJson(fromData('repository', 'index.json'));

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

function normalizeWeekName(value) {
  return `Sem ${value}`;
}

function extractRequestedWeek() {
  const match = question.match(/(?:semana|sem)\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}

function getForecastRows() {
  return Array.isArray(predictive.forecastData) ? predictive.forecastData : [];
}

function getWeekNumber(name) {
  const match = String(name).match(/(\d+)/);
  return match ? Number(match[1]) : null;
}

function getForecastForWeek(weekNumber) {
  const rows = getForecastRows();
  const found = rows.find((row) => getWeekNumber(row.name) === weekNumber);

  if (found) {
    return { ...found, estimated: false };
  }

  if (rows.length < 2) {
    return null;
  }

  const sorted = [...rows]
    .map((row) => ({ ...row, weekNumber: getWeekNumber(row.name) }))
    .filter((row) => Number.isFinite(row.weekNumber))
    .sort((a, b) => a.weekNumber - b.weekNumber);
  const last = sorted.at(-1);
  const previous = sorted.at(-2);

  if (!last || !previous || weekNumber <= last.weekNumber) {
    return null;
  }

  const step = weekNumber - last.weekNumber;
  const inventoryTrend = last.inventario - previous.inventario;
  const demandTrend = last.demanda - previous.demanda;

  return {
    name: normalizeWeekName(weekNumber),
    inventario: Math.max(0, Math.round(last.inventario + inventoryTrend * step)),
    demanda: Math.max(0, Math.round(last.demanda + demandTrend * step)),
    estimated: true,
  };
}

function describeForecast(row) {
  const shortage = Math.max(0, row.demanda - row.inventario);
  const surplus = Math.max(0, row.inventario - row.demanda);
  const suffix = row.estimated ? ' Es una estimacion extrapolada con la tendencia local disponible.' : '';

  if (shortage > 0) {
    return `${row.name}: demanda ${formatNumber(row.demanda)}, inventario ${formatNumber(row.inventario)}, ruptura estimada de ${formatNumber(shortage)} unidades.${suffix}`;
  }

  return `${row.name}: demanda ${formatNumber(row.demanda)}, inventario ${formatNumber(row.inventario)}, excedente estimado de ${formatNumber(surplus)} unidades.${suffix}`;
}

function selectBestProvider() {
  const quotes = Array.isArray(dashboard.quotes) ? dashboard.quotes : [];

  return [...quotes].sort((a, b) => {
    const confidenceDiff = Number(b.confidence || 0) - Number(a.confidence || 0);
    return confidenceDiff || String(a.cost || '').localeCompare(String(b.cost || ''));
  })[0];
}

function buildProviderDraft() {
  const provider = selectBestProvider();
  const weekNumber = extractRequestedWeek() || getWeekNumber(predictive.alert?.week) || 3;
  const forecast = getForecastForWeek(weekNumber);
  const shortage = forecast ? Math.max(0, forecast.demanda - forecast.inventario) : 0;

  if (!provider) {
    return 'No hay proveedores disponibles en el contexto local para simular un mensaje de compra.';
  }

  return [
    `Simulacion de mensaje para ${provider.provider}:`,
    '',
    `Asunto: Solicitud de disponibilidad y cotizacion - ${provider.req}`,
    '',
    `Hola equipo de ${provider.provider},`,
    '',
    `Necesitamos validar disponibilidad para ${shortage > 0 ? formatNumber(shortage) : 'las unidades requeridas de'} ${provider.req} relacionadas con ${normalizeWeekName(weekNumber)}. Segun nuestra proyeccion, la demanda esperada es de ${forecast ? formatNumber(forecast.demanda) : 'N/D'} unidades y el inventario disponible es de ${forecast ? formatNumber(forecast.inventario) : 'N/D'} unidades.`,
    '',
    'Por favor confirmar:',
    '1. Disponibilidad inmediata.',
    '2. Tiempo de entrega estimado.',
    '3. Precio final y condiciones.',
    '4. Fecha maxima para emitir orden de compra.',
    '',
    'Quedo atento para avanzar con aprobacion interna.',
    '',
    'Nota: esto es solo una simulacion; LogiSync no envio el mensaje ni ejecuto una compra real.',
  ].join('\n');
}

function localAnswer() {
  const requestedWeek = extractRequestedWeek();

  if (question.includes('compra') || question.includes('comprar') || question.includes('mensaje') || question.includes('proveedor')) {
    if (question.includes('compra') || question.includes('comprar') || question.includes('mensaje') || question.includes('enviar')) {
      return buildProviderDraft();
    }

    const provider = selectBestProvider();
    if (provider) {
      return `${provider.provider} aparece como la opcion con mayor confianza para ${provider.req} con ${provider.confidence}%. Costo referencial: ${provider.cost}.`;
    }
  }

  if (requestedWeek) {
    const forecast = getForecastForWeek(requestedWeek);
    return forecast ? describeForecast(forecast) : 'No encontre suficientes datos para estimar esa semana.';
  }

  if (question.includes('stock') || question.includes('demanda') || question.includes('inventario') || question.includes('predic')) {
    return getForecastRows().map(describeForecast).join(' ');
  }

  if (question.includes('flujo') || question.includes('operativo')) {
    const kpis = Array.isArray(dashboard.kpis)
      ? dashboard.kpis.map((kpi) => `${kpi.label}: ${kpi.value}`).join(', ')
      : 'No hay KPIs cargados.';
    return `Resumen operativo: ${kpis}.`;
  }

  return 'No encontre suficiente contexto local para responder con precision.';
}

function buildPrompt() {
  const knowledgeContext = Array.isArray(knowledge.context)
    ? knowledge.context.map((item) => `- ${item}`).join('\n')
    : '';
  const forecasts = getForecastRows().map((row) => {
    const shortage = Math.max(0, row.demanda - row.inventario);
    const surplus = Math.max(0, row.inventario - row.demanda);
    return `- ${row.name}: inventario=${row.inventario}, demanda=${row.demanda}, ruptura=${shortage}, excedente=${surplus}`;
  }).join('\n');
  const kpis = Array.isArray(dashboard.kpis)
    ? dashboard.kpis.map((kpi) => `- ${kpi.label}: ${kpi.value} (${kpi.change}, ${kpi.subtitle})`).join('\n')
    : '';
  const providers = Array.isArray(dashboard.quotes)
    ? dashboard.quotes.map((quote) => `- ${quote.provider}: requerimiento=${quote.req}, confianza=${quote.confidence}%, costo=${quote.cost}`).join('\n')
    : '';
  const analytics = Array.isArray(dashboard.analyticsData)
    ? dashboard.analyticsData.map((item) => `- Dia ${item.day}: valor=${item.value}`).join('\n')
    : '';
  const reportList = Array.isArray(reports.reports)
    ? reports.reports.map((report) => `- ${report.title}: tipo=${report.type}, fecha=${report.date}, formato=${report.format}`).join('\n')
    : '';
  const documents = Array.isArray(repository.documents)
    ? repository.documents.map((doc) => `- ${doc.title}: tipo=${doc.type}, match=${doc.match}%, path=${doc.path}`).join('\n')
    : '';
  const requestedWeek = extractRequestedWeek();
  const projectedWeek = requestedWeek ? getForecastForWeek(requestedWeek) : null;

  return [
    knowledge.systemPrompt || 'Eres el asistente local de LogiSync.',
    '',
    'Contexto local disponible:',
    knowledgeContext || '- No hay contexto local cargado.',
    '',
    'Forecast semanal disponible:',
    forecasts || '- No hay forecast cargado.',
    '',
    projectedWeek ? `Forecast calculado para la semana solicitada: ${describeForecast(projectedWeek)}` : '',
    '',
    'KPIs operativos:',
    kpis || '- No hay KPIs cargados.',
    '',
    'Cotizaciones/proveedores:',
    providers || '- No hay proveedores cargados.',
    '',
    'Serie diaria disponible:',
    analytics || '- No hay serie diaria cargada.',
    '',
    'Reportes:',
    reportList || '- No hay reportes cargados.',
    '',
    'Documentos:',
    documents || '- No hay documentos cargados.',
    '',
    'Instrucciones:',
    '- Responde en espanol claro y profesional.',
    '- Usa el contexto local cuando aplique.',
    '- Puedes responder sobre cualquier semana disponible en el forecast.',
    '- Si preguntan por semanas futuras fuera del forecast, puedes extrapolar como estimacion usando la tendencia de las dos ultimas semanas y debes decir claramente que es una estimacion.',
    '- Si preguntan por dias, usa la serie diaria disponible y aclara cuando la granularidad sea limitada.',
    '- Si el usuario pide comprar, enviar o contactar a un proveedor, redacta una simulacion de mensaje o solicitud de compra. No afirmes que enviaste el mensaje ni que ejecutaste una compra real.',
    '- Para proveedores, usa solo los proveedores disponibles en Cotizaciones/proveedores.',
    '- Si falta informacion critica, dilo y pide el dato necesario.',
    '- No inventes metricas, porcentajes, costos ni proveedores que no esten en el contexto.',
    '',
    `Pregunta del usuario: ${rawQuestion}`,
  ].filter(Boolean).join('\n');
}

async function askGemini() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    return {
      answer: localAnswer(),
      source: 'local-fallback',
      warning: 'GEMINI_API_KEY no esta configurada en el contenedor de n8n.',
    };
  }

  const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: buildPrompt() }],
        },
      ],
      generationConfig: {
        temperature: 0.35,
        maxOutputTokens: 2048,
      },
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      answer: localAnswer(),
      source: 'local-fallback',
      warning: payload.error?.message || `Gemini respondio con ${response.status}.`,
    };
  }

  const candidate = payload.candidates?.[0];
  const answer = candidate?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join('\n')
    .trim();

  return {
    answer: answer || localAnswer(),
    source: answer ? 'gemini' : 'local-fallback',
    warning: candidate?.finishReason && candidate.finishReason !== 'STOP'
      ? `Gemini finishReason: ${candidate.finishReason}`
      : undefined,
  };
}

askGemini()
  .then((result) => {
    process.stdout.write(JSON.stringify(result));
  })
  .catch((error) => {
    process.stdout.write(JSON.stringify({
      answer: localAnswer(),
      source: 'local-fallback',
      warning: error instanceof Error ? error.message : 'No se pudo consultar Gemini.',
    }));
  });
