import React, { useState, useEffect } from 'react';

const COLUMNS = [
  { id: 'lead', title: 'Leads / Incoming', color: 'border-l-4 border-l-blue-500' },
  { id: 'review', title: 'Technical Review', color: 'border-l-4 border-l-amber-500' },
  { id: 'proposal', title: 'Proposal / Negotiation', color: 'border-l-4 border-l-purple-500' },
  { id: 'won', title: 'Closed Won', color: 'border-l-4 border-l-emerald-500' }
];

const DEFAULT_TASKS = [
  { id: '1710000001', title: 'Salesforce LWC Integration', company: 'Apex Tech LLC', value: '₹1,20,000', status: 'lead', owner: 'Sachin' },
  { id: '1710000002', title: 'Custom SVG Chart Module', company: 'Vantex Internal', value: '₹85,000', status: 'review', owner: 'Sachin' },
  { id: '1710000003', title: 'Next.js E-Commerce Pipeline', company: 'Katni Traders', value: '₹2,10,000', status: 'proposal', owner: 'Ankit' },
  { id: '1710000004', title: 'Dashboard UI Architecture', company: 'GGITS Portal', value: '₹95,000', status: 'won', owner: 'Sachin' },
];

export default function TaskKanban() {
  // 1. Storage Engine Architecture
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('vantex_nexus_kanban');
    return saved ? JSON.parse(saved) : DEFAULT_TASKS;
  });

  const [activeColumn, setActiveColumn] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Deal Form States
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newOwner, setNewOwner] = useState('Sachin');

  useEffect(() => {
    localStorage.setItem('vantex_nexus_kanban', JSON.stringify(tasks));
  }, [tasks]);

  // 2. Drag & Drop Logic Handlers
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (activeColumn !== columnId) setActiveColumn(columnId);
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: targetStatus } : task
    ));
    setActiveColumn(null);
  };

  // 3. Form Submission & Custom ID Generator
  const handleCreateDeal = (e) => {
    e.preventDefault();
    if (!newTitle || !newCompany || !newValue) return;

    // Formatting raw number to INR standard currency
    const formattedValue = `₹${parseInt(newValue, 10).toLocaleString('en-IN')}`;

    const newDeal = {
      id: String(Date.now()),
      title: newTitle,
      company: newCompany,
      value: formattedValue,
      status: 'lead',
      owner: newOwner
    };

    setTasks(prev => [newDeal, ...prev]);
    
    // Reset Form
    setNewTitle('');
    setNewCompany('');
    setNewValue('');
    setIsModalOpen(false);
  };

  // 4. Delete Action Mechanics
  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="text-slate-100 bg-slate-950/20 min-h-screen relative">
      {/* Top Banner Control */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Deal Pipeline Engine</h1>
          <p className="text-sm text-slate-400 mt-1">Handcrafted native workspace. Engine operational without third-party wrapper lag.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white rounded-xl text-xs font-semibold tracking-wide shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            + Create New Deal
          </button>
          <div className="text-[10px] font-mono bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-cyan-400 hidden md:block">
            PERSISTENCE: LOCALSTORAGE_ACTIVE
          </div>
        </div>
      </div>

      {/* Kanban Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          const totalValue = colTasks.reduce((acc, curr) => {
            const num = parseInt(curr.value.replace(/[^0-9]/g, ''), 10);
            return acc + (isNaN(num) ? 0 : num);
          }, 0);

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              onDragLeave={() => setActiveColumn(null)}
              className={`rounded-xl bg-slate-900/40 border p-4 transition-all duration-300 min-h-[520px] flex flex-col
                ${activeColumn === col.id 
                  ? 'border-indigo-500 bg-slate-900/70 shadow-[0_0_20px_rgba(99,102,241,0.12)] scale-[1.01]' 
                  : 'border-slate-900'}`}
            >
              {/* Meta Stats */}
              <div className={`flex justify-between items-center pb-3 mb-3 border-b border-slate-800/60 ${col.color} pl-2`}>
                <h3 className="font-semibold text-xs text-slate-300 tracking-wider uppercase">{col.title}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 font-mono text-slate-400">{colTasks.length}</span>
              </div>

              {/* Volume Track */}
              <div className="mb-4 text-[11px] font-mono text-slate-500 flex justify-between">
                <span>Pipeline Volume:</span>
                <span className="text-slate-300 font-medium">₹{totalValue.toLocaleString('en-IN')}</span>
              </div>

              {/* Cards Container */}
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[580px] pr-1">
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="p-4 rounded-xl bg-[#0d1321] border border-slate-800/80 hover:border-slate-700 cursor-grab active:cursor-grabbing transition-all duration-200 group relative"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-medium text-indigo-400 bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-900/30">
                        {task.company}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-emerald-400">{task.value}</span>
                        <button 
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 text-[11px] cursor-pointer"
                          title="Delete Deal"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <h4 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors line-clamp-2">
                      {task.title}
                    </h4>
                    <div className="mt-4 pt-2 border-t border-slate-800/40 flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>Rep: {task.owner}</span>
                      <span>#{task.id.slice(-4)}</span>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center flex-1 py-16 border border-dashed border-slate-800/40 rounded-xl text-slate-600 text-xs font-mono">
                    Drop pipelines here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Custom Zero-Bloat Modal Component */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-white mb-1">Add New Enterprise Pipeline</h3>
            <p className="text-xs text-slate-400 mb-5">Deploy a raw transaction block into incoming streams.</p>
            
            <form onSubmit={handleCreateDeal} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g., GraphQL API Scale Integration"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-sans placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">Target Account / Client</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={e => setNewCompany(e.target.value)}
                  placeholder="e.g., Jabalpur Logistics"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 text-xs placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">Deal Worth (INR)</label>
                  <input
                    type="number"
                    required
                    value={newValue}
                    onChange={e => setNewValue(e.target.value)}
                    placeholder="e.g., 150000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 text-xs placeholder:text-slate-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">Deal Owner</label>
                  <select
                    value={newOwner}
                    onChange={e => setNewOwner(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 text-xs font-mono"
                  >
                    <option value="Sachin">Sachin</option>
                    <option value="Ankit">Ankit</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-900 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-400 rounded-xl text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold tracking-wide shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  Append Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}