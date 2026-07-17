import React, { useState } from 'react';

export default function AnalyticsChart() {
  const [timeframe, setTimeframe] = useState('6M');

  const revenueData = [
    { month: 'Jan', revenue: 120000 },
    { month: 'Feb', revenue: 190000 },
    { month: 'Mar', revenue: 310000 },
    { month: 'Apr', revenue: 280000 },
    { month: 'May', revenue: 420000 },
    { month: 'Jun', revenue: 485000 },
  ];

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-6 rounded-xl shadow-xl">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Revenue Analytics</h3>
          <p className="text-xs text-slate-400 mt-0.5">Monthly billing and income velocity growth.</p>
        </div>
        
        {/* Timeframe Toggles */}
        <div className="flex bg-slate-800/40 border border-slate-800 p-1 rounded-lg text-xs font-medium">
          {['1M', '3M', '6M', '1Y'].map((item) => (
            <button
              key={item}
              onClick={() => setTimeframe(item)}
              className={`px-3 py-1.5 rounded-md transition-all duration-200 ${
                timeframe === item 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Engine */}
      <div className="relative w-full h-64 pt-4">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(79, 70, 229)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="rgb(79, 70, 229)" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          <line x1="0" y1="0" x2="600" y2="0" stroke="rgba(51, 65, 85, 0.15)" strokeDasharray="4" />
          <line x1="0" y1="66" x2="600" y2="66" stroke="rgba(51, 65, 85, 0.15)" strokeDasharray="4" />
          <line x1="0" y1="133" x2="600" y2="133" stroke="rgba(51, 65, 85, 0.15)" strokeDasharray="4" />
          <line x1="0" y1="200" x2="600" y2="200" stroke="rgba(51, 65, 85, 0.3)" />

          {/* Area Path */}
          <path
            d="M 0,200 L 0,160 L 120,138 L 240,98 L 360,108 L 480,62 L 600,40 L 600,200 Z"
            fill="url(#chartGradient)"
          />

          {/* Core Vector Trendline */}
          <path
            d="M 0,160 L 120,138 L 240,98 L 360,108 L 480,62 L 600,40"
            fill="none"
            stroke="rgb(99, 102, 241)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Pulse Data Nodes */}
          {[
            {cx: 0, cy: 160}, {cx: 120, cy: 138}, {cx: 240, cy: 98},
            {cx: 360, cy: 108}, {cx: 480, cy: 62}, {cx: 600, cy: 40}
          ].map((point, i) => (
            <g key={i} className="cursor-pointer group/node">
              <circle cx={point.cx} cy={point.cy} r="5" fill="rgb(99, 102, 241)" stroke="rgb(15, 23, 42)" strokeWidth="2" />
              <circle cx={point.cx} cy={point.cy} r="9" fill="rgb(99, 102, 241)" className="opacity-0 group-hover/node:opacity-20 transition-opacity duration-200" />
            </g>
          ))}
        </svg>
      </div>

      {/* X-Axis Month Labels */}
      <div className="flex justify-between items-center mt-3 px-1 text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
        {revenueData.map((data, idx) => (
          <span key={idx}>{data.month}</span>
        ))}
      </div>
    </div>
  );
}