import React, { useState, useMemo, useEffect } from 'react';

const API_BASE_URL = 'https://vantex-nexus-backend.onrender.com';

export default function ExpenseMatrix({ totalInvoiceRevenue = 0 }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Infrastructure', date: '' });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        // FIX: GET request made public
        const response = await fetch(`${API_BASE_URL}/expenses`);
        if (response.ok) {
          const data = await response.json();
          setExpenses(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch cloud expenses");
        }
      } catch (error) {
        console.error("Network error while fetching expenses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const totalExpenses = useMemo(() => expenses.reduce((sum, item) => sum + Number(item.amount), 0), [expenses]);
  const netProfit = totalInvoiceRevenue - totalExpenses;
  const profitMargin = totalInvoiceRevenue > 0 ? ((netProfit / totalInvoiceRevenue) * 100).toFixed(1) : 0;

  const categoryTotals = useMemo(() => {
    const map = {};
    expenses.forEach(e => { map[e.category] = (map[e.category] || 0) + Number(e.amount); });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const maxChartValue = useMemo(() => {
    const values = categoryTotals.map(c => c.value);
    return values.length > 0 ? Math.max(...values, 5000) : 5000; 
  }, [categoryTotals]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;
    
    // FIX: Prompt implementation
    const adminPin = window.prompt("🔒 Admin PIN required to Log Expense:");
    if (!adminPin) return;

    setIsSubmitting(true);
    const newExpensePayload = {
      title: formData.title,
      amount: Number(formData.amount),
      category: formData.category,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminPin // Passing prompt PIN
        },
        body: JSON.stringify(newExpensePayload),
      });

      if (response.ok) {
        const savedExpense = await response.json();
        setExpenses(prev => [...prev, savedExpense]);
        setFormData({ title: '', amount: '', category: 'Infrastructure', date: '' });
      } else {
        alert("❌ Unauthorized or Server Error. Failed to push expense.");
      }
    } catch (error) {
      console.error("Cloud Submission Error:", error);
      alert("❌ Network error while saving expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const chartHeight = 160;
  const barWidth = 50;
  const gap = 40;

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Vantex Nexus // Financial Matrix</h1>
        <p className="text-sm text-slate-400">Live cloud-synced cash flow & operational expense engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Revenue (Inflow)</p>
          <p className="text-3xl font-bold text-emerald-400 mt-2">₹{totalInvoiceRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Operational Burn (Outflow)</p>
          <p className="text-3xl font-bold text-rose-400 mt-2">
            {isLoading ? '...' : `₹${totalExpenses.toLocaleString()}`}
          </p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Net Profit / Margin</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">
            {isLoading ? '...' : `₹${netProfit.toLocaleString()}`} <span className="text-sm font-normal text-slate-400">({profitMargin}%)</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl">
            <h2 className="text-lg font-semibold text-white mb-4">Log Operational Expense</h2>
            <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" required placeholder="Expense Description" value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              <input type="number" required placeholder="Amount (INR)" value={formData.amount} onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
              <select value={formData.category} onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                <option value="Infrastructure">Infrastructure</option>
                <option value="Outsourcing">Outsourcing</option>
                <option value="Marketing">Marketing</option>
                <option value="Tools">Tools</option>
                <option value="Office">Office</option>
              </select>
              <input type="date" value={formData.date} onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))} className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]" />
              <button type="submit" disabled={isSubmitting} className="md:col-span-2 bg-blue-600 hover:bg-blue-500 transition-colors text-white font-medium py-2 rounded-lg text-sm disabled:opacity-50">
                {isSubmitting ? 'Pushing to Cloud...' : 'Commit Entry to Live Ledger'}
              </button>
            </form>
          </div>

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
                    <th className="p-4 font-medium">Recorded Date</th>
                    <th className="p-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {isLoading ? (
                    <tr><td colSpan="4" className="p-8 text-center text-slate-500 animate-pulse">Syncing live blocks...</td></tr>
                  ) : expenses.length === 0 ? (
                    <tr><td colSpan="4" className="p-8 text-center text-slate-500">No expenses logged.</td></tr>
                  ) : (
                    expenses.map(item => {
                      const displayDate = item.expenseDate ? item.expenseDate.split('T')[0] : (item.createdAt ? item.createdAt.split('T')[0] : item.date);
                      return (
                        <tr key={item.id} className="hover:bg-slate-700/20 transition-colors">
                          <td className="p-4 font-medium text-white">{item.title}</td>
                          <td className="p-4"><span className="px-2 py-0.5 rounded text-xs bg-slate-900 text-slate-300 border border-slate-700">{item.category}</span></td>
                          <td className="p-4 text-slate-400 font-mono text-xs">{displayDate}</td>
                          <td className="p-4 text-right font-semibold text-rose-400">₹{Number(item.amount).toLocaleString()}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Category Breakdown</h2>
            <p className="text-xs text-slate-400 mb-6">Native high-fidelity SVG geometry rendering pipeline.</p>
            {categoryTotals.length === 0 && !isLoading ? (
              <div className="h-40 flex items-center justify-center text-sm text-slate-500">Awaiting financial data...</div>
            ) : (
              <div className="w-full flex justify-center bg-slate-900/40 p-4 rounded-lg border border-slate-700/50">
                <svg width={(barWidth + gap) * categoryTotals.length + gap} height={chartHeight + 40} className="overflow-visible">
                  {categoryTotals.map((item, index) => {
                    const currentBarHeight = (item.value / maxChartValue) * chartHeight;
                    const xCoordinate = gap + index * (barWidth + gap);
                    const yCoordinate = chartHeight - currentBarHeight + 20;

                    return (
                      <g key={item.name} className="group">
                        <text x={xCoordinate + barWidth / 2} y={yCoordinate - 8} textAnchor="middle" className="text-[10px] fill-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          ₹{item.value.toLocaleString()}
                        </text>
                        <rect x={xCoordinate} y={yCoordinate} width={barWidth} height={currentBarHeight || 2} rx={6} className="fill-blue-500/80 group-hover:fill-blue-400 transition-all duration-300 cursor-pointer" />
                        <text x={xCoordinate + barWidth / 2} y={chartHeight + 35} textAnchor="middle" className="text-[10px] fill-slate-400 font-medium tracking-tight">
                          {item.name.length > 8 ? `${item.name.slice(0, 6)}..` : item.name}
                        </text>
                      </g>
                    );
                  })}
                  <line x1={0} y1={chartHeight + 20} x2={(barWidth + gap) * categoryTotals.length + gap} y2={chartHeight + 20} className="stroke-slate-700 stroke-1" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}