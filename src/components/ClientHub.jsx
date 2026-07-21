import React, { useState, useEffect } from 'react';

export default function ClientHub() {
  const [clients, setClients] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    status: 'Lead',
    value: ''
  });

  // Load initial data
  useEffect(() => {
    const saved = localStorage.getItem('vantex_clients');
    if (saved) {
      setClients(JSON.parse(saved));
    } else {
      // Dummy data for initial showcase
      setClients([
        { id: 1, name: 'Rahul Sharma', company: 'TechNova', email: 'rahul@technova.in', status: 'Active', value: '45000' },
        { id: 2, name: 'Priya Desai', company: 'Desai Retail', email: 'priya@desairetail.com', status: 'Lead', value: '120000' }
      ]);
    }
  }, []);

  // Save on change
  useEffect(() => {
    if (clients.length > 0) {
      localStorage.setItem('vantex_clients', JSON.stringify(clients));
    }
  }, [clients]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newClient = {
      id: Date.now(),
      ...formData
    };
    setClients([newClient, ...clients]);
    setIsAdding(false);
    setFormData({ name: '', company: '', email: '', status: 'Lead', value: '' });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Lead': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Completed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  // Helper to get initials for the auto-avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Area */}
      <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800/60 shadow-xl backdrop-blur-sm">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span>👥</span> Client Hub
          </h2>
          <p className="text-slate-400 text-sm mt-1">Manage leads, active projects, and client relationships.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
        >
          {isAdding ? 'Cancel' : '+ New Client'}
        </button>
      </div>

      {/* Add Client Form (Expands when button clicked) */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-indigo-500/30 p-6 rounded-2xl shadow-2xl backdrop-blur-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 border-b border-slate-800 pb-2 mb-2">
            <h3 className="text-indigo-400 font-medium">Add New Relationship</h3>
          </div>
          
          <input required type="text" placeholder="Client Name" 
            className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:border-indigo-500 focus:outline-none"
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            
          <input type="text" placeholder="Company Name" 
            className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:border-indigo-500 focus:outline-none"
            value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
            
          <input type="email" placeholder="Email Address" 
            className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:border-indigo-500 focus:outline-none"
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            
          <div className="flex gap-4">
            <select 
              className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:border-indigo-500 focus:outline-none flex-1"
              value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="Lead">🟡 Lead</option>
              <option value="Active">🟢 Active Project</option>
              <option value="Completed">🔵 Completed</option>
            </select>
            
            <input type="number" placeholder="Deal Value (₹)" 
              className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:border-indigo-500 focus:outline-none flex-1"
              value={formData.value} onChange={e => setFormData({...formData, value: e.target.value})} />
          </div>

          <div className="md:col-span-2 mt-2">
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-colors">
              Save Client Profile
            </button>
          </div>
        </form>
      )}

      {/* Client Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {clients.map((client) => (
          <div key={client.id} className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl hover:border-slate-700 transition-all flex flex-col justify-between group">
            <div className="flex justify-between items-start">
              <div className="flex gap-4 items-center">
                {/* Auto-generated Avatar */}
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-lg group-hover:scale-105 transition-transform">
                  {getInitials(client.name)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-200">{client.name}</h3>
                  <p className="text-sm text-slate-400">{client.company || 'Independent'}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(client.status)}`}>
                {client.status}
              </span>
            </div>
            
            <div className="mt-5 pt-4 border-t border-slate-800/60 flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-slate-400">
                <span>📧</span> {client.email || 'No email added'}
              </div>
              <div className="font-semibold text-slate-300">
                Deal: <span className="text-emerald-400">₹{Number(client.value).toLocaleString('en-IN') || '0'}</span>
              </div>
            </div>
          </div>
        ))}
        
        {clients.length === 0 && !isAdding && (
          <div className="col-span-2 text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            No clients added yet. Start building your rolodex.
          </div>
        )}
      </div>

    </div>
  );
}