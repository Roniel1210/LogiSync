import React, { useEffect, useMemo, useState } from 'react';
import { FileText, Download, FileSpreadsheet, FileIcon, Search, Calendar, Filter, Clock, RefreshCw, Server } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

type ReportItem = {
  id: number;
  title: string;
  type: string;
  date: string;
  format: 'PDF' | 'XLSX' | 'CSV';
  size: string;
  path?: string;
};

type ScheduledReport = {
  name: string;
  frequency: string;
  next: string;
};

type ReportsPayload = {
  reports: ReportItem[];
  scheduledReports: ScheduledReport[];
};

const fallbackReports: ReportsPayload = {
  reports: [
    { id: 1, title: 'Analisis de Eficiencia Global', type: 'Operaciones', date: 'Octubre 2026', format: 'PDF', size: '2.4 MB' },
    { id: 2, title: 'Auditoria de Proveedores Q3', type: 'Finanzas', date: 'Q3 2026', format: 'XLSX', size: '5.1 MB' },
    { id: 3, title: 'Reporte de Riesgos (Prediccion IA)', type: 'Predictivo', date: 'Ultimos 30 dias', format: 'CSV', size: '1.2 MB' },
    { id: 4, title: 'Registro de Tiempos de Entrega', type: 'Logistica', date: 'Septiembre 2026', format: 'PDF', size: '3.8 MB' },
    { id: 5, title: 'Consolidado Semantico de Contratos', type: 'Legal', date: 'Trimestre Actual', format: 'XLSX', size: '4.5 MB' },
    { id: 6, title: 'Historico de Volumenes por Canal', type: 'Operaciones', date: 'Anual 2026', format: 'CSV', size: '8.4 MB' },
  ],
  scheduledReports: [
    { name: 'Resumen Diario de Operaciones', frequency: 'Diario, 08:00 AM', next: 'Manana' },
    { name: 'Cierre Financiero Semanal', frequency: 'Viernes, 18:00 PM', next: 'En 3 dias' },
    { name: 'Alertas Predictivas de Stock', frequency: 'Lunes, 06:00 AM', next: 'En 6 dias' },
  ],
};

const reportTitles = [
  'Analisis de Eficiencia Global',
  'Auditoria de Proveedores',
  'Reporte de Riesgos Predictivos',
  'Registro de Tiempos de Entrega',
  'Consolidado Semantico de Contratos',
  'Historico de Volumenes por Canal',
  'Resumen de Compras Criticas',
  'Control de Inventario Multinodo',
];

const reportTypes = ['Operaciones', 'Finanzas', 'Predictivo', 'Logistica', 'Legal'];
const reportFormats: Array<ReportItem['format']> = ['PDF', 'XLSX', 'CSV'];
const reportPeriods = ['Ultimos 7 dias', 'Ultimos 30 dias', 'Trimestre Actual', 'Mes Actual', 'Corte Semanal'];

function randomFrom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function buildLocalReports(): ReportsPayload {
  const reports = Array.from({ length: 6 + Math.floor(Math.random() * 4) }, (_, index) => {
    const format = randomFrom(reportFormats);

    return {
      id: Date.now() + index,
      title: `${randomFrom(reportTitles)} ${100 + Math.floor(Math.random() * 900)}`,
      type: randomFrom(reportTypes),
      date: randomFrom(reportPeriods),
      format,
      size: `${(1 + Math.random() * 8).toFixed(1)} MB`,
      path: 'local',
    };
  });

  return {
    reports,
    scheduledReports: fallbackReports.scheduledReports.map((report) => ({
      ...report,
      next: randomFrom(['Hoy', 'Manana', 'En 2 dias', 'En 5 dias', 'Proxima semana']),
    })),
  };
}

export function ReportsView() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<ReportsPayload>(() => buildLocalReports());
  const [formatFilter, setFormatFilter] = useState<'Todos' | ReportItem['format']>('Todos');
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [showTaskAdmin, setShowTaskAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [generationStatus, setGenerationStatus] = useState('');
  const [generating, setGenerating] = useState(false);

  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const reports = normalizedQuery
      ? data.reports.filter((report) =>
          [report.title, report.type, report.date, report.format].some((value) =>
            value.toLowerCase().includes(normalizedQuery)
          )
        )
      : data.reports;

    return reports
      .filter((report) => formatFilter === 'Todos' || report.format === formatFilter)
      .sort((a, b) => sortNewestFirst ? b.id - a.id : a.id - b.id);
  }, [data.reports, formatFilter, query, sortNewestFirst]);

  const loadReports = async () => {
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    setData(buildLocalReports());
    setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setLoading(false);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerationStatus('');
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    const newReport: ReportItem = {
      id: Date.now(),
      title: `Reporte Operativo Local ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      type: 'Operaciones',
      date: 'Generado hoy',
      format: 'PDF',
      size: `${(2 + Math.random() * 3).toFixed(1)} MB`,
      path: 'local',
    };
    setData((current) => ({ ...current, reports: [newReport, ...current.reports] }));
    setGenerationStatus(`Reporte local generado: ${newReport.title}.`);
    setGenerating(false);
  };

  const handleDownload = (report: ReportItem) => {
    const content = [
      `Reporte: ${report.title}`,
      `Area: ${report.type}`,
      `Periodo: ${report.date}`,
      `Formato: ${report.format}`,
      `Ruta: ${report.path ?? 'generado-localmente'}`,
    ].join('\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${report.format.toLowerCase()}`;
    link.click();
    URL.revokeObjectURL(url);
    setGenerationStatus(`Descarga preparada: ${report.title}.`);
  };

  const handleFormatFilter = () => {
    const filters: Array<'Todos' | ReportItem['format']> = ['Todos', 'PDF', 'XLSX', 'CSV'];
    const nextFilter = filters[(filters.indexOf(formatFilter) + 1) % filters.length];
    setFormatFilter(nextFilter);
    setGenerationStatus(nextFilter === 'Todos' ? 'Filtro de formato limpiado.' : `Filtrando reportes ${nextFilter}.`);
  };

  useEffect(() => {
    void loadReports();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6 p-6 pb-24 max-w-[1600px] mx-auto w-full"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Reportes Exportables</h1>
            <p className="text-sm text-slate-500 mt-1">Generacion y descarga de informes operacionales e historicos.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-[#4f46e5] hover:bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-bold tracking-wider uppercase transition-colors shadow-sm flex items-center gap-2 w-fit disabled:opacity-60"
            >
              {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              Generar Nuevo
            </button>
            <button
              onClick={() => void loadReports()}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
              Actualizar
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
            <Server className="w-4 h-4" />
            <span>{loading ? 'Actualizando reportes locales...' : `Modo local activo${lastUpdated ? ` - ${lastUpdated}` : ''}`}</span>
          </div>
          {generationStatus && <p className="text-xs text-slate-600">{generationStatus}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-slate-100/60 flex flex-col overflow-hidden min-h-[500px]">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-1 w-full max-w-sm relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar reportes..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4f46e5] transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSortNewestFirst((current) => !current);
                  setGenerationStatus(sortNewestFirst ? 'Ordenado por reportes antiguos.' : 'Ordenado por reportes recientes.');
                }}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors bg-white"
              >
                <Calendar className="w-4 h-4" /> Fecha
              </button>
              <button
                onClick={handleFormatFilter}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors bg-white',
                  formatFilter === 'Todos' ? 'text-slate-600' : 'text-[#4f46e5]'
                )}
              >
                <Filter className="w-4 h-4" /> {formatFilter === 'Todos' ? 'Filtrar' : formatFilter}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Documento</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Area</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest">Periodo</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Accion</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                          report.format === 'PDF' && 'bg-rose-50 text-rose-600',
                          report.format === 'XLSX' && 'bg-emerald-50 text-emerald-600',
                          report.format === 'CSV' && 'bg-blue-50 text-blue-600'
                        )}>
                          {report.format === 'PDF' ? <FileIcon className="w-5 h-5" /> :
                           report.format === 'XLSX' ? <FileSpreadsheet className="w-5 h-5" /> :
                           <FileText className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">{report.title}</p>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">{report.format} • {report.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        {report.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 font-medium">
                      {report.date}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDownload(report)}
                        title={report.path || 'Ruta no disponible'}
                        className="p-2 text-slate-400 hover:text-[#4f46e5] hover:bg-indigo-50 rounded-lg transition-colors inline-block"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!filteredReports.length && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-500">
                      No hay reportes para el filtro actual.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl shadow-xl p-6 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4f46e5] opacity-20 blur-3xl -mr-10 -mt-10 pointer-events-none rounded-full"></div>

            <h3 className="text-sm font-bold flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-indigo-400" /> Reportes Programados
            </h3>

            <div className="space-y-4">
              {data.scheduledReports.map((sch, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <h4 className="text-sm font-bold text-slate-100">{sch.name}</h4>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-slate-400">{sch.frequency}</span>
                    <span className="text-indigo-300 font-medium">{sch.next}</span>
                  </div>
                </div>
              ))}
            </div>

            {showTaskAdmin && (
              <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
                {data.scheduledReports.length} tarea(s) activas. Proxima ejecucion: {data.scheduledReports[0]?.next ?? 'sin fecha'}.
              </div>
            )}

            <button
              onClick={() => setShowTaskAdmin((current) => !current)}
              className="w-full mt-6 py-2.5 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Administrar Tareas
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-slate-100/60 p-6 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4">
              <FileIcon className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">Plantillas Personalizadas</h3>
            <p className="text-xs text-slate-500 mb-6 max-w-[200px] leading-relaxed">
              Diseña tus propios reportes utilizando los vectores de datos de LogiSync.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setFormatFilter('Todos');
                setGenerationStatus('Plantilla personalizada creada como borrador local.');
              }}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Crear Plantilla
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
