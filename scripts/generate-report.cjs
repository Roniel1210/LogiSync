const fs = require('fs');
const path = require('path');
const { fromData, toProjectRelative } = require('./lib/paths.cjs');
const { readJson, writeJson } = require('./lib/read-json.cjs');

function getArgValue(flagName) {
  const index = process.argv.indexOf(flagName);
  return index >= 0 ? process.argv[index + 1] ?? '' : '';
}

function formatTimestamp(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function normalizeType(rawType) {
  const candidate = String(rawType || '').trim();

  if (!candidate) {
    return 'Operaciones';
  }

  // n8n may pass the unresolved expression literally if the command field was not saved in expression mode.
  if (candidate.includes('$json') || candidate.includes('{{') || candidate.includes('}}')) {
    return 'Operaciones';
  }

  return candidate;
}

function escapeCsv(value) {
  const normalized = String(value ?? '');
  if (/[",\r\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }

  return normalized;
}

function buildReportRows() {
  const dashboard = readJson(fromData('dashboard', 'summary.json'));
  const predictive = readJson(fromData('predictive', 'summary.json'));
  const reports = readJson(fromData('reports', 'summary.json'));

  const rows = [['seccion', 'clave', 'valor']];

  for (const kpi of dashboard.kpis || []) {
    rows.push(['dashboard_kpi', kpi.label, kpi.value]);
    rows.push(['dashboard_kpi_change', kpi.label, kpi.change]);
  }

  for (const point of dashboard.analyticsData || []) {
    rows.push(['dashboard_analytics', point.day, point.value]);
  }

  for (const quote of dashboard.quotes || []) {
    rows.push(['dashboard_quote', quote.provider, `${quote.req} | ${quote.cost} | confianza ${quote.confidence}%`]);
  }

  for (const transport of dashboard.transport || []) {
    rows.push(['dashboard_transport', transport.name, transport.value]);
  }

  for (const point of predictive.forecastData || []) {
    rows.push(['predictive_forecast_inventory', point.name, point.inventario]);
    rows.push(['predictive_forecast_demand', point.name, point.demanda]);
  }

  if (predictive.alert) {
    rows.push(['predictive_alert', 'active', predictive.alert.active]);
    rows.push(['predictive_alert', 'week', predictive.alert.week]);
    rows.push(['predictive_alert', 'shortageUnits', predictive.alert.shortageUnits]);
  }

  if (predictive.decisionText) {
    rows.push(['predictive_decision', 'text', predictive.decisionText]);
  }

  if (predictive.sensitivity) {
    rows.push(['predictive_sensitivity', 'projectionConfidence', predictive.sensitivity.projectionConfidence]);
    rows.push(['predictive_sensitivity', 'climateRisk', predictive.sensitivity.climateRisk]);
  }

  for (const report of reports.reports || []) {
    rows.push(['reports_catalog', report.title, `${report.type} | ${report.date} | ${report.format} | ${report.size}`]);
  }

  return rows.map((row) => row.map(escapeCsv).join(',')).join('\r\n');
}

const type = normalizeType(getArgValue('--type'));
const summaryPath = fromData('reports', 'summary.json');
const generatedDir = fromData('reports', 'generated');

fs.mkdirSync(generatedDir, { recursive: true });

const now = new Date();
const timestamp = formatTimestamp(now);
const safeType = type.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
const fileName = `reporte-${safeType}-${timestamp}.csv`;
const filePath = path.join(generatedDir, fileName);

const csv = buildReportRows();

fs.writeFileSync(filePath, csv, 'utf8');

const summary = readJson(summaryPath);
const maxId = summary.reports.reduce((currentMax, report) => Math.max(currentMax, Number(report.id) || 0), 0);
const relativePath = toProjectRelative(filePath);

const newReport = {
  id: maxId + 1,
  title: `Reporte ${type} ${timestamp}`,
  type,
  date: now.toLocaleString('es-DO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }),
  format: 'CSV',
  size: `${(fs.statSync(filePath).size / 1024).toFixed(1)} KB`,
  path: relativePath,
};

summary.reports = [newReport, ...summary.reports];
writeJson(summaryPath, summary);

process.stdout.write(JSON.stringify({
  ok: true,
  fileName,
  path: relativePath,
}));
