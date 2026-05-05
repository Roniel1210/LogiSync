import React, { useEffect, useState } from 'react';
import { Calendar, MoreVertical, RefreshCw, Server, WifiOff } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { fetchN8n } from '../lib/n8n';

type Kpi = {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  subtitle: string;
};

type AnalyticsPoint = {
  day: string;
  value: number;
};

type Quote = {
  provider: string;
  req: string;
  confidence: number;
  cost: string;
};

type TransportPoint = {
  name: string;
  value: number;
  color: string;
};

type DashboardPayload = {
  kpis: Kpi[];
  analyticsData: AnalyticsPoint[];
  quotes: Quote[];
  transport: TransportPoint[];
};

const fallbackData: DashboardPayload = {
  kpis: [
    { label: 'Sincronizacion Inventario', value: '98.4%', change: '+2.1%', trend: 'up', subtitle: 'Vs mes anterior' },
    { label: 'SLA de Entregas', value: '96.5%', change: '+0.5%', trend: 'up', subtitle: 'Vs mes anterior' },
    { label: 'Optimizacion Compras', value: '$42.5k', change: '-1.5%', trend: 'down', subtitle: 'Vs mes anterior' },
    { label: 'Nodos Activos', value: '1,248', change: '+7%', trend: 'up', subtitle: 'Vs mes anterior' },
  ],
  analyticsData: [
    { day: '1', value: 160 }, { day: '2', value: 380 }, { day: '3', value: 190 },
    { day: '4', value: 290 }, { day: '5', value: 180 }, { day: '6', value: 190 },
    { day: '7', value: 280 }, { day: '8', value: 100 }, { day: '9', value: 210 },
    { day: '10', value: 380 }, { day: '11', value: 270 }, { day: '12', value: 105 },
    { day: '13', value: 115 }, { day: '14', value: 205 }, { day: '15', value: 260 },
    { day: '16', value: 185 }, { day: '17', value: 300 }, { day: '18', value: 110 },
    { day: '19', value: 85 }, { day: '20', value: 370 }, { day: '21', value: 105 },
    { day: '22', value: 215 }, { day: '23', value: 285 }, { day: '24', value: 160 },
  ],
  quotes: [
    { provider: 'GlobalTech Solutions', req: 'Semiconductores A', confidence: 98, cost: '$4,500' },
    { provider: 'Nexus Dynamics', req: 'Semiconductores A', confidence: 92, cost: '$4,200' },
    { provider: 'Prime Components', req: 'Placas Circuitos', confidence: 85, cost: '$2,100' },
    { provider: 'EcoLogistics', req: 'Embalaje Premium', confidence: 96, cost: '$850' },
    { provider: 'AeroFreight', req: 'Servicios DDP', confidence: 72, cost: '$1,850' },
  ],
  transport: [
    { name: 'Terrestre', value: 65, color: '#4f46e5' },
    { name: 'Aereo', value: 20, color: '#8b5cf6' },
    { name: 'Maritimo', value: 15, color: '#c4b5fd' },
  ],
};

export function DashboardView() {
  const [timeRange, setTimeRange] = useState('12 months');
  const [data, setData] = useState<DashboardPayload>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetchN8n<DashboardPayload>('/webhook/dashboard-summary');
      setData({
        kpis: response.kpis?.length ? response.kpis : fallbackData.kpis,
        analyticsData: response.analyticsData?.length ? response.analyticsData : fallbackData.analyticsData,
        quotes: response.quotes?.length ? response.quotes : fallbackData.quotes,
        transport: response.transport?.length ? response.transport : fallbackData.transport,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar n8n');
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6 p-6 pb-24 max-w-[1600px] mx-auto w-full"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm">
            {error ? (
              <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-700">
                <WifiOff className="w-4 h-4" />
                <span>Usando datos locales</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
                <Server className="w-4 h-4" />
                <span>{loading ? 'Sincronizando con n8n...' : 'Datos servidos por n8n'}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => void loadDashboard()}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
            Actualizar
          </button>
        </div>
        {error && <p className="text-xs text-amber-700">{error}. Revisa el webhook `dashboard-summary` en n8n.</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-slate-100/60">
            <p className="text-sm text-slate-500 font-medium mb-4">{kpi.label}</p>
            <div className="flex items-end items-center gap-3">
              <span className="text-3xl font-bold text-slate-800 tracking-tight">{kpi.value}</span>
              <span className={cn(
                'text-xs font-bold px-2 py-1 rounded flex items-center gap-1',
                kpi.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              )}>
                {kpi.change}
              </span>
              <span className="text-xs text-slate-400 ml-1">{kpi.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-slate-100/60 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Flujo Operativo Global</h2>
            <p className="text-sm text-slate-500 mt-1">Volumen de operaciones procesadas</p>
          </div>
          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100 w-fit">
            {['12 months', '30 days', '7 days', '24 hours'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-4 py-1.5 text-xs font-medium rounded-md transition-colors',
                  timeRange === range ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.analyticsData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-slate-100/60 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Evaluacion de Cotizaciones</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-md text-xs font-medium hover:bg-slate-50 transition-colors">
                <Calendar className="w-3.5 h-3.5" /> Filtrar
              </button>
              <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-md text-xs font-medium hover:bg-slate-50 transition-colors">
                Ver todo
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 px-2 text-xs font-medium text-slate-500">PROVEEDOR</th>
                  <th className="pb-3 px-2 text-xs font-medium text-slate-500">REQUERIMIENTO</th>
                  <th className="pb-3 px-2 text-xs font-medium text-slate-500 text-center">CONFIANZA (IA)</th>
                  <th className="pb-3 px-2 text-xs font-medium text-slate-500 text-right">VALOR PROY.</th>
                </tr>
              </thead>
              <tbody>
                {data.quotes.map((quote, idx) => (
                  <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-2 text-sm font-semibold text-slate-800">{quote.provider}</td>
                    <td className="py-4 px-2 text-sm text-slate-500">{quote.req}</td>
                    <td className="py-4 px-2 text-center">
                      <span className={cn(
                        'text-xs font-bold px-2 py-1 rounded text-white inline-block w-12',
                        quote.confidence >= 95 ? 'bg-emerald-500' :
                        quote.confidence >= 90 ? 'bg-blue-500' :
                        'bg-red-400'
                      )}>
                        {quote.confidence}%
                      </span>
                    </td>
                    <td className="py-4 px-2 text-sm font-semibold text-emerald-600 text-right">{quote.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-1 bg-white rounded-xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-slate-100/60 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-800">Distribucion de Carga</h2>
            <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5"/></button>
          </div>

          <div className="flex-1 min-h-[220px] relative flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.transport}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.transport.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-800">100%</span>
              <span className="text-xs text-slate-500">Volumen</span>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-2 pt-4 border-t border-slate-100">
            {data.transport.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs font-medium text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
