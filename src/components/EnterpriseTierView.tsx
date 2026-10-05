import React, { useState } from 'react';
import { useCloud } from '../context/CloudContext';
import {
  Award,
  ShieldCheck,
  Key,
  PhoneCall,
  Lock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FileCheck,
} from 'lucide-react';

export const EnterpriseTierView: React.FC = () => {
  const { lang, enterprise, activateVoucher, rotateHsmKey } = useCloud();
  const [inputCode, setInputCode] = useState<string>('DZ-PACK-ENTERPRISE-2026');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = activateVoucher(inputCode);
    if (res.success) {
      setMessage({ text: res.message, type: 'success' });
    } else {
      setMessage({ text: res.message, type: 'error' });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Banner */}
      <div className="border-b border-slate-800 pb-4">
        <div className="text-xs font-mono text-emerald-400 mb-1">
          05. Sovereign Enterprise Model & BYOK Security
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Award className="w-6 h-6 text-emerald-400" />
          <span>{lang === 'ar' ? 'نموذج الأعمال والباقة المؤسسية السيادية' : 'Sovereign Enterprise Tier & Security Pack'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          {lang === 'ar'
            ? 'باقة مهندسة خصيصاً للمؤسسات الحيوية والقطاعات السيادية (البنوك، سوناطراك، ومجمعات الصناعات الدوائية) مع دعم غرف العمليات الوطنية 24/7 والتشفير العتادي BYOK.'
            : 'Custom engineered tier for critical state infrastructure, national banks, energy giants, and pharmaceutical leaders with dedicated HSMs and 24/7 sovereign war room response.'}
        </p>
      </div>

      {/* Activation Box */}
      <div className="p-6 rounded-xl border border-emerald-900/60 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-slate-900/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'رمز التفعيل التجريبي للمؤسسات السيادية' : 'Sovereign Enterprise Trial Activation'}</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              {lang === 'ar' ? 'منحة 1,500,000 دج كرصيد استهلاك سحابي أولي' : '1,500,000 DZD Initial Sovereign Cloud Grant'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {lang === 'ar'
                ? 'أدخل الكود DZ-PACK-ENTERPRISE-2026 لتفعيل كافة المزايا غير المحدودة لحساب مؤسستك فوراً'
                : 'Enter code DZ-PACK-ENTERPRISE-2026 to activate unlimited enterprise capabilities and grant'}
            </p>
          </div>

          <div className="text-right rtl:text-left shrink-0">
            <div className="text-[11px] text-slate-400 font-mono">SOVEREIGN BALANCE</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {enterprise.balanceDzd.toLocaleString()} دج
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              {enterprise.isActivated ? 'ENTERPRISE_UNLOCKED' : 'STANDARD_TIER'}
            </div>
          </div>
        </div>

        {/* Voucher Form */}
        <form onSubmit={handleActivate} className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="DZ-PACK-ENTERPRISE-2026"
            className="flex-1 bg-slate-950 border border-slate-700 text-white font-mono text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:border-emerald-500 uppercase"
          />
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-md shadow-emerald-500/20"
          >
            {lang === 'ar' ? 'تفعيل الباقة واعتماد الرصيد' : 'Activate & Grant 1,500,000 DZD'}
          </button>
        </form>

        {message && (
          <div
            className={`p-3 rounded-lg text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                : 'bg-rose-950/80 border border-rose-800 text-rose-300'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* 4 Sovereign Enterprise Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Air-Gapped Private VPC */}
        <div
          className={`p-6 rounded-xl border transition-all ${
            enterprise.featuresUnlocked.airGappedVpc
              ? 'border-emerald-700/80 bg-slate-900/60'
              : 'border-slate-800 bg-slate-900/30 opacity-70'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded ${
                enterprise.featuresUnlocked.airGappedVpc
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {enterprise.featuresUnlocked.airGappedVpc ? 'ACTIVE & ISOLATED' : 'LOCKED'}
            </span>
          </div>

          <h3 className="text-base font-bold text-white mb-2">
            {lang === 'ar' ? 'شبكات Air-Gapped Private VPC معزولة فيزيائياً' : 'Air-Gapped Private VPC Networks'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {lang === 'ar'
              ? 'شبكات سحابية افتراضية معزولة تماماً فيزيائياً عن شبكة الإنترنت العامة مع تشفير كامل للأنفاق دون أي وصول خارجي عبر الحدود.'
              : 'Physically isolated private virtual clouds completely disconnected from public internet transit, featuring post-quantum encrypted tunnels.'}
          </p>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Backbone Mode:</span>
              <span className="text-slate-200">Dark Fiber Sovereign Mesh</span>
            </div>
            <div className="flex justify-between">
              <span>Egress Policy:</span>
              <span className="text-emerald-400 font-bold">STRICT_ZERO_CROSS_BORDER</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Dedicated HSM / BYOK */}
        <div
          className={`p-6 rounded-xl border transition-all ${
            enterprise.featuresUnlocked.dedicatedHsmByok
              ? 'border-emerald-700/80 bg-slate-900/60'
              : 'border-slate-800 bg-slate-900/30 opacity-70'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
              <Key className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded ${
                enterprise.featuresUnlocked.dedicatedHsmByok
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {enterprise.featuresUnlocked.dedicatedHsmByok ? 'BYOK_ENABLED' : 'LOCKED'}
            </span>
          </div>

          <h3 className="text-base font-bold text-white mb-2">
            {lang === 'ar' ? 'أجهزة تشفير عتادية مخصصة (Dedicated HSM / BYOK)' : 'Dedicated HSM & Bring-Your-Own-Key'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {lang === 'ar'
              ? 'أجهزة تشفير عتادية مخصصة (Hardware Security Modules) مع إمكانية إحضار المؤسسة لمفاتيح التشفير الخاصة بها دون وصول لمزود الخدمة.'
              : 'FIPS 140-3 Level 4 hardware encryption modules allowing sovereign entities to hold private keys with zero provider visibility.'}
          </p>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
            <div className="text-xs font-mono">
              <span className="text-slate-400">Active Master Keys: </span>
              <span className="text-white font-bold">{enterprise.hsmKeyCount} RSA-4096 / Ed25519</span>
            </div>
            {enterprise.featuresUnlocked.dedicatedHsmByok && (
              <button
                onClick={rotateHsmKey}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono text-sky-300 bg-sky-950 border border-sky-800 rounded hover:bg-sky-900 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Rotate Key</span>
              </button>
            )}
          </div>
        </div>

        {/* Pillar 3: 24/7 National Sovereign War Room */}
        <div
          className={`p-6 rounded-xl border transition-all ${
            enterprise.featuresUnlocked.sovereignWarRoom
              ? 'border-emerald-700/80 bg-slate-900/60'
              : 'border-slate-800 bg-slate-900/30 opacity-70'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded ${
                enterprise.featuresUnlocked.sovereignWarRoom
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {enterprise.featuresUnlocked.sovereignWarRoom ? 'HOTLINE_ACTIVE' : 'LOCKED'}
            </span>
          </div>

          <h3 className="text-base font-bold text-white mb-2">
            {lang === 'ar' ? 'غرفة العمليات الوطنية السيادية 24/7 (War Room)' : '24/7 Sovereign War Room Hotline'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {lang === 'ar'
              ? 'دعم هندسي وسيبراني مباشر من مهندسين جزائريين معتمدين مع زمن استجابة للطوارئ أقل من 15 دقيقة داخل الوطن.'
              : 'Dedicated national engineering and cyber defense team on standby 24/7 with a sub-15 minute on-site emergency response SLA.'}
          </p>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Emergency Response Time:</span>
              <span className="text-emerald-400 font-bold">&lt; 15 Minutes</span>
            </div>
            <div className="flex justify-between">
              <span>National Operations Center:</span>
              <span className="text-slate-200">Algiers Ben Aknoun / Oran Hub</span>
            </div>
          </div>
        </div>

        {/* Pillar 4: Sovereign SLA Agreement */}
        <div
          className={`p-6 rounded-xl border transition-all ${
            enterprise.featuresUnlocked.slaFinancialGuarantee
              ? 'border-emerald-700/80 bg-slate-900/60'
              : 'border-slate-800 bg-slate-900/30 opacity-70'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded ${
                enterprise.featuresUnlocked.slaFinancialGuarantee
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {enterprise.featuresUnlocked.slaFinancialGuarantee ? 'FINANCIALLY_BACKED' : 'LOCKED'}
            </span>
          </div>

          <h3 className="text-base font-bold text-white mb-2">
            {lang === 'ar' ? 'اتفاقية مستوى الخدمة (SLA 99.99%) بضمان مالي' : '99.99% Sovereign SLA Guarantee'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {lang === 'ar'
              ? 'ضمان توافر بنسبة 99.99% مع تعويضات مالية فورية للمؤسسة في حال أي إخلال تشغيلي، بموجب القانون الجزائري.'
              : 'Guaranteed 99.99% uptime with immediate financial reimbursement escrow in the event of operational downtime under Algerian commercial code.'}
          </p>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Uptime Guarantee:</span>
              <span className="text-emerald-400 font-bold">99.99%</span>
            </div>
            <div className="flex justify-between">
              <span>Penalty Escrow:</span>
              <span className="text-slate-200">100% Bill Credit Compensation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
