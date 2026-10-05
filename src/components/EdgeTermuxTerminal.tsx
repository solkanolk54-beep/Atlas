import React, { useState } from 'react';
import { useCloud } from '../context/CloudContext';
import {
  Terminal as TerminalIcon,
  Play,
  Copy,
  Check,
  Cpu,
  Layers,
  FileCode,
  Smartphone,
  HardDrive,
} from 'lucide-react';

export const EdgeTermuxTerminal: React.FC = () => {
  const { lang, terminalLogs, runTerminalCommand } = useCloud();
  const [cmdInput, setCmdInput] = useState<string>('');
  const [activeCodeTab, setActiveCodeTab] = useState<'compose' | 'dockerfile' | 'go_main'>('compose');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;
    runTerminalCommand(cmdInput);
    setCmdInput('');
  };

  const copyCode = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const dockerComposeContent = `# AtlasCloud Sovereign NeoCloud DZ - Docker Compose
# Single-command Sovereign Stack: Go Gin Control Plane + PostgreSQL 16 PostGIS 3.4
version: "3.9"

services:
  atlascloud-postgis:
    image: postgis/postgis:16-3.4-alpine
    container_name: atlascloud-postgis-primary
    environment:
      POSTGRES_DB: atlascloud_sovereign_db
      POSTGRES_USER: atlas_admin
      POSTGRES_PASSWORD: SovereignDzSecurePassword2026!
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgis_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - sovereign_net
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U atlas_admin -d atlascloud_sovereign_db"]
      interval: 5s
      timeout: 5s
      retries: 5

  atlascloud-gin-api:
    build:
      context: .
      dockerfile: Dockerfile.multistage
    container_name: atlascloud-gin-engine
    depends_on:
      atlascloud-postgis:
        condition: service_healthy
    ports:
      - "8080:8080"
    environment:
      PORT: "8080"
      GIN_MODE: release
      DB_HOST: atlascloud-postgis
      DB_PORT: "5432"
      DB_USER: atlas_admin
      DB_NAME: atlascloud_sovereign_db
      REGION_ID: dz-north-1
      ANPDP_AUDIT_ENABLED: "true"
    networks:
      - sovereign_net
    restart: unless-stopped

volumes:
  postgis_data:

networks:
  sovereign_net:
    driver: bridge`;

  const dockerfileContent = `# Multi-Stage High-Performance Go Build for Edge & Cloud
# Stage 1: Build & Compile Binary
FROM golang:1.23-alpine AS builder

WORKDIR /app
RUN apk add --no-cache git ca-certificates tzdata

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Compile lightweight static binary without CGO for < 25MB footprint
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \\
    -ldflags="-w -s -X main.Version=2026.10 -X main.SovereignRegion=dz-north-1" \\
    -o /app/bin/atlascloud-engine .

# Stage 2: Ultra-Minimal Production Scratch / Distroless Image
FROM scratch

WORKDIR /root/
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app/bin/atlascloud-engine /atlascloud-engine

EXPOSE 8080
ENTRYPOINT ["/atlascloud-engine"]`;

  const goMainSnippet = `package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

// AtlasCloud Sovereign Engine - Ultra-lightweight Go Gin Server (< 25MB RAM)
func main() {
	r := gin.New()
	r.Use(gin.Recovery())

	// Health and Sovereignty Endpoint
	r.GET("/api/v1/system/overview", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":            "ONLINE",
			"sovereign_region":  "dz-north-1",
			"uptime_sla":        99.99,
			"patroni_sync":      "SYNCHRONOUS_REPLICATION_OK",
			"law_18_07_audit":   "ANPDP_CERTIFIED",
		})
	})

	// Termux / Edge Listen Port
	r.Run(":8080")
}`;

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <div className="text-xs font-mono text-emerald-400 mb-1">
          06. Termux & Edge Ready Operational Runtime
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <TerminalIcon className="w-6 h-6 text-purple-400" />
          <span>{lang === 'ar' ? 'البيئة التشغيلية وتجربة التشغيل المباشرة (Termux & Edge)' : 'Operational Environment & Edge / Termux Runtime'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          {lang === 'ar'
            ? 'تشغيل فائق الخفة عبر الحاويات أو الأجهزة الطرفية وهواتف Termux باستهلاك ذاكرة أقل من 25MB، مع خادم Go Gin على المنفذ :8080 وقاعدة بيانات PostGIS المكانية.'
            : 'Ultra-lightweight execution via containers or localized Termux edge devices under 25MB memory budget, hosting Go Gin on port :8080 with PostGIS spatial engines.'}
        </p>
      </div>

      {/* Terminal Sandbox */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        {/* Terminal Title Bar */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-mono text-slate-400 ml-2">
              atlascloud@termux-edge:~$ (Go 1.23 / Gin Engine)
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">RAM:</span>
            <span className="text-emerald-400 font-bold tabular-nums">19.8MB / 25MB</span>
            <span aria-hidden="true" className="text-slate-700">|</span>
            <span className="text-slate-400">Port:</span>
            <span className="text-sky-400 font-bold">:8080</span>
          </div>
        </div>

        {/* Terminal Output Area */}
        <div className="p-4 font-mono text-xs text-slate-300 min-h-[260px] max-h-[380px] overflow-y-auto space-y-2 dir-ltr">
          {terminalLogs.map((line, idx) => (
            <div
              key={idx}
              className={
                line.startsWith('$')
                  ? 'text-emerald-400 font-bold'
                  : line.startsWith('[GIN-debug]')
                  ? 'text-sky-300'
                  : line.startsWith('[+]') || line.includes('✔')
                  ? 'text-emerald-400'
                  : line.includes('WARNING') || line.includes('Error')
                  ? 'text-amber-400'
                  : 'text-slate-300'
              }
            >
              {line}
            </div>
          ))}
        </div>

        {/* Pre-configured Quick Action Buttons */}
        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs font-mono">
          <span className="text-slate-500 self-center text-[11px]">Quick Run:</span>
          <button
            onClick={() => runTerminalCommand('go run main.go database.go')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition-colors"
          >
            go run main.go database.go
          </button>
          <button
            onClick={() => runTerminalCommand('docker compose up -d')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors"
          >
            docker compose up -d
          </button>
          <button
            onClick={() => runTerminalCommand('patronictl topology')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors"
          >
            patronictl topology
          </button>
          <button
            onClick={() => runTerminalCommand('psql -c "SELECT postgis_full_version();"')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 transition-colors"
          >
            psql postgis_version
          </button>
          <button
            onClick={() => runTerminalCommand('curl http://localhost:8080/api/v1/system/overview')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            curl :8080/overview
          </button>
          <button
            onClick={() => runTerminalCommand('clear')}
            className="px-2 py-1 rounded bg-slate-800/50 hover:bg-slate-700 text-slate-500 transition-colors"
          >
            clear
          </button>
        </div>

        {/* Input Prompt */}
        <form onSubmit={handleCommandSubmit} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2 dir-ltr">
          <span className="text-emerald-400 font-mono font-bold">$</span>
          <input
            type="text"
            value={cmdInput}
            onChange={(e) => setCmdInput(e.target.value)}
            placeholder="Type command (e.g. go run main.go database.go, help)..."
            className="flex-1 bg-transparent border-none text-white font-mono text-xs focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1 text-xs font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded transition-colors"
          >
            Run
          </button>
        </form>
      </div>

      {/* Deployment Artifacts & Configuration Previews */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ar' ? 'ملفات التكوين والنشر السيادي (Docker & Compose)' : 'Deployment Specifications & Dockerfile'}</span>
          </h3>

          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveCodeTab('compose')}
              className={`px-3 py-1 rounded transition-colors ${
                activeCodeTab === 'compose' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
              }`}
            >
              docker-compose.yml
            </button>
            <button
              onClick={() => setActiveCodeTab('dockerfile')}
              className={`px-3 py-1 rounded transition-colors ${
                activeCodeTab === 'dockerfile' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
              }`}
            >
              Dockerfile.multistage
            </button>
            <button
              onClick={() => setActiveCodeTab('go_main')}
              className={`px-3 py-1 rounded transition-colors ${
                activeCodeTab === 'go_main' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'
              }`}
            >
              main.go
            </button>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 relative">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span>
              {activeCodeTab === 'compose'
                ? 'docker-compose.yml'
                : activeCodeTab === 'dockerfile'
                ? 'Dockerfile.multistage'
                : 'cmd/server/main.go'}
            </span>
            <button
              onClick={() =>
                copyCode(
                  activeCodeTab === 'compose'
                    ? dockerComposeContent
                    : activeCodeTab === 'dockerfile'
                    ? dockerfileContent
                    : goMainSnippet,
                  activeCodeTab
                )
              }
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
            >
              {copiedKey === activeCodeTab ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedKey === activeCodeTab ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="font-mono text-xs text-slate-300 overflow-x-auto p-2 dir-ltr leading-relaxed max-h-96">
            <code>
              {activeCodeTab === 'compose'
                ? dockerComposeContent
                : activeCodeTab === 'dockerfile'
                ? dockerfileContent
                : goMainSnippet}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
