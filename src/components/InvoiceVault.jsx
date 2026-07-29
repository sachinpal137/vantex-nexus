import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://vantex-nexus-backend.onrender.com';

export default function InvoiceVault() {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [clientName, setClientName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [taxRate, setTaxRate] = useState(18);
  const [lineItems, setLineItems] = useState([{ id: '1', desc: '', qty: 1, rate: 0 }]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // FIX: Removed headers & x-admin-secret from GET request
        const response = await fetch(`${API_BASE_URL}/invoices`);
        
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error(`Server returned status ${response.status} or non-JSON response`);
        }

        const data = await response.json();
        setInvoices(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch cloud invoices:", error);
        setInvoices([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const calculateInvoiceMetrics = (items, taxPercent) => {
    let safeItems = [];
    if (Array.isArray(items)) {
      safeItems = items;
    } else if (typeof items === 'string') {
      try { safeItems = JSON.parse(items); } catch (e) { safeItems = []; }
    }
    const subtotal = safeItems.reduce((acc, item) => acc + ((item.qty || 0) * (item.rate || 0)), 0);
    const validTaxPercent = Number(taxPercent) || 0;
    const taxAmount = Math.round(subtotal * (validTaxPercent / 100));
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total, safeItems };
  };

  const safeInvoicesArray = Array.isArray(invoices) ? invoices : [];
  const stats = safeInvoicesArray.reduce((acc, inv) => {
    const { total } = calculateInvoiceMetrics(inv.items, inv.taxRate);
    if (inv.status === 'Paid') acc.paid += total;
    else if (inv.status === 'Pending') acc.pending += total;
    acc.totalVolume += total;
    return acc;
  }, { paid: 0, pending: 0, totalVolume: 0 });

  const handleAddLineItem = () => setLineItems([...lineItems, { id: String(Date.now()), desc: '', qty: 1, rate: 0 }]);
  const handleRemoveLineItem = (id) => { if (lineItems.length > 1) setLineItems(lineItems.filter(item => item.id !== id)); };
  const handleItemChange = (id, field, value) => {
    setLineItems(lineItems.map(item => item.id === id ? { ...item, [field]: field === 'desc' ? value : Number(value) } : item));
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!clientName || !dueDate || lineItems.some(i => !i.desc || i.rate <= 0)) return;

    // FIX: Dynamic PIN prompt
    const adminPin = window.prompt("🔒 Admin PIN required to Create Invoice:");
    if (!adminPin) return;

    setIsSubmitting(true);
    const { total } = calculateInvoiceMetrics(lineItems, taxRate);

    const newInvoice = {
      invoiceNumber: `INV-2026-${String(safeInvoicesArray.length + 1).padStart(3, '0')}`,
      client: clientName,
      date: new Date().toISOString().split('T')[0],
      dueDate: dueDate,
      status: 'Pending',
      items: lineItems,
      taxRate: Number(taxRate),
      amount: total
    };

    try {
      const response = await fetch(`${API_BASE_URL}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': adminPin // Passing prompt PIN
        },
        body: JSON.stringify(newInvoice),
      });

      if (response.ok) {
        const savedInvoice = await response.json();
        setInvoices([savedInvoice, ...safeInvoicesArray]);
        setClientName(''); setDueDate(''); setLineItems([{ id: '1', desc: '', qty: 1, rate: 0 }]);
        setIsCreateMode(false);
      } else {
        alert("❌ Unauthorized! Failed to save invoice.");
      }
    } catch (error) {
      console.error("Cloud Error:", error);
      alert("❌ Network error while saving invoice.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerNativePrint = (inv) => {
    setViewingInvoice(inv);
    setTimeout(() => { window.print(); }, 50);
  };

  const filteredInvoices = safeInvoicesArray.filter(inv => {
    const matchesSearch = String(inv.client || '').toLowerCase().includes(searchQuery.toLowerCase()) || String(inv.invoiceNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="text-slate-100 bg-slate-950/20 min-h-screen pb-12 animate-in fade-in duration-500">
      <style>{`
        @media print {
          aside, header, .no-print { display: none !important; }
          html, body, main, #root, .min-h-screen, .flex-1 { height: auto !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; background: #ffffff !important; box-shadow: none !important; }
          #printable-invoice-area { display: block !important; position: static !important; width: 100% !important; max-width: 100% !important; background: #ffffff !important; border: none !important; box-shadow: none !important; padding: 12mm !important; margin: 0 !important; }
          #printable-invoice-area * { color: #000000 !important; background: transparent !important; }
          #printable-invoice-area .text-indigo-400, #printable-invoice-area .text-emerald-400 { color: #000000 !important; font-weight: 800 !important; }
          #printable-invoice-area .border-slate-900, #printable-invoice-area .divide-slate-900, #printable-invoice-area .divide-slate-900\\/40 { border-color: #cbd5e1 !important; }
        }
      `}</style>

      {/* Same render UI code for the rest of Invoice Vault... (Sirf logic functions me changes the) */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 no-print">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Invoice Vault Engine</h1>
          <p className="text-sm text-slate-400 mt-1">Live cloud multi-tenant billing engine.</p>
        </div>
        <button onClick={() => { setIsCreateMode(!isCreateMode); setViewingInvoice(null); }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer">
          {isCreateMode ? '← Back to Ledger' : '+ Generate Invoice Block'}
        </button>
      </div>
      
      {/* BAQI PURA SAME HAI... (Aage ka render part wahi rahega jo tumhara tha) */}
      {/* Note: Paste your original render logic for tables and forms here as it requires no logic change! */}
      <p className="text-slate-500 text-xs text-center border-t border-slate-800 pt-10 mt-10">UI logic remains exactly the same below this line</p>
    </div>
  );
}