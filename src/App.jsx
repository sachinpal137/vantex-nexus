import React from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import MetricsGrid from './components/MetricsGrid';

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

      {/* Main Feature Content Placeholder (Next up: Graphs & Pipelines) */}
      <div className="border border-dashed border-slate-800/80 rounded-xl h-[45vh] flex flex-col items-center justify-center bg-slate-900/10 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-slate-300 mb-1">Project Pipelines & Chart Engine</h3>
        <p className="text-slate-500 text-xs max-w-xs text-center">
          Ready to inject the interactive revenue charts and dynamic Kanban drag-drop boards.
        </p>
      </div>
    </DashboardLayout>
  );
}