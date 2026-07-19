import React from 'react';

export default function DashboardLayout({ children, currentView, onViewChange }) {
  // Common helper class to handle clean navigation active/inactive states without layout shifts
  const getNavClass = (viewName) => {
    const isMainActive = currentView === viewName;
    return `flex items-center gap-3 px-4 py-3 cursor-pointer font-medium text-sm transition-all border-l-2 
      ${isMainActive 
        ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 rounded-r-md' 
        : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200 rounded-md'
      }`;
  };

  return (
    <div className="min-h-screen flex bg-[#090d16] text-slate-100 font-sans">
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-64 bg-slate-900/40 backdrop-blur-md border-r border-slate-800/60 flex flex-col justify-between p-6">
        <div>
          {/* Company Branding */}
          <div className="flex items-center gap-3 mb-10">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">V</div>
            <span className="text-xl font-bold tracking-wider text-white">VANTEX <span className="text-indigo-500">NEXUS</span></span>
          </div>
          
          {/* Navigation Links */}
          <nav className="space-y-2">
            {/* Overview Dashboard Tab */}
            <div 
              onClick={() => onViewChange('dashboard')}
              className={getNavClass('dashboard')}
            >
              <span>📊</span> Overview Dashboard
            </div>

            {/* Task Kanban Tab */}
            <div 
              onClick={() => onViewChange('kanban')}
              className={getNavClass('kanban')}
            >
              <span>📋</span> Task Kanban
            </div>

            {/* Invoice Vault Tab (UNLOCKED FOR DAY 4 ENGINE) */}
            <div 
              onClick={() => onViewChange('invoices')}
              className={getNavClass('invoices')}
            >
              <span>🧾</span> Invoice Vault
            </div>
          </nav>
        </div>
        
        {/* User Profile Footer */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
          <div className="h-9 w-9 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center font-semibold text-xs text-indigo-400">SK</div>
          <div>
            <p className="text-xs font-semibold text-slate-200">Sachin Kumar Pal</p>
            <p className="text-[10px] text-slate-500">Founder & Engineer</p>
          </div>
        </div>
      </aside>

      {/* 2. Main Workspace Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Sticky Top Header */}
        <header className="h-16 border-b border-slate-800/60 bg-slate-900/20 backdrop-blur-md flex items-center justify-between px-8">
          <div className="text-sm font-medium text-slate-400">Operations Control Center</div>
          <div className="flex items-center gap-4">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-400 tracking-wider">SYSTEM ACTIVE (DAY 4)</span>
          </div>
        </header>

        {/* Dynamic Inner Component Screen */}
        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}