import React, { useState } from 'react';
import { useCloud } from '../context/CloudContext';
import {
  FileCode,
  Play,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Database,
  Radio,
  Server,
  Layers,
  CheckCircle,
} from 'lucide-react';

interface EndpointSpec {
  method: 'GET' | 'POST' | 'WS';
  path: string;
  tag: string;
  summaryAr: string;
  summaryEn: string;
  descriptionAr: string;
  descriptionEn: string;
  parameters: Array<{ name: string; type: string; in: string; required: boolean; description: string }>;
  responseExample: any;
}

export const SwaggerApiDocs: React.FC = () => {
  const { lang, system, databases, iotRecords } = useCloud();

  const [expandedEndpoints, setExpandedEndpoints] = useState<Record<string, boolean>>({
    'GET-/api/v1/system/overview': true,
    'GET-/api/v1/databases/postgis': false,
    'WS-/ws/v1/iot/stream': false,
  });

  const [executing, setExecuting] = useState<Record<string, boolean>>({});
  const [responseOutputs, setResponseOutputs] = useState<Record<string, any>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const endpoints: EndpointSpec[] = [
    {
      method: 'GET',
      path: '/api/v1/system/overview',
      tag: 'System & Control Plane',
      summaryAr: 'جلب مؤشرات التوافر الحي وحالة التزامن وشهادة الامتثال',
      summaryEn: 'Get live cluster availability, Patroni replication, and ANPDP certification',
      descriptionAr:
        'يزود لوحة القيادة بنسبة التوافر الحي (99.99%)، عدد عقد Kubernetes (12 Nodes)، حالة مزامنة PostgreSQL عبر Patroni، وتأكيد شهادة الامتثال ANPDP للقانون 18-07.',
      descriptionEn:
        'Provides real-time uptime metrics (99.99%), 12 K8s worker node health, Patroni sync status, and Law 18-07 ANPDP compliance certification.',
      parameters: [
        {
          name: 'region',
          type: 'string',
          in: 'query',
          required: false,
          description: 'Filter overview by sovereign region (e.g. dz-north-1, dz-west-1)',
        },
      ],
      responseExample: {
        status: 'SUCCESS',
        code: 200,
        timestamp: new Date().toISOString(),
        cluster_status: system.clusterStatus,
        uptime_sla_percentage: system.uptimePercentage,
        kubernetes: {
          total_nodes: system.k8sNodesTotal,
          healthy_nodes: system.k8sNodesHealthy,
          control_plane: 'dz-north-1 (Algiers Tier-III)',
        },
        patroni_ha: {
          sync_status: system.patroniSyncStatus,
          active_leader: system.activePrimaryRegion,
          sync_standby: system.standbyMirrorRegion,
          rpo_bytes_loss: 0,
        },
        compliance: {
          law_18_07: 'COMPLIANT_MANDATORY_LOCALIZATION',
          authority: 'ANPDP (Autorité Nationale de Protection des Données)',
          bank_of_algeria: 'SATIM_SWITCH_LOCALIZED_ZERO_EGRESS',
        },
        engine_runtime: {
          binary_footprint_mb: system.memoryFootprintMB,
          median_latency_ms: system.medianLatencyMs,
        },
      },
    },
    {
      method: 'GET',
      path: '/api/v1/databases/postgis',
      tag: 'Spatial Databases',
      summaryAr: 'جلب مثيلات قواعد البيانات المكانية المدارة والإضافات المفعلة',
      summaryEn: 'Retrieve managed PostGIS spatial database clusters and extensions',
      descriptionAr:
        'جلب مباشر لكافة مثيلات قواعد البيانات المكانية المدارة (db-satim-gis-prod، db-felaha-agri-map) مع كشف الإضافات المفعلة ونوع التكرار.',
      descriptionEn:
        'Fetches managed PostGIS 3.4 instances, active extensions (postgis, pgvector, topology), and spatial SRID geometry configuration.',
      parameters: [
        {
          name: 'engine',
          type: 'string',
          in: 'query',
          required: false,
          description: 'Filter by engine type (default: postgresql-16-postgis)',
        },
      ],
      responseExample: {
        status: 'SUCCESS',
        code: 200,
        instances_count: databases.length,
        databases: databases,
      },
    },
    {
      method: 'WS',
      path: '/ws/v1/iot/stream',
      tag: 'Real-Time Telemetry',
      summaryAr: 'بث لحظي ثنائي الاتجاه لقراءات الشاحنات المبردة وحساسات المزارع',
      summaryEn: 'Bi-directional WebSocket push stream for cold logistics & farm sensors',
      descriptionAr:
        'بث لحظي مستمر لقراءات شاحنات الأدوية (Saidal)، وشاحنات المواد الغذائية المبردة، ومزارع بسكرة الزيتونية مع إحداثيات GPS ونسب الرطوبة ودرجات الحرارة كل 3 ثوانٍ.',
      descriptionEn:
        'Continuous 3-second streaming feed of Saidal vaccine cold chain, perishable transport, and Biskra smart grove soil telemetry with Point(4326) coordinates.',
      parameters: [
        {
          name: 'channels',
          type: 'string',
          in: 'query',
          required: false,
          description: 'Subscribed channels: pharma, cold_food, smart_agri (default: all)',
        },
      ],
      responseExample: {
        stream: '/ws/v1/iot/stream',
        frequency: '3000ms',
        protocol: 'WSS / TLS 1.3',
        sample_packet: {
          device_id: 'SAIDAL-PHARMA-TRK-01',
          temperature: -20.2,
          humidity: 42,
          wkt_geom: 'POINT(3.8967 36.3748)',
          srid: 4326,
          integrity_hash: '7d793037a0760186574b0282f2f435e7',
        },
      },
    },
  ];

  const toggleEndpoint = (key: string) => {
    setExpandedEndpoints((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleExecute = (key: string, endpoint: EndpointSpec) => {
    setExecuting((prev) => ({ ...prev, [key]: true }));

    setTimeout(() => {
      setResponseOutputs((prev) => ({
        ...prev,
        [key]: {
          statusCode: 200,
          statusText: 'OK',
          latencyMs: 3.2,
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'x-sovereign-region': system.activePrimaryRegion,
            'x-compliance-authority': 'ANPDP_ALGERIA',
            'x-law-18-07': 'VALIDATED',
            'x-engine': 'AtlasCloud-Go-Gin-Compiled/2.4.0',
          },
          body: endpoint.responseExample,
        },
      }));
      setExecuting((prev) => ({ ...prev, [key]: false }));
    }, 450);
  };

  const copyCurl = (path: string, method: string) => {
    const curl = `curl -X ${method === 'WS' ? 'GET' : method} "https://api.atlascloud.dz${path}" \\
  -H "Accept: application/json" \\
  -H "X-Sovereign-Tenant: SATIM-ENTERPRISE-PROD"`;
    navigator.clipboard.writeText(curl);
    setCopiedKey(path);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Swagger Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-mono text-emerald-400 mb-1">
            04. Live Endpoints & Interactive OpenAPI 3.1 Specs
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <FileCode className="w-6 h-6 text-amber-400" />
            <span>{lang === 'ar' ? 'التوثيق التفاعلي للـ APIs عبر Swagger UI' : 'Swagger UI & Live API Sandbox (/docs)'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            {lang === 'ar'
              ? 'توثيق بصري تفاعلي يتيح لمهندسي الطرف الثالث اختبار واستدعاء المسارات المعتمدة مباشرة عبر المتصفح والاطلاع على الترويسات والاستجابات الحية.'
              : 'Interactive visual documentation allowing third-party engineers to test endpoints live in-browser, inspect schemas, and copy cURL payloads.'}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-slate-400">OpenAPI:</span>
          <span className="text-amber-400 font-bold">3.1.0</span>
          <span aria-hidden="true" className="text-slate-700">|</span>
          <span className="text-slate-400">Base URL:</span>
          <span className="text-emerald-400 font-bold">https://api.atlascloud.dz</span>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-4">
        {endpoints.map((ep) => {
          const key = `${ep.method}-${ep.path}`;
          const isExpanded = !!expandedEndpoints[key];
          const isRunning = !!executing[key];
          const output = responseOutputs[key];

          const methodColor =
            ep.method === 'GET'
              ? 'bg-sky-950/80 border-sky-800/80 text-sky-400'
              : ep.method === 'POST'
              ? 'bg-emerald-950/80 border-emerald-800/80 text-emerald-400'
              : 'bg-purple-950/80 border-purple-800/80 text-purple-400';

          return (
            <div
              key={key}
              className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden transition-all"
            >
              {/* Endpoint Header Bar */}
              <div
                onClick={() => toggleEndpoint(key)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono font-bold text-xs px-2.5 py-1 rounded border ${methodColor}`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-mono text-sm font-semibold text-white">
                    {ep.path}
                  </span>
                  <span className="hidden md:inline text-xs text-slate-400">
                    — {lang === 'ar' ? ep.summaryAr : ep.summaryEn}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                    {ep.tag}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
                  )}
                </div>
              </div>

              {/* Endpoint Expanded Body */}
              {isExpanded && (
                <div className="p-6 border-t border-slate-800 bg-slate-950/70 space-y-6">
                  <div className="space-y-1">
                    <div className="text-xs font-semibold text-slate-400">
                      {lang === 'ar' ? 'الوصف التقني:' : 'Description:'}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {lang === 'ar' ? ep.descriptionAr : ep.descriptionEn}
                    </p>
                  </div>

                  {/* Parameters Table */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-slate-400">
                      {lang === 'ar' ? 'المعاملات (Parameters):' : 'Parameters:'}
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-right border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="py-2 px-3 font-mono font-semibold">Name</th>
                            <th className="py-2 px-3 font-mono font-semibold">In</th>
                            <th className="py-2 px-3 font-mono font-semibold">Type</th>
                            <th className="py-2 px-3 font-mono font-semibold">Required</th>
                            <th className="py-2 px-3 font-semibold">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                          {ep.parameters.map((p) => (
                            <tr key={p.name}>
                              <td className="py-2 px-3 text-sky-400 font-bold">{p.name}</td>
                              <td className="py-2 px-3 text-slate-400">{p.in}</td>
                              <td className="py-2 px-3 text-amber-400">{p.type}</td>
                              <td className="py-2 px-3 text-slate-400">
                                {p.required ? 'true' : 'false'}
                              </td>
                              <td className="py-2 px-3 font-sans text-slate-300">{p.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Actions: Try it Out & Copy cURL */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleExecute(key, ep)}
                      disabled={isRunning}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>
                        {isRunning
                          ? lang === 'ar'
                            ? 'جاري الاستدعاء...'
                            : 'Calling...'
                          : lang === 'ar'
                          ? 'اختبار المسار (Try it out)'
                          : 'Try it out'}
                      </span>
                    </button>

                    <button
                      onClick={() => copyCurl(ep.path, ep.method)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                    >
                      {copiedKey === ep.path ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === ep.path ? 'Copied cURL!' : 'Copy cURL'}</span>
                    </button>
                  </div>

                  {/* Response Inspection Output */}
                  {output && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Response Code:</span>
                          <span className="font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800">
                            {output.statusCode} {output.statusText}
                          </span>
                        </div>
                        <div className="text-slate-400">
                          Latency: <span className="text-sky-400 tabular-nums">{output.latencyMs}ms</span>
                        </div>
                      </div>

                      {/* Headers */}
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-400 space-y-1">
                        <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">
                          Response Headers:
                        </div>
                        {Object.entries(output.headers).map(([hKey, hVal]) => (
                          <div key={hKey} className="flex gap-2">
                            <span className="text-slate-300 font-semibold">{hKey}:</span>
                            <span className="text-slate-400">{String(hVal)}</span>
                          </div>
                        ))}
                      </div>

                      {/* JSON Body */}
                      <div className="space-y-1">
                        <div className="text-[10px] text-slate-500 font-mono font-bold uppercase">
                          Response Body (JSON):
                        </div>
                        <pre className="p-4 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto max-h-80">
                          {JSON.stringify(output.body, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
