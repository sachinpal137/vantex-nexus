import React, { useState, useEffect } from 'react';

export default function AnalyticsChart() {
  const [timeframe, setTimeframe] = useState('6M');
  const [isLoading, setIsLoading] = useState(false);
  
  // Abhi ke liye ye initial state hai, baad me API ise update karegi
  const [revenueData, setRevenueData] = useState([
    { month: 'Jan', revenue: 120000 },
    { month: 'Feb', revenue: 190000 },
    { month: 'Mar', revenue: 310000 },
    { month: 'Apr', revenue: 280000 },
    { month: 'May', revenue: 420000 },
    { month: 'Jun', revenue: 485000 },
  ]);

  /* 
   ========================================================
   🚀 DYNAMIC SVG CHART ENGINE (Auto-scales based on Data)
   ========================================================
  */
  // 1. Sabse highest revenue dhundo taaki graph limit se bahar na jaye
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue)) || 1; 
  const chartWidth = 600;
  const chartHeight = 160; // 200 total height me se padding adjust ki hai

  // 2. Har mahine ke data point ke liye X aur Y coordinates calculate karo
  const points = revenueData.map((data, index) => {
    const x = (index / (revenueData.length - 1)) * chartWidth;
    // SVG me Y-axis upar se neeche badhta hai, isliye invert kiya hai
    const y = 200 - ((data.revenue / maxRevenue) * chartHeight); 
    return { x, y, month: data.month, revenue: data.revenue };
  });

  // 3. SVG Path ki string dynamically generate karo
  const linePath = points.length > 0 ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}` : '';
  const areaPath = points.length > 0 ? `${linePath} L ${chartWidth},200 L 0,200 Z` : '';

  /*
  // Yahan aapka future API call aayega jo timeframe change hone par naya data layega
  useEffect(() => {
    setIsLoading(true);
    // fetch(`http://localhost:3000/api/revenue?range=${timeframe}`)
    //  .then(...)
  }, [timeframe]);
  */

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

          {/* Dynamic Area Path */}
          <path
            d={areaPath}
            fill="url(#chartGradient)"
            className="transition-all duration-500 ease-in-out"
          />

          {/* Dynamic Core Vector Trendline */}
          <path
            d={linePath}
            fill="none"
            stroke="rgb(99, 102, 241)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500 ease-in-out"
          />

          {/* Dynamic Active Pulse Data Nodes */}
          {points.map((point, i) => (
            <g key={i} className="cursor-pointer group/node">
              <circle 
                cx={point.x} 
                cy={point.y} 
                r="5" 
                fill="rgb(99, 102, 241)" 
                stroke="rgb(15, 23, 42)" 
                strokeWidth="2" 
                className="transition-all duration-500 ease-in-out"
              />
              <circle 
                cx={point.x} 
                cy={point.y} 
                r="9" 
                fill="rgb(99, 102, 241)" 
                className="opacity-0 group-hover/node:opacity-20 transition-all duration-200" 
              />
              {/* Optional Hover Tooltip Logic can go here */}
            </g>
          ))}
        </svg>
      </div>

      {/* Dynamic X-Axis Month Labels */}
      <div className="flex justify-between items-center mt-3 px-1 text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
        {revenueData.map((data, idx) => (
          <span key={idx}>{data.month}</span>
        ))}
      </div>
    </div>
  );
}