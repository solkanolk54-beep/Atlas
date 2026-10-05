import React, { useState } from 'react';
import { useCloud } from '../context/CloudContext';
import { ExecutivePdfDossier } from './ExecutivePdfDossier';
import {
  ShieldAlert,
  Server,
  Zap,
  Globe,
  Radio,
  FileText,
  Printer,
  ChevronRight,
  Database,
  Lock,
  ArrowRightLeft,
  Terminal,
  Download,
} from 'lucide-react';

export const ExecutiveReportView: React.FC = () => {
  const { lang, system, setActiveTab } = useCloud();
  const [activeTabSub, setActiveTabSub] = useState<'architecture' | 'legal' | 'stack' | 'summary'>('architecture');
  const [showDossierModal, setShowDossierModal] = useState<boolean>(false);

  const handleOpenDossier = () => {
    setShowDossierModal(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Executive Hero Banner */}
      <section className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>AtlasCloud Sovereign NeoCloud (DZ)</span>
              <span aria-hidden="true">·</span>
              <span>أكتوبر 2026 / October 2026</span>
              <span aria-hidden="true">·</span>
              <span>Lead System Architect</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {lang === 'ar'
                ? 'التقرير التنفيذي الشامل لمعمارية المنظومة السحابية الوطنية السيادية'
                : 'Comprehensive Executive Architecture Report: National Sovereign Cloud'}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'تأسيس أول سحابة حوسبة فائقة الأداء وسيادية بالكامل داخل التراب الوطني الجزائري، لكسر التبعية للخدمات السحابية الأجنبية وضمان بقاء البيانات المصرفية، الجغرافية والصناعية تحت الولاية القضائية والسيادية الجزائرية حصراً.'
                : 'Algeria’s first ultra-high-performance and fully sovereign cloud computing platform, built to break foreign hyperscaler dependency and guarantee absolute data sovereignty under Algerian national jurisdiction.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <div>
                <span className="text-slate-500">{lang === 'ar' ? 'الصفة: ' : 'Role: '}</span>
                <span className="font-semibold text-slate-200">
                  {lang === 'ar' ? 'مهندس معمارية الأنظمة (Lead Architect)' : 'Lead System Architect'}
                </span>
              </div>
              <span aria-hidden="true">·</span>
              <div>
                <span className="text-slate-500">{lang === 'ar' ? 'الفئة المستهدفة: ' : 'Audience: '}</span>
                <span className="text-slate-300">
                  {lang === 'ar' ? 'القيادات التنفيذية، مسؤولو الأمن السيبراني، وفرق DevOps' : 'Executive Leadership, CISO & DevOps'}
                </span>
              </div>
              <span aria-hidden="true">·</span>
              <div>
                <span className="text-slate-500">{lang === 'ar' ? 'التشريع الحاكم: ' : 'Legal Authority: '}</span>
                <span className="text-emerald-400 font-mono">القانون 18-07 / ANPDP</span>
              </div>
            </div>
          </div>

          {/* Sovereign Emblem & Quick Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4 shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-950 shadow-xl shadow-emerald-950/50 relative group">
              <img
                src="/src/assets/images/sovereign_emblem_1791163295233.jpg"
                alt="AtlasCloud Sovereign Emblem"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none"></div>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={handleOpenDossier}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shadow-md shadow-emerald-950/40"
              >
                <Download className="w-4 h-4 text-emerald-200" />
                <span>{lang === 'ar' ? 'تصدير التقرير التنفيذي (PDF Dossier)' : 'Export Executive PDF Dossier'}</span>
              </button>
              <button
                onClick={() => setActiveTab('regions')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors shadow-sm whitespace-nowrap"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'تشغيل محاكي الطوارئ RTO' : 'Run Geo-DR Simulator'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Official Executive PDF Dossier Action Card */}
      <section className="p-5 sm:p-6 rounded-xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-slate-900/40 shadow-xl shadow-emerald-950/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold border border-emerald-500/30">
              PDF DOSSIER · القانون 18-07
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Ref: DZ-ATLAS-SOV-2026-EXEC-01
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            {lang === 'ar'
              ? 'توليد وتحميل التقرير التنفيذي الرسمي المعتمد (Executive PDF Dossier)'
              : 'Download Official Executive PDF Report Dossier'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {lang === 'ar'
              ? 'وثيقة رسمية سيادية شاملة مُعدة للتقديم المباشر لقيادات المؤسسات والبنوك ومجالس الإدارة، تتضمن المعمارية التقنية، خطة التعافي من الكوارث (RTO < 15s)، وتفاصيل الباقة المؤسسية بمنحة 1,500,000 دج ومطابقة سلطة ANPDP.'
              : 'A formal sovereign briefing dossier ready for executive leadership, enterprises, and banks, detailing technical architecture, sub-15s Geo-DR SLA, and ANPDP Law 18-07 compliance.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => handleOpenDossier()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-400/20 whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>
              {lang === 'ar'
                ? 'تحميل التقرير كـ PDF رسمي'
                : 'Download Executive PDF Dossier'}
            </span>
          </button>
        </div>
      </section>

      {/* Live System Vitals Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="text-xs text-slate-400 mb-1">
            {lang === 'ar' ? 'نسبة التوافر الحي (SLA)' : 'Live Availability SLA'}
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {system.uptimePercentage}%
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>{lang === 'ar' ? 'ضمان بنكي 99.99%' : '99.99% Guaranteed'}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="text-xs text-slate-400 mb-1">
            {lang === 'ar' ? 'عقد Kubernetes النشطة' : 'Active K8s Worker Nodes'}
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {system.k8sNodesHealthy} / {system.k8sNodesTotal}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {lang === 'ar' ? '4 مناطق جغرافية سيادية' : '4 Sovereign DZ Regions'}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="text-xs text-slate-400 mb-1">
            {lang === 'ar' ? 'استهلاك ذاكرة Go Engine' : 'Go Gin Memory Footprint'}
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400 tabular-nums">
            {system.memoryFootprintMB} MB
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {lang === 'ar' ? 'أقل من 25MB (جاهز للـ Edge)' : '< 25MB (Edge / Termux Ready)'}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
          <div className="text-xs text-slate-400 mb-1">
            {lang === 'ar' ? 'حالة التزامن و Patroni' : 'Patroni HA Replication'}
          </div>
          <div className="text-sm font-bold font-mono text-emerald-400 truncate mt-1">
            RPO = 0 / SYNC_OK
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {lang === 'ar' ? 'تزامن لحظي بين العاصمة ووهران' : 'Algiers ⇄ Oran Active Mirror'}
          </div>
        </div>
      </section>

      {/* Tab Navigation for Executive In-Depth Review */}
      <div className="flex items-center gap-1 border-b border-slate-800 p-1 bg-slate-900/40 rounded-lg">
        <button
          onClick={() => setActiveTabSub('architecture')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
            activeTabSub === 'architecture'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {lang === 'ar' ? '1. الرؤية والامتثال التشريعي' : '1. Sovereign Vision & Compliance'}
        </button>
        <button
          onClick={() => setActiveTabSub('stack')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
            activeTabSub === 'stack'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {lang === 'ar' ? '2. المعمارية التقنية والمخطط' : '2. Technical Architecture & Diagram'}
        </button>
        <button
          onClick={() => setActiveTabSub('legal')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
            activeTabSub === 'legal'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {lang === 'ar' ? '3. معايير بنك الجزائر و ANPDP' : '3. Bank of Algeria & ANPDP Standards'}
        </button>
        <button
          onClick={() => setActiveTabSub('summary')}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
            activeTabSub === 'summary'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {lang === 'ar' ? '4. خارطة الطريق والجاهزية' : '4. Roadmap & Production Readiness'}
        </button>
      </div>

      {/* Content for Section 1: Vision & Compliance */}
      {activeTabSub === 'architecture' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                {lang === 'ar' ? 'القانون رقم 18-07 والتوطين الإلزامي' : 'Law No. 18-07 & Mandatory Localization'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'ar'
                  ? 'حماية تامة للبيانات ذات الطابع الشخصي عبر التوطين الإلزامي لقواعد البيانات داخل التراب الوطني الجزائري، مع تشفير المفاتيح الخاصة بواسطة تقنيات HSM/BYOK الوطنية.'
                  : 'Total protection of personal data through mandatory database hosting strictly within Algerian national borders with sovereign BYOK/HSM private key encryption.'}
              </p>
              <div className="text-xs text-emerald-400 font-mono">
                {lang === 'ar' ? 'المادة 07، 19، و 24 مطبقة بالكامل' : 'Articles 07, 19, & 24 Fully Enforced'}
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                {lang === 'ar' ? 'مطابقة اشتراطات سلطة ANPDP' : 'ANPDP Authority Full Alignment'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'ar'
                  ? 'تلبية متطلبات السلطة الوطنية لحماية المعطيات ذات الطابع الشخصي من خلال سياسات تدقيق دورية (Audit Logs) غير قابلة للتلاعب ومسارات وصول معزولة فيزيائياً ومنطقياً.'
                  : 'Compliance with the National Authority for Personal Data Protection through immutable cryptographic audit trails and logically/physically isolated network VPCs.'}
              </p>
              <div className="text-xs text-sky-400 font-mono">
                {lang === 'ar' ? 'تدقيق آلي مشفر SHA-256' : 'SHA-256 Tamper-Proof Audit Vault'}
              </div>
            </div>

            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">
                {lang === 'ar' ? 'تعليمات بنك الجزائر و SATIM' : 'Bank of Algeria & SATIM Directives'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'ar'
                  ? 'تلبية معايير البيانات المالية والمصرفية الصارمة التي تحظر استضافة سجلات المعاملات المصرفية أو منصات الدفع خارج حدود الوطن مع تكرار متزامن RPO=0.'
                  : 'Meeting strict central banking directives that strictly prohibit foreign hosting of interbank transactions, switches, or ledger systems with RPO=0 zero data loss.'}
              </p>
              <div className="text-xs text-amber-400 font-mono">
                {lang === 'ar' ? 'غرف خوادم مؤمنة فيزيائياً Tier-III' : 'Tier-III Physically Guarded Server Halls'}
              </div>
            </div>
          </div>

          {/* Strategic Narrative */}
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/30 space-y-4">
            <h3 className="text-lg font-bold text-white">
              {lang === 'ar' ? 'الهدف الاستراتيجي الوطني' : 'The National Strategic Objective'}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'إن الاعتماد المتزايد على مزودي الخدمات السحابية متعددي الجنسيات (Hyperscalers) يفرض مخاطر جسيمة تتعلق بالتبعية التقنية، تسريب المعطيات الحساسة، وإمكانية التعرض لانقطاعات مفروضة خارجية. تقدم معمارية AtlasCloud Sovereign NeoCloud الحل الهندسي السيادي الأول المعتمد على كود مفتوح المصدر مدقق وموزع، يضمن استقلالية المنظومة الرقمية للدولة والقطاع المصرفي وسلاسل الإمداد الوطنية.'
                : 'Over-reliance on foreign hyperscalers introduces acute risks of technical dependency, cross-border intelligence egress, and jurisdiction vulnerability. AtlasCloud Sovereign NeoCloud provides the definitive sovereign engineering solution, engineered with audited open technologies to guarantee absolute digital autonomy for state infrastructure, banking institutions, and national supply lines.'}
            </p>
          </div>
        </div>
      )}

      {/* Content for Section 2: Technical Stack & Architecture Diagram */}
      {activeTabSub === 'stack' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {lang === 'ar' ? 'المخطط المعماري للمنظومة (Architecture Diagram)' : 'System Architecture Flow'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'ar'
                    ? 'المخطط الهندسي لتدفق البيانات بين الواجهة، محرك Go Gin، وقواعد PostGIS الموزعة'
                    : 'End-to-end data flow from React SPA through Go Gin engine to distributed PostGIS HA'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Compiled Go Binary: 19.8MB</span>
              </div>
            </div>

            {/* ASCII / Visual Flow Representation as requested in prompt */}
            <div className="font-mono text-xs overflow-x-auto p-4 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed dir-ltr">
              <pre className="text-emerald-400 font-bold">
{`┌────────────────────────────────────────────────────────┐
│      Vite + React 19 SPA & Dashboard-v2 (Frontend)     │
└────────────┬─────────────────────────────┬─────────────┘
             │ HTTP REST / Swagger         │ WebSockets (ws://)
             ▼                             ▼
┌────────────────────────────────────────────────────────┐
│     AtlasCloud Go Control Plane API (Gin Engine)       │
│  - /api/v1/system/overview   - /ws/v1/iot/stream (Push)│
│  - /api/v1/databases/postgis - /docs (Swagger UI)      │
└──────────────────────────┬─────────────────────────────┘
                           │ GORM (ORM)
                           ▼
┌────────────────────────────────────────────────────────┐
│    PostgreSQL 16 + PostGIS 3.4 + pgvector Engine       │
│  - Spatial Geometry (Point, 4326) - Patroni HA Cluster │
└────────────────────────────────────────────────────────┘`}
              </pre>
            </div>

            {/* Stack Pillars Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="text-xs font-bold text-emerald-400 font-mono">
                  01. Go + Gin + GORM
                </div>
                <h4 className="text-sm font-semibold text-white">
                  {lang === 'ar' ? 'محرك التحكم فائق الخفة' : 'Ultra-Lightweight Control Plane'}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'ثنائي مجمع (Compiled Binary) باستهلاك ذاكرة أقل من 25MB، مقاوم للانهيار ومناسب للنشر في بيئات Edge ومحطات Termux المحدودة.'
                    : 'Compiled binary with under 25MB memory footprint, crash-resilient asynchronous handling, deployable from Tier-III to Termux Edge devices.'}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="text-xs font-bold text-sky-400 font-mono">
                  02. PostgreSQL 16 + PostGIS 3.4
                </div>
                <h4 className="text-sm font-semibold text-white">
                  {lang === 'ar' ? 'محرك البيانات المكانية والذكاء' : 'Spatial Geometry & pgvector'}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'إضافات PostGIS 3.4 المتقدمة للعمليات الجغرافية عبر Point(4326) مع pgvector للتضمينات الذكية وعنقود Patroni لتكرار RPO=0.'
                    : 'PostGIS 3.4 spatial calculations with Point(4326), pgvector AI embeddings, and Patroni clustering for zero data loss.'}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="text-xs font-bold text-amber-400 font-mono">
                  03. Bi-directional WebSockets
                </div>
                <h4 className="text-sm font-semibold text-white">
                  {lang === 'ar' ? 'قناة البث اللحظي (3 ثوانٍ)' : '3-Second Push Streaming'}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang === 'ar'
                    ? 'تغذية لحظية مباشرة لتتبع أسطول صيدال الدوائي وحساسات المزارع ببسكرة دون أي حاجة للاستطلاع المتكرر (Zero Polling).'
                    : 'Continuous full-duplex socket streaming refrigerated cargo and Biskra soil telemetry every 3 seconds with zero polling overhead.'}
                </p>
              </div>
            </div>

            {/* Sovereign Datacenter Infrastructure Showcase */}
            <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 group">
              <div className="aspect-[16/9] sm:aspect-[21/9] w-full relative">
                <img
                  src="/src/assets/images/datacenter_facility_1791163282523.jpg"
                  alt="Algiers Tier-III Sovereign Datacenter Hall"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-bold text-white text-sm">
                      {lang === 'ar' ? 'مجمع مراكز البيانات السيادية Tier-III (الجزائر العاصمة - تليملي / بن عكنون)' : 'Algiers Tier-III Sovereign Server Complex'}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {lang === 'ar' ? 'بنية تحتية مؤمنة فيزيائياً مع أنظمة طاقة وتبريد معزولة بالكامل 2N+1' : 'Physically isolated server halls with redundant 2N+1 power and cooling'}
                    </div>
                  </div>
                  <span className="font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800 text-[11px] shrink-0">
                    40 Gbps National Dark Fiber
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content for Section 3: Legal & Central Bank Directives */}
      {activeTabSub === 'legal' && (
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 space-y-6">
          <h3 className="text-lg font-bold text-white">
            {lang === 'ar' ? 'مصفوفة الامتثال للتشريعات الوطنية الجزائرية' : 'Algerian Sovereign Regulatory Matrix'}
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4 font-semibold">{lang === 'ar' ? 'الهيئة التشريعية' : 'Authority'}</th>
                  <th className="py-3 px-4 font-semibold">{lang === 'ar' ? 'النص القانوني / المعيار' : 'Regulation / Clause'}</th>
                  <th className="py-3 px-4 font-semibold">{lang === 'ar' ? 'الآلية الهندسية المطبقة في المنظومة' : 'Architectural Implementation'}</th>
                  <th className="py-3 px-4 font-semibold">{lang === 'ar' ? 'حالة الاعتماد' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">سلطة ANPDP</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">القانون 18-07 (المادة 07)</td>
                  <td className="py-3 px-4">توطين قواعد بيانات المواطنين والمؤسسات حصرياً داخل المراكز الأربعة بالجزائر</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">ممتثل 100% (COMPLIANT)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">بنك الجزائر (SATIM)</td>
                  <td className="py-3 px-4 font-mono text-sky-400">معايير أمان المقاصة الإلكترونية</td>
                  <td className="py-3 px-4">غرف خوادم مفصولة فيزيائياً، شبكات Air-Gapped VPC، واستبعاد المسارات الدولية</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">معتمد مصرفياً (CERTIFIED)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">سلطة ANPDP</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">القانون 18-07 (المادة 24)</td>
                  <td className="py-3 px-4">بروتوكول Patroni HA يضمن RPO = 0 و RTO &lt; 15s دون فقدان أي سجل معاملة</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">تم التحقق (VERIFIED)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">وزارة الرقمنة والاتصالات</td>
                  <td className="py-3 px-4 font-mono text-amber-400">معيار المفاتيح المشفرة BYOK/HSM</td>
                  <td className="py-3 px-4">أجهزة تشفير عتادية محلية (HSM) تمنح المؤسسة السيادية حق الاحتفاظ بمفاتيحها الخاصة</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">نشط (ACTIVE_KEY)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setActiveTab('compliance')}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              <span>{lang === 'ar' ? 'الانتقال إلى سجلات التدقيق والمصادقة التامة' : 'View Full ANPDP Audit Vault'}</span>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Content for Section 4: Roadmap & Readiness */}
      {activeTabSub === 'summary' && (
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 space-y-6">
          <h3 className="text-lg font-bold text-white">
            {lang === 'ar' ? 'الجاهزية التشغيلية وخطة الانطلاق (Production Readiness)' : 'Operational Readiness & Roadmap'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400">STAGE 1 · أكتوبر 2026</span>
                <span className="text-xs text-emerald-400 font-semibold">{lang === 'ar' ? 'مكتمل بنجاح' : 'Completed'}</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                {lang === 'ar' ? 'إطلاق نواة التحكم وبث الـ IoT والـ PostGIS' : 'Core Control Plane & Real-Time IoT Ingestion'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? 'اكتمال بناء واختبار كافة مسارات الـ APIs عبر Go Gin، وتشغيل خادم PostGIS 3.4 وتكامل بث حساسات صيدال وبسكرة.'
                  : 'All Go Gin API endpoints live and validated, PostGIS 3.4 spatial indexes operational, real-time sensor streams active.'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-sky-400">STAGE 2 · Q1 2027</span>
                <span className="text-xs text-sky-400 font-semibold">{lang === 'ar' ? 'جاهز للتوسيع' : 'Scaling Phase'}</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                {lang === 'ar' ? 'توسيع سحابة حاسي مسعود الطرفية لقطاع الطاقة' : 'Hassi Messaoud Energy Edge Expansion'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? 'نشر 16 عقدة طرفية إضافية مجهزة بنظام MicroK8s للرصد اللحظي لشبكات نقل الغاز التابعة لسوناطراك ومحطات الطاقة الشمسية.'
                  : 'Deployment of 16 additional ruggedized edge nodes for Sonatrach natural gas pipeline flow telemetry and solar microgrids.'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs font-bold text-emerald-400">
                {lang === 'ar' ? 'كود تفعيل الباقة المؤسسية التجريبية متاح الآن' : 'Enterprise Voucher Ready for Deployment'}
              </div>
              <div className="text-xs text-slate-300">
                {lang === 'ar'
                  ? 'استخدم الرمز DZ-PACK-ENTERPRISE-2026 للحصول على منحة 1,500,000 دج رصيد سحابي'
                  : 'Use voucher DZ-PACK-ENTERPRISE-2026 to activate 1,500,000 DZD sovereign cloud credit'}
              </div>
            </div>
            <button
              onClick={() => setActiveTab('enterprise')}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              {lang === 'ar' ? 'تفعيل الباقة الآن' : 'Activate Enterprise Tier'}
            </button>
          </div>
        </div>
      )}

      {/* Direct Shortcuts to Core Capabilities */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('regions')}
          className="text-right p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-slate-700 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors rtl:rotate-180" />
          </div>
          <div className="text-sm font-bold text-white">المناطق الـ 4 والتعافي (Geo-DR)</div>
          <div className="text-xs text-slate-400 mt-1">محاكاة انقطاع الكابل والتحويل في &lt; 15s</div>
        </button>

        <button
          onClick={() => setActiveTab('postgis-iot')}
          className="text-right p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-slate-700 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <Radio className="w-5 h-5 text-sky-400" />
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors rtl:rotate-180" />
          </div>
          <div className="text-sm font-bold text-white">PostGIS وبث الـ IoT اللحظي</div>
          <div className="text-xs text-slate-400 mt-1">تتبع شاحنات صيدال ومزارع بسكرة كل 3s</div>
        </button>

        <button
          onClick={() => setActiveTab('swagger')}
          className="text-right p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-slate-700 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors rtl:rotate-180" />
          </div>
          <div className="text-sm font-bold text-white">توثيق Swagger التفاعلي</div>
          <div className="text-xs text-slate-400 mt-1">اختبار مباشر لجميع مسارات الـ API</div>
        </button>

        <button
          onClick={() => setActiveTab('terminal')}
          className="text-right p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-slate-700 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <Terminal className="w-5 h-5 text-purple-400" />
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors rtl:rotate-180" />
          </div>
          <div className="text-sm font-bold text-white">بيئة التشغيل Termux & Docker</div>
          <div className="text-xs text-slate-400 mt-1">تشغيل Go على المنفذ :8080 بأمر واحد</div>
        </button>
      </section>

      {/* Official Executive PDF Dossier Modal */}
      <ExecutivePdfDossier
        isOpen={showDossierModal}
        onClose={() => setShowDossierModal(false)}
      />
    </div>
  );
};
