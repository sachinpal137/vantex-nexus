import React, { useState, useEffect } from 'react';

export default function MetricsGrid() {
  // Backend se saare stats store karne ke liye ek object state
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    activeProjects: 0,
    pendingInvoices: 0,
    totalClients: 0,
    isLoading: true
  });

  // Component load hote hi live dashboard API call karenge
  useEffect(() => {
    fetch('https://vantex-nexus-backend.onrender.com/dashboard-stats')
      .then(res => res.json())
      .then(data => {
        setDashboardData({
          totalRevenue: data.totalRevenue || 0,
          activeProjects: data.activeProjects || 0,
          pendingInvoices: data.pendingInvoices || 0,
          totalClients: data.totalClients || 0,
          isLoading: false
        });
      })
      .catch(err => {
        console.error("Dashboard API connect nahi hui bhai:", err);
        setDashboardData(prev => ({ ...prev, isLoading: false }));
      });
  }, []);

  // Vantex Solutions ke live metrics array
  const stats = [
    { 
      title: 'Total Revenue', 
      value: dashboardData.isLoading ? '...' : `₹${dashboardData.totalRevenue.toLocaleString('en-IN')}`, 
      change: 'Live DB 🟢', 
      isPositive: true, 
      icon: '💼' 
    },
    { 
      title: 'Active Pipelines', 
      value: dashboardData.isLoading ? '...' : `${dashboardData.activeProjects} Projects`, 
      change: 'Live DB 🟢', 
      isPositive: true, 
      icon: '⚡' 
    },
    { 
      title: 'Pending Invoices', 
      value: dashboardData.isLoading ? '...' : `${dashboardData.pendingInvoices} Unpaid`, 
      change: dashboardData.pendingInvoices > 0 ? 'Action Needed' : 'All Clear ✨', 
      isPositive: dashboardData.pendingInvoices === 0, 
      icon: '⏳' 
    },
    { 
      title: 'Total Clients', 
      value: dashboardData.isLoading ? '...' : `${dashboardData.totalClients} Active`, 
      change: 'Live DB 🟢', 
      isPositive: true, 
      icon: '👥' 
    },
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