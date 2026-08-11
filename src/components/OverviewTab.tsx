import React, { useState } from 'react';
import { 
  FileText, 
  Database, 
  Code2, 
  BarChart3, 
  ShieldCheck, 
  Copy, 
  Check, 
  Layers, 
  Terminal, 
  Sparkles,
  ArrowRight,
  BookOpen,
  Table
} from 'lucide-react';
import { getReadmeContent } from '../data/projectFiles';

interface OverviewTabProps {
  setActiveTab: (tab: string) => void;
  onOpenExportModal: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ setActiveTab, onOpenExportModal }) => {
  const [copied, setCopied] = useState(false);
  const readmeText = getReadmeContent();

  const handleCopyReadme = () => {
    navigator.clipboard.writeText(readmeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schemaColumns = [
    { name: 'accident_id', type: 'VARCHAR(20)', key: 'PK', desc: 'Unique identifier for each accident record (e.g. IND-ACC-100001).' },
    { name: 'accident_date', type: 'DATE', key: 'INDEX', desc: 'Timestamp of the crash instance for temporal trend modeling.' },
    { name: 'year / month', type: 'INT / VARCHAR', key: '-', desc: 'Derived calendar attributes for MoM and YoY time intelligence calculations.' },
    { name: 'state', type: 'VARCHAR(100)', key: 'INDEX', desc: 'State or Union Territory (e.g., Uttar Pradesh, Tamil Nadu, Maharashtra).' },
    { name: 'district', type: 'VARCHAR(100)', key: '-', desc: 'Local administrative region for highway blackspot identification.' },
    { name: 'road_type', type: 'ENUM', key: 'INDEX', desc: 'National Highway, State Highway, Urban Road, Rural Road.' },
    { name: 'vehicle_type', type: 'ENUM', key: '-', desc: '2-Wheeler, Car/SUV, Truck/Lorry, Bus, Auto-Rickshaw, Pedestrian.' },
    { name: 'severity', type: 'ENUM', key: 'INDEX', desc: 'Fatal, Severe Injury, Minor Injury, Non-Injury.' },
    { name: 'casualties', type: 'INT', key: '-', desc: 'Total number of injured or deceased individuals involved in the crash.' },
    { name: 'fatalities', type: 'INT', key: '-', desc: 'Total deaths resulting directly from the accident.' },
    { name: 'primary_cause', type: 'VARCHAR(100)', key: 'INDEX', desc: 'Over-speeding, Drunk Driving, Wrong-side Driving, Weather/Fog, Pothole.' },
    { name: 'time_slot', type: 'VARCHAR(50)', key: '-', desc: 'Morning Peak (06-10), Day (10-16), Evening Peak (16-21), Night (21-06).' },
    { name: 'weather_condition', type: 'VARCHAR(50)', key: '-', desc: 'Clear, Rainy, Dense Fog, Dust Storm.' },
    { name: 'helmet_belt_used', type: 'ENUM', key: '-', desc: 'Compliance flag (Yes/No) indicating if mandatory safety gear was active.' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="bg-slate-900 rounded-sm p-6 md:p-8 border-l-4 border-l-blue-500 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-sm text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>End-to-End Analytics Project Blueprint</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight uppercase leading-tight">
            India Road Safety Analytics Project
          </h2>

          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            A comprehensive, production-grade data analyst portfolio project based on India's Ministry of Road Transport and Highways (MoRTH) accident dataset (2018–2024). Explore the complete data pipeline—from <strong>MySQL relational queries</strong> and <strong>Python EDA notebooks</strong> to <strong>Power BI DAX measures</strong> and <strong>executive policy insights</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-sm text-xs transition-all shadow-md shadow-blue-600/30 uppercase tracking-wide"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Launch Power BI Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveTab('sql')}
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-2.5 rounded-sm text-xs transition-all uppercase tracking-wide"
            >
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Run MySQL Queries</span>
            </button>

            <button
              onClick={() => setActiveTab('python')}
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-2.5 rounded-sm text-xs transition-all uppercase tracking-wide"
            >
              <Code2 className="w-4 h-4 text-sky-400" />
              <span>View Python EDA Notebook</span>
            </button>
          </div>
        </div>
      </div>

      {/* End-to-End Project Architecture Pipeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center space-x-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>1. Project Architecture & Pipeline</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          
          {/* Step 1 */}
          <div className="bg-slate-950/70 p-4 border-l-2 border-blue-500 border border-slate-800 rounded-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-blue-400 font-mono font-bold mb-1">
                STAGE 01
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-tight mb-1">Data Extraction & Ingestion</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                MoRTH road accident data compilation & standardization across 15 Indian States and UTs.
              </p>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 px-2 py-1 rounded-sm border border-emerald-800/40">
              CSV • 2,500+ Records
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-950/70 p-4 border-l-2 border-blue-500 border border-slate-800 rounded-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-blue-400 font-mono font-bold mb-1">
                STAGE 02
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-tight mb-1">Data Warehousing</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                MySQL relational schema for persistent storage, indexing, window functions (DENSE_RANK, LAG).
              </p>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 px-2 py-1 rounded-sm border border-emerald-800/40">
              MySQL 8.0 • DDL & Queries
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-950/70 p-4 border-l-2 border-blue-500 border border-slate-800 rounded-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-blue-400 font-mono font-bold mb-1">
                STAGE 03
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-tight mb-1">Python EDA & Analytics</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Pandas cleaning, Seaborn correlation heatmaps, boxplots, and helmet risk odds ratios.
              </p>
            </div>
            <div className="text-[10px] text-sky-400 font-mono bg-sky-950/40 px-2 py-1 rounded-sm border border-sky-800/40">
              Python • Pandas • Seaborn
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-950/70 p-4 border-l-2 border-blue-500 border border-slate-800 rounded-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-blue-400 font-mono font-bold mb-1">
                STAGE 04
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-tight mb-1">BI Visualization</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Power BI star schema modeling, DAX measure library, interactive slicers, and executive visuals.
              </p>
            </div>
            <div className="text-[10px] text-amber-400 font-mono bg-amber-950/40 px-2 py-1 rounded-sm border border-amber-800/40">
              Power BI • DAX • Star Schema
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-950/70 p-4 border-l-2 border-blue-500 border border-slate-800 rounded-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-blue-400 font-mono font-bold mb-1">
                STAGE 05
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-tight mb-1">Policy & Action Report</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Actionable safety intervention policies for NHAI, speed governor enforcement, & emergency response.
              </p>
            </div>
            <div className="text-[10px] text-purple-400 font-mono bg-purple-950/40 px-2 py-1 rounded-sm border border-purple-800/40">
              MoRTH Strategy Brief
            </div>
          </div>

        </div>
      </div>

      {/* Dataset Schema Dictionary */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Table className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">2. Dataset Schema & Data Dictionary</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Table: <code className="text-blue-400">road_accidents_india</code></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-300 border-b border-slate-800 uppercase text-[10px] tracking-wider font-bold">
                <th className="p-3">Column Name</th>
                <th className="p-3">Data Type</th>
                <th className="p-3">Key / Index</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {schemaColumns.map((col, idx) => (
                <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-mono text-blue-400 font-bold">{col.name}</td>
                  <td className="p-3 font-mono text-amber-400 text-[11px]">{col.type}</td>
                  <td className="p-3">
                    {col.key === 'PK' && <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-sm text-[10px] font-bold">PRIMARY KEY</span>}
                    {col.key === 'INDEX' && <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-sm text-[10px] font-bold">INDEX</span>}
                    {col.key === '-' && <span className="text-slate-600">-</span>}
                  </td>
                  <td className="p-3 text-slate-300">{col.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Master Project README Code View */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">3. Master Project README.md</h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyReadme}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-sm border border-slate-700 transition-all font-semibold uppercase tracking-wide"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
              <span>{copied ? 'Copied README!' : 'Copy README.md'}</span>
            </button>

            <button
              onClick={onOpenExportModal}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-sm transition-all uppercase tracking-wide shadow-sm"
            >
              <span>Download Project Repository</span>
            </button>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 max-h-96 overflow-y-auto font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-blue-500/30">
          {readmeText}
        </div>
      </div>
    </div>
  );
};
