import React, { useState, useEffect } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import MetricsGrid from './components/MetricsGrid';
import AnalyticsChart from './components/AnalyticsChart';
import TaskKanban from './components/TaskKanban'; 
import InvoiceVault from './components/InvoiceVault'; 
import ExpenseMatrix from './components/ExpenseMatrix'; 
import ClientHub from './components/ClientHub'; 
import SettingsHub from './components/SettingsHub'; 

const API_BASE_URL = 'https://vantex-nexus-backend.onrender.com';

export default function App() {
  // Global view state to manage workspace toggling
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Live Revenue State
  const [totalPaidRevenue, setTotalPaidRevenue] = useState(75000); // Default fallback

  // Fetch live invoices from Cloud DB when user switches to 'expenses' view
  useEffect(() => {
    if (currentView === 'expenses' || currentView === 'dashboard') {
      const fetchLiveRevenue = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/invoices`);
          if (response.ok) {
            const invoicesList = await response.json();
            
            // Filter only 'Paid' status and sum amounts
            const calculatedTotal = invoicesList
              .filter(inv => inv.status === 'Paid' || inv.status === 'paid')
              .reduce((sum, inv) => sum + Number(inv.amount), 0);
              
            // Update state (agar 0 hai toh original hi dikhao varna real dikhao)
            if (calculatedTotal > 0) {
               setTotalPaidRevenue(calculatedTotal);
            }
          }
        } catch (error) {
          console.error("Error fetching live revenue for Expense Matrix:", error);
        }
      };
      
      fetchLiveRevenue();
    }
  }, [currentView]);

  return (
    <DashboardLayout currentView={currentView} onViewChange={setCurrentView}>
      
      {/* 1. OVERVIEW DASHBOARD STREAM */}
      {currentView === 'dashboard' && (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">Workspace Overview</h1>
            <p className="text-sm text-slate-400 mt-1">Welcome back, Sachin. Here's what's happening with Vantex operations today.</p>
          </div>
          <MetricsGrid />
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

      {/* 6. SETTINGS & DATA HUB STREAM */}
      {currentView === 'settings' && <SettingsHub />}

    </DashboardLayout>
  );
}