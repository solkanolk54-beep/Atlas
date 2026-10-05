import React from 'react';
import { useCloud, ActiveTab } from '../context/CloudContext';
import {
  ShieldCheck,
  Globe,
  Radio,
  FileCode,
  Terminal,
  Award,
  Layers,
  Sparkles,
  FileDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { lang, setLang, activeTab, setActiveTab, enterprise, system, setIsDossierOpen } = useCloud();

  const navItems: Array<{ id: ActiveTab; labelAr: string; labelEn: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'overview', labelAr: 'التقرير التنفيذي', labelEn: 'Executive Report', icon: Layers },
    { id: 'regions', labelAr: 'المناطق ومحاكي الطوارئ', labelEn: '4 Regions & Geo-DR', icon: Globe },
    { id: 'postgis-iot', labelAr: 'PostGIS والبث اللحظي', labelEn: 'PostGIS & IoT Stream', icon: Radio },
    { id: 'swagger', labelAr: 'وثائق Swagger API', labelEn: 'Swagger UI Docs', icon: FileCode },
    { id: 'enterprise', labelAr: 'الباقة المؤسسية', labelEn: 'Enterprise Tier', icon: Award },
    { id: 'compliance', labelAr: 'الامتثال وقانون 18-07', labelEn: 'Law 18-07 Audit', icon: ShieldCheck },
    { id: 'terminal', labelAr: 'بيئة Termux & Edge', labelEn: 'Termux & Edge CLI', icon: Terminal },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('overview')}
              className="text-left font-bold text-lg tracking-tight text-white hover:text-emerald-400 transition-colors flex items-center gap-2"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>AtlasCloud NeoCloud DZ</span>
            </button>
            <span className="hidden md:inline text-xs text-slate-500 font-mono">
              v2026.10 · Sovereign Core
            </span>
          </div>

          {/* Zone 2: Clean navigation links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-800 text-emerald-400 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? item.labelAr : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary actions & Language toggle */}
          <div className="flex items-center gap-2.5">
            {enterprise.isActivated ? (
              <button
                onClick={() => setActiveTab('enterprise')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 rounded-md hover:bg-emerald-900/60 transition-colors whitespace-nowrap"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span className="font-mono tabular-nums">
                  1,500,000 دج
                </span>
                <span className="hidden xl:inline text-slate-400">· {lang === 'ar' ? 'مؤسسية' : 'Enterprise'}</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('enterprise')}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors whitespace-nowrap shadow-sm shadow-emerald-500/20"
              >
                {lang === 'ar' ? 'تفعيل الباقة المؤسسية' : 'Activate Enterprise'}
              </button>
            )}

            <button
              onClick={() => setIsDossierOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors whitespace-nowrap"
              title={lang === 'ar' ? 'تصدير التقرير التنفيذي الشامل (PDF Dossier)' : 'Export Executive PDF Dossier'}
            >
              <FileDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'ar' ? 'تصدير PDF' : 'PDF Dossier'}</span>
            </button>

            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors whitespace-nowrap"
              title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
            >
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-900 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{lang === 'ar' ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
