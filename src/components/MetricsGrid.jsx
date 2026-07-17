import React from 'react';

export default function MetricsGrid() {
  // Vantex Solutions ke live metrics ka temporary mock data
  const stats = [
    { title: 'Total Revenue', value: '₹4,85,000', change: '+12.5%', isPositive: true, icon: '💼' },
    { title: 'Active Pipelines', value: '8 Projects', change: '2 in QA', isPositive: true, icon: '⚡' },
    { title: 'Pending Invoices', value: '3 Unpaid', change: '₹42,000 due', isPositive: false, icon: '⏳' },
    { title: 'Total Clients', value: '14 Active', change: '+2 new', isPositive: true, icon: '👥' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((item, index) => (
        <div 
          key={index} 
          className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-6 rounded-xl hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-semibold tracking-wider text-slate-400 group-hover:text-slate-300 uppercase">
              {item.title}
            </span>
            <div className="text-xl p-2 bg-slate-800/50 rounded-lg group-hover:bg-indigo-600/10 group-hover:text-indigo-400 transition-colors">
              {item.icon}
            </div>
          </div>
          
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              {item.value}
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
              item.isPositive 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {item.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}