import React, { useState } from 'react';

// Tera live Render backend URL
const API_BASE_URL = 'https://vantex-nexus-backend.onrender.com';

export default function SettingsHub() {
  const [status, setStatus] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // 📥 LIVE DATABASE EXPORT LOGIC (WITH PIN PROTECTION)
  const handleExport = async () => {
    // 🛑 Simple Frontend Security Prompt
    const pin = prompt("🔒 Enter Admin PIN to download cloud backup:");
    
    // Vercel Environment Variables se PIN uthana (GitHub pe code safe rahega)
    const SECRET_PIN = import.meta.env.VITE_ADMIN_PIN; 
    
    if (pin !== SECRET_PIN) {
      alert("❌ Incorrect PIN! Access Denied.");
      return;
    }

    setIsExporting(true);
    setStatus('⏳ Fetching cloud data... Please wait.');
    
    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-admin-secret': SECRET_PIN
      };

      // Fetch all core modules data from live backend in parallel with headers
      const [dealsRes, clientsRes, invoicesRes, expensesRes, servicesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/deals`, { headers }),
        fetch(`${API_BASE_URL}/clients`, { headers }),
        fetch(`${API_BASE_URL}/invoices`, { headers }),
        fetch(`${API_BASE_URL}/expenses`, { headers }),
        // Fallback added just in case 'services' endpoint isn't fully ready yet
        fetch(`${API_BASE_URL}/services`, { headers }).catch(() => ({ ok: true, json: () => [] })) 
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

  // 🛑 DANGER ZONE (Cloud warning note)
  const handleClearDataWarning = () => {
    alert("⚠️ Direct database wiping from the browser is disabled for production safety. Please manage records directly through Supabase or individual module delete actions.");
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
        {/* Data Backup Section */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-6 rounded-2xl shadow-xl backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Cloud Database Backup</h3>
            <p className="text-slate-400 text-sm mb-6">
              Secure your live Supabase PostgreSQL database. Download a complete JSON snapshot of all active deals, clients, invoices, and expenses. Requires Admin PIN.
            </p>
          </div>
         
          <div className="flex flex-col space-y-4">
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              {isExporting ? 'Fetching Cloud Data...' : 'Export Cloud Workspace Backup (.json)'}
            </button>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="bg-slate-900/40 border border-rose-950/40 p-6 rounded-2xl shadow-xl backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-rose-500 mb-2">Danger Zone</h3>
            <p className="text-slate-400 text-sm mb-6">
              Production safety controls. Direct browser-level database wiping is locked to protect live cloud records.
            </p>
          </div>
          
          <button 
            onClick={handleClearDataWarning}
            className="px-4 py-3 bg-rose-600/10 hover:bg-rose-600 hover:text-white text-rose-500 border border-rose-600/30 border-dashed font-semibold rounded-xl transition-all w-full flex items-center justify-center gap-2 cursor-pointer"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Wipe Cloud Database Protection
          </button>
        </div>
      </div>
    </div>
  );
}