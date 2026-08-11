import React from 'react';
import { 
  FileText, 
  BarChart3, 
  Database, 
  Code2, 
  Layers, 
  ShieldAlert, 
  Download, 
  Bot,
  Sparkles,
  MapPin
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenExportModal: () => void;
  onOpenAiDrawer: () => void;
  totalRecordsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenExportModal,
  onOpenAiDrawer,
  totalRecordsCount
}) => {
  const tabs = [
    { id: 'overview', label: '1. Architecture & README', icon: FileText },
    { id: 'dashboard', label: '2. Power BI Dashboard', icon: BarChart3 },
    { id: 'sql', label: '3. MySQL Workbench', icon: Database },
    { id: 'python', label: '4. Python EDA Notebook', icon: Code2 },
    { id: 'dax', label: '5. Power BI DAX & Model', icon: Layers },
    { id: 'insights', label: '6. Policy Insights', icon: ShieldAlert },
  ];

  return (
    <header className="bg-slate-900 border-b-4 border-blue-500 text-slate-100 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
          
          {/* Brand & Project Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-sm bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 border border-blue-400/30">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg md:text-xl font-bold tracking-tight uppercase text-white">
                  India Road Safety Analytics Project
                </h1>
                <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded-sm border border-blue-500/30 font-semibold tracking-wider uppercase">
                  End-To-End
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Pipeline: Python • MySQL • Power BI • MoRTH Strategic Insights
              </p>
            </div>
          </div>

          {/* Scope & Action Controls */}
          <div className="flex items-center space-x-3 self-end md:self-auto">
            <div className="hidden lg:flex items-center space-x-3 text-xs bg-slate-950/80 px-3 py-1.5 rounded-sm border border-slate-800">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-200 font-mono font-semibold">{totalRecordsCount.toLocaleString()} Records</span>
              </div>
              <span className="text-slate-700">|</span>
              <span className="text-slate-300">15 States</span>
              <span className="text-slate-700">|</span>
              <span className="text-slate-300">2018-2024</span>
            </div>

            <button
              onClick={onOpenAiDrawer}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-2 rounded-sm transition-all shadow-md shadow-blue-600/30 border border-blue-400/40"
            >
              <Bot className="w-4 h-4 text-blue-100" />
              <span>AI Analyst Assistant</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </button>

            <button
              onClick={onOpenExportModal}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-sm border border-slate-700 transition-all"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Export Code</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto no-scrollbar pt-1 border-t border-slate-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-t-sm transition-all whitespace-nowrap border-b-2 uppercase tracking-wide ${
                  isActive
                    ? 'bg-slate-800 text-blue-400 border-blue-500 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

