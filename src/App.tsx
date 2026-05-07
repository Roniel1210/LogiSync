import React, { useState } from 'react';
import { TopNav } from './components/TopNav';
import { DashboardView } from './components/DashboardView';
import { RepositoryView } from './components/RepositoryView';
import { PredictiveView } from './components/PredictiveView';
import { ReportsView } from './components/ReportsView';
import { ChatbotView } from './components/ChatbotView';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div className="flex flex-col h-screen w-full bg-[#f8fafc] text-slate-900 font-sans overflow-hidden">
      {/* Top Navigation */}
      <TopNav activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="w-full h-full">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'repository' && <RepositoryView />}
          {activeView === 'predictive' && <PredictiveView />}
          {activeView === 'reports' && <ReportsView />}
          {activeView === 'chatbot' && <ChatbotView />}
        </div>
      </main>
    </div>
  );
}

