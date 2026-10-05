import React from 'react';
import { CloudProvider, useCloud } from './context/CloudContext';
import { Header } from './components/Header';
import { ExecutiveReportView } from './components/ExecutiveReportView';
import { GeoDRSimulator } from './components/GeoDRSimulator';
import { PostGisIoTView } from './components/PostGisIoTView';
import { SwaggerApiDocs } from './components/SwaggerApiDocs';
import { EnterpriseTierView } from './components/EnterpriseTierView';
import { ComplianceAuditView } from './components/ComplianceAuditView';
import { EdgeTermuxTerminal } from './components/EdgeTermuxTerminal';
import { ExecutivePdfDossier } from './components/ExecutivePdfDossier';
import { ShieldCheck, HeartHandshake } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, lang, enterprise, isDossierOpen, setIsDossierOpen } = useCloud();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'overview' && <ExecutiveReportView />}
        {activeTab === 'regions' && <GeoDRSimulator />}
        {activeTab === 'postgis-iot' && <PostGisIoTView />}
        {activeTab === 'swagger' && <SwaggerApiDocs />}
        {activeTab === 'enterprise' && <EnterpriseTierView />}
        {activeTab === 'compliance' && <ComplianceAuditView />}
        {activeTab === 'terminal' && <EdgeTermuxTerminal />}
      </main>

      {/* Global Executive PDF Dossier Modal */}
      <ExecutivePdfDossier
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />

      {/* Clean Footer adhering to anti-slop rules (no fake bottom telemetry tickers) */}
      <footer className="border-t border-slate-900 bg-slate-950/80 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-300">
              AtlasCloud Sovereign NeoCloud (DZ)
            </span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'ar' ? 'أكتوبر 2026' : 'October 2026'}</span>
          </div>

          <div className="text-center sm:text-right rtl:sm:text-left text-slate-400">
            {lang === 'ar'
              ? 'مستضافة بالكامل داخل التراب الوطني الجزائري · خاضعة حصراً للقضاء والسيادة الوطنية'
              : 'Hosted strictly within Algerian national borders · Under exclusive sovereign jurisdiction'}
          </div>

          <div className="font-mono text-[11px] text-slate-500">
            Law 18-07 / ANPDP Validated
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CloudProvider>
      <MainContent />
    </CloudProvider>
  );
}
