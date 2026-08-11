import React, { useState } from 'react';
import { AccidentRecord, SqlQueryItem } from '../types';
import { CURATED_SQL_QUERIES, executeQueryOnDataset, SqlExecutionResult } from '../utils/sqlEngine';
import { 
  Database, 
  Play, 
  Copy, 
  Check, 
  Terminal, 
  Clock, 
  Table, 
  HelpCircle
} from 'lucide-react';

interface SqlWorkbenchTabProps {
  dataset: AccidentRecord[];
}

export const SqlWorkbenchTab: React.FC<SqlWorkbenchTabProps> = ({ dataset }) => {
  const [selectedQueryId, setSelectedQueryId] = useState<string>('q1');
  const [customSql, setCustomSql] = useState<string>(CURATED_SQL_QUERIES[0].sql);
  const [queryResult, setQueryResult] = useState<SqlExecutionResult>(() => 
    executeQueryOnDataset(CURATED_SQL_QUERIES[0].sql, dataset)
  );
  const [copied, setCopied] = useState(false);

  const activeQueryObj = CURATED_SQL_QUERIES.find(q => q.id === selectedQueryId) || CURATED_SQL_QUERIES[0];

  const handleSelectQuery = (query: SqlQueryItem) => {
    setSelectedQueryId(query.id);
    setCustomSql(query.sql);
    const res = executeQueryOnDataset(query.sql, dataset);
    setQueryResult(res);
  };

  const handleRunQuery = () => {
    const res = executeQueryOnDataset(customSql, dataset);
    setQueryResult(res);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(customSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border-l-4 border-l-blue-500 border border-slate-800 rounded-sm p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Database className="w-4 h-4 text-blue-400" />
            <span>MySQL 8.0 Data Warehouse Query Workbench</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight uppercase">
            Curated Relational SQL Queries & Live In-Memory Execution
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Execute production SQL featuring window functions (<code>DENSE_RANK</code>, <code>LAG</code>), aggregate CTEs, and group filters on 2,500+ records.
          </p>
        </div>

        <button
          onClick={handleRunQuery}
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-sm shadow-md shadow-blue-600/30 transition-all uppercase tracking-wider self-start md:self-auto"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Execute Query</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Query Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider px-1 pb-1 border-b border-slate-800">
            3. Curated SQL Queries (7 Queries)
          </h3>

          <div className="space-y-2">
            {CURATED_SQL_QUERIES.map((query) => {
              const isSelected = selectedQueryId === query.id;
              return (
                <button
                  key={query.id}
                  onClick={() => handleSelectQuery(query)}
                  className={`w-full text-left p-3.5 rounded-sm border transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-l-4 border-l-blue-500 border-slate-700 text-white shadow-md'
                      : 'bg-slate-900/80 hover:bg-slate-800/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{query.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-sm bg-slate-950 text-blue-400 border border-slate-800 font-mono">
                      {query.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {query.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: SQL Editor & Output */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* SQL Code Editor Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-sm p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">query_optimization.sql</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopySql}
                  className="flex items-center space-x-1 text-xs text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-sm border border-slate-700 font-semibold uppercase tracking-wider"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                  <span>{copied ? 'Copied' : 'Copy SQL'}</span>
                </button>

                <button
                  onClick={handleRunQuery}
                  className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1 rounded-sm transition-all uppercase tracking-wider"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run</span>
                </button>
              </div>
            </div>

            {/* Editable SQL Textarea */}
            <textarea
              value={customSql}
              onChange={(e) => setCustomSql(e.target.value)}
              rows={8}
              className="w-full bg-slate-950 text-emerald-400 font-mono text-[11px] p-4 rounded-sm border border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed selection:bg-blue-900/50"
            />

            {/* Query Business Logic & Technique Explanation */}
            <div className="bg-slate-950/80 p-3 rounded-sm border border-slate-800 text-xs space-y-1">
              <div className="text-blue-400 font-bold flex items-center space-x-1 uppercase text-[10px] tracking-wider">
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span>Query Mechanics & Relational Logic:</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {activeQueryObj.explanation}
              </p>
            </div>
          </div>

          {/* Results Table Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-sm p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Table className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Query Execution Result Matrix</span>
              </div>

              <div className="flex items-center space-x-3 text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>Execution: <strong className="text-blue-300 font-mono">{queryResult.executionTimeMs} ms</strong></span>
                </span>
                <span>|</span>
                <span>Rows: <strong className="text-emerald-400 font-mono">{queryResult.rowCount}</strong></span>
              </div>
            </div>

            {/* Output Table */}
            <div className="overflow-x-auto rounded-sm border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 text-slate-200 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider font-bold">
                    {queryResult.headers.map((h, idx) => (
                      <th key={idx} className="p-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {queryResult.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/50 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 whitespace-nowrap font-mono text-slate-200 text-[11px]">
                          {cell?.toString()}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

