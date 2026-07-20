import React, { useState, useMemo, useEffect } from 'react';

export default function ExpenseMatrix({ totalInvoiceRevenue = 75000 }) {
  // 1. Core States for Expenses with localStorage Sync
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('vantex_expenses');
      return saved ? JSON.parse(saved) : [
        { id: 1, title: 'Vercel Pro Plan', amount: 2000, category: 'Infrastructure', date: '2026-04-01' },
        { id: 2, title: 'UI Designer Freelancer', amount: 25000, category: 'Outsourcing', date: '2026-04-05' },
        { id: 3, title: 'LinkedIn Premium/Ads', amount: 8000, category: 'Marketing', date: '2026-04-10' },
        { id: 4, title: 'Cursor AI API', amount: 1500, category: 'Tools', date: '2026-04-12' },
      ];
    } catch (e) {
      console.error("Error reading localStorage", e);
      return [];
    }
  });

  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Infrastructure', date: '' });

  // Automatically commit mutations to browser memory
  useEffect(() => {
    localStorage.setItem('vantex_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // 2. Mathematical Aggregations
  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  }, [expenses]);

  const netProfit = totalInvoiceRevenue - totalExpenses;
  const profitMargin = totalInvoiceRevenue > 0 ? ((netProfit / totalInvoiceRevenue) * 100).toFixed(1) : 0;

  // 3. Category Data Preparation for SVG Chart
  const categoryTotals = useMemo(() => {
    const map = {};
    expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const maxChartValue = useMemo(() => {
    const values = categoryTotals.map(c => c.value);
    return values.length > 0 ? Math.max(...values, 5000) : 5000; 
  }, [categoryTotals]);

  // Handle Form Submission
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.date) return;
    
    setExpenses(prev => [
      ...prev,
      { ...formData, id: Date.now(), amount: Number(formData.amount) }
    ]);
    setFormData({ title: '', amount: '', category: 'Infrastructure', date: '' });
  };

  // SVG Chart Dimensions
  const chartHeight = 160;
  const barWidth = 50;
  const gap = 40;

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen font-sans">
      {/* Header & High-Level Metrics */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Vantex Nexus // Financial Matrix</h1>
        <p className="text-sm text-slate-400">Zero-dependency real-time cash flow & operational expense engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Revenue (Inflow)</p>
          <p className="text-3xl font-bold text-emerald-400 mt-2">₹{totalInvoiceRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Operational Burn (Outflow)</p>
          <p className="text-3xl font-bold text-rose-400 mt-2">₹{totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Net Profit / Margin</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">
            ₹{netProfit.toLocaleString()} <span className="text-sm font-normal text-slate-400">({profitMargin}%)</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Expense Logger Form & Ledger */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Expense Form */}
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl">
            <h2 className="text-lg font-semibold text-white mb-4">Log Operational Expense</h2>
            <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Expense Description (e.g., Server Scaling)" 
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <input 
                type="number" 
                placeholder="Amount (INR)" 
                value={formData.amount}
                onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <select 
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Infrastructure">Infrastructure</option>
                <option value="Outsourcing">Outsourcing</option>
                <option value="Marketing">Marketing</option>
                <option value="Tools">Tools</option>
              </select>
              <input 
                type="date" 
                value={formData.date}
                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-500 transition-colors text-white font-medium py-2 rounded-lg text-sm">
                Commit Entry to Ledger
              </button>
            </form>
          </div>

          {/* Ledger Table */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white">Expense Registry</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-900/50 text-slate-400 border-b border-slate-700">
                    <th className="p-4 font-medium">Description</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {expenses.map(item => (
                    <tr key={item.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="p-4 font-medium text-white">{item.title}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-xs bg-slate-900 text-slate-300 border border-slate-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">{item.date}</td>
                      <td className="p-4 text-right font-semibold text-rose-400">₹{item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Pure Zero-Dependency SVG Chart */}
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Category Breakdown</h2>
            <p className="text-xs text-slate-400 mb-6">Native high-fidelity SVG geometry rendering pipeline.</p>
            
            {categoryTotals.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-sm text-slate-500">No data points to render</div>
            ) : (
              <div className="w-full flex justify-center bg-slate-900/40 p-4 rounded-lg border border-slate-700/50">
                {/* SVG Mathematical Bar Chart */}
                <svg 
                  width={(barWidth + gap) * categoryTotals.length + gap} 
                  height={chartHeight + 40} 
                  className="overflow-visible"
                >
                  {categoryTotals.map((item, index) => {
                    const currentBarHeight = (item.value / maxChartValue) * chartHeight;
                    const xCoordinate = gap + index * (barWidth + gap);
                    const yCoordinate = chartHeight - currentBarHeight + 20;

                    return (
                      <g key={item.name} className="group">
                        {/* Dynamic Tooltip Value on Hover */}
                        <text
                          x={xCoordinate + barWidth / 2}
                          y={yCoordinate - 8}
                          textAnchor="middle"
                          className="text-[10px] fill-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          ₹{item.value}
                        </text>

                        {/* Rendered Bar Geometry */}
                        <rect
                          x={xCoordinate}
                          y={yCoordinate}
                          width={barWidth}
                          height={currentBarHeight}
                          rx={6}
                          className="fill-blue-500/80 group-hover:fill-blue-400 transition-all duration-300 cursor-pointer"
                        />

                        {/* Axis X Labels */}
                        <text
                          x={xCoordinate + barWidth / 2}
                          y={chartHeight + 35}
                          textAnchor="middle"
                          className="text-[10px] fill-slate-400 font-medium tracking-tight"
                        >
                          {item.name.length > 8 ? `${item.name.slice(0, 6)}..` : item.name}
                        </text>
                      </g>
                    );
                  })}
                  {/* Base Baseline Guide */}
                  <line 
                    x1={0} 
                    y1={chartHeight + 20} 
                    x2={(barWidth + gap) * categoryTotals.length + gap} 
                    y2={chartHeight + 20} 
                    className="stroke-slate-700 stroke-1" 
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Quick Micro-Report Footer */}
          <div className="mt-6 pt-4 border-t border-slate-700/60 text-xs text-slate-400 space-y-2">
            <div className="flex justify-between">
              <span>Primary Burn Vector:</span>
              <span className="text-slate-200 font-semibold">
                {categoryTotals.reduce((max, c) => c.value > max.value ? c : max, { name: 'None', value: 0 }).name}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Rendering Performance:</span>
              <span className="text-emerald-400 font-mono font-semibold">0ms (Native DOM)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}