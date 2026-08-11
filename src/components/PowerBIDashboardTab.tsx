import React, { useState, useMemo } from 'react';
import { AccidentRecord, DashboardFilters } from '../types';
import { INDIAN_STATES, ROAD_TYPES, VEHICLE_TYPES, PRIMARY_CAUSES } from '../data/accidentData';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  Filter, 
  RotateCcw, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  Car, 
  Clock, 
  Info,
  Building2,
  PieChart as PieIcon
} from 'lucide-react';

interface PowerBIDashboardTabProps {
  dataset: AccidentRecord[];
}

export const PowerBIDashboardTab: React.FC<PowerBIDashboardTabProps> = ({ dataset }) => {
  const [filters, setFilters] = useState<DashboardFilters>({
    year: 'ALL',
    state: 'ALL',
    roadType: 'ALL',
    vehicleType: 'ALL',
    severity: 'ALL',
    primaryCause: 'ALL'
  });

  const resetFilters = () => {
    setFilters({
      year: 'ALL',
      state: 'ALL',
      roadType: 'ALL',
      vehicleType: 'ALL',
      severity: 'ALL',
      primaryCause: 'ALL'
    });
  };

  // Filter dataset dynamically
  const filteredData = useMemo(() => {
    return dataset.filter((item) => {
      if (filters.year !== 'ALL' && item.year.toString() !== filters.year) return false;
      if (filters.state !== 'ALL' && item.state !== filters.state) return false;
      if (filters.roadType !== 'ALL' && item.roadType !== filters.roadType) return false;
      if (filters.vehicleType !== 'ALL' && item.vehicleType !== filters.vehicleType) return false;
      if (filters.severity !== 'ALL' && item.severity !== filters.severity) return false;
      if (filters.primaryCause !== 'ALL' && item.primaryCause !== filters.primaryCause) return false;
      return true;
    });
  }, [dataset, filters]);

  // Executive KPI Calculations
  const totalAccidents = filteredData.length;
  const totalFatalities = filteredData.reduce((sum, r) => sum + r.fatalities, 0);
  const totalCasualties = filteredData.reduce((sum, r) => sum + r.casualties, 0);
  const fatalityRate = totalAccidents > 0 ? (totalFatalities / totalAccidents) * 100 : 0;
  
  const highwayDeaths = filteredData
    .filter(r => r.roadType === 'National Highway' || r.roadType === 'State Highway')
    .reduce((sum, r) => sum + r.fatalities, 0);
  const highwayFatalityShare = totalFatalities > 0 ? (highwayDeaths / totalFatalities) * 100 : 0;

  const vruCasualties = filteredData
    .filter(r => r.vehicleType === '2-Wheeler' || r.vehicleType === 'Pedestrian' || r.vehicleType === 'Auto-Rickshaw')
    .reduce((sum, r) => sum + r.casualties, 0);
  const vruShare = totalCasualties > 0 ? (vruCasualties / totalCasualties) * 100 : 0;

  // Chart 1: State Breakdown
  const stateData = useMemo(() => {
    const map = new Map<string, { accidents: number; fatalities: number }>();
    filteredData.forEach(r => {
      const cur = map.get(r.state) || { accidents: 0, fatalities: 0 };
      cur.accidents += 1;
      cur.fatalities += r.fatalities;
      map.set(r.state, cur);
    });

    return Array.from(map.entries())
      .map(([state, val]) => ({ state, accidents: val.accidents, fatalities: val.fatalities }))
      .sort((a, b) => b.fatalities - a.fatalities)
      .slice(0, 8);
  }, [filteredData]);

  // Chart 2: Yearly Trend
  const yearlyTrendData = useMemo(() => {
    const map = new Map<number, { accidents: number; fatalities: number }>();
    [2018, 2019, 2020, 2021, 2022, 2023, 2024].forEach(y => map.set(y, { accidents: 0, fatalities: 0 }));
    
    filteredData.forEach(r => {
      const cur = map.get(r.year) || { accidents: 0, fatalities: 0 };
      cur.accidents += 1;
      cur.fatalities += r.fatalities;
      map.set(r.year, cur);
    });

    return Array.from(map.entries()).map(([year, val]) => ({
      year,
      accidents: val.accidents,
      fatalities: val.fatalities
    }));
  }, [filteredData]);

  // Chart 3: Road Type Pie
  const roadTypeData = useMemo(() => {
    const map = new Map<string, number>();
    filteredData.forEach(r => {
      map.set(r.roadType, (map.get(r.roadType) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const PIE_COLORS = ['#f59e0b', '#ef4444', '#3b82f6', '#10b981'];

  // Chart 4: Time Slot Distribution
  const timeSlotData = useMemo(() => {
    const slots = ['Morning Peak (06-10)', 'Day (10-16)', 'Evening Peak (16-21)', 'Night (21-06)'];
    const map = new Map<string, { accidents: number; fatalities: number }>();
    slots.forEach(s => map.set(s, { accidents: 0, fatalities: 0 }));

    filteredData.forEach(r => {
      const cur = map.get(r.timeSlot) || { accidents: 0, fatalities: 0 };
      cur.accidents += 1;
      cur.fatalities += r.fatalities;
      map.set(r.timeSlot, cur);
    });

    return slots.map(slot => ({
      timeSlot: slot.split(' ')[0],
      accidents: map.get(slot)?.accidents || 0,
      fatalities: map.get(slot)?.fatalities || 0
    }));
  }, [filteredData]);

  // Chart 5: Cause Distribution
  const causeData = useMemo(() => {
    const map = new Map<string, number>();
    filteredData.forEach(r => {
      map.set(r.primaryCause, (map.get(r.primaryCause) || 0) + 1);
    });

    return Array.from(map.entries())
      .map(([cause, count]) => ({ cause, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredData]);

  // Chart 6: Helmet Compliance Impact
  const complianceData = useMemo(() => {
    const map = new Map<string, { compliant: number; nonCompliant: number }>();
    ['2-Wheeler', 'Car/SUV'].forEach(v => map.set(v, { compliant: 0, nonCompliant: 0 }));

    filteredData.filter(r => r.vehicleType === '2-Wheeler' || r.vehicleType === 'Car/SUV').forEach(r => {
      const cur = map.get(r.vehicleType) || { compliant: 0, nonCompliant: 0 };
      if (r.helmetOrBeltUsed === 'Yes') cur.compliant += r.fatalities;
      else cur.nonCompliant += r.fatalities;
      map.set(r.vehicleType, cur);
    });

    return Array.from(map.entries()).map(([vehicle, val]) => ({
      vehicle,
      'Fatalities (Safety Gear Worn)': val.compliant,
      'Fatalities (No Safety Gear)': val.nonCompliant
    }));
  }, [filteredData]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Slicers / Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-sm p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Power BI Dashboard Slicers & Filters</h3>
            <span className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-sm border border-slate-800 font-mono">
              Active Records: {filteredData.length.toLocaleString()}
            </span>
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 font-semibold uppercase tracking-wider transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Slicers</span>
          </button>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          
          {/* Year Slicer */}
          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Year</label>
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-sm p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs"
            >
              <option value="ALL">All Years (2018-2024)</option>
              {[2018, 2019, 2020, 2021, 2022, 2023, 2024].map(y => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
          </div>

          {/* State Slicer */}
          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">State / UT</label>
            <select
              value={filters.state}
              onChange={(e) => setFilters({ ...filters, state: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-sm p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs"
            >
              <option value="ALL">All States (15 States)</option>
              {INDIAN_STATES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Road Type Slicer */}
          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Road Category</label>
            <select
              value={filters.roadType}
              onChange={(e) => setFilters({ ...filters, roadType: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-sm p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs"
            >
              <option value="ALL">All Road Types</option>
              {ROAD_TYPES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Vehicle Type Slicer */}
          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Vehicle Type</label>
            <select
              value={filters.vehicleType}
              onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-sm p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs"
            >
              <option value="ALL">All Vehicle Classes</option>
              {VEHICLE_TYPES.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Severity Slicer */}
          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Severity</label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-sm p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs"
            >
              <option value="ALL">All Severities</option>
              <option value="Fatal">Fatal</option>
              <option value="Severe Injury">Severe Injury</option>
              <option value="Minor Injury">Minor Injury</option>
              <option value="Non-Injury">Non-Injury</option>
            </select>
          </div>

          {/* Primary Cause Slicer */}
          <div>
            <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">Primary Cause</label>
            <select
              value={filters.primaryCause}
              onChange={(e) => setFilters({ ...filters, primaryCause: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-sm p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none text-xs"
            >
              <option value="ALL">All Primary Causes</option>
              {PRIMARY_CAUSES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-slate-900 border-l-4 border-orange-500 border border-slate-800 rounded-sm p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">
            <span>TOTAL ACCIDENTS</span>
            <AlertTriangle className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalAccidents.toLocaleString()}</div>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center space-x-1">
            <span className="text-orange-400 font-semibold">Incident Volume</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900 border-l-4 border-red-500 border border-slate-800 rounded-sm p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">
            <span>TOTAL FATALITIES</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-red-400 font-mono">{totalFatalities.toLocaleString()}</div>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center space-x-1">
            <span className="text-red-400 font-semibold">Fatal Loss</span>
            <span>of life</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900 border-l-4 border-blue-500 border border-slate-800 rounded-sm p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">
            <span>FATALITY RATE</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-400 font-mono">{fatalityRate.toFixed(1)}%</div>
          <div className="mt-2 text-[10px] text-slate-400">
            Deaths per 100 crashes
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900 border-l-4 border-indigo-500 border border-slate-800 rounded-sm p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">
            <span>HIGHWAY FATALITY SHARE</span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-300 font-mono">{highwayFatalityShare.toFixed(1)}%</div>
          <div className="mt-2 text-[10px] text-slate-400">
            NH & SH mortality percentage
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-slate-900 border-l-4 border-sky-500 border border-slate-800 rounded-sm p-4 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">
            <span>VRU CASUALTY SHARE</span>
            <Car className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-300 font-mono">{vruShare.toFixed(1)}%</div>
          <div className="mt-2 text-[10px] text-slate-400">
            2-Wheeler + Pedestrians
          </div>
        </div>

      </div>

      {/* Visual Analytics Grid 1: State Fatality & Yearly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* State Ranking Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-1 border-b border-slate-800">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>Top States by Fatalities</span>
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">BAR CHART</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="state" stroke="#94a3b8" fontSize={10} interval={0} angle={-25} textAnchor="end" />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="accidents" name="Total Accidents" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="fatalities" name="Total Fatalities" fill="#ef4444" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yearly Trend Line Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-1 border-b border-slate-800">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Yearly Trend Analysis (2018 - 2024)</span>
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">LINE CHART</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="accidents" name="Accidents" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="fatalities" name="Fatalities" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Visual Analytics Grid 2: Road Category & Time Slot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Donut Chart: Road Type Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-1 border-b border-slate-800">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-blue-400" />
              <span>Road Category Share</span>
            </h4>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roadTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {roadTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart: Time Slot */}
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-5 shadow-xl md:col-span-2">
          <div className="flex items-center justify-between mb-4 pb-1 border-b border-slate-800">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>Time Slot & Peak Hours Hazard Window</span>
            </h4>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSlotData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timeSlot" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="accidents" name="Total Accidents" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Area type="monotone" dataKey="fatalities" name="Fatalities" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Visual Analytics Grid 3: Primary Cause & Helmet Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Cause Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-5 shadow-xl">
          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4 pb-1 border-b border-slate-800">Primary Accident Causes Breakdown</h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={causeData} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                <YAxis type="category" dataKey="cause" stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', fontSize: '11px' }} />
                <Bar dataKey="count" name="Incidents" fill="#3b82f6" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Helmet / Seatbelt Compliance */}
        <div className="bg-slate-900 border border-slate-800 rounded-sm p-5 shadow-xl">
          <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-4 pb-1 border-b border-slate-800">Safety Gear (Helmet/Belt) Compliance vs Mortality</h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="vehicle" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="Fatalities (Safety Gear Worn)" fill="#10b981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="Fatalities (No Safety Gear)" fill="#ef4444" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Key Analytical Takeaways for Active Filter Context */}
      <div className="bg-blue-600 text-white p-5 border border-blue-500 shadow-xl rounded-sm">
        <div className="flex items-center space-x-2 mb-3 text-white font-bold text-xs uppercase tracking-wider border-b border-blue-400/40 pb-2">
          <Info className="w-4 h-4 text-blue-100" />
          <span>Active Context Analytical Takeaways & Policy Brief</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-blue-700/60 p-3 rounded-sm border border-blue-500/50">
            <strong className="text-white block mb-1 uppercase tracking-wide text-[10px]">High Velocity Impact:</strong>
            National & State Highways contribute to {highwayFatalityShare.toFixed(1)}% of deaths. Speed Enforcement Cameras are strongly recommended at 10km highway intervals.
          </div>
          <div className="bg-blue-700/60 p-3 rounded-sm border border-blue-500/50">
            <strong className="text-white block mb-1 uppercase tracking-wide text-[10px]">Vulnerable Road Users:</strong>
            Two-wheelers and pedestrians account for {vruShare.toFixed(1)}% of casualties. Automated helmet detection ANPR cameras are critical in urban zones.
          </div>
          <div className="bg-blue-700/60 p-3 rounded-sm border border-blue-500/50">
            <strong className="text-white block mb-1 uppercase tracking-wide text-[10px]">Peak Time Risk:</strong>
            Evening window (16:00 - 21:00) sees a sharp spike in fatal crashes due to peak congestion mixed with high speed heavy vehicle movement.
          </div>
        </div>
      </div>

    </div>
  );
};
