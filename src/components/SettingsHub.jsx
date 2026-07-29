import React, { useState } from 'react';

const API_BASE_URL = 'https://vantex-nexus-backend.onrender.com';

export default function SettingsHub() {
  const [status, setStatus] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    // FIX: Wapas se PIN protection laga di frontend pe
    const adminPin = window.prompt("🔒 Enter Admin PIN to download cloud backup:");
    const SECRET_PIN = import.meta.env.VITE_ADMIN_PIN;
    
    if (adminPin !== SECRET_PIN) {
      alert("❌ Incorrect PIN! Access Denied.");
      return;
    }

    setIsExporting(true);
    setStatus('⏳ Fetching cloud data... Please wait.');
    
    try {
      const [dealsRes, clientsRes, invoicesRes, expensesRes, servicesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/deals`),
        fetch(`${API_BASE_URL}/clients`),
        fetch(`${API_BASE_URL}/invoices`),
        fetch(`${API_BASE_URL}/expenses`),
        fetch(`${API_BASE_URL}/services`).catch(() => ({ ok: true, json: () => [] })) 
      ]);

      const allData = {
        exportedAt: new Date().toISOString(),
        deals: dealsRes.ok ? await dealsRes.json() : [],
        clients: clientsRes.ok ? await clientsRes.json() : [],
        invoices: invoicesRes.ok ? await invoicesRes.json() : [],
        expenses: expensesRes.ok ? await expensesRes.json() : [],
        services: servicesRes.ok ? await servicesRes.json() : [],
      };
      
      const jsonString = JSON.stringify(allData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `vantex_nexus_cloud_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setStatus('✅ Live cloud database exported successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus('❌ Export failed. Check console.');
      console.error("Export Error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearDataWarning = () => {
    alert("⚠️ Direct database wiping from the browser is disabled for production safety.");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800/60 shadow-xl backdrop-blur-sm">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>⚙️</span> System Settings & Data
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage cloud workspace backups and database synchronization.</p>
        </div>
      </div>
     
      {status && (
        <div className="mb-6 p-4 bg-slate-900 border-l-4 border-emerald-500 text-emerald-400 font-medium rounded-xl shadow-lg transition-all">
          {status}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Cloud Database Backup</h3>
            <p className="text-slate-400 text-sm mb-6">Download a complete JSON snapshot of all active deals, clients, invoices, and expenses. Requires Admin PIN.</p>
          </div>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
             {isExporting ? 'Fetching Cloud Data...' : 'Export Cloud Workspace Backup (.json)'}
          </button>
        </div>

        <div className="bg-slate-900/40 border border-rose-950/40 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-rose-500 mb-2">Danger Zone</h3>
            <p className="text-slate-400 text-sm mb-6">Production safety controls lock browser-level database wiping.</p>
          </div>
          <button 
            onClick={handleClearDataWarning}
            className="px-4 py-3 bg-rose-600/10 hover:bg-rose-600 hover:text-white text-rose-500 border border-rose-600/30 border-dashed font-semibold rounded-xl transition-all w-full flex items-center justify-center gap-2 cursor-pointer"
          >
            Wipe Cloud Database Protection
          </button>
        </div>
      </div>
    </div>
  );
}