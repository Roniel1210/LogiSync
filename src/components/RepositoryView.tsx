import React, { useEffect, useMemo, useState } from 'react';
import { Search, FileIcon, Filter, RefreshCw, Server, BarChart3, HardDrive, Tag, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

type DocumentItem = {
  id: number;
  title: string;
  type: string;
  time: string;
  size: string;
  match: number;
  path?: string;
};

const documentTitles = [
  'Contrato Marco Logistics',
  'Guia de Remision GR',
  'Factura Proveedor TechCorp',
  'Especificaciones Semiconductores',
  'Reporte de Satisfaccion',
  'Orden de Compra Critica',
  'Manifiesto de Carga Regional',
  'Evaluacion de Proveedor',
];

const documentTypes = ['CONTRATO', 'TRANSPORTE', 'FINANZAS', 'INVENTARIO', 'CLIENTE'];
const documentTimes = ['HACE 10 MIN', 'HACE 45 MIN', 'HACE 2H', 'HACE 6H', 'AYER', 'HACE 2 DIAS'];

function randomFrom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function buildLocalDocuments() {
  return Array.from({ length: 6 + Math.floor(Math.random() * 5) }, (_, index) => {
    const type = randomFrom(documentTypes);
    const suffix = type === 'TRANSPORTE'
      ? String(8000 + Math.floor(Math.random() * 1200))
      : String(2024 + Math.floor(Math.random() * 4));

    return {
      id: Date.now() + index,
      title: `${randomFrom(documentTitles)} ${suffix}`,
      type,
      time: randomFrom(documentTimes),
      size: Math.random() > 0.35 ? `${(0.3 + Math.random() * 5).toFixed(1)} MB` : `${120 + Math.floor(Math.random() * 780)} KB`,
      match: 40 + Math.floor(Math.random() * 58),
    };
  });
}

export function RepositoryView() {
  const [documents, setDocuments] = useState<DocumentItem[]>(() => buildLocalDocuments());
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('TODOS');
  const [actionStatus, setActionStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const loadDocuments = async (search = '') => {
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    const normalizedSearch = search.trim().toLowerCase();
    const localDocuments = buildLocalDocuments();
    setDocuments(
      normalizedSearch
        ? localDocuments.filter((doc) => [doc.title, doc.type].some((value) => value.toLowerCase().includes(normalizedSearch)))
        : localDocuments
    );
    setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    setLoading(false);
  };

  const availableTypes = useMemo(() => ['TODOS', ...Array.from(new Set(documents.map((doc) => doc.type)))], [documents]);

  const visibleDocuments = useMemo(() => {
    const filtered = typeFilter === 'TODOS'
      ? documents
      : documents.filter((doc) => doc.type === typeFilter);

    if (loading) {
      return filtered;
    }
    return filtered;
  }, [documents, loading, typeFilter]);

  const handleCycleFilters = () => {
    const nextType = availableTypes[(availableTypes.indexOf(typeFilter) + 1) % availableTypes.length] ?? 'TODOS';
    setTypeFilter(nextType);
    setActionStatus(nextType === 'TODOS' ? 'Mostrando todos los documentos.' : `Filtrando documentos tipo ${nextType}.`);
  };

  useEffect(() => {
    void loadDocuments();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6 p-6 pb-24 max-w-[1600px] mx-auto w-full"
    >
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Nexo Vectorial (Repositorio)</h1>
        <p className="text-sm text-slate-500 mt-1">Base de conocimiento semantica para analisis y extraccion documental.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
          <Server className="w-4 h-4" />
          <span>{loading ? 'Consultando indice local...' : `Modo local activo${lastUpdated ? ` - ${lastUpdated}` : ''}`}</span>
        </div>
        {actionStatus && <p className="text-xs text-slate-600">{actionStatus}</p>}
      </div>

      <div className="flex-shrink-0 bg-white rounded-xl p-3 border border-slate-100/60 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void loadDocuments(query)}
            placeholder="Ej: Extraer terminos de penalizacion en contratos de transporte del ultimo mes..."
            className="w-full bg-slate-50 border border-slate-100 rounded-lg outline-none text-sm text-slate-700 placeholder:text-slate-400 py-3.5 pl-12 pr-4 focus:bg-white focus:border-[#4f46e5] transition-colors"
          />
        </div>
        <button
          onClick={handleCycleFilters}
          className={cn(
            'bg-white hover:bg-slate-50 border border-slate-200 px-4 py-3.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors w-full sm:w-auto justify-center',
            typeFilter === 'TODOS' ? 'text-slate-700' : 'text-[#4f46e5]'
          )}
        >
          <Filter className="w-4 h-4" /> {typeFilter === 'TODOS' ? 'Filtros' : typeFilter}
        </button>
        <button
          onClick={() => void loadDocuments(query)}
          className="bg-[#4f46e5] hover:bg-indigo-600 text-white px-8 py-3.5 rounded-lg text-sm font-bold tracking-wider uppercase transition-colors shadow-sm w-full sm:w-auto flex items-center justify-center gap-2"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
          Busqueda
        </button>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="col-span-1 lg:col-span-5 bg-white rounded-xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-slate-100/60 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" /> Estadísticas del Repositorio
            </h2>
          </div>
          <div className="flex-1 p-5 flex flex-col gap-4">
            {/* Total docs */}
            <div className="bg-indigo-50 rounded-xl p-4 flex items-center gap-4 border border-indigo-100">
              <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                <FileIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-700">{visibleDocuments.length}</p>
                <p className="text-xs text-indigo-500 font-medium mt-0.5">Documentos Indexados</p>
              </div>
            </div>

            {/* Type breakdown */}
            <div className="bg-white rounded-xl p-4 border border-slate-100 flex flex-col gap-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Tag className="w-3.5 h-3.5" /> Distribución por Tipo
              </p>
              {Array.from(new Set(visibleDocuments.map(d => d.type))).map((type) => {
                const count = visibleDocuments.filter(d => d.type === type).length;
                const pct = Math.round((count / visibleDocuments.length) * 100);
                return (
                  <div key={type}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">{type}</span>
                      <span className="text-slate-500">{count} doc{count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Storage */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                <HardDrive className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Almacenamiento</p>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{visibleDocuments.length > 0 ? visibleDocuments.length + ' archivos disponibles' : 'Sin archivos'}</p>
              </div>
            </div>

            {/* Last updated */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Último Ingreso</p>
                <p className="text-sm font-bold text-slate-700 mt-0.5">{visibleDocuments[0]?.time ?? '—'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-7 bg-white rounded-xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-slate-100/60 flex flex-col min-h-0 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileIcon className="w-4 h-4 text-slate-500" /> Archivos Indexados
            </h2>
            <div className="flex gap-2 bg-slate-50 p-1 rounded-lg border border-slate-100">
              <button
                onClick={() => {
                  setTypeFilter('FINANZAS');
                  setActionStatus('Mostrando documentos financieros y facturas.');
                }}
                className={cn(
                  'text-[10px] uppercase tracking-widest font-bold hover:text-slate-700 py-1 px-3 rounded-md transition-colors',
                  typeFilter === 'FINANZAS' ? 'text-slate-800 bg-white shadow-sm' : 'text-slate-500'
                )}
              >
                Facturas
              </button>
              <button
                onClick={() => {
                  setTypeFilter('CONTRATO');
                  setActionStatus('Mostrando contratos indexados.');
                }}
                className={cn(
                  'text-[10px] uppercase tracking-widest font-bold hover:text-slate-700 py-1 px-3 rounded-md transition-colors',
                  typeFilter === 'CONTRATO' ? 'text-slate-800 bg-white shadow-sm' : 'text-slate-500'
                )}
              >
                Contratos
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar p-4 space-y-2">
            {visibleDocuments.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl border border-slate-100 bg-white hover:border-[#4f46e5]/30 hover:shadow-sm transition-all flex items-start justify-between group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 group-hover:bg-indigo-100 shrink-0 transition-colors">
                    <FileIcon className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{doc.title}</h3>
                    <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider flex gap-2">
                      <span>{doc.type}</span>
                      <span className="text-slate-300">•</span>
                      <span>{doc.time}</span>
                      <span className="text-slate-300">•</span>
                      <span>{doc.size}</span>
                    </p>
                  </div>
                </div>
                <div className={cn(
                  'text-xs font-bold px-3 py-1.5 rounded-lg border',
                  doc.match >= 90 ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                  doc.match >= 70 ? 'bg-blue-50 text-blue-700 border-blue-100' :
                  'bg-slate-50 text-slate-600 border-slate-200'
                )}>
                  {doc.match}% Match
                </div>
              </div>
            ))}
            {!visibleDocuments.length && (
              <div className="p-8 text-center text-sm text-slate-500">
                No hay documentos para esa busqueda.
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
