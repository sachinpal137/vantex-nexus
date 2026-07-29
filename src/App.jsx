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
  const [currentView, setCurrentView] = useState('dashboard');
  
  // FIX 1: Initial value ko 75000 se hata kar 0 kar diya
  const [totalPaidRevenue, setTotalPaidRevenue] = useState(0); 

  useEffect(() => {
    if (currentView === 'expenses' || currentView === 'dashboard') {
      const fetchLiveRevenue = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/invoices`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-admin-secret': import.meta.env.VITE_ADMIN_PIN
            }
          });
          if (response.ok) {
            const invoicesList = await response.json();
            const calculatedTotal = invoicesList
              .filter(inv => inv.status === 'Paid' || inv.status === 'paid')
              .reduce((sum, inv) => sum + Number(inv.amount), 0);
              
            // FIX 2: Yahan se 'if' condition hata di, ab agar total 0 hoga toh 0 hi set hoga
            setTotalPaidRevenue(calculatedTotal);
          }
        } catch (error) {
          console.error("Error fetching live revenue:", error);
        }
      };
      
      fetchLiveRevenue();
    }
  }, [currentView]);

  return (
    <DashboardLayout currentView={currentView} onViewChange={setCurrentView}>
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
      {currentView === 'kanban' && <TaskKanban />}
      {currentView === 'invoices' && <InvoiceVault />}
      {currentView === 'expenses' && <ExpenseMatrix totalInvoiceRevenue={totalPaidRevenue} />}
      {currentView === 'clients' && <ClientHub />}
      {currentView === 'settings' && <SettingsHub />}
    </DashboardLayout>
  );
}