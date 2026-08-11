import React, { useState } from 'react';
import { ACCIDENT_DATASET } from './data/accidentData';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { PowerBIDashboardTab } from './components/PowerBIDashboardTab';
import { SqlWorkbenchTab } from './components/SqlWorkbenchTab';
import { PythonEdaTab } from './components/PythonEdaTab';
import { PowerBiDaxTab } from './components/PowerBiDaxTab';
import { InsightsPolicyTab } from './components/InsightsPolicyTab';
import { ProjectExporterModal } from './components/ProjectExporterModal';
import { AiAnalystDrawer } from './components/AiAnalystDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30">
      
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
        totalRecordsCount={ACCIDENT_DATASET.length}
      />

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'overview' && (
          <OverviewTab
            setActiveTab={setActiveTab}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <PowerBIDashboardTab dataset={ACCIDENT_DATASET} />
        )}

        {activeTab === 'sql' && (
          <SqlWorkbenchTab dataset={ACCIDENT_DATASET} />
        )}

        {activeTab === 'python' && (
          <PythonEdaTab />
        )}

        {activeTab === 'dax' && (
          <PowerBiDaxTab />
        )}

        {activeTab === 'insights' && (
          <InsightsPolicyTab />
        )}
      </main>

      {/* Export Source Files Modal */}
      <ProjectExporterModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* AI Data Analyst Assistant Drawer */}
      <AiAnalystDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        datasetContext={{
          totalRecords: ACCIDENT_DATASET.length,
          years: '2018-2024',
          statesCount: 15
        }}
      />

    </div>
  );
}
