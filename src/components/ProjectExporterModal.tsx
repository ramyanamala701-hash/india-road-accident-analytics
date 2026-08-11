import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Database, 
  Code2, 
  Layers, 
  Table
} from 'lucide-react';
import { 
  getReadmeContent, 
  generateCsvDataset, 
  generateSqlSchemaScript 
} from '../data/projectFiles';
import { CURATED_SQL_QUERIES } from '../utils/sqlEngine';
import { CURATED_PYTHON_CELLS } from '../utils/pythonRunner';
import { POWERBI_DAX_MEASURES } from '../data/daxMeasures';

interface ProjectExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectExporterModal: React.FC<ProjectExporterModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeFile, setActiveFile] = useState<string>('readme');
  const [copied, setCopied] = useState(false);

  const files = [
    { id: 'readme', name: 'README.md', icon: FileText, content: getReadmeContent() },
    { id: 'schema', name: '01_schema_and_indexes.sql', icon: Database, content: generateSqlSchemaScript() },
    { 
      id: 'queries', 
      name: '02_analytical_queries.sql', 
      icon: Database, 
      content: CURATED_SQL_QUERIES.map(q => `-- ${q.title}\n-- ${q.description}\n${q.sql}\n`).join('\n\n') 
    },
    { 
      id: 'python', 
      name: 'eda_analysis.py', 
      icon: Code2, 
      content: CURATED_PYTHON_CELLS.map(c => `# ${c.title}\n${c.code}\n`).join('\n\n') 
    },
    { 
      id: 'dax', 
      name: 'powerbi_measures.dax', 
      icon: Layers, 
      content: POWERBI_DAX_MEASURES.map(m => `-- ${m.name} (${m.category})\n-- ${m.description}\n${m.name} =\n${m.formula}\n`).join('\n\n') 
    },
    { id: 'csv', name: 'india_road_accidents.csv', icon: Table, content: generateCsvDataset() }
  ];

  const currentFileObj = files.find(f => f.id === activeFile) || files[0];

  const handleCopyContent = () => {
    navigator.clipboard.writeText(currentFileObj.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([currentFileObj.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFileObj.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-sm w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 border-l-4 border-l-blue-500">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2 uppercase tracking-wider">
              <Download className="w-4 h-4 text-blue-400" />
              <span>Project Artifacts & Source File Exporter</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Download complete portfolio source files for Python, MySQL, Power BI, and README.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-sm bg-slate-900 border border-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* File Selector Sidebar */}
          <div className="md:col-span-4 bg-slate-950 border-r border-slate-800 p-4 space-y-2 overflow-y-auto">
            <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider px-2 mb-2 border-b border-slate-800 pb-1">
              Repository Artifacts
            </h4>
            {files.map((file) => {
              const Icon = file.icon;
              const isSelected = activeFile === file.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setActiveFile(file.id)}
                  className={`w-full text-left p-3 rounded-sm border flex items-center space-x-3 transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-l-4 border-l-blue-500 border-slate-700 text-white shadow-md'
                      : 'hover:bg-slate-900/60 border-transparent text-slate-400'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-mono font-medium truncate">{file.name}</span>
                </button>
              );
            })}
          </div>

          {/* File Preview Content */}
          <div className="md:col-span-8 p-6 flex flex-col justify-between overflow-hidden bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <span className="font-mono text-xs text-blue-400 font-bold flex items-center space-x-2 uppercase">
                <span>{currentFileObj.name}</span>
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyContent}
                  className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-sm border border-slate-700 font-semibold uppercase tracking-wider transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                  <span>{copied ? 'Copied' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={handleDownloadFile}
                  className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-sm transition-all uppercase tracking-wider shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-950 p-4 rounded-sm border border-slate-800 overflow-y-auto font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed selection:bg-blue-500/30">
              {currentFileObj.content}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

