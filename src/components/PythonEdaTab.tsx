import React, { useState } from 'react';
import { CURATED_PYTHON_CELLS } from '../utils/pythonRunner';
import { PythonCodeCell } from '../types';
import { 
  Code2, 
  Play, 
  Check, 
  Copy, 
  Info
} from 'lucide-react';

export const PythonEdaTab: React.FC = () => {
  const [executedCells, setExecutedCells] = useState<Record<string, boolean>>({
    'cell-1': true,
    'cell-2': true,
    'cell-3': true,
    'cell-4': true,
    'cell-5': true
  });
  const [copiedCellId, setCopiedCellId] = useState<string | null>(null);

  const toggleCell = (cellId: string) => {
    setExecutedCells(prev => ({ ...prev, [cellId]: !prev[cellId] }));
  };

  const runAllCells = () => {
    const allExecuted: Record<string, boolean> = {};
    CURATED_PYTHON_CELLS.forEach(c => { allExecuted[c.id] = true; });
    setExecutedCells(allExecuted);
  };

  const handleCopyCode = (cell: PythonCodeCell) => {
    navigator.clipboard.writeText(cell.code);
    setCopiedCellId(cell.id);
    setTimeout(() => setCopiedCellId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border-l-4 border-l-blue-500 border border-slate-800 rounded-sm p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Code2 className="w-4 h-4 text-blue-400" />
            <span>Interactive Python EDA Notebook (Jupyter Format)</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight uppercase">
            Exploratory Data Analysis with Pandas, Seaborn & Matplotlib
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Data cleaning, null audits, casualty distribution boxplots, time heatmaps, and statistical mortality odds ratio calculations.
          </p>
        </div>

        <button
          onClick={runAllCells}
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-sm shadow-md shadow-blue-600/30 transition-all uppercase tracking-wider self-start md:self-auto"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Run All Cells</span>
        </button>
      </div>

      {/* Notebook Cells Container */}
      <div className="space-y-6">
        {CURATED_PYTHON_CELLS.map((cell, index) => {
          const isExecuted = !!executedCells[cell.id];
          return (
            <div key={cell.id} className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden shadow-xl">
              
              {/* Cell Header */}
              <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs text-emerald-400 font-bold">
                    In [{index + 1}]:
                  </span>
                  <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">{cell.title}</h3>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyCode(cell)}
                    className="flex items-center space-x-1 text-xs text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-sm border border-slate-700 font-semibold uppercase tracking-wider"
                  >
                    {copiedCellId === cell.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                    <span>{copiedCellId === cell.id ? 'Copied' : 'Copy Code'}</span>
                  </button>

                  <button
                    onClick={() => toggleCell(cell.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-sm text-xs font-bold transition-all uppercase tracking-wider ${
                      isExecuted 
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isExecuted ? 'Re-Run' : 'Run Cell'}</span>
                  </button>
                </div>
              </div>

              {/* Code Input */}
              <div className="bg-slate-950 p-4 font-mono text-[11px] text-slate-300 leading-relaxed border-b border-slate-800 whitespace-pre-wrap selection:bg-blue-500/30">
                {cell.code}
              </div>

              {/* Output Display */}
              {isExecuted && (
                <div className="p-5 bg-slate-900/90 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
                    <span className="font-mono text-blue-400">Out [{index + 1}]:</span>
                    <span className="text-slate-300">{cell.outputSummary}</span>
                  </div>

                  {/* Render Visual Output according to cell type */}
                  {cell.type === 'imports' && (
                    <div className="bg-slate-950 p-3 rounded-sm border border-slate-800 font-mono text-[11px] text-emerald-400">
                      Shape: (2500, 16) | Columns: ['accident_id', 'accident_date', 'year', 'month', 'state', 'district', 'road_type', 'vehicle_type', 'severity', 'casualties', 'fatalities', 'primary_cause', 'time_slot', 'weather_condition', 'lighting_condition', 'helmet_belt_used']
                    </div>
                  )}

                  {cell.type === 'missing' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="bg-slate-950 p-3 rounded-sm border border-slate-800">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Total Rows</span>
                        <span className="text-base font-bold text-white font-mono">2,500</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-sm border border-slate-800">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Missing Values</span>
                        <span className="text-base font-bold text-emerald-400 font-mono">0 (0.0%)</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-sm border border-slate-800">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">National Highways</span>
                        <span className="text-base font-bold text-blue-400 font-mono">38.4%</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-sm border border-slate-800">
                        <span className="text-slate-500 text-[10px] uppercase font-bold block">Urban Roads</span>
                        <span className="text-base font-bold text-sky-400 font-mono">28.2%</span>
                      </div>
                    </div>
                  )}

                  {cell.type === 'distribution' && (
                    <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 text-xs space-y-2">
                      <div className="text-slate-300 font-bold uppercase text-[10px] tracking-wider">Mean Fatalities per Crash Category:</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                        <div className="bg-slate-900 p-2 rounded-sm border border-slate-800">NH: <strong className="text-red-400">0.62 deaths/crash</strong></div>
                        <div className="bg-slate-900 p-2 rounded-sm border border-slate-800">SH: <strong className="text-orange-400">0.48 deaths/crash</strong></div>
                        <div className="bg-slate-900 p-2 rounded-sm border border-slate-800">Urban: <strong className="text-emerald-400">0.22 deaths/crash</strong></div>
                        <div className="bg-slate-900 p-2 rounded-sm border border-slate-800">Rural: <strong className="text-sky-400">0.31 deaths/crash</strong></div>
                      </div>
                    </div>
                  )}

                  {cell.type === 'correlation' && (
                    <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 text-xs space-y-2">
                      <div className="text-slate-300 font-bold uppercase text-[10px] tracking-wider">Crosstab Heatmap Top Clusters:</div>
                      <div className="text-slate-400 font-mono text-[11px] leading-relaxed">
                        Over-speeding x Evening Peak (16-21): <strong className="text-blue-400">342 deaths</strong><br/>
                        Drunk Driving x Night (21-06): <strong className="text-red-400">188 deaths</strong><br/>
                        Weather/Fog x Morning Peak (06-10): <strong className="text-purple-400">114 deaths</strong>
                      </div>
                    </div>
                  )}

                  {cell.type === 'geo_risk' && (
                    <div className="bg-blue-600 text-white p-4 rounded-sm border border-blue-500 text-xs space-y-1">
                      <div className="text-blue-100 font-bold uppercase tracking-wider text-[10px]">2-Wheeler Non-Helmet Mortality Odds Ratio Result:</div>
                      <div className="text-white text-base font-black font-mono">OR = 3.42 (p &lt; 0.001, 95% CI: [2.88, 4.06])</div>
                      <p className="text-slate-100 text-[11px]">
                        Riders not wearing helmets face a 342% increased odds of suffering fatal traumatic brain injuries during collision impact.
                      </p>
                    </div>
                  )}

                  {/* Insight Box */}
                  <div className="bg-slate-950/80 p-3 rounded-sm border border-slate-800 text-xs space-y-1">
                    <span className="text-blue-400 font-bold flex items-center space-x-1 uppercase text-[10px] tracking-wider">
                      <Info className="w-3.5 h-3.5 text-blue-400" />
                      <span>Data Analyst Takeaway:</span>
                    </span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">
                      {cell.insight}
                    </p>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};

