import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, BarChart2, TrendingUp, Package, RefreshCw, Server } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const suggestedPrompts = [
  { icon: BarChart2, text: 'Resumen del flujo operativo de este mes' },
  { icon: TrendingUp, text: 'Explicame la prediccion de stock de la Semana 3' },
  { icon: Package, text: 'Cual es el mejor proveedor para Semiconductores?' },
];

type ChatMessage = {
  role: 'assistant' | 'user';
  content: string;
};

const initialMessage: ChatMessage = {
  role: 'assistant',
  content: 'Hola. Soy tu asistente de LogiSync. Puedo ayudarte a interpretar graficas, resumir reportes operativos o consultar proveedores.',
};

function buildLocalAnswer(question: string) {
  const normalized = question.toLowerCase();

  if (normalized.includes('stock') || normalized.includes('semana')) {
    return 'En modo local, la prediccion marca mayor riesgo alrededor de la Semana 3. Recomendacion: generar orden preventiva y revisar proveedores con confianza IA superior a 90%.';
  }

  if (normalized.includes('proveedor') || normalized.includes('semiconductor')) {
    return 'Para semiconductores, prioriza GlobalTech Solutions por confianza alta y costo estable. Nexus Dynamics queda como alternativa si necesitas reducir costo unitario.';
  }

  if (normalized.includes('flujo') || normalized.includes('kpi') || normalized.includes('mes')) {
    return 'El flujo operativo local muestra sincronizacion alta, SLA estable y variacion positiva en nodos activos. Usa Actualizar para regenerar el escenario.';
  }

  return 'Estoy trabajando en modo local. Puedo ayudarte con flujo operativo, reportes, repositorio, proveedores y predicciones usando los datos simulados de esta laptop.';
}

export function ChatbotView() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userContent = input.trim();
    const newMessages = [...messages, { role: 'user' as const, content: userContent }];

    setMessages(newMessages);
    setInput('');
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    setMessages([
      ...newMessages,
      {
        role: 'assistant',
        content: buildLocalAnswer(userContent),
      },
    ]);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col h-full p-6 pb-8 max-w-[1000px] mx-auto w-full"
    >
      <div className="flex-shrink-0 mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-[#4f46e5]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Asistente de Analisis IA</h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              Interpreta datos complejos y proyecciones mediante lenguaje natural.
            </p>
          </div>
        </div>
        <div className={cn(
          'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium',
          'border-emerald-200 bg-emerald-50 text-emerald-700'
        )}>
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Server className="w-4 h-4" />}
          <span>{loading ? 'Procesando local...' : 'Chat local activo'}</span>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)] border border-slate-100/60 flex flex-col overflow-hidden min-h-0">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex gap-4 max-w-[85%]', msg.role === 'user' ? 'ml-auto flex-row-reverse' : '')}>
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                msg.role === 'assistant' ? 'bg-indigo-50 text-[#4f46e5] border border-indigo-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
              )}>
                {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={cn(
                'px-5 py-4 rounded-2xl text-sm leading-relaxed',
                msg.role === 'assistant'
                  ? 'bg-slate-50 text-slate-700 border border-slate-100/80 rounded-tl-sm'
                  : 'bg-[#4f46e5] text-white rounded-tr-sm shadow-md shadow-indigo-500/20 font-medium'
              )}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {messages.length === 1 && (
          <div className="px-6 pb-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Sugerencias Inteligentes</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(prompt.text)}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-medium hover:bg-white hover:border-[#4f46e5] hover:text-[#4f46e5] hover:shadow-sm transition-all"
                >
                  <prompt.icon className="w-4 h-4" />
                  {prompt.text}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-white border-t border-slate-100/80 sticky bottom-0">
          <div className="relative flex items-center max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && void handleSend()}
              placeholder="Pregunta sobre reportes, graficas predictivas o KPIs..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm text-slate-700 placeholder:text-slate-400 py-4 pl-6 pr-16 focus:bg-white focus:border-[#4f46e5] focus:shadow-sm transition-all"
            />
            <button
              onClick={() => void handleSend()}
              disabled={!input.trim() || loading}
              className="absolute right-3 p-2.5 bg-[#4f46e5] text-white rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-500/20"
            >
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          <div className="text-center mt-3">
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
              La IA de LogiSync procesa consultas combinando KPIs en tiempo real, historicos y contexto local.
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
