import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useCloud } from '../context/CloudContext';
import {
  Truck,
  Leaf,
  Flame,
  Radio,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Target,
  Maximize2,
  MapPin,
  Compass,
  Thermometer,
  Droplets,
  Activity,
  Shield,
  Eye,
  EyeOff,
  Navigation,
} from 'lucide-react';
import { IoTTelemetryRecord } from '../types/cloud';

interface GeoCity {
  nameAr: string;
  nameEn: string;
  lat: number;
  lng: number;
  isHub?: boolean;
}

const ALGERIA_CITIES: GeoCity[] = [
  { nameAr: 'الجزائر العاصمة', nameEn: 'Algiers', lat: 36.7538, lng: 3.0588, isHub: true },
  { nameAr: 'وهران', nameEn: 'Oran', lat: 35.6987, lng: -0.6349, isHub: true },
  { nameAr: 'قسنطينة', nameEn: 'Constantine', lat: 36.365, lng: 6.6147, isHub: true },
  { nameAr: 'ورقلة', nameEn: 'Ouargla', lat: 31.95, lng: 5.3333, isHub: true },
  { nameAr: 'بسكرة', nameEn: 'Biskra', lat: 34.85, lng: 5.7333 },
  { nameAr: 'حاسي مسعود', nameEn: 'Hassi Messaoud', lat: 31.68, lng: 6.07 },
  { nameAr: 'البليدة', nameEn: 'Blida', lat: 36.47, lng: 2.83 },
  { nameAr: 'سطيف', nameEn: 'Setif', lat: 36.19, lng: 5.41 },
  { nameAr: 'عنابة', nameEn: 'Annaba', lat: 36.9, lng: 7.76 },
  { nameAr: 'الشلف', nameEn: 'Chlef', lat: 36.16, lng: 1.33 },
  { nameAr: 'البويرة', nameEn: 'Bouira', lat: 36.37, lng: 3.9 },
  { nameAr: 'تلمسان', nameEn: 'Tlemcen', lat: 34.88, lng: -1.32 },
  { nameAr: 'تيزي وزو', nameEn: 'Tizi Ouzou', lat: 36.71, lng: 4.04 },
  { nameAr: 'غرداية', nameEn: 'Ghardaia', lat: 32.49, lng: 3.67 },
];

// East-West Highway path (A1)
const HIGHWAY_EAST_WEST: Array<[number, number]> = [
  [-1.32, 34.88], // Tlemcen
  [-0.63, 35.70], // Oran
  [1.33, 36.16],  // Chlef
  [2.83, 36.47],  // Blida
  [3.06, 36.75],  // Algiers
  [3.90, 36.37],  // Bouira
  [5.41, 36.19],  // Setif
  [6.61, 36.36],  // Constantine
  [7.76, 36.90],  // Annaba
];

// Trans-Sahara Highway (RN3 to Biskra & Ouargla)
const HIGHWAY_SAHARA: Array<[number, number]> = [
  [3.06, 36.75],  // Algiers
  [3.90, 36.37],  // Bouira
  [5.73, 34.85],  // Biskra
  [5.33, 31.95],  // Ouargla
  [6.07, 31.68],  // Hassi Messaoud
];

export const InteractiveGisMap: React.FC = () => {
  const { lang, iotRecords, regions, isWsStreaming } = useCloud();

  // Map viewport bounds and transform state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Layer Toggles
  const [showPharma, setShowPharma] = useState<boolean>(true);
  const [showAgri, setShowAgri] = useState<boolean>(true);
  const [showEnergy, setShowEnergy] = useState<boolean>(true);
  const [showHubs, setShowHubs] = useState<boolean>(true);
  const [showHighways, setShowHighways] = useState<boolean>(true);
  const [showGeofences, setShowGeofences] = useState<boolean>(true);

  // Selected asset / pin
  const [selectedPin, setSelectedPin] = useState<IoTTelemetryRecord | null>(iotRecords[0] || null);

  // Spatial Radius Query on map click
  const [radiusCenter, setRadiusCenter] = useState<{ lat: number; lng: number; x: number; y: number } | null>({
    lat: 36.7538,
    lng: 3.0588,
    x: 440,
    y: 110,
  });
  const [radiusKm, setRadiusKm] = useState<number>(150);

  // Coordinate projection mapping for Algeria view
  // Algeria bounding: Lng -3.0 to +9.5 (range: 12.5), Lat 29.5 to 38.0 (range: 8.5)
  const mapWidth = 900;
  const mapHeight = 600;

  const minLng = -2.8;
  const maxLng = 9.2;
  const minLat = 30.5;
  const maxLat = 37.8;

  const project = (lng: number, lat: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * mapWidth;
    const y = ((maxLat - lat) / (maxLat - minLat)) * mapHeight;
    return { x, y };
  };

  const unproject = (x: number, y: number) => {
    const lng = minLng + (x / mapWidth) * (maxLng - minLng);
    const lat = maxLat - (y / mapHeight) * (maxLat - minLat);
    return { lng: Number(lng.toFixed(4)), lat: Number(lat.toFixed(4)) };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    // Adjust for current pan and zoom
    const svgX = (rawX - pan.x) / zoom;
    const svgY = (rawY - pan.y) / zoom;

    const coords = unproject(svgX, svgY);
    setRadiusCenter({
      lat: coords.lat,
      lng: coords.lng,
      x: svgX,
      y: svgY,
    });
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRadiusCenter({ lat: 36.7538, lng: 3.0588, x: 440, y: 110 });
    setRadiusKm(150);
  };

  // Convert km to SVG pixel radius roughly
  // 1 degree latitude ~ 111 km
  const kmToSvgPixels = (km: number) => {
    const latDelta = km / 111;
    const pixelPerLat = mapHeight / (maxLat - minLat);
    return latDelta * pixelPerLat;
  };

  // Compute assets matching radius query
  const assetsInRadius = useMemo(() => {
    if (!radiusCenter) return [];

    return iotRecords.filter((item) => {
      const R = 6371; // km
      const dLat = ((item.lat - radiusCenter.lat) * Math.PI) / 180;
      const dLon = ((item.lng - radiusCenter.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((radiusCenter.lat * Math.PI) / 180) *
          Math.cos((item.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = R * c;
      return dist <= radiusKm;
    });
  }, [iotRecords, radiusCenter, radiusKm]);

  // SVG points string builder for highways
  const buildPolylinePath = (coords: Array<[number, number]>) => {
    return coords
      .map(([lng, lat]) => {
        const { x, y } = project(lng, lat);
        return `${x},${y}`;
      })
      .join(' ');
  };

  return (
    <div className="space-y-4">
      {/* GIS Header & Layer Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                {lang === 'ar' ? 'الخريطة المكانية التفاعلية لأسطول صيدال ومزارع بسكرة' : 'Sovereign PostGIS Fleet & Smart Agro Spatial GIS'}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                EPSG:4326 (WGS 84)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'تتبع حي لشاحنات سلاسل التبريد والواحات مع استعلامات التقارب الجغرافي ST_DWithin'
                : 'Real-time cold-chain fleet and smart oasis tracking with spatial buffer queries'}
            </p>
          </div>
        </div>

        {/* Layer Filters Strip */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setShowPharma(!showPharma)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
              showPharma
                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'ar' ? 'شاحنات صيدال' : 'Saidal Pharma'}</span>
          </button>

          <button
            onClick={() => setShowAgri(!showAgri)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
              showAgri
                ? 'bg-amber-950/80 border-amber-700 text-amber-300 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? 'مزارع بسكرة' : 'Biskra Agro'}</span>
          </button>

          <button
            onClick={() => setShowEnergy(!showEnergy)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
              showEnergy
                ? 'bg-purple-950/80 border-purple-700 text-purple-300 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'ar' ? 'حاسي مسعود للطاقة' : 'Energy Edge'}</span>
          </button>

          <button
            onClick={() => setShowHubs(!showHubs)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
              showHubs
                ? 'bg-sky-950/80 border-sky-700 text-sky-300 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span>{lang === 'ar' ? 'المراكز الـ 4' : '4 Hubs'}</span>
          </button>

          <button
            onClick={() => setShowGeofences(!showGeofences)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
              showGeofences
                ? 'bg-slate-800 border-slate-600 text-slate-200'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'ar' ? 'نطاق ST_DWithin' : 'Spatial Radius'}</span>
          </button>
        </div>
      </div>

      {/* Main Map Viewport & Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Interactive SVG Cartography Stage */}
        <div className="lg:col-span-3 rounded-xl border border-slate-800 bg-slate-950 relative overflow-hidden select-none h-[520px] shadow-2xl">
          {/* Zoom & Viewport Controls Toolbar */}
          <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 z-20 flex flex-col gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-slate-800 shadow-xl">
            <button
              onClick={() => setZoom((z) => Math.min(3.5, z + 0.3))}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.8, z - 0.3))}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Map Compass & Scale Badge */}
          <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>WS PUSH: 3s</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
            <span aria-hidden="true">·</span>
            <span>Click map to relocate query buffer</span>
          </div>

          {/* SVG Map Canvas */}
          <svg
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleMapClick}
          >
            <defs>
              {/* Subtle Spatial Coordinate Grid */}
              <pattern id="gisGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#172554" strokeWidth="0.4" strokeOpacity="0.3" />
              </pattern>
              {/* Radial gradient for spatial buffer */}
              <radialGradient id="bufferGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                <stop offset="70%" stopColor="#10b981" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </radialGradient>
            </defs>

            {/* Background Grid */}
            <rect width={mapWidth} height={mapHeight} fill="#030712" />
            <rect width={mapWidth} height={mapHeight} fill="url(#gisGrid)" />

            {/* Transform Group for Pan & Zoom */}
            <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
              {/* Mediterranean Sea Coastline & Northern Boundary line */}
              <path
                d="M 40,80 Q 220,100 440,75 T 820,70"
                fill="none"
                stroke="#1e3a8a"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              <text x="360" y="45" fill="#3b82f6" fontSize="11" fontStyle="italic" opacity="0.6">
                البحر الأبيض المتوسط · Mediterranean Sea
              </text>

              {/* Major Highway Infrastructure Layers */}
              {showHighways && (
                <>
                  {/* Autoroute Est-Ouest (A1) */}
                  <polyline
                    points={buildPolylinePath(HIGHWAY_EAST_WEST)}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points={buildPolylinePath(HIGHWAY_EAST_WEST)}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="1.8"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                  />

                  {/* Trans-Sahara Route (RN3) */}
                  <polyline
                    points={buildPolylinePath(HIGHWAY_SAHARA)}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points={buildPolylinePath(HIGHWAY_SAHARA)}
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="1.5"
                    strokeDasharray="5 3"
                    strokeLinecap="round"
                  />
                </>
              )}

              {/* Interactive ST_DWithin Spatial Radius Buffer */}
              {showGeofences && radiusCenter && (
                <g>
                  {/* Buffer Circle */}
                  <circle
                    cx={radiusCenter.x}
                    cy={radiusCenter.y}
                    r={kmToSvgPixels(radiusKm)}
                    fill="url(#bufferGradient)"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    className="animate-pulse"
                  />
                  {/* Center Target Crosshair */}
                  <line
                    x1={radiusCenter.x - 8}
                    y1={radiusCenter.y}
                    x2={radiusCenter.x + 8}
                    y2={radiusCenter.y}
                    stroke="#10b981"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={radiusCenter.x}
                    y1={radiusCenter.y - 8}
                    x2={radiusCenter.x}
                    y2={radiusCenter.y + 8}
                    stroke="#10b981"
                    strokeWidth="1.5"
                  />
                  <text
                    x={radiusCenter.x + kmToSvgPixels(radiusKm) - 10}
                    y={radiusCenter.y - 8}
                    fill="#10b981"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    ST_DWithin: {radiusKm}km ({assetsInRadius.length} assets)
                  </text>
                </g>
              )}

              {/* Major Algerian Wilaya Cities & Labels */}
              {ALGERIA_CITIES.map((city) => {
                const { x, y } = project(city.lng, city.lat);
                return (
                  <g key={city.nameEn} transform={`translate(${x}, ${y})`}>
                    <circle r="3" fill="#64748b" />
                    <text
                      x="6"
                      y="3"
                      fill="#94a3b8"
                      fontSize="9"
                      fontFamily="system-ui"
                      className="pointer-events-none"
                    >
                      {lang === 'ar' ? city.nameAr : city.nameEn}
                    </text>
                  </g>
                );
              })}

              {/* 4 Sovereign Datacenter Hubs */}
              {showHubs &&
                regions.map((reg) => {
                  const { x, y } = project(reg.lng, reg.lat);
                  const isPrimary = reg.id === 'dz-north-1';
                  return (
                    <g
                      key={reg.id}
                      transform={`translate(${x}, ${y})`}
                      className="cursor-pointer"
                    >
                      <circle
                        r="12"
                        fill={isPrimary ? '#10b981' : '#0284c7'}
                        fillOpacity="0.2"
                        className="animate-ping"
                      />
                      <rect
                        x="-7"
                        y="-7"
                        width="14"
                        height="14"
                        rx="3"
                        fill={isPrimary ? '#10b981' : '#0284c7'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      <text
                        x="10"
                        y="-4"
                        fill="#ffffff"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {reg.id}
                      </text>
                    </g>
                  );
                })}

              {/* Live IoT Assets (Trucks, Farms, Energy Nodes) */}
              {iotRecords.map((item) => {
                if (
                  (item.deviceType === 'PHARMA_TRUCK' && !showPharma) ||
                  (item.deviceType === 'FOOD_COLD_CHAIN' && !showPharma) ||
                  (item.deviceType === 'SMART_AGRI_FARM' && !showAgri) ||
                  (item.deviceType === 'ENERGY_EDGE' && !showEnergy)
                ) {
                  return null;
                }

                const { x, y } = project(item.lng, item.lat);
                const isSelected = selectedPin?.id === item.id;

                const pinColor =
                  item.deviceType === 'PHARMA_TRUCK'
                    ? '#10b981' // emerald
                    : item.deviceType === 'FOOD_COLD_CHAIN'
                    ? '#0284c7' // sky
                    : item.deviceType === 'SMART_AGRI_FARM'
                    ? '#f59e0b' // amber
                    : '#a855f7'; // purple

                return (
                  <g
                    key={item.id}
                    transform={`translate(${x}, ${y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPin(item);
                    }}
                    className="cursor-pointer transition-transform hover:scale-125"
                  >
                    {/* Pulsing ring for active transmission */}
                    <circle
                      r={isSelected ? '14' : '9'}
                      fill={pinColor}
                      fillOpacity="0.3"
                      className="animate-pulse"
                    />

                    {/* Central Icon Base */}
                    <circle
                      r="6"
                      fill={pinColor}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />

                    {/* Quick Floating Label */}
                    <text
                      x="9"
                      y="-4"
                      fill="#f8fafc"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {item.id}
                    </text>
                    <text
                      x="9"
                      y="7"
                      fill={pinColor}
                      fontSize="8"
                      fontFamily="monospace"
                    >
                      {item.temperatureC > 0 ? `+${item.temperatureC}` : item.temperatureC}°C
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Selected Asset Live HUD & Telemetry Details */}
        <div className="space-y-4">
          {selectedPin ? (
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-mono text-xs font-bold text-white">
                    {selectedPin.id}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {selectedPin.alarmState}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">
                  {lang === 'ar' ? selectedPin.nameAr : selectedPin.nameEn}
                </h4>
                <div className="text-xs text-slate-400 mt-0.5">
                  {lang === 'ar' ? selectedPin.locationNameAr : selectedPin.locationNameEn}
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-1">
                  Org: {selectedPin.clientEn}
                </div>
              </div>

              {/* Gauge readings */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">TEMP GAUGE</span>
                  <span className="text-emerald-400 font-bold text-base tabular-nums">
                    {selectedPin.temperatureC > 0 ? `+${selectedPin.temperatureC}` : selectedPin.temperatureC}°C
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {selectedPin.targetTempRange}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">MOISTURE / HUM</span>
                  <span className="text-sky-400 font-bold text-base tabular-nums">
                    {selectedPin.humidityPct ?? 'N/A'}%
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {selectedPin.salinityEc ? `EC ${selectedPin.salinityEc}` : 'Battery 94%'}
                  </span>
                </div>
              </div>

              {/* PostGIS Point WKT */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-mono">
                  PostGIS Geometry Point (EPSG:4326):
                </span>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 truncate">
                  {selectedPin.spatialPointWkt}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Speed:</span>
                  <span className="text-white">{selectedPin.speedKmh ?? 0} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span>Refrigeration Seal:</span>
                  <span className="text-emerald-400">LOCKED_SECURE</span>
                </div>
                <div className="flex justify-between">
                  <span>Telemetry Pulse:</span>
                  <span className="text-slate-300">Bi-directional WS Push</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/40 text-center text-xs text-slate-400">
              {lang === 'ar' ? 'انقر على أي شاحنة أو مزرعة لعرض تفاصيل التليمتري' : 'Click on any fleet vehicle or farm station to inspect telemetry'}
            </div>
          )}

          {/* Spatial Proximity Buffer Query Summary Box */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'استعلام النطاق (ST_DWithin)' : 'Spatial Buffer Filter'}</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                {assetsInRadius.length} {lang === 'ar' ? 'أصول متطابقة' : 'matches'}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-400 font-mono">
                <span>Radius: {radiusKm} km</span>
                <div className="flex gap-1">
                  {[80, 150, 300].map((km) => (
                    <button
                      key={km}
                      onClick={() => setRadiusKm(km)}
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        radiusKm === km
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {km}km
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="max-h-28 overflow-y-auto space-y-1 font-mono text-[11px]">
              {assetsInRadius.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => setSelectedPin(asset)}
                  className="flex items-center justify-between p-1.5 rounded bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-emerald-500/60"
                >
                  <span className="text-slate-200 truncate">{asset.id}</span>
                  <span className="text-emerald-400 tabular-nums">
                    {asset.temperatureC > 0 ? `+${asset.temperatureC}` : asset.temperatureC}°C
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
