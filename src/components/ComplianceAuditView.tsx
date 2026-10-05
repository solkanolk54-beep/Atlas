import React, { useState } from 'react';
import { useCloud } from '../context/CloudContext';
import {
  ShieldCheck,
  FileCheck,
  Lock,
  Download,
  CheckCircle2,
  Search,
  ExternalLink,
  Award,
} from 'lucide-react';

export const ComplianceAuditView: React.FC = () => {
  const { lang, auditLogs, system } = useCloud();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCertModal, setShowCertModal] = useState<boolean>(false);

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.law1807Clause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.sha256Hash.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-mono text-emerald-400 mb-1">
            07. Legislative Compliance & ANPDP Audit Vault
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>{lang === 'ar' ? 'سجل الامتثال والتدقيق القانوني (القانون 18-07 وبنك الجزائر)' : 'Law 18-07 & Central Bank Compliance Audit Vault'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            {lang === 'ar'
              ? 'مستودع تدقيق سيادي غير قابل للتلاعب يوثق الامتثال التام لقانون حماية المعطيات ذات الطابع الشخصي 18-07، ومتطلبات سلطة ANPDP، وتعليمات بنك الجزائر لشبكة SATIM.'
              : 'Immutable cryptographic audit trail enforcing compliance with Algerian Personal Data Protection Law 18-07, ANPDP directives, and Bank of Algeria interbank switch rules.'}
          </p>
        </div>

        <button
          onClick={() => setShowCertModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          <Award className="w-4 h-4" />
          <span>{lang === 'ar' ? 'عرض شهادة اعتماد ANPDP الرسمية' : 'View Official ANPDP Certificate'}</span>
        </button>
      </div>

      {/* 3 Pillars of Algerian Compliance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 font-bold">LAW 18-07</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              MANDATORY
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">
            {lang === 'ar' ? 'التوطين الإلزامي وتشفير البيانات' : 'Mandatory Data Localization'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === 'ar'
              ? 'حظر نقل أو نسخ أو استضافة البيانات الحساسة أو الشخصية خارج الحدود الوطنية، مع اشتراط تشفير البيانات أثناء النقل والتخزين.'
              : 'Absolute prohibition on transferring or caching sensitive citizen records outside national borders; mandatory zero-egress enforcement.'}
          </p>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
            Article 07 & 24 Compliance: 100%
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-sky-400 font-bold">ANPDP REGISTRY</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
              AUDITED
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">
            {lang === 'ar' ? 'سجلات التدقيق الدورية وسلطة ANPDP' : 'Periodic Audit & Isolation Logs'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === 'ar'
              ? 'توليد سجلات تدقيق مشفرة بتوقيع SHA-256 لكل عملية وصول لقواعد البيانات المكانية والمصرفية، محفوظة في هضبة قسنطينة (dz-east-1).'
              : 'Automated cryptographic SHA-256 audit generation for every database read/write operation, permanently vaulted in Constantine dz-east-1.'}
          </p>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
            Inspection ID: ANPDP-DZ-2026-X9
          </div>
        </div>

        <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-amber-400 font-bold">BANK OF ALGERIA</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
              SATIM CERTIFIED
            </span>
          </div>
          <h3 className="text-sm font-bold text-white">
            {lang === 'ar' ? 'معايير البيانات المصرفية والمالية' : 'Interbank Financial Security'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {lang === 'ar'
              ? 'غرف خوادم مؤمنة فيزيائياً ومفصولة منطقياً في الجزائر العاصمة ووهران، تضمن استمرار العمليات المصرفية حتى في حالات انقطاع الكوابل الدولية.'
              : 'Physically secured server vaults in Algiers & Oran, ensuring seamless continuous payment processing even during international subsea fiber cuts.'}
          </p>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
            Banking Resiliency: RPO = 0
          </div>
        </div>
      </div>

      {/* Cryptographic Audit Logs Vault */}
      <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <span>{lang === 'ar' ? 'سجل التدقيق الآلي المشفر (Cryptographic Audit Vault)' : 'Tamper-Evident Audit Trail'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? 'سجلات موثقة ببصمة SHA-256 للعمليات السحابية الحساسة'
                : 'Cryptographically hashed immutable events verified against national compliance rules'}
            </p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute top-3 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'بحث في السجلات أو البصمات...' : 'Search actors, hashes...'}
              className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg py-2 pr-9 pl-3 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 w-64 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3 font-semibold">ID & Timestamp</th>
                <th className="py-2.5 px-3 font-semibold">Actor</th>
                <th className="py-2.5 px-3 font-semibold">Action & Resource</th>
                <th className="py-2.5 px-3 font-semibold">Legal Clause (18-07)</th>
                <th className="py-2.5 px-3 font-semibold">SHA-256 Digest</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{log.id}</div>
                    <div className="text-[10px] text-slate-500">{log.timestamp}</div>
                  </td>
                  <td className="py-3 px-3 text-sky-400">{log.actor}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-200">{log.action}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{log.resource}</div>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300">{log.law1807Clause}</td>
                  <td className="py-3 px-3 text-[10px] text-slate-400 truncate max-w-[120px]" title={log.sha256Hash}>
                    {log.sha256Hash.slice(0, 14)}...
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Certificate Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-slate-950 border border-emerald-700/80 rounded-2xl p-6 sm:p-8 space-y-6 relative shadow-2xl">
            <div className="text-center space-y-2 border-b border-slate-800 pb-4">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-400 mb-1">
                <Award className="w-8 h-8" />
              </div>
              <div className="text-xs font-mono text-emerald-400">
                الجمهورية الجزائرية الديمقراطية الشعبية
              </div>
              <h3 className="text-xl font-bold text-white">
                شهادة الامتثال الوطني للسيادة الرقمية وتوطين البيانات
              </h3>
              <p className="text-xs text-slate-400">
                السلطة الوطنية لحماية المعطيات ذات الطابع الشخصي (ANPDP)
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <p>
                تشهد السلطة الوطنية بأن منصة الحوسبة السحابية <strong className="text-white">AtlasCloud Sovereign NeoCloud DZ</strong> قد استوفت كافة الشروط والمعايير التقنية والأمنية المنصوص عليها في <strong className="text-emerald-400">القانون رقم 18-07</strong> المؤرخ في 10 يونيو 2018 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800/80">
                <div>
                  <span className="text-slate-500 block">رقم الاعتماد:</span>
                  <span className="text-white font-bold">DZ-ANPDP-2026-SOV-001</span>
                </div>
                <div>
                  <span className="text-slate-500 block">نطاق التوطين:</span>
                  <span className="text-emerald-400 font-bold">المراكز الأربعة (الجزائر، وهران، قسنطينة، ورقلة)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">تشفير المفاتيح:</span>
                  <span className="text-white">BYOK / FIPS 140-3 Level 4</span>
                </div>
                <div>
                  <span className="text-slate-500 block">تاريخ الإصدار:</span>
                  <span className="text-white">أكتوبر 2026</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCertModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                {lang === 'ar' ? 'إغلاق النافذة' : 'Close'}
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                {lang === 'ar' ? 'طباعة / حفظ الشهادة' : 'Print / Export Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
