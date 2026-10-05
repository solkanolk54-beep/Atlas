import React, { useState } from 'react';
import { useCloud } from '../context/CloudContext';
import { InteractiveGisMap } from './InteractiveGisMap';
import { D3GisMapOverlay } from './D3GisMapOverlay';
import {
  Database,
  Radio,
  Pause,
  Play,
  Layers,
  Thermometer,
  Droplets,
  Truck,
  Leaf,
  Flame,
  Search,
  CheckCircle,
  Copy,
  ChevronDown,
  Map as MapIcon,
  Table,
  Globe,
  Download,
  FileSpreadsheet,
  Check,
} from 'lucide-react';

export const PostGisIoTView: React.FC = () => {
  const {
    lang,
    databases,
    iotRecords,
    wsPacketsCount,
    isWsStreaming,
    setIsWsStreaming,
    lastWsPacket,
  } = useCloud();

  const [gisViewTab, setGisViewTab] = useState<'d3_geojson' | 'vector_map' | 'instances'>('d3_geojson');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PHARMA' | 'FOOD' | 'AGRI' | 'ENERGY'>('ALL');
  const [selectedDevice, setSelectedDevice] = useState<string>(iotRecords[0]?.id || '');
  const [spatialQueryRadiusKm, setSpatialQueryRadiusKm] = useState<number>(120);
  const [spatialQueryResult, setSpatialQueryResult] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [csvDownloaded, setCsvDownloaded] = useState<boolean>(false);

  const downloadIotCsv = (onlyFiltered: boolean = false) => {
    const recordsToExport = onlyFiltered ? filteredRecords : iotRecords;
    const headers = [
      'device_id',
      'name_ar',
      'name_en',
      'client_ar',
      'client_en',
      'device_type',
      'latitude',
      'longitude',
      'temperature_celsius',
      'target_temp_range',
      'humidity_percent',
      'salinity_ec_dsm',
      'speed_kmh',
      'door_locked',
      'battery_percent',
      'alarm_state',
      'spatial_point_wkt',
      'srid',
      'timestamp',
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = recordsToExport.map((item) => [
      escapeCsv(item.id),
      escapeCsv(item.nameAr),
      escapeCsv(item.nameEn),
      escapeCsv(item.clientAr),
      escapeCsv(item.clientEn),
      escapeCsv(item.deviceType),
      item.lat,
      item.lng,
      item.temperatureC,
      escapeCsv(item.targetTempRange),
      item.humidityPct ?? '',
      item.salinityEc ?? '',
      item.speedKmh ?? '',
      item.doorLocked ? 'TRUE' : 'FALSE',
      item.batteryPct,
      escapeCsv(item.alarmState),
      escapeCsv(item.spatialPointWkt),
      4326,
      escapeCsv(item.timestamp),
    ]);

    const csvContent =
      '\uFEFF' +
      headers.join(',') +
      '\n' +
      rows.map((r) => r.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestampStr = new Date().toISOString().replace(/[:.]/g, '-');
    link.href = url;
    link.download = `AtlasCloud_IoT_Telemetry_${onlyFiltered ? 'Filtered' : 'Full'}_${timestampStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCsvDownloaded(true);
    setTimeout(() => setCsvDownloaded(false), 2500);
  };

  const filteredRecords = iotRecords.filter((rec) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'PHARMA') return rec.deviceType === 'PHARMA_TRUCK';
    if (activeFilter === 'FOOD') return rec.deviceType === 'FOOD_COLD_CHAIN';
    if (activeFilter === 'AGRI') return rec.deviceType === 'SMART_AGRI_FARM';
    if (activeFilter === 'ENERGY') return rec.deviceType === 'ENERGY_EDGE';
    return true;
  });

  const activeRecord = iotRecords.find((r) => r.id === selectedDevice) || iotRecords[0];

  const runSpatialQueryDemo = () => {
    // Spatial query: devices within spatialQueryRadiusKm of Algiers Center (3.0588, 36.7538)
    const algiersLat = 36.7538;
    const algiersLng = 3.0588;

    const nearby = iotRecords
      .map((item) => {
        // Approximate distance calculation using spherical law of cosines
        const R = 6371; // km
        const dLat = ((item.lat - algiersLat) * Math.PI) / 180;
        const dLon = ((item.lng - algiersLng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((algiersLat * Math.PI) / 180) *
            Math.cos((item.lat * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distKm = Number((R * c).toFixed(1));
        return {
          id: item.id,
          name: item.nameEn,
          distKm,
          temp: item.temperatureC,
          wkt: item.spatialPointWkt,
        };
      })
      .filter((i) => i.distKm <= spatialQueryRadiusKm)
      .sort((a, b) => a.distKm - b.distKm);

    setSpatialQueryResult(
      JSON.stringify(
        {
          spatial_engine: 'PostGIS 3.4.2 (SRID: 4326)',
          execution_time_ms: 1.4,
          anchor: 'Algiers Central Hub (POINT(3.0588 36.7538))',
          radius_filter_km: spatialQueryRadiusKm,
          matched_assets_count: nearby.length,
          matched_assets: nearby,
        },
        null,
        2
      )
    );
  };

  const copyWkt = (wkt: string) => {
    navigator.clipboard.writeText(wkt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="text-xs font-mono text-emerald-400 mb-1">
            02. Spatial Engines & Bi-Directional IoT Stream
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {lang === 'ar'
              ? 'محرك قواعد البيانات المكانية PostGIS والبث اللحظي لإنترنت الأشياء'
              : 'PostGIS 3.4 Spatial Database & Real-Time IoT WebSocket Stream'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            {lang === 'ar'
              ? 'تكامل مباشر بين PostgreSQL 16 مع إضافتي PostGIS 3.4 و pgvector، وقناة WebSockets تبث بيانات التتبع المبرد لأسطول صيدال وحساسات مزارع بسكرة كل 3 ثوانٍ.'
              : 'Direct integration of PostgreSQL 16 + PostGIS 3.4 + pgvector, backed by a persistent bi-directional WebSocket pushing telemetry every 3 seconds.'}
          </p>
        </div>

        {/* WebSocket & CSV Export Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-3 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isWsStreaming ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
                }`}
              ></span>
              <span className="text-xs font-mono font-bold text-white">
                /ws/v1/iot/stream
              </span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              <span className="tabular-nums font-bold text-emerald-400">{wsPacketsCount}</span> pkts
            </div>
            <button
              onClick={() => setIsWsStreaming(!isWsStreaming)}
              className={`p-1.5 rounded transition-colors ${
                isWsStreaming
                  ? 'bg-amber-950/60 text-amber-300 hover:bg-amber-900/60'
                  : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60'
              }`}
              title={isWsStreaming ? 'إيقاف البث مؤقتاً' : 'استئناف البث اللحظي'}
            >
              {isWsStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            onClick={() => downloadIotCsv(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-800/80 rounded-lg text-xs font-semibold transition-colors shadow-sm"
            title="تصدير كامل بيانات الـ IoT الحية كملف CSV"
          >
            {csvDownloaded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{csvDownloaded ? (lang === 'ar' ? 'تم تنزيل الـ CSV!' : 'CSV Downloaded!') : (lang === 'ar' ? 'تنزيل بيانات IoT (CSV)' : 'Download IoT CSV')}</span>
          </button>
        </div>
      </div>

      {/* GIS Navigation Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-900/80 rounded-lg border border-slate-800 w-fit">
        <button
          onClick={() => setGisViewTab('d3_geojson')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            gisViewTab === 'd3_geojson'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'خريطة D3.js المكانية (D3.js GeoJSON Overlay)' : 'D3.js GeoJSON Map Overlay'}</span>
        </button>

        <button
          onClick={() => setGisViewTab('vector_map')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            gisViewTab === 'vector_map'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'خريطة المسارات المتجهة' : 'Vector Route Map'}</span>
        </button>

        <button
          onClick={() => setGisViewTab('instances')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
            gisViewTab === 'instances'
              ? 'bg-emerald-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'مثيلات PostGIS وجداول البيانات' : 'Managed PostGIS Clusters & Tables'}</span>
        </button>
      </div>

      {/* D3.js GeoJSON Map Overlay Section */}
      {gisViewTab === 'd3_geojson' && (
        <D3GisMapOverlay
          selectedDeviceId={selectedDevice}
          onSelectDevice={(id) => setSelectedDevice(id)}
        />
      )}

      {/* Vector Route Map Section */}
      {gisViewTab === 'vector_map' && <InteractiveGisMap />}

      {/* Managed PostGIS Database Instances */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-sky-400" />
            <span>{lang === 'ar' ? 'مثيلات قواعد البيانات المكانية المدارة' : 'Managed PostGIS Spatial Instances'}</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Engine: PostgreSQL 16.3 / PostGIS 3.4.2 / pgvector 0.7.0
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {databases.map((db) => (
            <div
              key={db.id}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs text-sky-400 font-bold">{db.name}</div>
                  <div className="text-xs text-slate-300 font-semibold mt-0.5">
                    {lang === 'ar' ? db.clientOrganizationAr : db.clientOrganizationEn}
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400">
                  {db.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                <div>
                  <span className="text-slate-500 block text-[10px]">SPATIAL SRID</span>
                  <span className="text-slate-200 font-bold">{db.spatialSRID} (WGS 84)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">GEOMETRY</span>
                  <span className="text-slate-200 truncate block">{db.geometryType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">RECORDS</span>
                  <span className="text-slate-200 tabular-nums">
                    {(db.recordsCount / 1000000).toFixed(2)}M rows
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] text-slate-400">
                  {lang === 'ar' ? 'الإضافات المفعلة (PostgreSQL Extensions):' : 'Active Extensions:'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {db.extensions.map((ext) => (
                    <span
                      key={ext}
                      className="px-2 py-0.5 text-[11px] font-mono rounded bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {ext}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live IoT Fleet & Farms Telemetry Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device List & Filter */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'العقد والحساسات النشطة' : 'Live Ingestion Nodes'}</span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadIotCsv(activeFilter !== 'ALL')}
                className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-mono transition-colors border border-slate-700"
                title={lang === 'ar' ? 'تصدير هذه القائمة كملف CSV' : 'Export this list to CSV'}
              >
                <Download className="w-3 h-3 text-emerald-400" />
                <span>CSV</span>
              </button>
              <span className="text-xs text-slate-400 font-mono">
                Push: 3s
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                activeFilter === 'ALL' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
              }`}
            >
              {lang === 'ar' ? 'الكل' : 'All'}
            </button>
            <button
              onClick={() => setActiveFilter('PHARMA')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                activeFilter === 'PHARMA' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400'
              }`}
            >
              {lang === 'ar' ? 'أدوية صيدال' : 'Saidal Pharma'}
            </button>
            <button
              onClick={() => setActiveFilter('FOOD')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                activeFilter === 'FOOD' ? 'bg-slate-800 text-sky-400 font-bold' : 'text-slate-400'
              }`}
            >
              {lang === 'ar' ? 'أغذية مبردة' : 'Cold Food'}
            </button>
            <button
              onClick={() => setActiveFilter('AGRI')}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
                activeFilter === 'AGRI' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              {lang === 'ar' ? 'مزارع بسكرة' : 'Biskra Agro'}
            </button>
          </div>

          {/* Records List */}
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {filteredRecords.map((item) => {
              const isSelected = item.id === selectedDevice;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedDevice(item.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/20'
                      : 'border-slate-800 bg-slate-900/40 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      {item.deviceType === 'PHARMA_TRUCK' && <Truck className="w-3.5 h-3.5 text-emerald-400" />}
                      {item.deviceType === 'FOOD_COLD_CHAIN' && <Truck className="w-3.5 h-3.5 text-sky-400" />}
                      {item.deviceType === 'SMART_AGRI_FARM' && <Leaf className="w-3.5 h-3.5 text-amber-400" />}
                      {item.deviceType === 'ENERGY_EDGE' && <Flame className="w-3.5 h-3.5 text-purple-400" />}
                      <span className="font-mono text-xs font-bold text-white">{item.id}</span>
                    </div>
                    <span className="font-mono text-xs font-bold tabular-nums text-emerald-400">
                      {item.temperatureC > 0 ? `+${item.temperatureC}` : item.temperatureC}°C
                    </span>
                  </div>

                  <div className="text-xs font-medium text-slate-300 truncate">
                    {lang === 'ar' ? item.nameAr : item.nameEn}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
                    <span className="truncate max-w-[160px]">
                      {lang === 'ar' ? item.locationNameAr : item.locationNameEn}
                    </span>
                    <span className="text-emerald-400">{item.alarmState}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Device Telemetry Detail & WKT Geometry */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{activeRecord.id}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeRecord.clientEn}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  {lang === 'ar' ? activeRecord.nameAr : activeRecord.nameEn}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  {lang === 'ar' ? activeRecord.locationNameAr : activeRecord.locationNameEn}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyWkt(activeRecord.spatialPointWkt)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isCopied ? 'تم النسخ!' : 'Copy WKT'}</span>
                </button>
              </div>
            </div>

            {/* Vital Instrument Displays */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono mb-1 flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-emerald-400" />
                  <span>TEMPERATURE</span>
                </div>
                <div className="text-xl font-bold font-mono text-white tabular-nums">
                  {activeRecord.temperatureC > 0 ? `+${activeRecord.temperatureC}` : activeRecord.temperatureC}°C
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  {activeRecord.targetTempRange}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono mb-1 flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-sky-400" />
                  <span>HUMIDITY / MOISTURE</span>
                </div>
                <div className="text-xl font-bold font-mono text-sky-400 tabular-nums">
                  {activeRecord.humidityPct ?? 'N/A'}%
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  {activeRecord.salinityEc ? `EC: ${activeRecord.salinityEc} dS/m` : 'Normal range'}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono mb-1">
                  BATTERY / SOLAR
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                  {activeRecord.batteryPct}%
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  Autonomous LiFePO4
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-mono mb-1">
                  SPATIAL COORDS
                </div>
                <div className="text-xs font-bold font-mono text-slate-200 tabular-nums truncate">
                  {activeRecord.lat.toFixed(4)}, {activeRecord.lng.toFixed(4)}
                </div>
                <div className="text-[10px] text-emerald-400 mt-1 font-mono">
                  Point(4326) Valid
                </div>
              </div>
            </div>

            {/* PostGIS WKT Representation */}
            <div className="space-y-1">
              <div className="text-xs text-slate-400 font-mono">
                PostGIS Geometry Representation (geometry(Point, 4326)):
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                <code>
                  ST_GeomFromText('{activeRecord.spatialPointWkt}', 4326)
                </code>
              </div>
            </div>

            {/* Interactive Spatial Query Sandbox */}
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-sky-400" />
                  <span>{lang === 'ar' ? 'استعلام جغرافي فوري (PostGIS ST_DWithin Sandbox)' : 'Instant Spatial Query Engine (ST_DWithin)'}</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{lang === 'ar' ? 'نطاق البحث:' : 'Radius:'}</span>
                  <select
                    value={spatialQueryRadiusKm}
                    onChange={(e) => setSpatialQueryRadiusKm(Number(e.target.value))}
                    className="bg-slate-900 border border-slate-700 text-xs text-white rounded px-2 py-1 font-mono"
                  >
                    <option value={80}>80 km</option>
                    <option value={150}>150 km</option>
                    <option value={300}>300 km</option>
                    <option value={600}>600 km (National Range)</option>
                  </select>
                  <button
                    onClick={runSpatialQueryDemo}
                    className="px-3 py-1 text-xs font-bold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded transition-colors"
                  >
                    {lang === 'ar' ? 'تنفيذ الاستعلام' : 'Execute SQL'}
                  </button>
                </div>
              </div>

              {spatialQueryResult && (
                <div className="p-3 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto">
                  <pre>{spatialQueryResult}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Live WebSocket Packet Stream Inspector */}
      {lastWsPacket && (
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>LIVE FRAME INGESTION STREAM (Bi-directional WebSocket TLS 1.3)</span>
            </span>
            <span>Packet ID: #{wsPacketsCount}</span>
          </div>
          <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-3 bg-slate-900/60 rounded-lg border border-slate-800/80">
            {JSON.stringify(lastWsPacket, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
