import React from 'react';
import { AlertTriangle, Zap, ArrowRight, Share2, Printer } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

const forecastData = [
  { name: 'Sem 1', inventario: 4000, demanda: 2400 },
  { name: 'Sem 2', inventario: 3000, demanda: 1398 },
  { name: 'Sem 3', inventario: 2000, demanda: 4800 }, 
  { name: 'Sem 4', inventario: 2780, demanda: 3908 },
  { name: 'Sem 5', inventario: 1890, demanda: 4800 },
  { name: 'Sem 6', inventario: 2390, demanda: 3800 },
  { name: 'Sem 7', inventario: 3490, demanda: 4300 },
];

export function PredictiveView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6 p-6 pb-24 max-w-[1600px] mx-auto w-full"
    >
      <div className="flex-shrink-0 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Analítica Predictiva</h1>
          <p className="text-sm text-slate-500 mt-1">Prevención de rupturas de stock vía modelos estocásticos.</p>
        </div>
        <div className="flex gap-3">
           <button className="p-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
             <Share2 className="w-4 h-4" />
           </button>
           <button className="p-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
             <Printer className="w-4 h-4" />
           </button>
           <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm ml-2">
             <AlertTriangle className="w-4 h-4" />
             <span className="text-xs font-bold uppercase tracking-widest">Ruptura Detectada (Sem 3)</span>
           </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart View */}
        <div className="col-span-1 lg:col-span-8 bg-white rounded-xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-slate-100/60 flex flex-col p-6 min-h-[400px]">
           <div className="flex items-center justify-between mb-8">
             <h2 className="text-lg font-bold text-slate-800">Inventario Proyectado vs Demanda</h2>
             <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded-full bg-slate-300"></span>
                 <span className="text-xs font-medium text-slate-500">Demanda (IA)</span>
               </div>
               <div className="flex items-center gap-2">
                 <span className="w-3 h-3 rounded-full bg-[#4f46e5]"></span>
                 <span className="text-xs font-medium text-slate-700">Stock Proyectado</span>
               </div>
             </div>
           </div>

           <div className="flex-1 w-full relative">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                 />
                 <ReferenceLine x="Sem 3" stroke="#ef4444" strokeDasharray="3 3" />
                 <Area type="monotone" dataKey="demanda" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                 <Area type="monotone" dataKey="inventario" stroke="#4f46e5" strokeWidth={3} fill="url(#colorInv)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Action Panel */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
           <div className="bg-[#1e293b] rounded-xl p-6 shadow-xl relative overflow-hidden">
             {/* Background glow decoration */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#4f46e5] opacity-20 blur-3xl -mr-10 -mt-10 pointer-events-none rounded-full"></div>
             
             <h3 className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-4 flex items-center gap-2">
               <Zap className="w-4 h-4 fill-current" /> Motor de Decisión
             </h3>
             <p className="text-sm text-slate-300 italic mb-6 leading-relaxed relative z-10">
               "La demanda inferida para la Semana 3 supera el stock de seguridad en 2,800 unidades debido a un pico estimado."
             </p>
             <div className="flex flex-col gap-3 relative z-10">
               <button className="bg-[#4f46e5] hover:bg-indigo-500 text-white font-bold text-sm py-3 rounded-lg transition-colors w-full uppercase tracking-wider shadow-md shadow-indigo-500/20">
                 Generar Órdenes
               </button>
               <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-sm py-3 rounded-lg transition-colors w-full uppercase tracking-wider flex items-center justify-center gap-2">
                 Ver Análisis <ArrowRight className="w-4 h-4" />
               </button>
             </div>
           </div>

           <div className="bg-white rounded-xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-slate-100/60 p-6 flex-1">
             <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-6">Matriz de Sensibilidad</h3>
             
             <div className="space-y-6">
               <div>
                 <div className="flex justify-between text-xs font-bold mb-2">
                   <span className="text-slate-700">Confianza de Proyección</span>
                   <span className="text-slate-800">89%</span>
                 </div>
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 rounded-full w-[89%]"></div>
                 </div>
               </div>
               
               <div>
                 <div className="flex justify-between text-xs font-bold mb-2">
                   <span className="text-slate-700">Riesgo Logístico (Clima)</span>
                   <span className="text-amber-500">22%</span>
                 </div>
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-amber-400 rounded-full w-[22%]"></div>
                 </div>
               </div>
             </div>
           </div>
        </div>

      </div>
    </motion.div>
  );
}
