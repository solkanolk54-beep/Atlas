import React, { useState } from 'react';
import { useCloud } from '../context/CloudContext';
import { WebSocketStressTester } from './WebSocketStressTester';
import { HassiMessaoudPipelineMonitor } from './HassiMessaoudPipelineMonitor';
import {
  Globe,
  AlertTriangle,
  RotateCcw,
  Play,
  CheckCircle2,
  Activity,
  Server,
  Cpu,
  Database,
  ArrowRight,
  ShieldCheck,
  Zap,
  Flame,
} from 'lucide-react';

export const GeoDRSimulator: React.FC = () => {
  const {
    lang,
    regions,
    failoverSim,
    startFailoverSimulation,
    resetFailoverSimulation,
    system,
  } = useCloud();

  const [activeDrTab, setActiveDrTab] = useState<'geo_failover' | 'ws_stress' | 'pipeline_scada'>('geo_failover');

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-mono text-emerald-400 mb-1">
            03. Multi-Region Topology & Geo-DR Engine
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {lang === 'ar'
              ? 'البنية التحتية والمناطق الجغرافية الـ 4 وخطة التعافي من الكوارث'
              : '4 Sovereign Regions & Interactive Geo-Disaster Recovery Engine'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            {lang === 'ar'
              ? 'توزيع استراتيجي على 4 مناطق وطنية لتأمين استمرارية الأعمال الكاملة مع RPO = 0 (انعدام فقدان البيانات) و RTO < 15s (زمن تعافي تلقائي دون تدخل بشري).'
              : 'Strategic distribution across 4 national regions ensuring continuous zero-loss operation (RPO=0) and autonomous sub-15s failover (RTO<15s).'}
          </p>
        </div>

        {/* Live Failover Controls (when in geo_failover mode) */}
        {activeDrTab === 'geo_failover' && (
          <div className="flex items-center gap-2 shrink-0">
            {!failoverSim.isActive ? (
              <button
                onClick={startFailoverSimulation}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-lg shadow-rose-600/20"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'محاكاة انقطاع العاصمة (Start Geo-DR)' : 'Simulate Algiers Outage'}</span>
              </button>
            ) : (
              <button
                onClick={resetFailoverSimulation}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إعادة ضبط المنظومة' : 'Reset Topology'}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stress & DR Testing Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/90 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveDrTab('geo_failover')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeDrTab === 'geo_failover'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'اختبار انقطاع العاصمة والتعافي (RTO < 15s)' : 'Algiers Outage Failover (RTO < 15s)'}</span>
        </button>

        <button
          onClick={() => setActiveDrTab('ws_stress')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeDrTab === 'ws_stress'
              ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'اختبار إجهاد البث اللحظي للـ WebSockets' : 'WebSocket Concurrency Stress Test'}</span>
        </button>

        <button
          onClick={() => setActiveDrTab('pipeline_scada')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeDrTab === 'pipeline_scada'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'شاشة المراقبة الطرفية لورقلة (Ouargla Edge Monitor)' : 'Ouargla SCADA Edge Monitor'}</span>
        </button>
      </div>

      {/* Tab 1: WebSocket Stress Test */}
      {activeDrTab === 'ws_stress' && <WebSocketStressTester />}

      {/* Tab 2: Hassi Messaoud SCADA Monitor */}
      {activeDrTab === 'pipeline_scada' && <HassiMessaoudPipelineMonitor />}

      {/* Tab 3: Live Disaster Recovery Stopwatch & Progress Banner */}
      {activeDrTab === 'geo_failover' && failoverSim.isActive && (
        <div className="p-5 rounded-xl border border-rose-800/80 bg-rose-950/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-mono text-rose-400 font-bold">
                  {lang === 'ar' ? 'محاكاة طوارئ حية جارية (Geo-DR In Progress)' : 'Active Geo-DR Drill Running'}
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {failoverSim.step < 5
                    ? lang === 'ar'
                      ? 'جاري التحويل التلقائي لحركة المرور إلى وهران (dz-west-1)...'
                      : 'Failing over transactions autonomously to Oran (dz-west-1)...'
                    : lang === 'ar'
                    ? 'اكتملت عملية التعافي بنجاح تام! تم ترقية وهران إلى المركز الرئيسي.'
                    : 'Disaster recovery verified! Oran promoted to Primary Leader.'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-2 rounded-lg border border-slate-800">
              <div>
                <div className="text-[10px] text-slate-400 font-mono">MEASURED RTO</div>
                <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                  {failoverSim.elapsedSeconds.toFixed(1)}s
                </div>
              </div>
              <div className="border-r border-slate-800 h-8 rtl:border-l rtl:border-r-0"></div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono">MEASURED RPO</div>
                <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                  0 Bytes
                </div>
              </div>
              <div className="border-r border-slate-800 h-8 rtl:border-l rtl:border-r-0"></div>
              <div>
                <div className="text-[10px] text-slate-400 font-mono">TARGET SLA</div>
                <div className="text-xs font-bold font-mono text-slate-300">
                  &lt; 15s RTO
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <div
              className={`p-2.5 rounded-lg border ${
                failoverSim.step >= 1
                  ? 'bg-rose-950/40 border-rose-700/60 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <div className="font-mono text-[10px]">01. DETECTION</div>
              <div className="font-semibold mt-0.5">رصد فقدان نبض العاصمة (dz-north-1)</div>
            </div>
            <div
              className={`p-2.5 rounded-lg border ${
                failoverSim.step >= 2
                  ? 'bg-amber-950/40 border-amber-700/60 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <div className="font-mono text-[10px]">02. PATRONI RAFT</div>
              <div className="font-semibold mt-0.5">تطابق سجلات التزامن (RPO=0)</div>
            </div>
            <div
              className={`p-2.5 rounded-lg border ${
                failoverSim.step >= 3
                  ? 'bg-sky-950/40 border-sky-700/60 text-sky-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <div className="font-mono text-[10px]">03. PROMOTION</div>
              <div className="font-semibold mt-0.5">ترقية وهران (dz-west-1) كـ Primary</div>
            </div>
            <div
              className={`p-2.5 rounded-lg border ${
                failoverSim.step >= 4
                  ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <div className="font-mono text-[10px]">04. DNS / BGP</div>
              <div className="font-semibold mt-0.5">تحويل مسارات شبكة SATIM الوطنية</div>
            </div>
          </div>

          {/* Drill Logs Console */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs max-h-40 overflow-y-auto space-y-1">
            {failoverSim.logs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-slate-500 shrink-0">{log.time}</span>
                <span
                  className={
                    log.level === 'crit'
                      ? 'text-rose-400'
                      : log.level === 'warn'
                      ? 'text-amber-400'
                      : log.level === 'info'
                      ? 'text-sky-400'
                      : 'text-emerald-400 font-semibold'
                  }
                >
                  {log.msg}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Topology Visual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {regions.map((region) => {
          const isPrimary = region.id === system.activePrimaryRegion;
          const isFailed = region.status === 'FAILOVER_TRIGGERED';

          return (
            <div
              key={region.id}
              className={`p-5 rounded-xl border transition-all ${
                isFailed
                  ? 'border-rose-800/80 bg-rose-950/20'
                  : isPrimary
                  ? 'border-emerald-600/80 bg-emerald-950/20 shadow-md shadow-emerald-950/40'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isFailed
                        ? 'bg-rose-500 animate-ping'
                        : isPrimary
                        ? 'bg-emerald-400 animate-pulse'
                        : 'bg-sky-400'
                    }`}
                  ></span>
                  <span className="font-mono text-xs text-slate-400 uppercase font-bold">
                    {region.id}
                  </span>
                </div>
                <div
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isFailed
                      ? 'bg-rose-900/60 text-rose-300'
                      : isPrimary
                      ? 'bg-emerald-900/60 text-emerald-300'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {region.status}
                </div>
              </div>

              <h3 className="text-base font-bold text-white mb-1">
                {lang === 'ar' ? region.nameAr : region.nameEn}
              </h3>
              <div className="text-xs text-slate-400 mb-4 line-clamp-1">
                {lang === 'ar' ? region.locationAr : region.locationEn}
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-2 mb-4 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Role:</span>
                  <span className="text-slate-200 font-bold">{region.replicationType}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Hardware Nodes:</span>
                  <span className="text-slate-200">{region.k8sNodes} Nodes</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Compute Capacity:</span>
                  <span className="text-slate-200 tabular-nums">{region.vCpuTotal} vCPU / {region.ramGb}GB</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>RPO / RTO:</span>
                  <span className="text-emerald-400 font-bold tabular-nums">
                    {region.rpoSeconds}s / {region.rtoSeconds}s
                  </span>
                </div>
              </div>

              {/* Workload Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{lang === 'ar' ? 'نسبة الحمل الفعلي:' : 'Active Load:'}</span>
                  <span className="font-mono font-bold text-white">{region.activeLoadPct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isFailed
                        ? 'bg-rose-500'
                        : isPrimary
                        ? 'bg-emerald-500'
                        : 'bg-sky-500'
                    }`}
                    style={{ width: `${region.activeLoadPct}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400 leading-relaxed">
                <span className="text-slate-500 block mb-0.5 font-semibold">
                  {lang === 'ar' ? 'التخصص الاستراتيجي:' : 'Strategic Function:'}
                </span>
                {lang === 'ar' ? region.specializationAr : region.specializationEn}
              </div>

              {region.id === 'dz-south-1' && (
                <button
                  onClick={() => {
                    setActiveDrTab('pipeline_scada');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-950/70 hover:bg-amber-900/80 border border-amber-800 text-amber-300 text-xs font-bold transition-all shadow-sm"
                >
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'ar' ? 'فتح شاشة الحوسبة الطرفية لورقلة (Edge Monitor)' : 'Launch Ouargla Edge Monitor'}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Algeria National Map Representation with Active Geo-Replication Links */}
      {activeDrTab === 'geo_failover' && (
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white">
              {lang === 'ar'
                ? 'خريطة الربط السيادي بين المراكز الأربعة (National Sovereign Mesh)'
                : 'National Sovereign Mesh Connectivity'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? 'شبكة ألياف بصرية وطنية مغلقة (Air-Gapped Backbone) تربط العاصمة، وهران، قسنطينة وورقلة'
                : 'Air-gapped dedicated optical backbone connecting Algiers, Oran, Constantine, and Ouargla'}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Sync Fiber (RPO=0)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>Async Vault (S3)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Edge IoT (Oil/Agri)</span>
            </span>
          </div>
        </div>

        {/* Schematic SVG Map representing Algeria topology */}
        <div className="relative w-full h-80 rounded-lg bg-slate-950 border border-slate-800/80 overflow-hidden flex items-center justify-center p-4">
          <svg
            viewBox="0 0 800 400"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Subtle Grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="800" height="400" fill="url(#grid)" />

            {/* Approximate Algeria Outline Silhouette Path */}
            <path
              d="M 220,70 L 290,55 L 430,65 L 560,70 L 620,95 L 610,160 L 580,240 L 530,340 L 400,380 L 320,360 L 240,290 L 190,190 L 190,120 Z"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />

            {/* Fiber links between hubs */}
            {/* Algiers (400, 75) to Oran (280, 95) */}
            <line
              x1="400"
              y1="75"
              x2="280"
              y2="95"
              stroke={failoverSim.isActive ? '#e11d48' : '#10b981'}
              strokeWidth="3"
              strokeDasharray={failoverSim.isActive ? '6 4' : 'none'}
              className={failoverSim.isActive ? 'animate-pulse' : ''}
            />
            {/* Algiers (400, 75) to Constantine (530, 85) */}
            <line
              x1="400"
              y1="75"
              x2="530"
              y2="85"
              stroke="#38bdf8"
              strokeWidth="2"
            />
            {/* Oran (280, 95) to Ouargla (460, 230) */}
            <line
              x1="280"
              y1="95"
              x2="460"
              y2="230"
              stroke="#64748b"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            {/* Algiers (400, 75) to Ouargla (460, 230) */}
            <line
              x1="400"
              y1="75"
              x2="460"
              y2="230"
              stroke="#f59e0b"
              strokeWidth="2"
            />

            {/* Hub 1: Algiers (dz-north-1) */}
            <g transform="translate(400, 75)">
              <circle
                r={failoverSim.step >= 1 ? '16' : '12'}
                fill={failoverSim.step >= 1 ? '#e11d48' : '#10b981'}
                fillOpacity="0.2"
                className="animate-ping"
              />
              <circle
                r="7"
                fill={failoverSim.step >= 1 ? '#e11d48' : '#10b981'}
              />
              <text x="12" y="-10" fill="#f8fafc" fontSize="12" fontWeight="bold">
                dz-north-1 (الجزائر العاصمة)
              </text>
              <text x="12" y="6" fill="#94a3b8" fontSize="10">
                {failoverSim.step >= 1 ? 'FAILOVER TRIGGERED' : 'K8s Control Plane & Primary'}
              </text>
            </g>

            {/* Hub 2: Oran (dz-west-1) */}
            <g transform="translate(280, 95)">
              <circle
                r={failoverSim.step >= 3 ? '18' : '10'}
                fill={failoverSim.step >= 3 ? '#10b981' : '#38bdf8'}
                fillOpacity="0.25"
                className={failoverSim.step >= 3 ? 'animate-ping' : ''}
              />
              <circle
                r="7"
                fill={failoverSim.step >= 3 ? '#10b981' : '#38bdf8'}
              />
              <text x="-140" y="-10" fill="#f8fafc" fontSize="12" fontWeight="bold">
                dz-west-1 (وهران)
              </text>
              <text x="-140" y="6" fill="#94a3b8" fontSize="10">
                {failoverSim.step >= 3 ? '👑 PROMOTED PRIMARY' : 'Sync Standby (RPO=0)'}
              </text>
            </g>

            {/* Hub 3: Constantine (dz-east-1) */}
            <g transform="translate(530, 85)">
              <circle r="6" fill="#38bdf8" />
              <text x="14" y="-8" fill="#f8fafc" fontSize="12" fontWeight="bold">
                dz-east-1 (قسنطينة)
              </text>
              <text x="14" y="8" fill="#94a3b8" fontSize="10">
                Async Replica & S3 Lake
              </text>
            </g>

            {/* Hub 4: Ouargla / Hassi Messaoud (dz-south-1) */}
            <g transform="translate(460, 230)">
              <circle r="7" fill="#f59e0b" />
              <text x="14" y="-8" fill="#f8fafc" fontSize="12" fontWeight="bold">
                dz-south-1 (ورقلة / حاسي مسعود)
              </text>
              <text x="14" y="8" fill="#94a3b8" fontSize="10">
                IoT Edge (Energy & Agri)
              </text>
            </g>
          </svg>
        </div>
      </div>
      )}
    </div>
  );
};
