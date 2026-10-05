export type Language = 'ar' | 'en';

export interface SystemOverview {
  clusterStatus: 'HEALTHY' | 'FAILOVER_IN_PROGRESS' | 'DEGRADED';
  uptimePercentage: number;
  k8sNodesTotal: number;
  k8sNodesHealthy: number;
  patroniSyncStatus: 'SYNCHRONOUS_REPLICATION_OK' | 'FAILING_OVER' | 'PROMOTED_PRIMARY';
  activePrimaryRegion: string;
  standbyMirrorRegion: string;
  complianceCertStatus: 'ANPDP_VALIDATED_LAW_18_07';
  bankOfAlgeriaCompliance: 'COMPLIANT_ZERO_BORDER_EGRESS';
  memoryFootprintMB: number;
  activeRequestsPerSec: number;
  medianLatencyMs: number;
  lastAuditSync: string;
}

export interface SovereignRegion {
  id: string; // 'dz-north-1' | 'dz-west-1' | 'dz-east-1' | 'dz-south-1'
  nameAr: string;
  nameEn: string;
  locationAr: string;
  locationEn: string;
  roleAr: string;
  roleEn: string;
  nodeType: string;
  tier: string;
  status: 'ONLINE' | 'STANDBY_SYNC' | 'EDGE_ONLINE' | 'FAILOVER_TRIGGERED' | 'PROMOTED_PRIMARY';
  lat: number;
  lng: number;
  k8sNodes: number;
  vCpuTotal: number;
  ramGb: number;
  storageTb: number;
  rpoSeconds: number;
  rtoSeconds: number;
  replicationType: 'PRIMARY' | 'SYNC_MIRROR' | 'ASYNC_REPLICA' | 'EDGE_CACHE';
  activeLoadPct: number;
  specializationAr: string;
  specializationEn: string;
}

export interface PostGISDatabase {
  id: string;
  name: string;
  clientOrganizationAr: string;
  clientOrganizationEn: string;
  region: string;
  engineVersion: string;
  extensions: string[];
  spatialSRID: number;
  geometryType: string;
  tablesCount: number;
  recordsCount: number;
  storageMb: number;
  replicationLagBytes: number;
  status: 'HEALTHY' | 'SYNCING';
  lastVacuum: string;
}

export interface IoTTelemetryRecord {
  id: string;
  deviceType: 'PHARMA_TRUCK' | 'FOOD_COLD_CHAIN' | 'SMART_AGRI_FARM' | 'ENERGY_EDGE';
  nameAr: string;
  nameEn: string;
  clientAr: string;
  clientEn: string;
  locationNameAr: string;
  locationNameEn: string;
  lat: number;
  lng: number;
  timestamp: string;
  temperatureC: number;
  targetTempRange: string;
  humidityPct?: number;
  salinityEc?: number;
  doorLocked: boolean;
  speedKmh?: number;
  batteryPct: number;
  alarmState: 'NORMAL' | 'WARNING' | 'CRITICAL';
  spatialPointWkt: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  region: string;
  resource: string;
  law1807Clause: string;
  anpdpClassification: 'LEVEL_3_CONFIDENTIAL' | 'LEVEL_4_RESTRICTED' | 'LEVEL_2_INTERNAL';
  sha256Hash: string;
  status: 'VERIFIED' | 'COMPLIANT';
}

export interface EnterpriseVoucherState {
  isActivated: boolean;
  voucherCode: string;
  balanceDzd: number;
  planNameAr: string;
  planNameEn: string;
  tierId: string;
  activatedAt: string | null;
  featuresUnlocked: {
    airGappedVpc: boolean;
    dedicatedHsmByok: boolean;
    sovereignWarRoom: boolean;
    slaFinancialGuarantee: boolean;
  };
  hsmKeyCount: number;
}
