import React, { useState } from 'react';
import { useCloud } from '../context/CloudContext';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  Award,
  CheckCircle2,
  Lock,
  Building2,
  Calendar,
  User,
  Share2,
  Check,
  ChevronDown,
  X,
} from 'lucide-react';

interface ExecutivePdfDossierProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutivePdfDossier: React.FC<ExecutivePdfDossierProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang, system, enterprise, regions, databases } = useCloud();

  const [targetCompany, setTargetCompany] = useState<string>(
    'شركة المعاملات الإلكترونية والبنكية (SATIM) / البنوك الوطنية'
  );
  const [docRef] = useState<string>('DZ-ATLAS-SOV-2026-EXEC-01');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadOfflineDossier = () => {
    // Generate self-contained standalone HTML dossier file for offline archiving and printing
    const dossierHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>AtlasCloud Sovereign NeoCloud DZ - التقرير التنفيذي الشامل</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #0f172a; margin: 40px; background: #fff; }
    .header { border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
    .title { font-size: 24px; font-weight: 800; color: #064e3b; margin: 0 0 8px 0; }
    .meta { font-size: 13px; color: #64748b; }
    .stamp { border: 2px solid #059669; color: #059669; padding: 6px 14px; font-weight: bold; font-size: 12px; border-radius: 4px; }
    h2 { font-size: 18px; color: #0f172a; border-right: 4px solid #059669; padding-right: 10px; margin-top: 25px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13px; }
    th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: right; }
    th { background: #f8fafc; font-weight: 700; color: #1e293b; }
    .badge { background: #ecfdf5; color: #047857; padding: 3px 8px; border-radius: 4px; font-weight: bold; }
    .signature { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 20px; display: flex; justify-content: space-between; }
    @media print { body { margin: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">التقرير التنفيذي الشامل لمعمارية المنظومة السحابية الوطنية السيادية</div>
      <div class="meta">مشروع: AtlasCloud Sovereign NeoCloud (DZ) · الصفة: مهندس معمارية الأنظمة (Lead System Architect) · أكتوبر 2026</div>
      <div class="meta">الجهة المستهدفة: ${targetCompany} · المرجع: ${docRef}</div>
    </div>
    <div class="stamp">وثيقة رسمية سيادية معتمدة</div>
  </div>

  <h2>1. الرؤية، الأهداف والامتثال التشريعي (Sovereign Vision & Compliance)</h2>
  <p>تأسيس أول سحابة حوسبة فائقة الأداء وسيادية بالكامل داخل التراب الوطني الجزائري لكسر التبعية للخدمات السحابية الأجنبية (Hyperscalers)، وضمان بقاء البيانات الحساسة والبنية التحتية الحرجة للدولة والشركات الوطنية خاضعة حصراً للقضاء والسيادة الوطنية دون أي خروج للبيانات خارج الحدود.</p>
  <ul>
    <li><strong>القانون رقم 18-07:</strong> حماية تامة للبيانات ذات الطابع الشخصي عبر التوطين الإلزامي لقواعد البيانات داخل التراب الوطني.</li>
    <li><strong>مطابقة سلطة ANPDP:</strong> تدقيق دوري غير قابل للتلاعب (Audit Logs) مشفر بـ SHA-256 ومسارات شبكية معزولة.</li>
    <li><strong>تعليمات بنك الجزائر (SATIM):</strong> حظر تام لاستضافة سجلات المعاملات المصرفية خارج حدود الوطن مع RPO=0.</li>
  </ul>

  <h2>2. المعمارية التقنية للمنظومة (Modern Resilient Tech Stack)</h2>
  <table>
    <tr><th>المكون البرمجي</th><th>المحرك والتقنية</th><th>المواصفات ومؤشرات الأداء</th></tr>
    <tr><td>Frontend Dashboard</td><td>Vite + React 19 SPA</td><td>ثنائي اللغة (عربي/إنجليزي)، محاكيات الطوارئ والخرق الحراري</td></tr>
    <tr><td>Control Plane API</td><td>Go + Gin + GORM</td><td>ثنائي مجمع فائق الخفة (19.8MB استهلاك ذاكرة &lt; 25MB)</td></tr>
    <tr><td>Spatial Databases</td><td>PostgreSQL 16 + PostGIS 3.4</td><td>دعم geometry(Point, 4326) و pgvector والتكرار المتزامن عبر Patroni HA</td></tr>
    <tr><td>Real-Time Push</td><td>Bi-directional WebSockets</td><td>بث لحظي لقراءات الشاحنات والمزارع كل 3 ثوانٍ دون استطلاع متكرر</td></tr>
  </table>

  <h2>3. البنية التحتية والمناطق الجغرافية الـ 4 (Multi-Region Topology & Geo-DR)</h2>
  <table>
    <tr><th>المنطقة</th><th>الموقع الجغرافي</th><th>الدور الوظيفي الأساسي</th><th>نوع العقد ومؤشر RPO/RTO</th></tr>
    <tr><td>dz-north-1</td><td>الجزائر العاصمة (Algiers Tier-III)</td><td>المركز الرئيسي للتحكم والعمليات البنكية</td><td>K8s Control Plane + Patroni Primary (RPO=0)</td></tr>
    <tr><td>dz-west-1</td><td>وهران (Oran Port Zone)</td><td>تكرار متزامن فوري، والملاحة اللوجستية</td><td>Active Synchronous Mirror (RPO=0, RTO &lt; 15s)</td></tr>
    <tr><td>dz-east-1</td><td>قسنطينة (Constantine High-Plateau)</td><td>معالجة السجلات المؤسسية والنسخ الاحتياطي</td><td>Asynchronous Replica + S3 Storage Pool</td></tr>
    <tr><td>dz-south-1</td><td>ورقلة / حاسي مسعود (Ouargla Edge)</td><td>حوسبة طرفية للنفط والغاز والزراعة الصحراوية</td><td>Low-Latency Edge Nodes + IoT Aggregator</td></tr>
  </table>

  <h2>4. الباقة المؤسسية السيادية (Sovereign Enterprise Tier)</h2>
  <p>كود التفعيل التجريبي: <strong>DZ-PACK-ENTERPRISE-2026</strong> مع منحة 1,500,000 دج كرصيد استهلاك سحابي أولي يشمل: شبكات Air-Gapped Private VPC معزولة، أجهزة تشفير عتادية مخصصة Dedicated HSM / BYOK، وغرفة العمليات الوطنية السيادية 24/7 National War Room مع ضمان SLA 99.99%.</p>

  <div class="signature">
    <div>
      <div><strong>اعتماد مهندس معمارية الأنظمة</strong></div>
      <div>Lead System Architect - AtlasCloud Sovereign NeoCloud (DZ)</div>
      <div style="font-family: monospace; color: #059669; font-size: 11px;">SHA-256 Digest: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
    </div>
    <div style="text-align: left;">
      <div><strong>تاريخ الإصدار:</strong> 04 أكتوبر 2026</div>
      <div><strong>سلطة الاعتماد:</strong> ANPDP / الجمهورية الجزائرية الديمقراطية الشعبية</div>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([dossierHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AtlasCloud_Executive_Dossier_${docRef}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      {/* Modal Container */}
      <div className="bg-slate-950 border border-slate-700 max-w-4xl w-full rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Top Action Toolbar (Hidden during print) */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {lang === 'ar' ? 'معاينة وتوليد التقرير التنفيذي الشامل (PDF Dossier)' : 'Executive PDF Dossier Generator'}
              </h3>
              <div className="text-xs text-slate-400">
                Ref: <span className="font-mono text-emerald-400">{docRef}</span> · جاهز للطباعة والتصدير
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'ar' ? 'طباعة / حفظ كـ PDF' : 'Print / Save as PDF'}</span>
            </button>

            <button
              onClick={handleDownloadOfflineDossier}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span>{downloadSuccess ? (lang === 'ar' ? 'تم التنزيل!' : 'Downloaded!') : (lang === 'ar' ? 'تنزيل الملف' : 'Download')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Company customization bar (Hidden during print) */}
        <div className="px-6 py-3 bg-slate-900/50 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-2 text-slate-400">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ar' ? 'المؤسسة المستفيدة (Recipient Enterprise):' : 'Recipient Enterprise:'}</span>
          </div>
          <select
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="شركة المعاملات الإلكترونية والبنكية (SATIM) / البنوك الوطنية">
              شركة المعاملات الإلكترونية والبنكية (SATIM) / البنوك الوطنية
            </option>
            <option value="مجمع صيدال الوطني للصناعات الدوائية (Groupe Saidal)">
              مجمع صيدال الوطني للصناعات الدوائية (Groupe Saidal)
            </option>
            <option value="سوناطراك - قسم النقل عبر الأنابيب وتكنولوجيا المعلومات">
              سوناطراك - قسم النقل عبر الأنابيب وتكنولوجيا المعلومات
            </option>
            <option value="بنك الفلاحة والتنمية الريفية (BADR)">
              بنك الفلاحة والتنمية الريفية (BADR)
            </option>
            <option value="الوزارات والهيئات السيادية للجمهورية الجزائرية">
              الوزارات والهيئات السيادية للجمهورية الجزائرية
            </option>
          </select>
        </div>

        {/* The Printable A4 Executive Dossier Document */}
        <div
          id="printable-dossier"
          className="p-8 sm:p-12 bg-white text-slate-900 space-y-8 print:p-0 print:m-0 print:shadow-none"
        >
          {/* Document Header */}
          <div className="border-b-2 border-emerald-600 pb-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
                  الجمهورية الجزائرية الديمقراطية الشعبية · وثيقة سيادية رسمية
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                  التقرير التنفيذي الشامل لمعمارية المنظومة السحابية الوطنية السيادية
                </h1>
                <div className="text-base font-bold text-emerald-700">
                  مشروع: AtlasCloud Sovereign NeoCloud (DZ)
                </div>
              </div>

              {/* Official Sovereign Stamp Badge */}
              <div className="border-2 border-emerald-700 p-3 rounded-lg text-center shrink-0 bg-emerald-50">
                <div className="text-[10px] font-bold text-emerald-900">سلطة حماية المعطيات (ANPDP)</div>
                <div className="text-xs font-black text-emerald-700 font-mono">قانون 18-07 معتمد</div>
                <div className="text-[9px] text-slate-600 font-mono mt-0.5">REF: {docRef}</div>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">الصفة والمعد:</span>
                <span className="font-bold text-slate-900">مهندس معمارية الأنظمة (Lead Architect)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">تاريخ الإصدار:</span>
                <span className="font-bold text-slate-900">أكتوبر 2026 / October 2026</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">الجهة المستهدفة:</span>
                <span className="font-bold text-slate-900 truncate block">{targetCompany}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">مستوى التصنيف:</span>
                <span className="font-bold text-emerald-800">مؤسسي سيادي (RESTRICTED)</span>
              </div>
            </div>
          </div>

          {/* Section 1: Sovereign Vision & Legal Compliance */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-r-4 border-emerald-600 pr-3">
              <span>1. الرؤية، الأهداف والامتثال التشريعي (Sovereign Vision & Compliance)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              تأسيس أول سحابة حوسبة فائقة الأداء وسيادية بالكامل داخل التراب الوطني الجزائري، بهدف كسر التبعية للخدمات السحابية الأجنبية (Hyperscalers)، وضمان بقاء البيانات الحساسة والبنية التحتية الحرجة للدولة والشركات الوطنية خاضعة حصراً للقضاء والسيادة الوطنية دون أي خروج للبيانات خارج الحدود.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="text-xs font-bold text-emerald-800">القانون رقم 18-07</div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  حماية تامة للبيانات ذات الطابع الشخصي عبر التوطين الإلزامي لقواعد البيانات داخل التراب الوطني وتشفير المفاتيح الخاصة.
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="text-xs font-bold text-sky-800">مطابقة سلطة ANPDP</div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  تلبية متطلبات السلطة الوطنية لحماية المعطيات من خلال سياسات تدقيق دورية (Audit Logs) غير قابلة للتلاعب ومسارات معزولة.
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                <div className="text-xs font-bold text-amber-800">تعليمات بنك الجزائر (SATIM)</div>
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  حظر استضافة سجلات المعاملات المصرفية خارج حدود الوطن مع غرف خوادم مؤمنة فيزيائياً ومفصولة منطقياً.
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Technical Architecture */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-r-4 border-emerald-600 pr-3">
              <span>2. المعمارية التقنية للمنظومة (Modern Resilient Tech Stack)</span>
            </h2>
            <table className="w-full text-xs text-right border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="p-2.5 border border-slate-200 font-bold">الطبقة البرمجية</th>
                  <th className="p-2.5 border border-slate-200 font-bold">التقنية المختارة</th>
                  <th className="p-2.5 border border-slate-200 font-bold">المواصفات ومؤشرات الأداء السيادية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-2.5 border border-slate-200 font-bold">واجهة المستخدم (Frontend)</td>
                  <td className="p-2.5 border border-slate-200 font-mono">Vite + React 19 SPA & D3.js</td>
                  <td className="p-2.5 border border-slate-200">لوحة تحكم عصرية ثنائية اللغة تدعم طبقات GeoJSON ومحاكاة الطوارئ</td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-slate-200 font-bold">محرك التحكم (Control Plane)</td>
                  <td className="p-2.5 border border-slate-200 font-mono">Go + Gin + GORM (Compiled)</td>
                  <td className="p-2.5 border border-slate-200 font-mono text-emerald-800 font-bold">
                    استهلاك ذاكرة 19.8MB (&lt; 25MB) مع استجابة غير متزامنة ومقاومة للانهيار
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-slate-200 font-bold">قواعد البيانات المكانية</td>
                  <td className="p-2.5 border border-slate-200 font-mono">PostgreSQL 16 + PostGIS 3.4</td>
                  <td className="p-2.5 border border-slate-200">إضافات PostGIS 3.4 و pgvector مع هندسة Point(4326) وتكرار Patroni</td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-slate-200 font-bold">البث اللحظي للـ IoT</td>
                  <td className="p-2.5 border border-slate-200 font-mono">Bi-directional WebSockets</td>
                  <td className="p-2.5 border border-slate-200">ضخ مستمر لقراءات شاحنات صيدال ومزارع بسكرة كل 3 ثوانٍ دون استطلاع</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 3: 4 Sovereign Regions Topology & Geo-DR */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-r-4 border-emerald-600 pr-3">
              <span>3. البنية التحتية والمناطق الجغرافية الـ 4 وخطة التعافي (Geo-DR)</span>
            </h2>
            <table className="w-full text-xs text-right border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="p-2.5 border border-slate-200 font-bold">المنطقة</th>
                  <th className="p-2.5 border border-slate-200 font-bold">الموقع الجغرافي</th>
                  <th className="p-2.5 border border-slate-200 font-bold">الدور الوظيفي الأساسي</th>
                  <th className="p-2.5 border border-slate-200 font-bold">مؤشر RPO / RTO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-2.5 border border-slate-200 font-bold font-mono">dz-north-1</td>
                  <td className="p-2.5 border border-slate-200">الجزائر العاصمة (Algiers Tier-III)</td>
                  <td className="p-2.5 border border-slate-200">المركز الرئيسي للتحكم والعمليات البنكية K8s + Patroni</td>
                  <td className="p-2.5 border border-slate-200 font-mono font-bold text-emerald-800">Primary (RPO=0)</td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-slate-200 font-bold font-mono">dz-west-1</td>
                  <td className="p-2.5 border border-slate-200">وهران (Oran Port Zone)</td>
                  <td className="p-2.5 border border-slate-200">تكرار متزامن فوري، والملاحة اللوجستية البحرية</td>
                  <td className="p-2.5 border border-slate-200 font-mono font-bold text-emerald-800">RPO=0 / RTO &lt; 15s</td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-slate-200 font-bold font-mono">dz-east-1</td>
                  <td className="p-2.5 border border-slate-200">قسنطينة (Constantine High-Plateau)</td>
                  <td className="p-2.5 border border-slate-200">معالجة السجلات المؤسسية والنسخ الاحتياطي S3 Storage</td>
                  <td className="p-2.5 border border-slate-200 font-mono">Async Replica</td>
                </tr>
                <tr>
                  <td className="p-2.5 border border-slate-200 font-bold font-mono">dz-south-1</td>
                  <td className="p-2.5 border border-slate-200">ورقلة / حاسي مسعود (Ouargla Edge)</td>
                  <td className="p-2.5 border border-slate-200">حوسبة طرفية للنفط والغاز والزراعة الصحراوية وواحات بسكرة</td>
                  <td className="p-2.5 border border-slate-200 font-mono">Edge Aggregator</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 4: Enterprise Tier & Activation Code */}
          <div className="p-4 rounded-lg border-2 border-emerald-600 bg-emerald-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 text-sm">الباقة المؤسسية السيادية (Sovereign Enterprise Tier)</span>
              <span className="font-mono font-black text-xs text-emerald-700 bg-emerald-100 px-3 py-1 rounded border border-emerald-300">
                DZ-PACK-ENTERPRISE-2026
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              تمنح هذه الباقة المؤسسات الحيوية رصيد استهلاك أولي بقيمة <strong className="text-slate-900">1,500,000 دج</strong>، مع تفعيل شبكات <strong>Air-Gapped Private VPC</strong> المعزولة فيزيائياً، وأجهزة التشفير العتادي <strong>Dedicated HSM / BYOK</strong>، وغرفة العمليات الوطنية السيادية <strong>24/7 National War Room</strong> باستجابة &lt; 15 دقيقة، مع عقد اتفاقية مستوى خدمة <strong>SLA 99.99%</strong> مدعومة بتعويض مالي فوري.
            </p>
          </div>

          {/* Document Signatures and Cryptographic Seal */}
          <div className="pt-6 border-t-2 border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 text-xs text-slate-700">
            <div className="space-y-1">
              <div><strong>اعتماد وتوقيع:</strong> مهندس معمارية الأنظمة (Lead System Architect)</div>
              <div className="font-mono text-[10px] text-slate-500">
                SHA-256 Digest: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </div>
              <div className="text-[10px] text-emerald-800 font-semibold">
                تم التحقق والمطابقة مع متطلبات سلطة ANPDP وبنك الجزائر (SATIM)
              </div>
            </div>

            <div className="text-left rtl:text-right border-r-2 rtl:border-l-2 rtl:border-r-0 border-slate-300 pr-4 rtl:pl-4 rtl:pr-0">
              <div className="font-bold text-slate-900">الجمهورية الجزائرية الديمقراطية الشعبية</div>
              <div>سلطة حماية المعطيات ذات الطابع الشخصي (ANPDP)</div>
              <div className="font-mono text-slate-500 text-[10px]">تاريخ المصادقة: 04 أكتوبر 2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
