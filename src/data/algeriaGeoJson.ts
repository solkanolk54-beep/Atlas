// GeoJSON definitions for Algeria sovereign territory, agricultural zones, and logistics corridors
export interface GeoJsonFeature<G = any, P = any> {
  type: 'Feature';
  id?: string | number;
  geometry: G;
  properties: P;
}

export interface GeoJsonFeatureCollection<G = any, P = any> {
  type: 'FeatureCollection';
  features: Array<GeoJsonFeature<G, P>>;
}

// 1. Algerian National Border & Key Regional Boundaries GeoJSON
export const ALGERIA_BOUNDARY_GEOJSON: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'DZA',
      properties: {
        nameAr: 'الجمهورية الجزائرية الديمقراطية الشعبية',
        nameEn: 'Algeria',
        iso: 'DZ',
        srid: 4326,
        capital: 'Algiers',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            // Northern Coastline and Borders approximate polygon
            [-2.15, 35.1],
            [-0.63, 35.7],
            [0.15, 36.1],
            [1.33, 36.4],
            [2.83, 36.6],
            [3.06, 36.78], // Algiers
            [4.05, 36.9],
            [5.3, 36.85],
            [6.6, 36.9],
            [7.76, 36.9], // Annaba
            [8.5, 36.95], // El Kala border
            [8.3, 35.5],
            [8.1, 34.0],
            [8.8, 31.8],
            [9.8, 30.2],
            [8.5, 27.5],
            [7.0, 25.0],
            [5.0, 22.5],
            [4.0, 20.0],
            [1.0, 19.0],
            [-1.5, 21.0],
            [-4.5, 25.0],
            [-6.0, 27.5],
            [-8.6, 28.7], // Tindouf tip
            [-6.5, 30.5],
            [-4.0, 31.8],
            [-2.5, 32.5],
            [-1.8, 34.2],
            [-2.15, 35.1],
          ],
        ],
      },
    },
  ],
};

// 2. High-Value Agricultural Zones (المناطق الفلاحية والواحات)
export const AGRICULTURAL_ZONES_GEOJSON: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'AGRI-ZONE-BISKRA-01',
      properties: {
        zoneNameAr: 'حوض واحات بسكرة والزيبان (دقلة نور والزيتون المكثف)',
        zoneNameEn: 'Biskra Ziban Agro-Basin (Deglet Nour & Olive Groves)',
        wilaya: 'Biskra',
        cropType: 'Deglet Nour Date Palms & Super-Intensive Olives',
        areaHectares: 48500,
        irrigationMethod: 'Solar Smart Drip Irrigation & Deep Albian Wells',
        soilType: 'Aridisol / Alluvial with Gypsum',
        averageMoisturePct: 34.2,
        salinityIndexEc: '1.08 dS/m (Optimal)',
        postgisPolygonWkt: 'POLYGON((5.40 34.65, 6.10 34.65, 6.15 34.95, 5.45 34.95, 5.40 34.65))',
        colorTheme: '#10b981',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [5.40, 34.65],
            [6.10, 34.65],
            [6.15, 34.95],
            [5.85, 35.05],
            [5.45, 34.95],
            [5.40, 34.65],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'AGRI-ZONE-MITIDJA-02',
      properties: {
        zoneNameAr: 'سهل متيجة الفلاحي الخصيب (ألبان وحمضيات وخضروات طازجة)',
        zoneNameEn: 'Mitidja Fertile Agro-Plain (Dairy, Citrus & Horticulture)',
        wilaya: 'Blida / Algiers',
        cropType: 'Fresh Milk Logistics, Citrus Orchards, Greenhouses',
        areaHectares: 62000,
        irrigationMethod: 'Wadi Chiffa Surface Runoff & Mitidja Aquifer',
        soilType: 'Deep Alluvial Loam (High Fertility)',
        averageMoisturePct: 65.4,
        salinityIndexEc: '0.45 dS/m (Pristine)',
        postgisPolygonWkt: 'POLYGON((2.60 36.45, 3.25 36.55, 3.35 36.75, 2.70 36.65, 2.60 36.45))',
        colorTheme: '#0284c7',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [2.60, 36.45],
            [3.25, 36.55],
            [3.35, 36.75],
            [2.95, 36.72],
            [2.70, 36.65],
            [2.60, 36.45],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'AGRI-ZONE-MASCARA-SIG-03',
      properties: {
        zoneNameAr: 'سهل الهبرة وسيق ومعسكر (أشجار الزيتون والحبوب الكبرى)',
        zoneNameEn: 'Habra-Sig & Mascara Agricultural Plain (Olives & Grains)',
        wilaya: 'Mascara',
        cropType: 'Table Olives, Olive Oil Mills, Durum Wheat',
        areaHectares: 39000,
        irrigationMethod: 'Dam Water Reservoir & Micro-Sprinklers',
        soilType: 'Calcareous Clay',
        averageMoisturePct: 42.1,
        salinityIndexEc: '0.92 dS/m',
        postgisPolygonWkt: 'POLYGON((-0.30 35.40, 0.25 35.35, 0.35 35.65, -0.20 35.68, -0.30 35.40))',
        colorTheme: '#f59e0b',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-0.30, 35.40],
            [0.25, 35.35],
            [0.35, 35.65],
            [-0.10, 35.75],
            [-0.20, 35.68],
            [-0.30, 35.40],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      id: 'AGRI-ZONE-SOUF-PIVOTS-04',
      properties: {
        zoneNameAr: 'واحات وادي سوف الزراعية (الرش المحوري والبطاطا الصحراوية)',
        zoneNameEn: 'Oued Souf Agro-Basin (Center-Pivot Potatoes & Dates)',
        wilaya: 'El Oued',
        cropType: 'Center-Pivot Potatoes, Onions, Organic Vegetables',
        areaHectares: 54000,
        irrigationMethod: 'Center Pivot Deep Aquifer Irrigation',
        soilType: 'Sandy Arid Dune Soils',
        averageMoisturePct: 29.8,
        salinityIndexEc: '1.25 dS/m',
        postgisPolygonWkt: 'POLYGON((6.65 33.20, 7.30 33.25, 7.25 33.60, 6.60 33.55, 6.65 33.20))',
        colorTheme: '#8b5cf6',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.65, 33.20],
            [7.30, 33.25],
            [7.25, 33.60],
            [6.75, 33.65],
            [6.60, 33.55],
            [6.65, 33.20],
          ],
        ],
      },
    },
  ],
};

// 3. National Logistics Corridors (ممرات سلاسل الإمداد والتبريد الوطنية)
export const LOGISTICS_CORRIDORS_GEOJSON: GeoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'CORRIDOR-A1-EAST-WEST',
      properties: {
        nameAr: 'شريان الطريق السيار شرق-غرب (A1)',
        nameEn: 'East-West Sovereign Logistics Highway (A1)',
        lengthKm: 1216,
        capacity: 'Dual 3-lane Highway with Smart Cold-Chain Stations',
        monitoredFleetCount: 42,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-1.32, 34.88], // Tlemcen
          [-0.63, 35.70], // Oran Hub
          [0.15, 35.95],  // Mostaganem junction
          [1.33, 36.16],  // Chlef
          [2.20, 36.35],  // Ain Defla
          [2.83, 36.47],  // Blida
          [3.06, 36.75],  // Algiers Central
          [3.90, 36.37],  // Bouira
          [4.75, 36.20],  // Bordj Bou Arreridj
          [5.41, 36.19],  // Setif
          [6.61, 36.36],  // Constantine Hub
          [7.20, 36.65],  // Skikda junction
          [7.76, 36.90],  // Annaba
        ],
      },
    },
    {
      type: 'Feature',
      id: 'CORRIDOR-RN3-SAHARA',
      properties: {
        nameAr: 'طريق الوحدة الأفريقية والصحراء الكبرى (RN3)',
        nameEn: 'Trans-Sahara Agro-Energy Corridor (RN3)',
        lengthKm: 850,
        capacity: 'Heavy Logistics Transport for Oil, Gas & Oasis Cargo',
        monitoredFleetCount: 28,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [3.06, 36.75],  // Algiers
          [3.90, 36.37],  // Bouira
          [4.50, 35.80],  // M'Sila
          [5.73, 34.85],  // Biskra Oasis Hub
          [6.05, 33.10],  // Touggourt
          [5.33, 31.95],  // Ouargla Edge Hub
          [6.07, 31.68],  // Hassi Messaoud Energy
        ],
      },
    },
    {
      type: 'Feature',
      id: 'PIPELINE-SONATRACH-HMD-SKIKDA',
      properties: {
        nameAr: 'أنبوب النفط الخام والغاز حاسي مسعود ➔ سكيكدة (OT/OB1)',
        nameEn: 'Sonatrach Crude & Gas Pipeline Hassi Messaoud ➔ Skikda',
        lengthKm: 640,
        capacity: '40" Crude Oil Mainline · SCADA Monitored by dz-south-1',
        pipelineType: 'CRUDE_GAS_PIPELINE',
        pressureRatingBar: 74.5,
        monitoredFleetCount: 16,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [6.07, 31.68],  // Hassi Messaoud Central
          [6.02, 31.87],  // Haoud El Hamra Manifold Terminal
          [6.05, 33.10],  // Touggourt Booster
          [5.73, 34.85],  // Biskra Station
          [6.17, 35.55],  // Batna Junction
          [6.90, 36.88],  // Skikda Export Terminal & Refinery
        ],
      },
    },
    {
      type: 'Feature',
      id: 'PIPELINE-SONATRACH-HMD-ARZEW',
      properties: {
        nameAr: 'أنبوب الغاز الطبيعي والمكثفات حاسي مسعود ➔ أرزيو (GZ4/GG1)',
        nameEn: 'Sonatrach Gas & Condensate Pipeline Hassi Messaoud ➔ Arzew',
        lengthKm: 820,
        capacity: '48" High-Pressure Gas Trunkline · SCADA Monitored by dz-south-1',
        pipelineType: 'NATURAL_GAS_PIPELINE',
        pressureRatingBar: 82.0,
        monitoredFleetCount: 22,
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [6.07, 31.68],  // Hassi Messaoud Central
          [5.33, 31.95],  // Ouargla Edge Hub
          [3.67, 32.49],  // Ghardaia Compression
          [2.87, 33.80],  // Laghouat
          [1.32, 35.37],  // Tiaret Valve Station
          [-0.31, 35.85], // Arzew LNG Complex & Export Harbor
        ],
      },
    },
  ],
};
