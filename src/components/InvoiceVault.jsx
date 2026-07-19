import React, { useState, useEffect } from 'react';

const DEFAULT_INVOICES = [
  {
    id: 'INV-2026-001',
    client: 'GGITS Portal Authorities',
    date: '2026-04-10',
    dueDate: '2026-05-10',
    status: 'Paid',
    items: [{ id: '1', desc: 'Dashboard UI Architecture Layout', qty: 1, rate: 95000 }],
    taxRate: 18,
  },
  {
    id: 'INV-2026-002',
    client: 'Katni Traders Group',
    date: '2026-04-12',
    dueDate: '2026-05-12',
    status: 'Pending',
    items: [
      { id: '1', desc: 'Next.js Core Pipeline Setup', qty: 1, rate: 150000 },
      { id: '2', desc: 'Database Schema Optimization', qty: 1, rate: 60000 }
    ],
    taxRate: 18,
  }
];

export default function InvoiceVault() {
  // 1. Storage & State Synchronization
  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('vantex_nexus_invoices');
    return saved ? JSON.parse(saved) : DEFAULT_INVOICES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  // Form States for New Invoice
  const [clientName, setClientName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [taxRate, setTaxRate] = useState(18);
  const [lineItems, setLineItems] = useState([{ id: '1', desc: '', qty: 1, rate: 0 }]);

  useEffect(() => {
    localStorage.setItem('vantex_nexus_invoices', JSON.stringify(invoices));
  }, [invoices]);

  // 2. Dynamic Mathematical Computations
  const calculateInvoiceMetrics = (items, taxPercent) => {
    const subtotal = items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
    const taxAmount = Math.round(subtotal * (taxPercent / 100));
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  // Global Matrix Stats
  const stats = invoices.reduce((acc, inv) => {
    const { total } = calculateInvoiceMetrics(inv.items, inv.taxRate);
    if (inv.status === 'Paid') acc.paid += total;
    else if (inv.status === 'Pending') acc.pending += total;
    acc.totalVolume += total;
    return acc;
  }, { paid: 0, pending: 0, totalVolume: 0 });

  // 3. Line-Item Mutation Engine
  const handleAddLineItem = () => {
    setLineItems([...lineItems, { id: String(Date.now()), desc: '', qty: 1, rate: 0 }]);
  };

  const handleRemoveLineItem = (id) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        return { ...item, [field]: field === 'desc' ? value : Number(value) };
      }
      return item;
    }));
  };

  // 4. Form Submission & Custom ID Tokenization
  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (!clientName || !dueDate || lineItems.some(i => !i.desc || i.rate <= 0)) return;

    const newInvoice = {
      id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
      client: clientName,
      date: new Date().toISOString().split('T')[0],
      dueDate: dueDate,
      status: 'Pending',
      items: lineItems,
      taxRate: Number(taxRate)
    };

    setInvoices([newInvoice, ...invoices]);
    
    // Reset States
    setClientName('');
    setDueDate('');
    setLineItems([{ id: '1', desc: '', qty: 1, rate: 0 }]);
    setIsCreateMode(false);
  };

  // Native Print Execution Trigger
  const triggerNativePrint = (inv) => {
    setViewingInvoice(inv);
    setTimeout(() => {
      window.print();
    }, 50);
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.client.toLowerCase().includes(searchQuery.toLowerCase()) || inv.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="text-slate-100 bg-slate-950/20 min-h-screen pb-12">
      
      {/* NATIVE HIGH-FIDELITY PRINT ENGINE OVERRIDE PATCH */}
      <style>{`
        @media print {
          /* 1. Nuke outer app shell nodes completely to secure 0px allocation */
          aside, header, .no-print {
            display: none !important;
          }

          /* 2. Flatten layout nodes completely to remove background artifacts and height locks */
          html, body, main, #root, 
          .min-h-screen, 
          .flex-1 {
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: #ffffff !important;
            box-shadow: none !important;
          }

          /* 3. Re-draw isolated content area starting precisely at page origin */
          #printable-invoice-area {
            display: block !important;
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            background: #ffffff !important;
            border: none !important;
            box-shadow: none !important;
            padding: 12mm !important;
            margin: 0 !important;
          }

          /* 4. Strict high-contrast monochrome typography rules */
          #printable-invoice-area * {
            color: #000000 !important;
            background: transparent !important;
          }
          
          #printable-invoice-area .text-indigo-400,
          #printable-invoice-area .text-emerald-400 {
            color: #000000 !important;
            font-weight: 800 !important;
          }

          /* 5. Elegant structural table dividers instead of dark grid boundaries */
          #printable-invoice-area .border-slate-900, 
          #printable-invoice-area .divide-slate-900, 
          #printable-invoice-area .divide-slate-900\/40 {
            border-color: #cbd5e1 !important;
          }
        }
      `}</style>

      {/* Header Controller */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 no-print">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Invoice Vault Engine</h1>
          <p className="text-sm text-slate-400 mt-1">Handcrafted multi-tenant billing engine. Zero layout abstraction wrappers.</p>
        </div>
        <button
          onClick={() => { setIsCreateMode(!isCreateMode); setViewingInvoice(null); }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer"
        >
          {isCreateMode ? '← Back to Ledger' : '+ Generate Invoice Block'}
        </button>
      </div>

      {!isCreateMode && !viewingInvoice && (
        <div className="space-y-6 no-print">
          {/* Top Performance Financial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-5">
              <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">Total Vault Volume</span>
              <div className="text-xl font-bold font-mono mt-1 text-slate-200">₹{stats.totalVolume.toLocaleString('en-IN')}</div>
            </div>
            <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-5 border-l-4 border-l-emerald-500">
              <span className="text-[10px] font-mono tracking-wider text-emerald-500 uppercase">Liquid Cleared (Paid)</span>
              <div className="text-xl font-bold font-mono mt-1 text-emerald-400">₹{stats.paid.toLocaleString('en-IN')}</div>
            </div>
            <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-5 border-l-4 border-l-amber-500">
              <span className="text-[10px] font-mono tracking-wider text-amber-500 uppercase">Escrow Pipeline (Pending)</span>
              <div className="text-xl font-bold font-mono mt-1 text-amber-400">₹{stats.pending.toLocaleString('en-IN')}</div>
            </div>
          </div>

          {/* Filtering Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0d1321] border border-slate-900 p-4 rounded-xl">
            <input
              type="text"
              placeholder="Search by Invoice ID or Client..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
            />
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
              {['All', 'Paid', 'Pending'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-colors whitespace-nowrap cursor-pointer
                    ${statusFilter === tab ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-950 text-slate-500 border border-slate-900 hover:text-slate-300'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Core Table Matrix */}
          <div className="bg-[#0d1321]/40 border border-slate-900 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-900/30 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Invoice ID</th>
                  <th className="p-4">Target Client</th>
                  <th className="p-4">Issued Date</th>
                  <th className="p-4">Gross Valuation</th>
                  <th className="p-4">Runtime Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs">
                {filteredInvoices.map(inv => {
                  const { total } = calculateInvoiceMetrics(inv.items, inv.taxRate);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="p-4 font-mono text-indigo-400 font-semibold">{inv.id}</td>
                      <td className="p-4 font-medium text-slate-200">{inv.client}</td>
                      <td className="p-4 text-slate-400 font-mono">{inv.date}</td>
                      <td className="p-4 text-slate-200 font-mono font-bold">₹{total.toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wide font-medium border
                          ${inv.status === 'Paid' ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400' : 'bg-amber-950/40 border-amber-900/50 text-amber-400'}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-3">
                        <button
                          onClick={() => setViewingInvoice(inv)}
                          className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                        >
                          View Workspace
                        </button>
                        <button
                          onClick={() => triggerNativePrint(inv)}
                          className="text-slate-400 hover:text-slate-200 font-medium cursor-pointer"
                        >
                          🖨️ Direct Print
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-600 font-mono">
                      No matching records found in local index blocks.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dynamic Creation Workspace Mode */}
      {isCreateMode && (
        <form onSubmit={handleCreateInvoice} className="bg-[#0d1321] border border-slate-900 rounded-2xl p-6 max-w-3xl mx-auto space-y-6 no-print">
          <div className="border-b border-slate-900 pb-4">
            <h3 className="text-base font-bold text-white">Handcraft Corporate Invoice Block</h3>
            <p className="text-xs text-slate-500">Append raw commercial billing matrices directly into internal memory arrays.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Client Business Title</label>
              <input
                type="text" required value={clientName} onChange={e => setClientName(e.target.value)}
                placeholder="e.g., GGITS Operations Inc."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Due Matrix Date</label>
              <input
                type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Dynamic Row Allocator Engine */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Itemized Transactions</span>
              <button
                type="button" onClick={handleAddLineItem}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-mono cursor-pointer"
              >
                + Append Row Allocation
              </button>
            </div>

            <div className="space-y-2">
              {lineItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 items-center bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                  <div className="col-span-6">
                    <input
                      type="text" required placeholder="Service Description / Deliverable Node"
                      value={item.desc} onChange={e => handleItemChange(item.id, 'desc', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number" min="1" required placeholder="Qty"
                      value={item.qty} onChange={e => handleItemChange(item.id, 'qty', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 text-center font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number" min="0" required placeholder="Rate (₹)"
                      value={item.rate || ''} onChange={e => handleItemChange(item.id, 'rate', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      type="button" onClick={() => handleRemoveLineItem(item.id)}
                      disabled={lineItems.length === 1}
                      className="text-slate-600 hover:text-rose-400 disabled:opacity-30 disabled:hover:text-slate-600 text-xs cursor-pointer"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mathematical Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-900">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Tax Matrix Configuration (%)</label>
              <input
                type="number" min="0" max="100" value={taxRate} onChange={e => setTaxRate(e.target.value)}
                className="w-32 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-900 font-mono text-xs space-y-2 text-slate-400">
              {(() => {
                const { subtotal, taxAmount, total } = calculateInvoiceMetrics(lineItems, taxRate);
                return (
                  <>
                    <div className="flex justify-between"><span>Subtotal Architecture:</span><span className="text-slate-200">₹{subtotal.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between"><span>Computed Tax Aggregates ({taxRate}%):</span><span className="text-slate-200">₹{taxAmount.toLocaleString('en-IN')}</span></div>
                    <div className="flex justify-between border-t border-slate-900 pt-2 text-sm font-bold">
                      <span className="text-indigo-400">Grand Financial Matrix:</span>
                      <span className="text-emerald-400">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
            <button
              type="button" onClick={() => setIsCreateMode(false)}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-slate-400 rounded-xl text-xs font-medium cursor-pointer"
            >
              Cancel Allocation
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold tracking-wide cursor-pointer"
            >
              Commit Invoice Node
            </button>
          </div>
        </form>
      )}

      {/* High-Fidelity Viewing Workspace & Print Sandbox */}
      {viewingInvoice && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="flex justify-between items-center bg-[#0d1321] border border-slate-900 p-4 rounded-xl no-print">
            <button
              onClick={() => setViewingInvoice(null)}
              className="text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
            >
              ← Close Sandbox View
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              🖨️ Fire Browser Print Layer
            </button>
          </div>

          {/* Absolute Isolated Printable Layout Container */}
          <div id="printable-invoice-area" className="bg-[#0c101b] border border-slate-900 rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-900 pb-6">
              <div>
                <h2 className="text-lg font-bold text-white tracking-wide">VANTEX SOLUTIONS</h2>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">Automated Node Infrastructure Statement</p>
              </div>
              <div className="text-right font-mono">
                <div className="text-sm font-bold text-indigo-400">{viewingInvoice.id}</div>
                <div className="text-[10px] text-slate-500 mt-1">Issued: {viewingInvoice.date}</div>
                <div className="text-[10px] text-slate-400 font-bold">Due: {viewingInvoice.dueDate}</div>
              </div>
            </div>

            <div className="my-6">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Target Bill-To Entity</span>
              <div className="text-sm font-semibold text-slate-200">{viewingInvoice.client}</div>
            </div>

            {/* Print Table */}
            <table className="w-full text-left border-collapse my-6">
              <thead>
                <tr className="border-b border-slate-900 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-2">Operational Node / Deliverable Description</th>
                  <th className="py-2 text-center">Quantity</th>
                  <th className="py-2 text-right">Unit Rate</th>
                  <th className="py-2 text-right">Net Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/40 text-xs text-slate-300">
                {viewingInvoice.items.map(item => (
                  <tr key={item.id}>
                    <td className="py-3 font-medium text-slate-200">{item.desc}</td>
                    <td className="py-3 text-center font-mono">{item.qty}</td>
                    <td className="py-3 text-right font-mono">₹{item.rate.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-right font-mono text-slate-100">₹{(item.qty * item.rate).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end border-t border-slate-900 pt-4 font-mono text-xs">
              <div className="w-64 space-y-2 text-slate-400">
                {(() => {
                  const { subtotal, taxAmount, total } = calculateInvoiceMetrics(viewingInvoice.items, viewingInvoice.taxRate);
                  return (
                    <>
                      <div className="flex justify-between"><span>Subtotal Allocation:</span><span className="text-slate-200">₹{subtotal.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between"><span>Computed GST ({viewingInvoice.taxRate}%):</span><span className="text-slate-200">₹{taxAmount.toLocaleString('en-IN')}</span></div>
                      <div className="flex justify-between border-t border-slate-900 pt-2 text-sm font-bold">
                        <span className="text-indigo-400">Total Obligation:</span>
                        <span className="text-emerald-400">₹{total.toLocaleString('en-IN')}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-slate-900/60 text-[10px] font-mono text-slate-600 text-center">
              System-generated via Vantex Nexus Architecture. No physical authentication signature required.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}