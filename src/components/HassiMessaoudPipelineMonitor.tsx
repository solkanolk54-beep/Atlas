import React, { useState, useEffect } from 'react';
import { useCloud } from '../context/CloudContext';
import {
  Flame,
  Activity,
  Gauge,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Radio,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Server,
  Lock,
  Cpu,
  Layers,
  Terminal,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface ScadaStation {
  id: string;
  nameAr: string;
  nameEn: string;
  wilaya: string;
  pipelineType: string;
  nominalPressureBar: number;
  currentPressureBar: number;
  flowRateM3H: number;
  tempC: number;
  vibrationMmS: number;
  cathodicVolts: number;
  valveState: 'ARMED_OPEN' | 'CLOSING' | 'ISOLATED' | 'TESTING';
  status: 'OPTIMAL' | 'WARNING' | 'ALERT';
}

const SCADA_STATIONS: ScadaStation[] = [
  {
    id: 'HMD-CP-01',
    nameAr: 'محطة الضغط التوربيني والفصل حاسي مسعود (HMD-CP-01)',
    nameEn: 'Hassi Messaoud Central Gas & Oil Compression (HMD-CP-01)',
    wilaya: 'Ouargla',
    pipelineType: '48" GZ4 High-Pressure Trunkline & 40" OT Crude',
    nominalPressureBar: 68.0,
    currentPressureBar: 68.4,
    flowRateM3H: 2840,
    tempC: 41.2,
    vibrationMmS: 0.74,
    cathodicVolts: -1.18,
    valveState: 'ARMED_OPEN',
    status: 'OPTIMAL',
  },
  {
    id: 'HDH-MANIFOLD-02',
    nameAr: 'مجمع التجميع والشحن حوض الحمراء (HDH-MANIFOLD-02)',
    nameEn: 'Haoud El Hamra Oil Dispatch & Gathering Manifold (HDH-02)',
    wilaya: 'Ouargla',
    pipelineType: '40" Crude Oil Mainline (OT/OB1)',
    nominalPressureBar: 65.0,
    currentPressureBar: 64.2,
    flowRateM3H: 2650,
    tempC: 38.6,
    vibrationMmS: 0.68,
    cathodicVolts: -1.22,
    valveState: 'ARMED_OPEN',
    status: 'OPTIMAL',
  },
  {
    id: 'OUARGLA-EDGE-GATEWAY',
    nameAr: 'بوابة الحوسبة الطرفية الصناعية ورقلة (dz-south-1 Gateway)',
    nameEn: 'Ouargla Industrial K8s Edge Gateway (dz-south-1 Gateway)',
    wilaya: 'Ouargla',
    pipelineType: 'OT/IT Air-Gapped Supervisory & Modbus Aggregator',
    nominalPressureBar: 70.0,
    currentPressureBar: 69.1,
    flowRateM3H: 2980,
    tempC: 36.5,
    vibrationMmS: 0.52,
    cathodicVolts: -1.16,
    valveState: 'ARMED_OPEN',
    status: 'OPTIMAL',
  },
  {
    id: 'TG-BOOSTER-03',
    nameAr: 'محطة تعزيز الرفع الهيدروليكي تقرت (TG-BOOSTER-03)',
    nameEn: 'Touggourt Hydraulic Pumping Booster (TG-BOOSTER-03)',
    wilaya: 'Touggourt / Ouargla Basin',
    pipelineType: '40" OT Pipeline Section 3 ➔ Skikda',
    nominalPressureBar: 72.0,
    currentPressureBar: 71.0,
    flowRateM3H: 3120,
    tempC: 36.8,
    vibrationMmS: 0.81,
    cathodicVolts: -1.19,
    valveState: 'ARMED_OPEN',
    status: 'OPTIMAL',
  },
];

export const HassiMessaoudPipelineMonitor: React.FC = () => {
  const { lang, regions } = useCloud();

  const ouarglaRegion = regions.find((r) => r.id === 'dz-south-1') || regions[3];

  const [stations, setStations] = useState<ScadaStation[]>(SCADA_STATIONS);
  const [selectedStationId, setSelectedStationId] = useState<string>('HMD-CP-01');
  const [scadaAlert, setScadaAlert] = useState<string | null>(null);
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [protocolViewMode, setProtocolViewMode] = useState<'modbus' | 'opcua' | 'dnp3'>('modbus');
  const [testLog, setTestLog] = useState<string[]>([
    '00:00.00 - [dz-south-1] تم تأسيس قناة اتصال SCADA مع معقد حاسي مسعود عبر شبكة ورقلة المعزولة',
    '00:00.01 - [Modbus/TCP] قراءة سجلات الضغط الهيدروليكي (Register 40102 = 68.4 Bar)',
    '00:00.02 - [OPC-UA] استلام وسم التدفق الحجمي (Tag: Pipeline.OT40.Flow = 2840 m³/h)',
    '00:00.03 - [Protection] فحص الحماية الكاثودية: -1.18V CSE (مانع تأكل التربة متطابق)',
  ]);

  const activeStation = stations.find((s) => s.id === selectedStationId) || stations[0];

  // Minor continuous SCADA telemetry fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setStations((prev) =>
        prev.map((st) => {
          if (st.id === 'HMD-CP-01' && isTestRunning) return st;
          const deltaP = (Math.random() - 0.5) * 0.25;
          const deltaF = Math.round((Math.random() - 0.5) * 15);
          return {
            ...st,
            currentPressureBar: Number((st.nominalPressureBar + deltaP).toFixed(1)),
            flowRateM3H: st.flowRateM3H + deltaF,
            tempC: Number((st.tempC + (Math.random() - 0.5) * 0.1).toFixed(1)),
            vibrationMmS: Number((st.vibrationMmS + (Math.random() - 0.5) * 0.02).toFixed(2)),
          };
        })
      );
    }, 2800);
    return () => clearInterval(timer);
  }, [isTestRunning]);

  // Simulation 1: Trigger SCADA Overpressure Drill on Selected Station
  const triggerOverpressureDrill = () => {
    setIsTestRunning(true);
    setScadaAlert(
      lang === 'ar'
        ? `⚠️ تحذير ضغط مرتفع: 79.8 Bar في ${activeStation.nameAr} - استجابة الحوسبة الطرفية الفورية`
        : `⚠️ Overpressure Alert: 79.8 Bar at ${activeStation.nameEn} - Triggering edge bleed throttle`
    );

    setStations((prev) =>
      prev.map((st) =>
        st.id === selectedStationId
          ? {
              ...st,
              currentPressureBar: 79.8,
              flowRateM3H: st.flowRateM3H + 450,
              vibrationMmS: 1.48,
              status: 'ALERT',
            }
          : st
      )
    );

    const newLogs = [
      `00:00.12 - [SCADA-ALARM] رصد ارتفاع غير طبيعي في ضغط خط ${activeStation.id} إلى 79.8 Bar`,
      `00:00.38 - [dz-south-1 Edge] معالجة فورية داخل عقدة ورقلة دون الحاجة للاتصال بالسحابة الخارجية (Latency: 1.8ms)`,
      `00:00.75 - [Auto-Bleed] تفعيل صمام تصريف الفائض الهيدروليكي الآلي (Bleed Loop Active)`,
      `00:01.40 - [Stabilization] انخفاض الضغط تدريجياً: 73.2 Bar ➔ 68.4 Bar واستقرار التدفق`,
      `00:02.10 - [Resolved] عودة كافة المؤشرات للنطاق الاسمي الآمن وتوثيق السجل في قواعد PostGIS`,
    ];
    setTestLog((prev) => [...newLogs, ...prev.slice(0, 10)]);

    setTimeout(() => {
      setStations((prev) =>
        prev.map((st) =>
          st.id === selectedStationId
            ? {
                ...st,
                currentPressureBar: st.nominalPressureBar,
                vibrationMmS: 0.74,
                status: 'OPTIMAL',
              }
            : st
        )
      );
      setScadaAlert(null);
      setIsTestRunning(false);
    }, 4800);
  };

  // Simulation 2: Trigger Rapid ESD Emergency Shut-Down Valve Isolation
  const triggerEsdValveDrill = () => {
    setStations((prev) =>
      prev.map((st) =>
        st.id === selectedStationId ? { ...st, valveState: 'TESTING' } : st
      )
    );

    setTestLog((prev) => [
      `00:00.08 - [ESD-TRIP] إرسال نبضة اختبار صمام الأمان الكهرومغناطيسي لمطة ${activeStation.id}`,
      `00:00.42 - [Mechanical] بدء إغلاق بوابة الصمام المعزولة هيدروليكياً في زمن استجابة قياسي 420ms`,
      `00:00.85 - [ISOLATED] اكتمال إغلاق صمام الأمان بالكامل بنجاح 100% (Seal Verified)`,
      ...prev.slice(0, 10),
    ]);

    setTimeout(() => {
      setStations((prev) =>
        prev.map((st) =>
          st.id === selectedStationId ? { ...st, valveState: 'ISOLATED' } : st
        )
      );

      setTimeout(() => {
        setStations((prev) =>
          prev.map((st) =>
            st.id === selectedStationId ? { ...st, valveState: 'ARMED_OPEN' } : st
          )
        );
        setTestLog((prev) => [
          `00:03.00 - [ARMED] إعادة تعشيق صمام الأمان وتأكيده في وضع الفتح التشغيلي (ARMED_OPEN)`,
          ...prev.slice(0, 10),
        ]);
      }, 3000);
    }, 1100);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/20 shadow-inner">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                {lang === 'ar'
                  ? 'شاشة المراقبة الطرفية لخطوط الطاقة وأنابيب حاسي مسعود (Ouargla Edge SCADA Monitor)'
                  : 'Ouargla Industrial Edge Monitor & Pipeline SCADA (dz-south-1)'}
              </h3>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                dz-south-1 · Sonatrach TRC
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              {lang === 'ar'
                ? 'واجهة تفاعلية لمراقبة بيانات الـ SCADA الحية لخطوط نقل المحروقات الكبرى التابعة لسوناطراك عبر عقدة ورقلة الطرفية، مع استجابة فورية للأعطال بدون تأخير سحابي.'
                : 'Real-time telemetry ingestion and edge safety actuation for Sonatrach’s major hydrocarbon trunklines in Ouargla & Hassi Messaoud.'}
            </p>
          </div>
        </div>

        {/* Live Edge Link Telemetry Badge */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400">Edge Link:</span>
            <span className="text-emerald-400 font-bold">1.8 ms</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-slate-300">
            <span className="text-slate-400">Node:</span> Ouargla Tier-Edge
          </div>
        </div>
      </div>

      {/* Station Selector Bar */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Server className="w-3.5 h-3.5 text-amber-400" />
          <span>{lang === 'ar' ? 'محطات خطوط الطاقة المتصلة بشبكة ورقلة الحافة:' : 'Energy Pipeline SCADA Stations:'}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stations.map((st) => {
            const isSelected = st.id === selectedStationId;
            return (
              <button
                key={st.id}
                onClick={() => setSelectedStationId(st.id)}
                className={`text-right rtl:text-right ltr:text-left p-3.5 rounded-xl border transition-all text-xs space-y-1.5 ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-500/80 shadow-md shadow-amber-950/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400 truncate">{st.id}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      st.status === 'ALERT'
                        ? 'bg-rose-500 animate-ping'
                        : st.status === 'WARNING'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  ></span>
                </div>
                <div className="font-bold text-white truncate text-xs">
                  {lang === 'ar' ? st.nameAr : st.nameEn}
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400">Pressure:</span>
                  <span className="text-amber-400 font-bold">{st.currentPressureBar.toFixed(1)} Bar</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive SVG Pipeline Schematic Diagram */}
      <div className="p-4 sm:p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>
              {lang === 'ar'
                ? 'مخطط التدفق الهيدروليكي اللحظي لشبكة خطوط الأنابيب (SCADA Pipeline Schematic)'
                : 'Real-Time SCADA Pipeline Flow Schematic'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-amber-400 rounded"></span>
              <span>48" GZ4 Gas Trunkline</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-sky-400 rounded"></span>
              <span>40" OT Crude Pipeline</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>dz-south-1 Gateway</span>
            </span>
          </div>
        </div>

        {/* SVG Pipeline Canvas */}
        <div className="w-full h-48 bg-slate-900/80 rounded-lg border border-slate-800/80 overflow-hidden relative">
          <svg viewBox="0 0 900 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Grid Pattern */}
            <defs>
              <pattern id="scada-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="900" height="200" fill="url(#scada-grid)" />

            {/* Pipeline 1: HMD -> HDH -> Ouargla -> Arzew (GZ4 48" Gas) */}
            <path
              d="M 120,60 L 320,60 L 520,60 L 800,60"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Flow Pulses */}
            <path
              d="M 120,60 L 320,60 L 520,60 L 800,60"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeDasharray="12 40"
              className="animate-pulse"
              opacity="0.8"
            />

            {/* Pipeline 2: HDH -> Touggourt -> Skikda (OT 40" Crude) */}
            <path
              d="M 320,60 L 320,140 L 520,140 L 800,140"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Flow Pulses */}
            <path
              d="M 320,60 L 320,140 L 520,140 L 800,140"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeDasharray="12 40"
              className="animate-pulse"
              opacity="0.8"
            />

            {/* Station 1: Hassi Messaoud (120, 60) */}
            <g transform="translate(120, 60)" className="cursor-pointer" onClick={() => setSelectedStationId('HMD-CP-01')}>
              <circle r={selectedStationId === 'HMD-CP-01' ? '18' : '12'} fill="#f59e0b" fillOpacity="0.25" className="animate-ping" />
              <circle r="9" fill={selectedStationId === 'HMD-CP-01' ? '#fbbf24' : '#f59e0b'} stroke="#ffffff" strokeWidth="2" />
              <text x="0" y="-18" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">HMD-01 (حاسي مسعود)</text>
              <text x="0" y="24" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace">68.4 Bar · 2,840 m³/h</text>
            </g>

            {/* Station 2: Haoud El Hamra Manifold (320, 60) */}
            <g transform="translate(320, 60)" className="cursor-pointer" onClick={() => setSelectedStationId('HDH-MANIFOLD-02')}>
              <circle r={selectedStationId === 'HDH-MANIFOLD-02' ? '18' : '12'} fill="#0ea5e9" fillOpacity="0.25" className="animate-ping" />
              <circle r="9" fill={selectedStationId === 'HDH-MANIFOLD-02' ? '#38bdf8' : '#0ea5e9'} stroke="#ffffff" strokeWidth="2" />
              <text x="0" y="-18" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">HDH-02 (حوض الحمراء)</text>
              <text x="0" y="24" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">64.2 Bar · ESD: OK</text>
            </g>

            {/* Station 3: Ouargla Edge Gateway (520, 60) */}
            <g transform="translate(520, 60)" className="cursor-pointer" onClick={() => setSelectedStationId('OUARGLA-EDGE-GATEWAY')}>
              <circle r={selectedStationId === 'OUARGLA-EDGE-GATEWAY' ? '20' : '14'} fill="#10b981" fillOpacity="0.3" className="animate-pulse" />
              <rect x="-10" y="-10" width="20" height="20" rx="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <text x="0" y="-18" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">dz-south-1 (ورقلة الحافة)</text>
              <text x="0" y="26" textAnchor="middle" fill="#34d399" fontSize="10" fontFamily="monospace">K8s Gateway · 1.8ms</text>
            </g>

            {/* Station 4: Touggourt Booster (520, 140) */}
            <g transform="translate(520, 140)" className="cursor-pointer" onClick={() => setSelectedStationId('TG-BOOSTER-03')}>
              <circle r={selectedStationId === 'TG-BOOSTER-03' ? '18' : '12'} fill="#0ea5e9" fillOpacity="0.25" className="animate-ping" />
              <circle r="9" fill={selectedStationId === 'TG-BOOSTER-03' ? '#38bdf8' : '#0ea5e9'} stroke="#ffffff" strokeWidth="2" />
              <text x="0" y="24" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">TG-03 (تقرت - Booster)</text>
              <text x="0" y="-16" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">71.0 Bar · 3,120 m³/h</text>
            </g>

            {/* Terminals Endpoints */}
            <g transform="translate(800, 60)">
              <rect x="-8" y="-8" width="16" height="16" fill="#475569" stroke="#94a3b8" />
              <text x="14" y="4" fill="#94a3b8" fontSize="10" fontFamily="monospace">➔ Arzew Port (أرزيو)</text>
            </g>
            <g transform="translate(800, 140)">
              <rect x="-8" y="-8" width="16" height="16" fill="#475569" stroke="#94a3b8" />
              <text x="14" y="4" fill="#94a3b8" fontSize="10" fontFamily="monospace">➔ Skikda Terminal (سكيكدة)</text>
            </g>
          </svg>
        </div>
      </div>

      {/* Active Station Real-Time Telemetry Dials & Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Hydraulic Pipeline Pressure */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{lang === 'ar' ? 'ضغط الأنبوب الهيدروليكي' : 'Hydraulic Pressure'}</span>
            <Gauge className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {activeStation.currentPressureBar.toFixed(1)}{' '}
            <span className="text-xs text-slate-400 font-normal">Bar</span>
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>نطاق الأمان: 60 - 75 Bar</span>
          </div>
        </div>

        {/* Metric 2: Flow Rate */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{lang === 'ar' ? 'معدل التدفق الحجمي' : 'Flow Rate'}</span>
            <Activity className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {activeStation.flowRateM3H.toLocaleString()}{' '}
            <span className="text-xs text-slate-400 font-normal">m³/h</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {activeStation.pipelineType.split('·')[0]}
          </div>
        </div>

        {/* Metric 3: Vibration & Mechanical Integrity */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{lang === 'ar' ? 'الاهتزاز التوربيني' : 'Turbine Vibration'}</span>
            <Radio className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {activeStation.vibrationMmS.toFixed(2)}{' '}
            <span className="text-xs text-slate-400 font-normal">mm/s</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">
            ISO 10816 Class A (&lt; 1.8 mm/s)
          </div>
        </div>

        {/* Metric 4: Cathodic Protection & ESD Status */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{lang === 'ar' ? 'صمام الأمان (ESD Valve)' : 'ESD Safety Valve'}</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold font-mono text-emerald-400 truncate">
            {activeStation.valveState === 'ARMED_OPEN'
              ? 'مؤمن / مفتوح (ARMED)'
              : activeStation.valveState === 'TESTING'
              ? 'جاري الاختبار (TESTING)'
              : 'معزول تلقائياً (ISOLATED)'}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            حماية كاثودية: {activeStation.cathodicVolts}V CSE
          </div>
        </div>
      </div>

      {/* Alert Banner if simulation active */}
      {scadaAlert && (
        <div className="p-3.5 rounded-lg border border-amber-600/80 bg-amber-950/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-semibold">
            <AlertTriangle className="w-4 h-4 animate-bounce shrink-0" />
            <span>{scadaAlert}</span>
          </div>
          <span className="font-mono text-amber-400 text-[11px] font-bold">Edge Auto-Resolution Active</span>
        </div>
      )}

      {/* Edge Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>
            {lang === 'ar'
              ? `المحطة المحددة: ${activeStation.nameAr} · ولاية ${activeStation.wilaya}`
              : `Active Node: ${activeStation.nameEn} · ${activeStation.wilaya}`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={triggerOverpressureDrill}
            disabled={isTestRunning}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-amber-300 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800 transition-colors disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'محاكاة ارتفاع الضغط (Overpressure Drill)' : 'Simulate Overpressure'}</span>
          </button>

          <button
            onClick={triggerEsdValveDrill}
            disabled={activeStation.valveState !== 'ARMED_OPEN'}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-sky-300 bg-sky-950/60 hover:bg-sky-900/60 border border-sky-800 transition-colors disabled:opacity-50"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'فحص صمام الأمان ESD (Trip Test)' : 'Test ESD Valve'}</span>
          </button>
        </div>
      </div>

      {/* Industrial Protocol Stream Inspector (Modbus / OPC UA / DNP3) */}
      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-mono font-bold text-slate-200">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ar' ? 'بث بروتوكولات الـ SCADA الصناعية (Industrial Protocol Stream):' : 'Industrial SCADA Protocol Feed:'}</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
            <button
              onClick={() => setProtocolViewMode('modbus')}
              className={`px-2.5 py-0.5 rounded transition-colors ${
                protocolViewMode === 'modbus' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400'
              }`}
            >
              Modbus/TCP
            </button>
            <button
              onClick={() => setProtocolViewMode('opcua')}
              className={`px-2.5 py-0.5 rounded transition-colors ${
                protocolViewMode === 'opcua' ? 'bg-slate-800 text-sky-400 font-bold' : 'text-slate-400'
              }`}
            >
              OPC-UA
            </button>
            <button
              onClick={() => setProtocolViewMode('dnp3')}
              className={`px-2.5 py-0.5 rounded transition-colors ${
                protocolViewMode === 'dnp3' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              DNP3
            </button>
          </div>
        </div>

        {/* Live Code / Register block */}
        <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
          {protocolViewMode === 'modbus' && (
            <>
              <div className="text-emerald-400">// Modbus TCP Frame on dz-south-1 Edge: IP 10.213.4.12:502 (Unit ID: 1)</div>
              <div>[READ_HOLDING_REGISTERS] Function 03: Register[40102] = {Math.round(activeStation.currentPressureBar * 100)} (Pressure_Bar: {activeStation.currentPressureBar.toFixed(2)})</div>
              <div>[READ_HOLDING_REGISTERS] Function 03: Register[40104] = {activeStation.flowRateM3H} (Flow_m3_h)</div>
              <div>[READ_DISCRETE_INPUTS]   Function 02: Register[10001] = 1 (ESD_Valve_Armed: TRUE)</div>
              <div className="text-slate-500 text-[10px]">CRC-16 Verified · Response Latency: 1.82ms · Encrypted over WireGuard VPN</div>
            </>
          )}

          {protocolViewMode === 'opcua' && (
            <>
              <div className="text-sky-400">// OPC UA Endpoint: opc.tcp://dz-south-edge.atlascloud.dz:4840/SonatrachTRC</div>
              <div>NodeId: "ns=2;s=Pipeline.OT40.{activeStation.id}.Pressure" -&gt; Value: {activeStation.currentPressureBar.toFixed(2)} Bar (Quality: Good, Timestamp: {new Date().toISOString()})</div>
              <div>NodeId: "ns=2;s=Pipeline.OT40.{activeStation.id}.Vibration" -&gt; Value: {activeStation.vibrationMmS.toFixed(2)} mm/s</div>
              <div>NodeId: "ns=2;s=Pipeline.OT40.{activeStation.id}.CathodicV" -&gt; Value: {activeStation.cathodicVolts} V CSE</div>
              <div className="text-slate-500 text-[10px]">SecurityPolicy: Basic256Sha256 · Micro-K8s Ingestion Agent</div>
            </>
          )}

          {protocolViewMode === 'dnp3' && (
            <>
              <div className="text-amber-400">// DNP3 Outstation Profile: Master dz-south-1 (Port 20000)</div>
              <div>Group 30 Var 1 (Analog Input 32-bit): Point 0 (Pipeline_Pressure) = {Math.round(activeStation.currentPressureBar * 10)} [Flags: ONLINE]</div>
              <div>Group 1 Var 1 (Binary Input): Point 3 (Overpressure_Relief_State) = {activeStation.status === 'ALERT' ? '1 [ALARM]' : '0 [NORMAL]'}</div>
              <div>Group 12 Var 1 (Control Relay Output Block): Trip Valve Pulse = {activeStation.valveState === 'ARMED_OPEN' ? 'ARMED' : 'TRIPPED'}</div>
              <div className="text-slate-500 text-[10px]">Unsolicited Reporting Enabled · Buffer Queue: 0 Drops</div>
            </>
          )}
        </div>

        {/* Audit Log Terminal */}
        <div className="font-mono text-[10px] text-slate-400 space-y-0.5 max-h-24 overflow-y-auto pt-1 border-t border-slate-800/80">
          {testLog.map((log, idx) => (
            <div key={idx} className="truncate">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
