import React, { useState } from 'react';

const SettingsHub = () => {
  const [status, setStatus] = useState('');

  // 📥 EXPORT LOGIC
  const handleExport = () => {
    try {
      const allData = {};
      // Iterate through localStorage and grab all data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        allData[key] = localStorage.getItem(key);
      }
      
      const jsonString = JSON.stringify(allData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `vantex_nexus_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setStatus('✅ Data exported successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      setStatus('❌ Export failed. Check console.');
      console.error(error);
    }
  };

  // 📤 IMPORT LOGIC
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        Object.keys(importedData).forEach((key) => {
          localStorage.setItem(key, importedData[key]);
        });
        
        setStatus('✅ Workspace restored! Reloading...');
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        setStatus('❌ Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  // 🛑 DANGER ZONE
  const handleClearData = () => {
    if (window.confirm("⚠️ Are you sure? This will wipe all Vantex Nexus data from this browser!")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 text-gray-100 bg-gray-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 tracking-tight text-white">⚙️ System Settings</h2>
      
      {status && (
        <div className="mb-6 p-3 bg-gray-800 border-l-4 border-emerald-500 text-emerald-400 font-medium rounded">
          {status}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Backup Section */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-2">Data Backup & Restore</h3>
          <p className="text-gray-400 text-sm mb-6">
            Secure your zero-dependency workspace. Download a snapshot of your current database or restore from a previous JSON backup.
          </p>
          
          <div className="flex flex-col space-y-4">
            <button 
              onClick={handleExport}
              className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Export Workspace Backup (.json)
            </button>

            <div className="relative">
              <input 
                type="file" 
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                Restore from Backup
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-red-900/30">
          <h3 className="text-xl font-semibold mb-2 text-red-500">Danger Zone</h3>
          <p className="text-gray-400 text-sm mb-6">
            Permanently delete all Vantex Nexus data from this browser's local storage. This action cannot be undone.
          </p>
          
          <button 
            onClick={handleClearData}
            className="px-4 py-3 bg-red-600/10 hover:bg-red-600 hover:text-white text-red-500 border border-red-600 border-dashed font-medium rounded-lg transition-all w-full flex items-center justify-center gap-2"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Wipe Local Database
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsHub;