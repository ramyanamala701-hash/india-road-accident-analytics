import React, { useState } from 'react';
import { POWERBI_DAX_MEASURES } from '../data/daxMeasures';
import { DaxMeasureItem } from '../types';
import { 
  Layers, 
  Copy, 
  Check, 
  Search, 
  Database, 
  Share2, 
  Table
} from 'lucide-react';

export const PowerBiDaxTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['ALL', 'Core KPIs', 'Severity & Rates', 'Time Intelligence (YoY / MoM)', 'Risk & Hazard Index'];

  const filteredMeasures = POWERBI_DAX_MEASURES.filter(m => {
    if (selectedCategory !== 'ALL' && m.category !== selectedCategory) return false;
    if (searchTerm && !m.name.toLowerCase().includes(searchTerm.toLowerCase()) && !m.formula.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleCopyDax = (measure: DaxMeasureItem) => {
    navigator.clipboard.writeText(`${measure.name} =\n${measure.formula}`);
    setCopiedId(measure.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border-l-4 border-l-blue-500 border border-slate-800 rounded-sm p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>Power BI Architecture & DAX Measures</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight uppercase">
            Star Schema Data Modeling & DAX Measures Library
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Star Schema relationships between <code>Fact_Accidents</code> and dimension tables with Time Intelligence and Risk Index DAX formulas.
          </p>
        </div>
      </div>

      {/* Star Schema Interactive Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-blue-400" />
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Power BI Data Model Architecture (Star Schema)</h3>
          </div>
          <span className="text-[10px] font-bold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-sm border border-blue-800 font-mono uppercase tracking-wider">
            1-to-Many Relationships
          </span>
        </div>

        {/* Visual Diagram Representation */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          
          {/* Dim State */}
          <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-blue-400 uppercase tracking-wider text-[11px]">
              <span>Dim_State</span>
              <Table className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <ul className="text-slate-400 space-y-1 font-mono text-[11px]">
              <li className="text-blue-400">🔑 state_id (PK)</li>
              <li>state_name</li>
              <li>zone</li>
              <li>population_density</li>
            </ul>
          </div>

          {/* Dim Date */}
          <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-blue-400 uppercase tracking-wider text-[11px]">
              <span>Dim_Date</span>
              <Table className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <ul className="text-slate-400 space-y-1 font-mono text-[11px]">
              <li className="text-blue-400">🔑 date_key (PK)</li>
              <li>full_date</li>
              <li>year / month</li>
              <li>day_of_week</li>
            </ul>
          </div>

          {/* CENTER: Fact Table */}
          <div className="bg-blue-950/40 border-2 border-blue-500 p-5 rounded-sm text-xs space-y-3 shadow-xl">
            <div className="flex items-center justify-between font-bold text-blue-300 text-xs uppercase tracking-wider border-b border-blue-500/40 pb-2">
              <span>Fact_Accidents</span>
              <Database className="w-4 h-4 text-blue-400" />
            </div>
            <ul className="text-slate-200 space-y-1 font-mono text-[11px]">
              <li className="text-blue-400 font-bold">🔑 accident_id (PK)</li>
              <li>🔗 date_key (FK)</li>
              <li>🔗 state_id (FK)</li>
              <li>🔗 vehicle_id (FK)</li>
              <li>🔗 road_id (FK)</li>
              <li className="text-emerald-400 font-bold">casualties (Sum)</li>
              <li className="text-red-400 font-bold">fatalities (Sum)</li>
            </ul>
          </div>

          {/* Dim Vehicle */}
          <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-blue-400 uppercase tracking-wider text-[11px]">
              <span>Dim_Vehicle</span>
              <Table className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <ul className="text-slate-400 space-y-1 font-mono text-[11px]">
              <li className="text-blue-400">🔑 vehicle_id (PK)</li>
              <li>vehicle_type</li>
              <li>category</li>
              <li>vulnerable_flag</li>
            </ul>
          </div>

          {/* Dim RoadType */}
          <div className="bg-slate-950 p-4 rounded-sm border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-blue-400 uppercase tracking-wider text-[11px]">
              <span>Dim_RoadType</span>
              <Table className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <ul className="text-slate-400 space-y-1 font-mono text-[11px]">
              <li className="text-blue-400">🔑 road_id (PK)</li>
              <li>road_type</li>
              <li>speed_limit_kph</li>
              <li>jurisdiction</li>
            </ul>
          </div>

        </div>
      </div>

      {/* DAX Measures Search & Library */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Power BI DAX Measures Library</h3>
            <p className="text-xs text-slate-400 mt-1">Copy production DAX calculated measures for Power BI Desktop.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search DAX measures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-9 pr-3 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* DAX Measures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeasures.map((measure) => (
            <div key={measure.id} className="bg-slate-950 border border-slate-800 rounded-sm p-4 space-y-3 shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-blue-400 font-mono uppercase tracking-wide">{measure.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-sm bg-slate-900 text-slate-400 border border-slate-800 font-mono">
                    {measure.category}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-3">{measure.description}</p>

                {/* Formatted DAX Code Box */}
                <div className="bg-slate-900 p-3 rounded-sm border border-slate-800 font-mono text-[11px] text-emerald-400 whitespace-pre-wrap leading-relaxed selection:bg-blue-900">
                  {measure.formula}
                </div>
              </div>

              <button
                onClick={() => handleCopyDax(measure)}
                className="flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 px-3 rounded-sm transition-all uppercase tracking-wider mt-2 shadow-sm"
              >
                {copiedId === measure.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                <span>{copiedId === measure.id ? 'Copied DAX!' : 'Copy DAX Formula'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

