import React, { useState } from 'react';
import { LayoutDashboard, Database, TrendingUp, FileText, MessageSquare, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

interface TopNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export function TopNav({ activeView, setActiveView }: TopNavProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Flujo Operativo', icon: LayoutDashboard },
    { id: 'repository', label: 'Nexo Vectorial', icon: Database },
    { id: 'predictive', label: 'Proyecciones', icon: TrendingUp },
    { id: 'reports', label: 'Reportes', icon: FileText },
    { id: 'chatbot', label: 'Asistente IA', icon: MessageSquare },
  ];

  return (
    <header className="h-[72px] bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-6 shrink-0 z-20 sticky top-0 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2.5 shrink-0 min-w-[44px]">
        <div className="shrink-0 w-10 h-10 flex items-center justify-center">
          <img
            src="/logo-local.jpeg"
            alt="LogiSync Logo"
            className="w-10 h-10 object-contain rounded-xl drop-shadow-md"
          />
        </div>
        <div className="hidden lg:block">
          <h1 className="text-slate-800 font-bold text-xl leading-none">LogiSync</h1>
          <p className="text-[10px] text-[#4f46e5] font-bold mt-1 tracking-widest uppercase">ERP Inteligente</p>
        </div>
      </div>

      {/* Center Navigation */}
      <nav className="flex-1 flex justify-center items-center gap-0.5 xl:gap-1 px-2 overflow-hidden">
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={cn(
                "flex items-center gap-1.5 xl:gap-2 px-2 xl:px-3 2xl:px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group whitespace-nowrap shrink-0",
                isActive
                  ? "bg-indigo-50 text-[#4f46e5]"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              )}
            >
              <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-[#4f46e5]" : "text-slate-400 group-hover:text-slate-500")} />
              <span className="hidden sm:inline text-xs xl:text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Area (User/Bell) */}
      <div className="flex items-center gap-2 lg:gap-4 shrink-0 justify-end">
        {/* Online Status */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">IA Activa</span>
        </div>

        <button
          onClick={() => setShowNotifications((current) => !current)}
          aria-label="Ver notificaciones"
          className="text-slate-400 hover:text-[#4f46e5] bg-slate-50 p-2.5 rounded-full border border-slate-100 hover:bg-indigo-50 transition-colors relative group shrink-0"
        >
          <Bell className="w-4 h-4" />
          {!showNotifications && <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
        </button>
        {showNotifications && (
          <div className="absolute right-20 top-16 w-72 rounded-xl border border-slate-100 bg-white p-4 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Notificaciones</p>
            <div className="mt-3 space-y-3">
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">3 alertas predictivas requieren revision.</p>
              <p className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700">Repositorio vectorial sincronizado.</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 lg:gap-3 pl-3 lg:pl-4 border-l border-slate-100 cursor-pointer shrink-0">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-700 leading-none whitespace-nowrap">Admin Logístico</p>
            <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">Superadmin</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 shrink-0">
            AL
          </div>
        </div>
      </div>
    </header>
  );
}
