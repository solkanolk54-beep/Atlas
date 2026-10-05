import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { useCloud } from '../context/CloudContext';
import {
  ALGERIA_BOUNDARY_GEOJSON,
  AGRICULTURAL_ZONES_GEOJSON,
  LOGISTICS_CORRIDORS_GEOJSON,
  GeoJsonFeature,
} from '../data/algeriaGeoJson';
import { IoTTelemetryRecord } from '../types/cloud';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Target,
  FileCode,
  Copy,
  Check,
  Compass,
  Truck,
  Leaf,
  Shield,
  Activity,
  Maximize2,
  Navigation,
} from 'lucide-react';

export interface D3GisMapOverlayProps {
  selectedDeviceId?: string;
  onSelectDevice?: (deviceId: string) => void;
  onSelectAgriZone?: (zone: any) => void;
}

export const D3GisMapOverlay: React.FC<D3GisMapOverlayProps> = ({
  selectedDeviceId,
  onSelectDevice,
  onSelectAgriZone,
}) => {
  const { lang, iotRecords, regions, isWsStreaming, wsPacketsCount } = useCloud();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const historyTrailsRef = useRef<Record<string, Array<[number, number]>>>({});

  // Layer switches
  const [showAgriZones, setShowAgriZones] = useState<boolean>(true);
  const [showFleet, setShowFleet] = useState<boolean>(true);
  const [showCorridors, setShowCorridors] = useState<boolean>(true);
  const [showHubs, setShowHubs] = useState<boolean>(true);
  const [showRadiusBuffer, setShowRadiusBuffer] = useState<boolean>(true);
  const [showTrails, setShowTrails] = useState<boolean>(true);

  // Radius Buffer State
  const [radiusCenter, setRadiusCenter] = useState<{ lng: number; lat: number }>({
    lng: 3.0588,
    lat: 36.7538, // Algiers
  });
  const [radiusKm, setRadiusKm] = useState<number>(150);

  // Selected item states
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [hoveredInfo, setHoveredInfo] = useState<{
    x: number;
    y: number;
    title: string;
    subtitle: string;
    telemetry?: string;
  } | null>(null);

  // GeoJSON tab modal/drawer
  const [showGeoJsonModal, setShowGeoJsonModal] = useState<boolean>(false);
  const [copiedGeoJson, setCopiedGeoJson] = useState<boolean>(false);

  // Dynamic Fleet GeoJSON FeatureCollection generated from live PostGIS records
  const fleetGeoJson = useMemo(() => {
    return {
      type: 'FeatureCollection',
      features: iotRecords.map((item) => ({
        type: 'Feature',
        id: item.id,
        properties: {
          id: item.id,
          nameAr: item.nameAr,
          nameEn: item.nameEn,
          clientAr: item.clientAr,
          clientEn: item.clientEn,
          deviceType: item.deviceType,
          temperatureC: item.temperatureC,
          targetTempRange: item.targetTempRange,
          humidityPct: item.humidityPct,
          salinityEc: item.salinityEc,
          speedKmh: item.speedKmh,
          doorLocked: item.doorLocked,
          batteryPct: item.batteryPct,
          alarmState: item.alarmState,
          timestamp: item.timestamp,
        },
        geometry: {
          type: 'Point',
          coordinates: [item.lng, item.lat],
        },
      })),
    };
  }, [iotRecords]);

  // Combined full GeoJSON for developers
  const fullPostgisGeoJson = useMemo(() => {
    return {
      type: 'FeatureCollection',
      metadata: {
        spatial_engine: 'PostgreSQL 16.3 + PostGIS 3.4.2',
        srid: 4326,
        generated_at: new Date().toISOString(),
        packet_count: wsPacketsCount,
      },
      features: [
        ...AGRICULTURAL_ZONES_GEOJSON.features,
        ...LOGISTICS_CORRIDORS_GEOJSON.features,
        ...fleetGeoJson.features,
      ],
    };
  }, [fleetGeoJson, wsPacketsCount]);

  // Assets inside spatial buffer
  const assetsInBuffer = useMemo(() => {
    return iotRecords.filter((rec) => {
      const R = 6371; // km
      const dLat = ((rec.lat - radiusCenter.lat) * Math.PI) / 180;
      const dLon = ((rec.lng - radiusCenter.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((radiusCenter.lat * Math.PI) / 180) *
          Math.cos((rec.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = R * c;
      return dist <= radiusKm;
    });
  }, [iotRecords, radiusCenter, radiusKm]);

  // D3 Render & Projection Setup
  useEffect(() => {
    if (!svgRef.current) return;

    const width = 960;
    const height = 620;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clean container for pristine redraw

    // Define Projection focused on Algeria (Center around 3°E, 34°N)
    const projection = d3
      .geoMercator()
      .center([3.2, 34.2])
      .scale(2300)
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Filter definitions & Patterns
    const defs = svg.append('defs');

    // Agricultural Hatch Pattern
    const pattern = defs
      .append('pattern')
      .attr('id', 'agriHatch')
      .attr('width', 10)
      .attr('height', 10)
      .attr('patternTransform', 'rotate(45 0 0)')
      .attr('patternUnits', 'userSpaceOnUse');

    pattern
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', 0)
      .attr('y2', 10)
      .attr('stroke', '#10b981')
      .attr('strokeWidth', 1.5)
      .attr('strokeOpacity', 0.4);

    // Glow Filter for Fleet Nodes
    const filter = defs.append('filter').attr('id', 'glow');
    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', '2.5')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Main Zoomable Group
    const g = svg.append('g').attr('class', 'map-root-group');

    // D3 Zoom Behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // 1. Render Algeria National Boundary Polygon
    g.append('g')
      .attr('class', 'boundary-layer')
      .selectAll('path')
      .data(ALGERIA_BOUNDARY_GEOJSON.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator as any)
      .attr('fill', '#090d16')
      .attr('stroke', '#1e293b')
      .attr('strokeWidth', 1.8)
      .attr('strokeDasharray', '5 4');

    // 2. Render Agricultural Zones GeoJSON Polygons
    if (showAgriZones) {
      const agriGroup = g.append('g').attr('class', 'agri-zones-layer');

      agriGroup
        .selectAll('path')
        .data(AGRICULTURAL_ZONES_GEOJSON.features)
        .enter()
        .append('path')
        .attr('d', pathGenerator as any)
        .attr('fill', (d: any) => d.properties.colorTheme || '#10b981')
        .attr('fill-opacity', 0.22)
        .attr('stroke', (d: any) => d.properties.colorTheme || '#10b981')
        .attr('strokeWidth', 2)
        .attr('cursor', 'pointer')
        .on('mouseenter', (event: MouseEvent, d: any) => {
          const el = event.currentTarget as SVGPathElement;
          d3.select(el)
            .transition()
            .duration(150)
            .attr('fill-opacity', 0.45)
            .attr('strokeWidth', 3);

          setHoveredInfo({
            x: event.pageX,
            y: event.pageY,
            title: lang === 'ar' ? d.properties.zoneNameAr : d.properties.zoneNameEn,
            subtitle: `${d.properties.wilaya} · ${d.properties.areaHectares.toLocaleString()} Ha`,
            telemetry: `Moisture: ${d.properties.averageMoisturePct}% · Salinity: ${d.properties.salinityIndexEc}`,
          });
        })
        .on('mouseleave', (event: MouseEvent) => {
          const el = event.currentTarget as SVGPathElement;
          d3.select(el)
            .transition()
            .duration(150)
            .attr('fill-opacity', 0.22)
            .attr('strokeWidth', 2);
          setHoveredInfo(null);
        })
        .on('click', (_event, d: any) => {
          setSelectedFeature({ type: 'AGRI_ZONE', data: d });
          if (onSelectAgriZone) {
            onSelectAgriZone(d);
          }
        });

      // Add Agricultural Zone Center Labels
      agriGroup
        .selectAll('text')
        .data(AGRICULTURAL_ZONES_GEOJSON.features)
        .enter()
        .append('text')
        .attr('transform', (d: any) => {
          const centroid = pathGenerator.centroid(d as any);
          return `translate(${centroid[0]}, ${centroid[1]})`;
        })
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', '#f1f5f9')
        .attr('font-size', '10px')
        .attr('font-family', 'sans-serif')
        .attr('font-weight', 'bold')
        .attr('pointer-events', 'none')
        .text((d: any) => (lang === 'ar' ? d.properties.wilaya : d.properties.wilaya));
    }

    // 3. Render National Logistics Corridors GeoJSON LineStrings
    if (showCorridors) {
      const corridorsGroup = g.append('g').attr('class', 'corridors-layer');

      corridorsGroup
        .selectAll('path')
        .data(LOGISTICS_CORRIDORS_GEOJSON.features)
        .enter()
        .append('path')
        .attr('d', pathGenerator as any)
        .attr('fill', 'none')
        .attr('stroke', (d: any) =>
          d.id === 'CORRIDOR-A1-EAST-WEST'
            ? '#0284c7'
            : d.id === 'PIPELINE-SONATRACH-HMD-SKIKDA'
            ? '#f59e0b'
            : d.id === 'PIPELINE-SONATRACH-HMD-ARZEW'
            ? '#ec4899'
            : '#d97706'
        )
        .attr('stroke-width', (d: any) => (d.properties?.pipelineType ? 3.2 : 2.6))
        .attr('stroke-dasharray', (d: any) => (d.properties?.pipelineType ? '6 3' : '8 4'))
        .attr('stroke-linecap', 'round')
        .attr('cursor', 'pointer')
        .attr('opacity', 0.9)
        .on('mouseenter', (event: MouseEvent, d: any) => {
          setHoveredInfo({
            x: event.pageX,
            y: event.pageY,
            title: lang === 'ar' ? d.properties.nameAr : d.properties.nameEn,
            subtitle: `${d.properties.capacity} · ${d.properties.lengthKm} km`,
            telemetry: d.properties.pressureRatingBar
              ? `Max Design Pressure: ${d.properties.pressureRatingBar} Bar · SCADA Linked`
              : undefined,
          });
        })
        .on('mouseleave', () => setHoveredInfo(null));
    }

    // 4. Render PostGIS ST_DWithin Buffer using d3.geoCircle
    if (showRadiusBuffer && radiusCenter) {
      // 1 degree latitude ~ 111.32 km
      const radiusDegrees = radiusKm / 111.32;
      const circleGenerator = d3
        .geoCircle()
        .center([radiusCenter.lng, radiusCenter.lat])
        .radius(radiusDegrees);

      const bufferFeature = circleGenerator();

      const bufferGroup = g.append('g').attr('class', 'radius-buffer-layer');

      bufferGroup
        .append('path')
        .datum(bufferFeature)
        .attr('d', pathGenerator as any)
        .attr('fill', '#10b981')
        .attr('fill-opacity', 0.12)
        .attr('stroke', '#10b981')
        .attr('stroke-width', 1.8)
        .attr('stroke-dasharray', '6 4')
        .attr('pointer-events', 'none');

      // Center crosshair marker
      const centerCoords = projection([radiusCenter.lng, radiusCenter.lat]);
      if (centerCoords) {
        bufferGroup
          .append('circle')
          .attr('cx', centerCoords[0])
          .attr('cy', centerCoords[1])
          .attr('r', 4)
          .attr('fill', '#10b981');

        bufferGroup
          .append('text')
          .attr('x', centerCoords[0] + 12)
          .attr('y', centerCoords[1] + 4)
          .attr('fill', '#10b981')
          .attr('font-size', '10px')
          .attr('font-family', 'monospace')
          .attr('font-weight', 'bold')
          .text(`PostGIS ST_DWithin (${radiusKm}km)`);
      }
    }

    // 5. Render 4 Sovereign Regional Datacenter Hubs
    if (showHubs) {
      const hubsGroup = g.append('g').attr('class', 'hubs-layer');

      regions.forEach((reg) => {
        const coords = projection([reg.lng, reg.lat]);
        if (!coords) return;

        const isPrimary = reg.id === 'dz-north-1';

        const hubNode = hubsGroup
          .append('g')
          .attr('transform', `translate(${coords[0]}, ${coords[1]})`)
          .attr('cursor', 'pointer')
          .on('click', () => {
            setSelectedFeature({ type: 'REGION_HUB', data: reg });
          });

        hubNode
          .append('circle')
          .attr('r', isPrimary ? 14 : 10)
          .attr('fill', isPrimary ? '#10b981' : '#0284c7')
          .attr('fill-opacity', 0.25)
          .attr('class', 'animate-pulse');

        hubNode
          .append('rect')
          .attr('x', -6)
          .attr('y', -6)
          .attr('width', 12)
          .attr('height', 12)
          .attr('rx', 2.5)
          .attr('fill', isPrimary ? '#10b981' : '#0284c7')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 1.5);

        hubNode
          .append('text')
          .attr('x', 10)
          .attr('y', -4)
          .attr('fill', '#ffffff')
          .attr('font-size', '10px')
          .attr('font-family', 'monospace')
          .attr('font-weight', 'bold')
          .text(reg.id);
      });
    }

    // 6. Record & Render Vehicle Movement Breadcrumbs
    fleetGeoJson.features.forEach((feature) => {
      const id = feature.properties.id;
      const coords = feature.geometry.coordinates as [number, number];
      if (!historyTrailsRef.current[id]) {
        historyTrailsRef.current[id] = [coords];
      } else {
        const list = historyTrailsRef.current[id];
        const last = list[list.length - 1];
        if (!last || Math.abs(last[0] - coords[0]) > 0.0001 || Math.abs(last[1] - coords[1]) > 0.0001) {
          list.push(coords);
          if (list.length > 10) list.shift();
        }
      }
    });

    if (showTrails) {
      const trailsGroup = g.append('g').attr('class', 'trails-layer');
      Object.entries(historyTrailsRef.current).forEach(([_id, trailCoords]) => {
        if (trailCoords.length < 2) return;
        const trailLine = d3
          .line<[number, number]>()
          .x((d) => projection(d)?.[0] || 0)
          .y((d) => projection(d)?.[1] || 0)
          .curve(d3.curveBasis);

        trailsGroup
          .append('path')
          .datum(trailCoords)
          .attr('d', trailLine as any)
          .attr('fill', 'none')
          .attr('stroke', '#10b981')
          .attr('stroke-width', 2.5)
          .attr('stroke-dasharray', '3 3')
          .attr('opacity', 0.7);
      });
    }

    // 7. Render Fleet & Farm Nodes from Live GeoJSON
    if (showFleet) {
      const fleetGroup = g.append('g').attr('class', 'fleet-layer');

      fleetGeoJson.features.forEach((feature) => {
        const coords = projection(feature.geometry.coordinates as [number, number]);
        if (!coords) return;

        const p = feature.properties;
        const isSelected = selectedDeviceId === p.id;
        const pinColor =
          p.deviceType === 'PHARMA_TRUCK'
            ? '#10b981'
            : p.deviceType === 'FOOD_COLD_CHAIN'
            ? '#0284c7'
            : p.deviceType === 'SMART_AGRI_FARM'
            ? '#f59e0b'
            : '#a855f7';

        const node = fleetGroup
          .append('g')
          .attr('transform', `translate(${coords[0]}, ${coords[1]})`)
          .attr('cursor', 'pointer')
          .on('mouseenter', (event) => {
            setHoveredInfo({
              x: event.pageX,
              y: event.pageY,
              title: lang === 'ar' ? p.nameAr : p.nameEn,
              subtitle: `${p.clientEn} · ${p.deviceType}`,
              telemetry: `Temp: ${p.temperatureC > 0 ? `+${p.temperatureC}` : p.temperatureC}°C | Point(${feature.geometry.coordinates[0]}, ${feature.geometry.coordinates[1]})`,
            });
          })
          .on('mouseleave', () => setHoveredInfo(null))
          .on('click', () => {
            setSelectedFeature({ type: 'FLEET_DEVICE', data: p, coords: feature.geometry.coordinates });
            if (onSelectDevice) {
              onSelectDevice(p.id);
            }
          });

        // Highlight ring if currently selected
        if (isSelected) {
          node
            .append('circle')
            .attr('r', 16)
            .attr('fill', 'none')
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4 2')
            .attr('class', 'animate-spin');
        }

        // Pulsing Beacon
        node
          .append('circle')
          .attr('r', 11)
          .attr('fill', pinColor)
          .attr('fill-opacity', 0.3)
          .attr('class', 'animate-ping');

        // Central Circle
        node
          .append('circle')
          .attr('r', isSelected ? 8 : 6)
          .attr('fill', pinColor)
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 1.5)
          .attr('filter', 'url(#glow)');

        // Telemetry Label Badge
        node
          .append('text')
          .attr('x', 9)
          .attr('y', -3)
          .attr('fill', '#ffffff')
          .attr('font-size', '9px')
          .attr('font-family', 'monospace')
          .attr('font-weight', 'bold')
          .text(p.id);

        node
          .append('text')
          .attr('x', 9)
          .attr('y', 8)
          .attr('fill', pinColor)
          .attr('font-size', '8px')
          .attr('font-family', 'monospace')
          .text(`${p.temperatureC > 0 ? `+${p.temperatureC}` : p.temperatureC}°C`);
      });
    }

    // Map Click Listener to relocate spatial buffer
    svg.on('click', (event: MouseEvent) => {
      // Avoid firing when clicking interactive markers
      const target = event.target as SVGElement | null;
      if (target && target.tagName !== 'svg' && target.tagName !== 'rect') {
        return;
      }
      const [clickX, clickY] = d3.pointer(event, g.node());
      const geoCoords = projection.invert?.([clickX, clickY]);
      if (geoCoords) {
        setRadiusCenter({
          lng: Number(geoCoords[0].toFixed(4)),
          lat: Number(geoCoords[1].toFixed(4)),
        });
      }
    });
  }, [
    showAgriZones,
    showFleet,
    showCorridors,
    showHubs,
    showRadiusBuffer,
    showTrails,
    selectedDeviceId,
    radiusCenter,
    radiusKm,
    fleetGeoJson,
    lang,
    regions,
  ]);

  // Zoom control handlers using D3 Zoom Behavior
  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(250).call(zoomBehaviorRef.current.scaleBy, 1.35);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(250).call(zoomBehaviorRef.current.scaleBy, 0.75);
    }
  };

  const handleZoomReset = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(350).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
      setRadiusCenter({ lng: 3.0588, lat: 36.7538 });
      setRadiusKm(150);
    }
  };

  const copyGeoJson = () => {
    navigator.clipboard.writeText(JSON.stringify(fullPostgisGeoJson, null, 2));
    setCopiedGeoJson(true);
    setTimeout(() => setCopiedGeoJson(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Control Bar & Layers Switch */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                {lang === 'ar' ? 'خريطة D3.js المكانية التفاعلية لأسطول صيدال والمزارع' : 'D3.js Spatial GeoJSON Overlay Engine'}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                D3 v7 · PostGIS EPSG:4326
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'إسقاط كارتوغرافي دقيق لطبقات GeoJSON للواحات ومسارات الشاحنات مع محاكاة الاستعلامات الدائرية'
                : 'Projected vector GeoJSON polygons for agricultural zones & live fleet beacons with D3 zoom'}
            </p>
          </div>
        </div>

        {/* Action Buttons: GeoJSON Inspector & Layers */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setShowAgriZones(!showAgriZones)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              showAgriZones
                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'ar' ? 'واحات بسكرة ومتيجة' : 'Agri Zones'}</span>
          </button>

          <button
            onClick={() => setShowFleet(!showFleet)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              showFleet
                ? 'bg-sky-950/80 border-sky-700 text-sky-300 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-sky-400" />
            <span>{lang === 'ar' ? 'أسطول صيدال' : 'Pharma Fleet'}</span>
          </button>

          <button
            onClick={() => setShowCorridors(!showCorridors)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              showCorridors
                ? 'bg-amber-950/80 border-amber-700 text-amber-300 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? 'الممرات A1/RN3' : 'Highways'}</span>
          </button>

          <button
            onClick={() => setShowHubs(!showHubs)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              showHubs
                ? 'bg-purple-950/80 border-purple-700 text-purple-300 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'ar' ? 'المراكز الـ 4' : '4 Hubs'}</span>
          </button>

          <button
            onClick={() => setShowTrails(!showTrails)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
              showTrails
                ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'ar' ? 'أثر المسار (Trails)' : 'Trails'}</span>
          </button>

          <button
            onClick={() => setShowGeoJsonModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>GeoJSON Spec</span>
          </button>
        </div>
      </div>

      {/* Main D3 Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* SVG Viewport */}
        <div
          ref={containerRef}
          className="lg:col-span-3 rounded-xl border border-slate-800 bg-slate-950 relative overflow-hidden select-none h-[540px] shadow-2xl"
        >
          {/* Zoom & Viewport Controls Toolbar */}
          <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 z-20 flex flex-col gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-slate-800 shadow-xl">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Zoom In (D3 scale)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Zoom Out (D3 scale)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomReset}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Reset Viewport"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Map Compass & Scale Badge */}
          <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>D3 GEO ENGINE</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Projection: Mercator(3.2°E, 34.2°N)</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-semibold">Click map to move ST_DWithin query</span>
          </div>

          {/* D3 Target SVG */}
          <svg
            ref={svgRef}
            viewBox="0 0 960 620"
            className="w-full h-full cursor-grab active:cursor-grabbing"
          ></svg>
        </div>

        {/* Side Inspector Panel */}
        <div className="space-y-4">
          {/* Spatial Buffer Query Control */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase font-mono">
                  {lang === 'ar' ? 'استعلام النطاق المكاني (ST_DWithin)' : 'PostGIS ST_DWithin Buffer'}
                </h4>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-400">
                {assetsInBuffer.length} {lang === 'ar' ? 'أصول متطابقة' : 'matches'}
              </span>
            </div>

            <div className="text-[11px] text-slate-400">
              Center: <span className="font-mono text-white">{radiusCenter.lat.toFixed(4)}, {radiusCenter.lng.toFixed(4)}</span>
            </div>

            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">Radius:</span>
              <div className="flex gap-1 font-mono">
                {[80, 150, 250, 400].map((km) => (
                  <button
                    key={km}
                    onClick={() => setRadiusKm(km)}
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      radiusKm === km
                        ? 'bg-emerald-400 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    {km}km
                  </button>
                ))}
              </div>
            </div>

            {/* Matching Assets List */}
            <div className="max-h-36 overflow-y-auto space-y-1 font-mono text-xs pr-1">
              {assetsInBuffer.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => setSelectedFeature({ type: 'FLEET_DEVICE', data: asset, coords: [asset.lng, asset.lat] })}
                  className="flex items-center justify-between p-2 rounded bg-slate-950/80 border border-slate-800/80 cursor-pointer hover:border-emerald-500/60"
                >
                  <span className="text-slate-200 truncate">{asset.id}</span>
                  <span className="text-emerald-400 font-bold">
                    {asset.temperatureC > 0 ? `+${asset.temperatureC}` : asset.temperatureC}°C
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Feature Telemetry Card */}
          {selectedFeature ? (
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                  {selectedFeature.type}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  EPSG:4326 VALID
                </span>
              </div>

              {selectedFeature.type === 'FLEET_DEVICE' && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white">
                    {lang === 'ar' ? selectedFeature.data.nameAr : selectedFeature.data.nameEn}
                  </h4>
                  <div className="text-xs text-slate-400">
                    Client: {selectedFeature.data.clientEn}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">TEMP</span>
                      <span className="text-emerald-400 font-bold">
                        {selectedFeature.data.temperatureC > 0 ? `+${selectedFeature.data.temperatureC}` : selectedFeature.data.temperatureC}°C
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">HUMIDITY</span>
                      <span className="text-sky-400 font-bold">
                        {selectedFeature.data.humidityPct ?? 'N/A'}%
                      </span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 truncate">
                    POINT({selectedFeature.coords[0]} {selectedFeature.coords[1]})
                  </div>
                </div>
              )}

              {selectedFeature.type === 'AGRI_ZONE' && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white">
                    {lang === 'ar' ? selectedFeature.data.properties.zoneNameAr : selectedFeature.data.properties.zoneNameEn}
                  </h4>
                  <div className="text-xs text-emerald-400 font-mono">
                    Area: {selectedFeature.data.properties.areaHectares.toLocaleString()} Hectares
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Crop: {selectedFeature.data.properties.cropType}
                  </p>
                  <div className="text-xs text-slate-400">
                    Irrigation: {selectedFeature.data.properties.irrigationMethod}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 truncate">
                    {selectedFeature.data.properties.postgisPolygonWkt}
                  </div>
                </div>
              )}

              {selectedFeature.type === 'REGION_HUB' && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white">
                    {lang === 'ar' ? selectedFeature.data.nameAr : selectedFeature.data.nameEn}
                  </h4>
                  <div className="text-xs text-sky-400 font-mono">
                    {selectedFeature.data.nodeType}
                  </div>
                  <div className="text-xs text-slate-400">
                    SLA: RPO {selectedFeature.data.rpoSeconds}s · RTO {selectedFeature.data.rtoSeconds}s
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/30 text-center text-xs text-slate-500">
              {lang === 'ar'
                ? 'انقر على أي واحة زراعية أو شاحنة أو مركز بيانات لفحص هندسة الـ PostGIS'
                : 'Click any agricultural zone polygon or vehicle beacon to inspect properties'}
            </div>
          )}
        </div>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredInfo && (
        <div
          className="fixed z-50 pointer-events-none p-3 rounded-lg bg-slate-950/95 backdrop-blur-md border border-slate-700 text-xs shadow-2xl space-y-1 transform -translate-x-1/2 -translate-y-full mb-3"
          style={{ left: hoveredInfo.x, top: hoveredInfo.y - 10 }}
        >
          <div className="font-bold text-white">{hoveredInfo.title}</div>
          <div className="text-slate-400">{hoveredInfo.subtitle}</div>
          {hoveredInfo.telemetry && (
            <div className="text-emerald-400 font-mono text-[11px] pt-1 border-t border-slate-800">
              {hoveredInfo.telemetry}
            </div>
          )}
        </div>
      )}

      {/* GeoJSON Raw Export Modal */}
      {showGeoJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  PostGIS Live GeoJSON FeatureCollection (EPSG:4326)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyGeoJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                >
                  {copiedGeoJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedGeoJson ? 'Copied GeoJSON' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => setShowGeoJsonModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-[460px] dir-ltr leading-relaxed">
              {JSON.stringify(fullPostgisGeoJson, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
