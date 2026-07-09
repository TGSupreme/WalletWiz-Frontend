import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { 
  TrendingUp, 
  Calendar, 
  PieChart, 
  Activity, 
  ChevronDown, 
  AlertCircle 
} from 'lucide-react';

const CATEGORY_COLORS = {
  "Food & Dining": "#8b5cf6", // Violet
  "Shopping": "#0ea5e9", // Sky
  "Travel & Transport": "#f59e0b", // Amber
  "Bills & Utilities": "#f43f5e", // Rose
  "Entertainment": "#6366f1", // Indigo
  "Health & Medical": "#10b981", // Emerald
  "Others": "#64748b" // Slate
};

const CATEGORY_COLORS_BG = {
  "Food & Dining": "bg-violet-500",
  "Shopping": "bg-sky-500",
  "Travel & Transport": "bg-amber-500",
  "Bills & Utilities": "bg-rose-500",
  "Entertainment": "bg-indigo-500",
  "Health & Medical": "bg-emerald-500",
  "Others": "bg-slate-500"
};

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('this-month');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyticsAPI.getDashboard(timeframe);
      setData(response);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError(err.message || 'Failed to retrieve analytics reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  // Parse category data and filter out zero values or dummy index labels ("0", "1")
  const activeCategoryData = data?.by_category
    ? Object.keys(data.by_category)
        .map(cat => {
          const total = parseFloat(data.by_category[cat]) || 0;
          const overallTotal = parseFloat(data.total_spent) || 1;
          return {
            category: cat,
            total: total,
            percentage: Math.round((total / overallTotal) * 100)
          };
        })
        .filter(c => c.total > 0 && c.category !== "0" && c.category !== "1")
        .sort((a, b) => b.total - a.total)
    : [];

  // Determine if backend response contains zero valid spend data or is completely empty
  const isEmpty = !data || 
                  activeCategoryData.length === 0 || 
                  (parseFloat(data.total_spent) || 0) === 0 ||
                  (data.transaction_count || 0) === 0;

  // Active Spending Trends Calculations
  const activeTrendData = data?.daily_trends && data.daily_trends.length > 0
    ? data.daily_trends
    : [];

  const totalSpent = !isEmpty ? (parseFloat(data?.total_spent) || 0) : 0;
  const transactionCount = !isEmpty ? (data?.transaction_count || 0) : 0;
  const dailyAverage = !isEmpty ? (totalSpent / (timeframe === 'this-year' ? 365 : 30)) : 0;

  // SVG Donut Calculations
  let accumulatedPercentage = 0;
  const donutRadius = 38;
  const donutCircumference = 2 * Math.PI * donutRadius; // ~238.76

  // SVG Area Trend Line Calculations
  const chartHeight = 80;
  const chartWidth = 300;
  const maxTrendVal = activeTrendData.length > 0 
    ? Math.max(...activeTrendData.map(d => parseFloat(d.total) || 0), 1)
    : 1;
  
  const points = activeTrendData.map((d, index) => {
    const totalVal = parseFloat(d.total) || 0;
    const x = (index / (activeTrendData.length - 1)) * chartWidth;
    const y = chartHeight - ((totalVal / maxTrendVal) * (chartHeight - 20)) - 10;
    return { x, y, date: d.date, total: totalVal };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${chartHeight} L ${points[0].x.toFixed(1)} ${chartHeight} Z`
    : '';

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-bg-dark transition-colors duration-300">
      
      {/* Timeframe Selector Sub-Header */}
      <div className="bg-white dark:bg-card-dark border-b border-slate-100 dark:border-border-dark px-6 py-3.5 flex items-center justify-between shrink-0">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-violet-500" />
          Spend Analytics
        </span>

        {/* Custom Select Trigger */}
        <div className="relative">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-border-dark rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer focus:border-violet-500"
          >
            <option value="this-month">This Month</option>
            <option value="last-30-days">Last 30 Days</option>
            <option value="this-year">This Year</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Main Content Dashboard */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {loading ? (
          /* Loading Indicator */
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-8 h-8 border-3 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">Synthesizing charts...</p>
          </div>
        ) : error ? (
          /* Error Banner */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="w-10 h-10 text-rose-500 mb-2" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{error}</p>
            <button 
              onClick={fetchAnalytics}
              className="mt-3 px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium"
            >
              Retry
            </button>
          </div>
        ) : isEmpty ? (
          /* High-Fidelity Empty State Card */
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="w-16 h-16 bg-violet-500/10 text-violet-500 rounded-2xl flex items-center justify-center mb-4">
              <PieChart className="w-8 h-8" />
            </div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">No spending data logged yet</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-[240px] mt-1.5 leading-normal">
              We couldn't find any transactions for the selected timeframe. Log an expense in the chat window to begin!
            </p>
          </div>
        ) : (
          <>
            {/* KPI Metrics Dashboard Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Card: Total Spent */}
              <div className="col-span-2 bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-3xl p-5 shadow-lg shadow-violet-500/10">
                <span className="text-[10px] text-violet-100 font-bold uppercase tracking-wider">Total Outflow</span>
                <h2 className="text-2xl font-black mt-1">₹{totalSpent.toFixed(2)}</h2>
                <div className="flex items-center gap-1.5 text-[10px] text-violet-100 mt-2 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
                  Across {transactionCount} logged events
                </div>
              </div>

              {/* Card: Daily Average */}
              <div className="bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark rounded-3xl p-4 shadow-2xs">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Daily Avg</span>
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-1">₹{dailyAverage.toFixed(2)}</h3>
              </div>

              {/* Card: Trans count */}
              <div className="bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark rounded-3xl p-4 shadow-2xs">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Volume</span>
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-1">{transactionCount} logs</h3>
              </div>
            </div>

            {/* Visual Section: Spending Trend Line Graph */}
            {points.length > 0 && (
              <div className="bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark rounded-3xl p-5 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-violet-500" />
                  Spending Velocity Trend
                </h4>

                {/* Custom SVG Line Chart */}
                <div className="w-full h-32 flex items-end">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-24 overflow-visible">
                    <defs>
                      <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid Lines */}
                    <line x1="0" y1={chartHeight - 10} x2={chartWidth} y2={chartHeight - 10} stroke="#94a3b8" strokeOpacity="0.1" strokeWidth="1" />
                    <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="#94a3b8" strokeOpacity="0.1" strokeWidth="1" />
                    <line x1="0" y1="10" x2={chartWidth} y2="10" stroke="#94a3b8" strokeOpacity="0.1" strokeWidth="1" />

                    {/* Shaded Area */}
                    {areaPath && <path d={areaPath} fill="url(#area-grad)" />}
                    
                    {/* Trend Path Line */}
                    {linePath && <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
                    
                    {/* Interactive Points */}
                    {points.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r="3" fill="#8b5cf6" stroke="#ffffff" strokeWidth="1.5" className="hover:scale-150 transition-all cursor-crosshair" />
                    ))}
                  </svg>
                </div>

                {/* Chart X-Axis Labels */}
                <div className="flex justify-between px-1 mt-2 text-[9px] text-slate-400 dark:text-slate-500 font-semibold uppercase">
                  {points.map((p, idx) => (
                    <span key={idx} className="w-8 text-center truncate">{p.date}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Visual Section: Category Breakdown Donut */}
            <div className="bg-white dark:bg-card-dark border border-slate-100 dark:border-border-dark rounded-3xl p-5 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-1">
                <PieChart className="w-4 h-4 text-violet-500" />
                Category Distribution
              </h4>

              <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-around">
                {/* SVG Donut Visual */}
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {/* Background Ring */}
                    <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="#f1f5f9" strokeWidth="9" className="dark:stroke-slate-800" />
                    
                    {/* Color Segments */}
                    {activeCategoryData.map((c, index) => {
                      const segmentLength = (c.percentage / 100) * donutCircumference;
                      const segmentOffset = donutCircumference - segmentLength;
                      const currentAccumulatedOffset = (accumulatedPercentage / 100) * donutCircumference;
                      
                      accumulatedPercentage += c.percentage;
                      const strokeColor = CATEGORY_COLORS[c.category] || '#64748b';

                      return (
                        <circle
                          key={index}
                          cx="50"
                          cy="50"
                          r={donutRadius}
                          fill="transparent"
                          stroke={strokeColor}
                          strokeWidth="9.5"
                          strokeDasharray={donutCircumference}
                          strokeDashoffset={currentAccumulatedOffset}
                          className="transition-all duration-500"
                        />
                      );
                    })}
                  </svg>
                  
                  {/* Center Text label */}
                  <div className="absolute text-center">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block uppercase leading-none">Share</span>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100 mt-0.5 block leading-none">100%</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="flex-1 w-full space-y-2.5">
                  {activeCategoryData.map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${CATEGORY_COLORS_BG[c.category] || 'bg-slate-500'}`}></span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{c.category}</span>
                      </div>
                      <div className="text-right font-bold text-slate-800 dark:text-slate-100">
                        ₹{c.total.toFixed(0)} <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium ml-1">({c.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
        
      </div>
    </div>
  );
}
