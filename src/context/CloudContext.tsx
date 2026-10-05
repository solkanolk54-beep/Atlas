import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Language,
  SystemOverview,
  SovereignRegion,
  PostGISDatabase,
  IoTTelemetryRecord,
  AuditLogItem,
  EnterpriseVoucherState,
} from '../types/cloud';
import {
  INITIAL_SYSTEM_OVERVIEW,
  SOVEREIGN_REGIONS,
  INITIAL_POSTGIS_DATABASES,
  INITIAL_IOT_RECORDS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';

export type ActiveTab =
  | 'overview'
  | 'regions'
  | 'postgis-iot'
  | 'swagger'
  | 'compliance'
  | 'enterprise'
  | 'terminal';

interface FailoverSimState {
  isActive: boolean;
  step: number; // 0: idle, 1: fault detected, 2: patroni consensus, 3: failover promoted, 4: dns rerouted, 5: completed
  elapsedSeconds: number;
  logs: Array<{ time: string; msg: string; level: 'warn' | 'info' | 'success' | 'crit' }>;
  targetRegion: string;
}

interface CloudContextType {
  lang: Language;
  setLang: (l: Language) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  system: SystemOverview;
  regions: SovereignRegion[];
  databases: PostGISDatabase[];
  iotRecords: IoTTelemetryRecord[];
  auditLogs: AuditLogItem[];
  wsPacketsCount: number;
  isWsStreaming: boolean;
  setIsWsStreaming: (val: boolean) => void;
  lastWsPacket: any;
  failoverSim: FailoverSimState;
  startFailoverSimulation: () => void;
  resetFailoverSimulation: () => void;
  enterprise: EnterpriseVoucherState;
  activateVoucher: (code: string) => { success: boolean; message: string };
  rotateHsmKey: () => void;
  terminalLogs: string[];
  runTerminalCommand: (cmd: string) => void;
  isDossierOpen: boolean;
  setIsDossierOpen: (open: boolean) => void;
}

const CloudContext = createContext<CloudContextType | undefined>(undefined);

export const CloudProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ar');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [system, setSystem] = useState<SystemOverview>(INITIAL_SYSTEM_OVERVIEW);
  const [regions, setRegions] = useState<SovereignRegion[]>(SOVEREIGN_REGIONS);
  const [databases] = useState<PostGISDatabase[]>(INITIAL_POSTGIS_DATABASES);
  const [iotRecords, setIotRecords] = useState<IoTTelemetryRecord[]>(INITIAL_IOT_RECORDS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [wsPacketsCount, setWsPacketsCount] = useState<number>(8420);
  const [isWsStreaming, setIsWsStreaming] = useState<boolean>(true);
  const [lastWsPacket, setLastWsPacket] = useState<any>(null);

  // Failover simulation state
  const [failoverSim, setFailoverSim] = useState<FailoverSimState>({
    isActive: false,
    step: 0,
    elapsedSeconds: 0,
    logs: [],
    targetRegion: 'dz-west-1',
  });

  // Enterprise state
  const [enterprise, setEnterprise] = useState<EnterpriseVoucherState>({
    isActivated: false,
    voucherCode: '',
    balanceDzd: 0,
    planNameAr: 'الباقة الأساسية المشتركة',
    planNameEn: 'Standard Sovereign Tier',
    tierId: 'standard',
    activatedAt: null,
    featuresUnlocked: {
      airGappedVpc: false,
      dedicatedHsmByok: false,
      sovereignWarRoom: false,
      slaFinancialGuarantee: false,
    },
    hsmKeyCount: 1,
  });

  // Terminal state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'AtlasCloud Sovereign NeoCloud (DZ) Edge Engine v2.4.0 (linux/amd64)',
    'Go Gin Engine compiled binary footprint: 19.8MB (Max constraint: < 25MB)',
    'Initialized Patroni HA cluster on port 8080 with PostGIS 3.4.2 & pgvector 0.7',
    'Ready for sovereign execution. Type "help" or run pre-configured scripts.',
  ]);

  // Synchronize HTML dir attribute with language
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Real-Time IoT WebSocket Streaming simulator (Ticking every 3 seconds)
  useEffect(() => {
    if (!isWsStreaming) return;

    const interval = setInterval(() => {
      const nowIso = new Date().toISOString();

      setIotRecords((prevRecords) =>
        prevRecords.map((item) => {
          let updatedTemp = item.temperatureC;
          let updatedLat = item.lat;
          let updatedLng = item.lng;
          let updatedHumidity = item.humidityPct;
          let updatedSalinity = item.salinityEc;

          // Minor drift to reflect realistic continuous sensors
          if (item.deviceType === 'PHARMA_TRUCK') {
            const delta = (Math.random() - 0.5) * 0.15;
            updatedTemp = Number((item.temperatureC + delta).toFixed(2));
            // Slight coordinate drift along highway
            updatedLng = Number((item.lng + (Math.random() - 0.48) * 0.003).toFixed(4));
            updatedLat = Number((item.lat + (Math.random() - 0.49) * 0.002).toFixed(4));
          } else if (item.deviceType === 'FOOD_COLD_CHAIN') {
            const delta = (Math.random() - 0.5) * 0.2;
            updatedTemp = Number((item.temperatureC + delta).toFixed(2));
            updatedHumidity = Math.min(95, Math.max(40, Number(((item.humidityPct || 65) + (Math.random() - 0.5) * 1.5).toFixed(1))));
          } else if (item.deviceType === 'SMART_AGRI_FARM') {
            const delta = (Math.random() - 0.5) * 0.3;
            updatedTemp = Number((item.temperatureC + delta).toFixed(1));
            updatedHumidity = Math.min(60, Math.max(20, Number(((item.humidityPct || 30) + (Math.random() - 0.5) * 0.4).toFixed(1))));
            if (item.salinityEc) {
              updatedSalinity = Number((item.salinityEc + (Math.random() - 0.5) * 0.01).toFixed(2));
            }
          }

          return {
            ...item,
            temperatureC: updatedTemp,
            lat: updatedLat,
            lng: updatedLng,
            humidityPct: updatedHumidity,
            salinityEc: updatedSalinity,
            timestamp: nowIso,
            spatialPointWkt: `POINT(${updatedLng} ${updatedLat})`,
          };
        })
      );

      setWsPacketsCount((c) => c + 1);

      // Packet preview
      const sampleItem = INITIAL_IOT_RECORDS[Math.floor(Math.random() * INITIAL_IOT_RECORDS.length)];
      setLastWsPacket({
        stream: '/ws/v1/iot/stream',
        protocol: 'WSS (TLS 1.3 / Sovereign ANPDP Encrypted)',
        timestamp: nowIso,
        telemetry: {
          deviceId: sampleItem.id,
          type: sampleItem.deviceType,
          client: sampleItem.clientEn,
          coords: [sampleItem.lat, sampleItem.lng],
          temp: sampleItem.temperatureC,
          postgis_geometry: sampleItem.spatialPointWkt,
          heartbeat: 'NOMINAL',
        },
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isWsStreaming]);

  // Failover simulation runner
  const startFailoverSimulation = useCallback(() => {
    if (failoverSim.isActive) return;

    setFailoverSim({
      isActive: true,
      step: 1,
      elapsedSeconds: 0,
      targetRegion: 'dz-west-1',
      logs: [
        {
          time: '00:00.00',
          msg: '🚨 تم إطلاق المحاكاة: انقطاع كابل الألياف البحرية والكهرباء عن dz-north-1 (الجزائر العاصمة)',
          level: 'crit',
        },
      ],
    });

    setSystem((s) => ({
      ...s,
      clusterStatus: 'FAILOVER_IN_PROGRESS',
      patroniSyncStatus: 'FAILING_OVER',
    }));

    setRegions((prev) =>
      prev.map((r) =>
        r.id === 'dz-north-1'
          ? { ...r, status: 'FAILOVER_TRIGGERED', activeLoadPct: 0 }
          : r
      )
    );

    // Timeline execution for RTO < 15s demonstration
    // Step 2 at 3.2s
    setTimeout(() => {
      setFailoverSim((prev) => ({
        ...prev,
        step: 2,
        elapsedSeconds: 3.2,
        logs: [
          ...prev.logs,
          {
            time: '00:03.20',
            msg: '⚡ بروتوكول Patroni Raft consensus: التحقق من انعدام فقدان البيانات RPO = 0 بايت عبر Oran Synchronous Mirror',
            level: 'warn',
          },
        ],
      }));
    }, 3200);

    // Step 3 at 7.1s
    setTimeout(() => {
      setFailoverSim((prev) => ({
        ...prev,
        step: 3,
        elapsedSeconds: 7.1,
        logs: [
          ...prev.logs,
          {
            time: '00:07.10',
            msg: '👑 ترقية عقدة وهران dz-west-1 إلى PRIMARY LEADER وتفعيل نمط الكتابة المكانية في PostGIS بنجاح',
            level: 'info',
          },
        ],
      }));

      setRegions((prev) =>
        prev.map((r) =>
          r.id === 'dz-west-1'
            ? { ...r, status: 'PROMOTED_PRIMARY', replicationType: 'PRIMARY', activeLoadPct: 88 }
            : r
        )
      );
    }, 7100);

    // Step 4 at 10.4s
    setTimeout(() => {
      setFailoverSim((prev) => ({
        ...prev,
        step: 4,
        elapsedSeconds: 10.4,
        logs: [
          ...prev.logs,
          {
            time: '00:10.40',
            msg: '🌐 تحويل BGP Anycast المسار السيادي وإعادة توجيه حركة معاملات SATIM إلى وهران دون أي مقاطعة',
            level: 'info',
          },
        ],
      }));
    }, 10400);

    // Step 5 at 13.5s (RTO = 13.5s < 15s Guaranteed!)
    setTimeout(() => {
      setFailoverSim((prev) => ({
        ...prev,
        step: 5,
        elapsedSeconds: 13.5,
        logs: [
          ...prev.logs,
          {
            time: '00:13.50',
            msg: '✅ اكتملت خطة التعافي من الكوارث (Geo-DR) بنجاح فائق! RTO = 13.5 ثانية (< 15s) و RPO = 0 (صفر بايت مفقود)',
            level: 'success',
          },
        ],
      }));

      setSystem((s) => ({
        ...s,
        clusterStatus: 'HEALTHY',
        activePrimaryRegion: 'dz-west-1',
        standbyMirrorRegion: 'dz-east-1',
        patroniSyncStatus: 'PROMOTED_PRIMARY',
      }));

      // Add audit entry
      setAuditLogs((prev) => [
        {
          id: `AUD-DR-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toISOString(),
          actor: 'patroni-orchestrator@dz-west-1',
          action: 'AUTOMATED_GEO_FAILOVER_ORAN_PROMOTION',
          region: 'dz-west-1',
          resource: 'cluster/patroni-ha-patronictl',
          law1807Clause: 'المادة 24: خطط استمرارية الأعمال والتعافي الفوري',
          anpdpClassification: 'LEVEL_4_RESTRICTED',
          sha256Hash: 'a71829e2bc13d5678841432f890bfaee600021cbb8a3d13c7743bdf129841f22',
          status: 'VERIFIED',
        },
        ...prev,
      ]);
    }, 13500);
  }, [failoverSim.isActive]);

  const resetFailoverSimulation = useCallback(() => {
    setFailoverSim({
      isActive: false,
      step: 0,
      elapsedSeconds: 0,
      logs: [],
      targetRegion: 'dz-west-1',
    });

    setSystem(INITIAL_SYSTEM_OVERVIEW);
    setRegions(SOVEREIGN_REGIONS);
  }, []);

  // Voucher Activation
  const activateVoucher = useCallback((code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'DZ-PACK-ENTERPRISE-2026') {
      setEnterprise({
        isActivated: true,
        voucherCode: cleanCode,
        balanceDzd: 1500000,
        planNameAr: 'الباقة المؤسسية السيادية (Sovereign Enterprise)',
        planNameEn: 'Sovereign Enterprise Tier',
        tierId: 'sovereign_enterprise',
        activatedAt: new Date().toISOString(),
        featuresUnlocked: {
          airGappedVpc: true,
          dedicatedHsmByok: true,
          sovereignWarRoom: true,
          slaFinancialGuarantee: true,
        },
        hsmKeyCount: 4,
      });

      // Add audit log
      setAuditLogs((prev) => [
        {
          id: `AUD-ENT-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toISOString(),
          actor: 'sovereign-billing@dz-north-1',
          action: 'ENTERPRISE_PACK_DZ_2026_ACTIVATED_1500000_DZD',
          region: 'dz-north-1',
          resource: 'billing/voucher-grant-dz',
          law1807Clause: 'المادة 31: أجهزة التشفير العتادي BYOK والشبكات المعزولة',
          anpdpClassification: 'LEVEL_4_RESTRICTED',
          sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
          status: 'VERIFIED',
        },
        ...prev,
      ]);

      return {
        success: true,
        message:
          lang === 'ar'
            ? 'تم تفعيل الباقة المؤسسية السيادية بنجاح وإيداع 1,500,000 دج رصيد سحابي!'
            : 'Sovereign Enterprise Tier activated with 1,500,000 DZD cloud credit granted!',
      };
    }
    return {
      success: false,
      message:
        lang === 'ar'
          ? 'رمز التفعيل غير صحيح. استخدم الرمز المعتمد: DZ-PACK-ENTERPRISE-2026'
          : 'Invalid voucher code. Please use the official code: DZ-PACK-ENTERPRISE-2026',
    };
  }, [lang]);

  const rotateHsmKey = useCallback(() => {
    setEnterprise((prev) => ({
      ...prev,
      hsmKeyCount: prev.hsmKeyCount + 1,
    }));
    setAuditLogs((prev) => [
      {
        id: `AUD-HSM-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
        actor: 'national-crypto-officer@satim',
        action: 'HSM_BYOK_KEY_ROTATION_SUCCESS',
        region: 'dz-north-1',
        resource: 'hsm/keys/rsa-4096-sovereign-vault',
        law1807Clause: 'المادة 31: تدوير وتأمين مفاتيح التشفير الوطنية',
        anpdpClassification: 'LEVEL_4_RESTRICTED',
        sha256Hash: '9f83c60bee849ea2db1bde4b459ebd534f40da63f7b805377145465b037812cd',
        status: 'VERIFIED',
      },
      ...prev,
    ]);
  }, []);

  const runTerminalCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    let response = '';
    const lower = trimmed.toLowerCase();

    if (lower === 'help') {
      response = `Available commands:
  - go run main.go database.go    : Start AtlasCloud Go Gin control plane on port 8080
  - docker compose up -d          : Launch multi-container PostGIS + Patroni cluster
  - patronictl topology           : Inspect Patroni 4-region HA replication status
  - psql -c "SELECT postgis_full_version();" : Check PostgreSQL 16 & PostGIS 3.4
  - curl http://localhost:8080/api/v1/system/overview : Query local Gin API
  - clear                         : Reset terminal output`;
    } else if (lower.includes('go run')) {
      response = `[GIN-debug] [WARNING] Running in "release" mode. Switch to "debug" mode for verbose logging.
[GIN-debug] GET    /api/v1/system/overview   --> main.GetSystemOverview (3 handlers)
[GIN-debug] GET    /api/v1/databases/postgis --> main.GetPostGISDatabases (3 handlers)
[GIN-debug] GET    /ws/v1/iot/stream         --> main.HandleIoTWebSocketStream (3 handlers)
[GIN-debug] GET    /docs                     --> ginSwagger.WrapHandler (Swagger UI 5.11)
[ATLAS-CLOUD] Listening and serving HTTP on :8080
[MEMORY] Resident Set Size: 19.8MB (Memory budget: < 25MB - OPTIMAL FOR EDGE/TERMUX)
[HA] Connected to Patroni primary: dz-north-1 (latency 0.8ms)`;
    } else if (lower.includes('docker compose')) {
      response = `[+] Running 4/4
 ✔ Network atlascloud_sovereign_net Created                                    0.2s
 ✔ Container atlascloud-patroni-etcd-1    Started                                0.4s
 ✔ Container atlascloud-postgis-primary-1 Started                                0.6s
 ✔ Container atlascloud-gin-api-1        Started (Port 8080->8080)              0.8s
All sovereign services running in local containerized sandbox!`;
    } else if (lower.includes('patronictl')) {
      response = `+ Cluster: patroni-dz-sovereign (74109481230491) +---------+
| Member     | Host         | Role    | State   | TL | Lag in MB |
+------------+--------------+---------+---------+----+-----------+
| dz-north-1 | 10.10.1.10   | Leader  | running |  1 |           |
| dz-west-1  | 10.10.2.10   | Sync    | running |  1 |         0 |
| dz-east-1  | 10.10.3.10   | Replica | running |  1 |       0.1 |
| dz-south-1 | 10.10.4.10   | Replica | running |  1 |       0.3 |
+------------+--------------+---------+---------+----+-----------+
Sync standbys: dz-west-1 (RPO = 0 guaranteed)`;
    } else if (lower.includes('psql') || lower.includes('postgis')) {
      response = `POSTGIS="3.4.2 c874d2b" [EXTENSION] PGSQL="160" GEOS="3.12.1-CAPI-1.18.1" PROJ="9.3.1" LIBXML="2.9.14" LIBJSON="0.17" LIBPROTOBUF="1.4.1" WAGYU="0.5.0 (Internal)"
Installed modules: postgis, postgis_topology, postgis_raster, pgvector 0.7.0
Spatial Reference SRID: EPSG:4326 (WGS 84 / Geographic coordinates)`;
    } else if (lower.includes('curl')) {
      response = JSON.stringify(
        {
          status: 'SUCCESS',
          code: 200,
          region: 'dz-north-1',
          uptime: '99.99%',
          compliance: 'ANPDP_LAW_18_07_CERTIFIED',
          k8s_nodes: 12,
          patroni_sync: 'SYNCHRONOUS_REPLICATION_OK',
        },
        null,
        2
      );
    } else if (lower === 'clear') {
      setTerminalLogs([]);
      return;
    } else {
      response = `bash: command not recognized: "${trimmed}". Type "help" to view sovereign commands.`;
    }

    setTerminalLogs((prev) => [...prev, `$ ${trimmed}`, response]);
  }, []);

  return (
    <CloudContext.Provider
      value={{
        lang,
        setLang,
        activeTab,
        setActiveTab,
        system,
        regions,
        databases,
        iotRecords,
        auditLogs,
        wsPacketsCount,
        isWsStreaming,
        setIsWsStreaming,
        lastWsPacket,
        failoverSim,
        startFailoverSimulation,
        resetFailoverSimulation,
        enterprise,
        activateVoucher,
        rotateHsmKey,
        terminalLogs,
        runTerminalCommand,
        isDossierOpen,
        setIsDossierOpen,
      }}
    >
      {children}
    </CloudContext.Provider>
  );
};

export const useCloud = () => {
  const context = useContext(CloudContext);
  if (!context) {
    throw new Error('useCloud must be used within a CloudProvider');
  }
  return context;
};
