import React from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import MetricsGrid from './components/MetricsGrid';
import AnalyticsChart from './components/AnalyticsChart';

export default function App() {
  return (
    <DashboardLayout>
      {/* Top Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Workspace Overview</h1>
        <p className="text-sm text-slate-400 mt-1">Welcome back, Sachin. Here's what's happening with Vantex operations today.</p>
      </div>

      {/* Dynamic Analytical Widgets Section */}
      <MetricsGrid />

      {/* Interactive Chart Engine Section */}
      <AnalyticsChart />
    </DashboardLayout>
  );
}