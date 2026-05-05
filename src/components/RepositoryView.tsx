import React, { useEffect, useMemo, useState } from 'react';
import { Search, Network, FileIcon, Filter, RefreshCw, Server, WifiOff } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { fetchN8n } from '../lib/n8n';

type DocumentItem = {
  id: number;
  title: string;
  type: string;
  time: string;
  size: string;
  match: number;
  path?: string;
};

type RepositoryPayload = {
  documents: DocumentItem[];
};

const fallbackDocuments: DocumentItem[] = [
  { id: 1, title: 'Contrato Marco Logistics 2024', type: 'CONTRATO', time: 'HACE 2H', size: '2.4 MB', match: 94 },
  { id: 2, title: 'Guia de Remision GR-8821', type: 'TRANSPORTE', time: 'HACE 5H', size: '145 KB', match: 88 },
  { id: 3, title: 'Factura Proveedor TechCorp', type: 'FINANZAS', time: 'AYER', size: '320 KB', match: 76 },
  { id: 4, title: 'Especificaciones Semiconductores', type: 'INVENTARIO', time: 'AYER', size: '1.1 MB', match: 65 },
  { id: 5, title: 'Reporte Q3 Satisfaccion', type: 'CLIENTE', time: 'HACE 2 DIAS', size: '4.5 MB', match: 42 },
];

export function RepositoryView() {
  const [documents, setDocuments] = useState<DocumentItem[]>(fallbackDocuments);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDocuments = async (search = '') => {
    setLoading(true);
    setError('');

    try {
      const searchParam = search.trim() ? `?q=${encodeURIComponent(search.trim())}` : '';
      const response = await fetchN8n<RepositoryPayload>(`/webhook/repository-search${searchParam}`);
      setDocuments(response.documents?.length ? response.documents : fallbackDocuments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo consultar el repositorio');
      setDocuments(
        search.trim()
          ? fallbackDocuments.filter((doc) => doc.title.toLowerCase().includes(search.trim().toLowerCase()))
          : fallbackDocuments
      );
    } finally {
      setLoading(false);
    }
  };

  const visibleDocuments = useMemo(() => {
    if (loading || error) {
      return documents;
    }
    return documents;
  }, [documents, error, loading]);

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
        {error ? (
          <>
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700">
              <WifiOff className="w-4 h-4" />
              <span>Busqueda local de respaldo</span>
            </div>
            <p className="text-xs text-amber-700">{error}. Revisa el webhook `repository-search`.</p>
          </>
        ) : (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
            <Server className="w-4 h-4" />
            <span>{loading ? 'Consultando indice en n8n...' : 'Repositorio conectado a n8n'}</span>
          </div>
        )}
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
        <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-4 py-3.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors w-full sm:w-auto justify-center">
          <Filter className="w-4 h-4" /> Filtros
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
              <Network className="w-4 h-4 text-indigo-500" /> Representacion Vectorial
            </h2>
          </div>
          <div className="flex-1 p-6 flex flex-col justify-center items-center bg-slate-50/50 relative min-h-[300px]">
            <div className="absolute inset-6 rounded-xl bg-[#0f172a] overflow-hidden flex items-center justify-center border border-slate-800 shadow-xl">
              <div className="relative w-full h-full max-w-[300px] max-h-[300px]">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" style={{ stroke: 'rgba(79, 70, 229, 0.3)', strokeWidth: 0.5 }}>
                  <line x1="20" y1="50" x2="80" y2="30" />
                  <line x1="20" y1="50" x2="70" y2="80" />
                  <line x1="80" y1="30" x2="70" y2="80" />
                  <line x1="50" y1="10" x2="20" y2="50" />
                </svg>
                <div className="absolute w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_12px_#818cf8]" style={{ left: '18%', top: '48%' }}></div>
                <div className="absolute w-1.5 h-1.5 rounded-full bg-purple-400" style={{ left: '78%', top: '28%' }}></div>
                <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ left: '68%', top: '78%' }}></div>
                <div className="absolute w-1.5 h-1.5 rounded-full bg-blue-300" style={{ left: '48%', top: '8%' }}></div>

                <div className="absolute left-1/2 top-1/2 -translate-x-[40%] -translate-y-1/2 bg-indigo-900/60 border border-indigo-500/30 rounded p-2.5 backdrop-blur-md">
                  <p className="text-[9px] text-indigo-200 font-mono tracking-widest break-all w-28 leading-relaxed">
                    TENSOR: [0.124, -0.052, 0.891, 0.442, -0.199...]
                  </p>
                </div>
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
              <button className="text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-slate-700 py-1 px-3 rounded-md transition-colors">Facturas</button>
              <button className="text-[10px] uppercase tracking-widest font-bold text-slate-800 bg-white shadow-sm py-1 px-3 rounded-md">Contratos</button>
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
