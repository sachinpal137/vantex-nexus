import React, { useState, useMemo } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import MetricsGrid from './components/MetricsGrid';
import AnalyticsChart from './components/AnalyticsChart';
import TaskKanban from './components/TaskKanban'; // Day 3 Pipeline Engine
import InvoiceVault from './components/InvoiceVault'; // Day 4 Billing Engine
import ExpenseMatrix from './components/ExpenseMatrix'; // Day 5 Financial Engine Added
import ClientHub from './components/ClientHub'; // Day 6 CRM Engine Added
import SettingsHub from './components/SettingsHub'; // 👈 Day 7 Data Management Added

export default function App() {
  // Global view state to manage workspace toggling
  // Supported States: 'dashboard' | 'kanban' | 'invoices' | 'expenses' | 'clients' | 'settings'
  const [currentView, setCurrentView] = useState('dashboard');

  // 🔄 Day 4 & Day 5 Data Bridge: Live Revenue calculation from localStorage
  const totalPaidRevenue = useMemo(() => {
    try {
      // Day 4 me jis key se invoices save kiye the (e.g., 'vantex_invoices' ya 'invoices') use fetch karo
      const savedInvoices = localStorage.getItem('vantex_invoices') || localStorage.getItem('invoices');
      if (!savedInvoices) return 75000; // Fallback dummy data agar koi invoice na mile
      
      const invoicesList = JSON.parse(savedInvoices);
      // Sirf 'Paid' status wale invoices ka total filter out aur sum karo
      return invoicesList
        .filter(inv => inv.status === 'Paid' || inv.status === 'paid')
        .reduce((sum, inv) => sum + Number(inv.amount), 0);
    } catch (e) {
      console.error("Error bridging invoice revenue to Expense Matrix:", e);
      return 75000; // Safe fallback on parse error
    }
  }, [currentView]); // Recalculates when user switches views to guarantee fresh calculations

  return (
    <DashboardLayout currentView={currentView} onViewChange={setCurrentView}>
      
      {/* 1. OVERVIEW DASHBOARD STREAM */}
      {currentView === 'dashboard' && (
        <>
          {/* Top Welcome Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">Workspace Overview</h1>
            <p className="text-sm text-slate-400 mt-1">Welcome back, Sachin. Here's what's happening with Vantex operations today.</p>
          </div>

          {/* Dynamic Analytical Widgets Section */}
          <MetricsGrid />

          {/* Interactive Chart Engine Section */}
          <AnalyticsChart />
        </>
      )}

      {/* 2. TASK KANBAN PIPELINE STREAM */}
      {currentView === 'kanban' && <TaskKanban />}

      {/* 3. INVOICE VAULT TRANSACTION STREAM */}
      {currentView === 'invoices' && <InvoiceVault />}

      {/* 4. EXPENSE MATRIX & ANALYTICS STREAM */}
      {currentView === 'expenses' && (
        <ExpenseMatrix totalInvoiceRevenue={totalPaidRevenue} />
      )}

      {/* 5. CLIENT HUB (MINI CRM) STREAM */}
      {currentView === 'clients' && <ClientHub />}

      {/* 6. SETTINGS & DATA HUB STREAM 👈 Day 7 Integration */}
      {currentView === 'settings' && <SettingsHub />}

    </DashboardLayout>
  );
}