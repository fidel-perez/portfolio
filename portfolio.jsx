import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0a0e17",
  bgCard: "#111827",
  bgCardHover: "#1a2332",
  border: "#1e293b",
  borderActive: "#3b82f6",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  accent: "#3b82f6",
  accentGlow: "rgba(59,130,246,0.15)",
  green: "#10b981",
  greenGlow: "rgba(16,185,129,0.15)",
  orange: "#f59e0b",
  orangeGlow: "rgba(245,158,11,0.15)",
  purple: "#8b5cf6",
  purpleGlow: "rgba(139,92,246,0.15)",
  red: "#ef4444",
  cyan: "#06b6d4",
  cyanGlow: "rgba(6,182,212,0.15)",
};

const FONT = `'JetBrains Mono', 'Fira Code', 'SF Mono', monospace`;
const FONT_SANS = `'DM Sans', 'Segoe UI', system-ui, sans-serif`;

// ─── Animated connection line component ───
function AnimatedLine({ x1, y1, x2, y2, color = COLORS.accent, delay = 0, dashed = false }) {
  const length = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth="2" fill="none"
      strokeDasharray={dashed ? "6 4" : length}
      strokeDashoffset={dashed ? 0 : length}
      opacity={dashed ? 0.4 : 1}
      style={{
        animation: dashed ? 'none' : `drawLine 1.2s ease-out ${delay}s forwards`,
      }}
    />
  );
}

// ─── Node box for diagrams ───
function DiagramNode({ x, y, w = 140, h = 50, label, sub, color = COLORS.accent, icon, delay = 0, onClick }) {
  const glow = color === COLORS.green ? COLORS.greenGlow :
               color === COLORS.orange ? COLORS.orangeGlow :
               color === COLORS.purple ? COLORS.purpleGlow :
               color === COLORS.cyan ? COLORS.cyanGlow :
               COLORS.accentGlow;
  return (
    <g style={{ animation: `fadeInUp 0.6s ease-out ${delay}s both`, cursor: onClick ? 'pointer' : 'default' }}
       onClick={onClick}>
      <rect x={x} y={y} width={w} height={h} rx="8"
        fill={COLORS.bgCard} stroke={color} strokeWidth="1.5"
        filter={`drop-shadow(0 0 8px ${glow})`}
      />
      {icon && (
        <text x={x + 12} y={y + h/2 + 1} fontSize="14" fill={color} dominantBaseline="middle">{icon}</text>
      )}
      <text x={x + (icon ? 28 : w/2)} y={y + (sub ? h/2 - 4 : h/2 + 1)}
        fontSize="11" fontFamily={FONT} fill={COLORS.text} fontWeight="600"
        textAnchor={icon ? "start" : "middle"} dominantBaseline="middle">
        {label}
      </text>
      {sub && (
        <text x={x + (icon ? 28 : w/2)} y={y + h/2 + 12}
          fontSize="9" fontFamily={FONT} fill={COLORS.textDim}
          textAnchor={icon ? "start" : "middle"} dominantBaseline="middle">
          {sub}
        </text>
      )}
    </g>
  );
}

// ─── Home Lab Architecture Diagram ───
function HomeLabDiagram() {
  return (
    <svg viewBox="0 0 900 620" width="100%" style={{ maxWidth: 900 }}>
      <defs>
        <marker id="arrow-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.accent} />
        </marker>
        <marker id="arrow-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.green} />
        </marker>
        <marker id="arrow-orange" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.orange} />
        </marker>
      </defs>

      {/* Section labels */}
      <text x="20" y="30" fontSize="11" fill={COLORS.textDim} fontFamily={FONT} textTransform="uppercase" letterSpacing="2">Internet / External</text>
      <line x1="20" y1="40" x2="880" y2="40" stroke={COLORS.border} strokeWidth="1" strokeDasharray="4 4" />

      <text x="20" y="130" fontSize="11" fill={COLORS.textDim} fontFamily={FONT} textTransform="uppercase" letterSpacing="2">Raspberry Pi · Always-On Gateway</text>
      <rect x="15" y="140" width="870" height="180" rx="12" fill="none" stroke={COLORS.green} strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />

      <text x="20" y="360" fontSize="11" fill={COLORS.textDim} fontFamily={FONT} textTransform="uppercase" letterSpacing="2">Ubuntu Server · On-Demand (Wake-on-LAN)</text>
      <rect x="15" y="370" width="870" height="220" rx="12" fill="none" stroke={COLORS.purple} strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />

      {/* External nodes */}
      <DiagramNode x="30" y="60" w="120" h="45" label="Users" sub="Tailscale mesh" color={COLORS.cyan} icon="👤" delay={0.1} />
      <DiagramNode x="180" y="60" w="120" h="45" label="GitHub" sub="Webhooks" color={COLORS.textDim} icon="⚙" delay={0.15} />
      <DiagramNode x="370" y="60" w="130" h="45" label="Telegram" sub="Bot Gateway" color={COLORS.cyan} icon="💬" delay={0.2} />
      <DiagramNode x="540" y="60" w="130" h="45" label="FreeDNS" sub="Dynamic DNS" color={COLORS.textDim} icon="🌐" delay={0.25} />
      <DiagramNode x="710" y="60" w="140" h="45" label="Healthcheck.io" sub="Uptime Monitor" color={COLORS.green} icon="♥" delay={0.3} />

      {/* Pi nodes */}
      <DiagramNode x="30" y="160" w="130" h="50" label="Headscale" sub="VPN Control Plane" color={COLORS.green} icon="🔒" delay={0.3} />
      <DiagramNode x="190" y="160" w="130" h="50" label="Caddy" sub="Reverse Proxy + TLS" color={COLORS.green} icon="🔀" delay={0.35} />
      <DiagramNode x="350" y="160" w="140" h="50" label="Telegram Bot" sub="Commands & Alerts" color={COLORS.green} icon="🤖" delay={0.4} />
      <DiagramNode x="520" y="160" w="140" h="50" label="Webhook Listener" sub="Auto-rebuild on push" color={COLORS.green} icon="🪝" delay={0.45} />
      <DiagramNode x="690" y="160" w="160" h="50" label="Ansible Controller" sub="IaC for both nodes" color={COLORS.green} icon="📋" delay={0.5} />

      <DiagramNode x="30" y="235" w="130" h="50" label="JSON Store" sub="Git-backed data" color={COLORS.green} icon="💾" delay={0.5} />
      <DiagramNode x="190" y="235" w="130" h="50" label="ntfy" sub="Push notifications" color={COLORS.green} icon="🔔" delay={0.55} />
      <DiagramNode x="350" y="235" w="140" h="50" label="Changedetection" sub="Web monitoring" color={COLORS.green} icon="👁" delay={0.6} />
      <DiagramNode x="520" y="235" w="140" h="50" label="rclone Backups" sub="pCloud + GDrive" color={COLORS.green} icon="☁" delay={0.65} />
      <DiagramNode x="690" y="235" w="160" h="50" label="WoL Trigger" sub="UDP wake server" color={COLORS.orange} icon="⚡" delay={0.7} />

      {/* Server nodes */}
      <DiagramNode x="30" y="390" w="150" h="55" label="Hermes Agent" sub="Multi-agent · Playwright" color={COLORS.purple} icon="🧠" delay={0.6} />
      <DiagramNode x="210" y="390" w="130" h="55" label="Whisper ASR" sub="Speech-to-text" color={COLORS.purple} icon="🎙" delay={0.65} />
      <DiagramNode x="370" y="390" w="130" h="55" label="SearXNG" sub="Private search" color={COLORS.purple} icon="🔍" delay={0.7} />
      <DiagramNode x="530" y="390" w="130" h="55" label="LLM Helper" sub="Inference proxy" color={COLORS.purple} icon="✨" delay={0.75} />
      <DiagramNode x="690" y="390" w="160" h="55" label="Docker Manager" sub="Dashboard UI" color={COLORS.purple} icon="🐳" delay={0.8} />

      <DiagramNode x="30" y="470" w="150" h="55" label="Plex / Jellyfin" sub="Media streaming" color={COLORS.purple} icon="🎬" delay={0.7} />
      <DiagramNode x="210" y="470" w="130" h="55" label="*arr Stack" sub="Media automation" color={COLORS.purple} icon="📡" delay={0.75} />
      <DiagramNode x="370" y="470" w="130" h="55" label="Excalidraw" sub="Whiteboard" color={COLORS.purple} icon="✏" delay={0.8} />
      <DiagramNode x="530" y="470" w="130" h="55" label="OnlyOffice" sub="Document editor" color={COLORS.purple} icon="📄" delay={0.85} />
      <DiagramNode x="690" y="470" w="160" h="55" label="+ 15 more services" sub="FileBrowser, pyLoad..." color={COLORS.purple} icon="📦" delay={0.9} />

      {/* Flow label */}
      <DiagramNode x="30" y="555" w="850" h="40" label="All services containerized via Docker Compose · Git-versioned · Ansible-managed · Auto-backed up nightly" color={COLORS.textDim} delay={1} />

      {/* Connection lines */}
      <AnimatedLine x1="90" y1="105" x2="90" y2="160" color={COLORS.cyan} delay={0.4} />
      <AnimatedLine x1="240" y1="105" x2="585" y2="160" color={COLORS.textDim} delay={0.5} />
      <AnimatedLine x1="435" y1="105" x2="420" y2="160" color={COLORS.cyan} delay={0.5} />
      <AnimatedLine x1="830" y1="210" x2="830" y2="390" color={COLORS.orange} delay={0.8} />
    </svg>
  );
}

// ─── Professional Platform Diagram ───
function ProfessionalDiagram() {
  return (
    <svg viewBox="0 0 900 520" width="100%" style={{ maxWidth: 900 }}>
      {/* Section labels */}
      <text x="20" y="30" fontSize="11" fill={COLORS.textDim} fontFamily={FONT} textTransform="uppercase" letterSpacing="2">Data Sources · 20+ Integrations</text>
      <line x1="20" y1="40" x2="880" y2="40" stroke={COLORS.border} strokeWidth="1" strokeDasharray="4 4" />

      <text x="20" y="185" fontSize="11" fill={COLORS.textDim} fontFamily={FONT} textTransform="uppercase" letterSpacing="2">Ingestion Layer</text>
      <rect x="15" y="195" width="870" height="80" rx="12" fill="none" stroke={COLORS.orange} strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />

      <text x="20" y="315" fontSize="11" fill={COLORS.textDim} fontFamily={FONT} textTransform="uppercase" letterSpacing="2">Orchestration & Compute · AWS EKS</text>
      <rect x="15" y="325" width="560" height="80" rx="12" fill="none" stroke={COLORS.accent} strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />

      <text x="610" y="315" fontSize="11" fill={COLORS.textDim} fontFamily={FONT} textTransform="uppercase" letterSpacing="2">Warehouse & Analytics</text>
      <rect x="600" y="325" width="285" height="80" rx="12" fill="none" stroke={COLORS.cyan} strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />

      <text x="20" y="445" fontSize="11" fill={COLORS.textDim} fontFamily={FONT} textTransform="uppercase" letterSpacing="2">Infrastructure & DevOps</text>
      <rect x="15" y="455" width="870" height="55" rx="12" fill="none" stroke={COLORS.green} strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />

      {/* Sources */}
      <DiagramNode x="30" y="55" w="150" h="50" label="SaaS APIs (20+)" sub="Pendo, Salesforce..." color={COLORS.orange} icon="🔌" delay={0.1} />
      <DiagramNode x="210" y="55" w="140" h="50" label="Internal MongoDB" sub="Production replica" color={COLORS.orange} icon="🗄" delay={0.15} />
      <DiagramNode x="380" y="55" w="140" h="50" label="Government APIs" sub="Public sector data" color={COLORS.orange} icon="🏛" delay={0.2} />
      <DiagramNode x="550" y="55" w="140" h="50" label="Internal APIs" sub="Microservices" color={COLORS.orange} icon="🔗" delay={0.25} />
      <DiagramNode x="720" y="55" w="150" h="50" label="Google Sheets" sub="Business-managed" color={COLORS.orange} icon="📊" delay={0.3} />

      {/* Real-time pipeline */}
      <DiagramNode x="30" y="120" w="120" h="40" label="Cross-Acct SQS" color={COLORS.red} icon="📨" delay={0.3} />
      <DiagramNode x="175" y="120" w="100" h="40" label="Lambda" color={COLORS.red} delay={0.35} />
      <DiagramNode x="300" y="120" w="120" h="40" label="Firehose" color={COLORS.red} delay={0.4} />
      <DiagramNode x="445" y="120" w="80" h="40" label="S3" color={COLORS.red} delay={0.45} />
      <DiagramNode x="550" y="120" w="120" h="40" label="Snowpipe" color={COLORS.red} delay={0.5} />
      
      <AnimatedLine x1="150" y1="140" x2="175" y2="140" color={COLORS.red} delay={0.5} />
      <AnimatedLine x1="275" y1="140" x2="300" y2="140" color={COLORS.red} delay={0.55} />
      <AnimatedLine x1="420" y1="140" x2="445" y2="140" color={COLORS.red} delay={0.6} />
      <AnimatedLine x1="525" y1="140" x2="550" y2="140" color={COLORS.red} delay={0.65} />

      {/* Ingestion */}
      <DiagramNode x="30" y="210" w="160" h="50" label="DLT" sub="Primary ELT framework" color={COLORS.orange} icon="⬇" delay={0.4} />
      <DiagramNode x="220" y="210" w="160" h="50" label="Singer (Legacy)" sub="Migrating away" color={COLORS.textDim} icon="🔄" delay={0.45} />
      <DiagramNode x="420" y="210" w="170" h="50" label="Self-hosted Airbyte" sub="Helm on EKS" color={COLORS.orange} icon="🔀" delay={0.5} />
      <DiagramNode x="630" y="210" w="230" h="50" label="Custom SQS Pipeline" sub="Real-time ingestion (designed 2+ yrs ago)" color={COLORS.orange} icon="⚡" delay={0.55} />

      {/* Orchestration */}
      <DiagramNode x="30" y="340" w="170" h="50" label="Apache Airflow" sub="Central orchestrator" color={COLORS.accent} icon="🎯" delay={0.5} />
      <DiagramNode x="230" y="340" w="170" h="50" label="K8s Pod Operator" sub="Isolated containers" color={COLORS.accent} icon="🐳" delay={0.55} />
      <DiagramNode x="430" y="340" w="130" h="50" label="Karpenter" sub="Auto-scaling" color={COLORS.accent} icon="📐" delay={0.6} />

      {/* Warehouse */}
      <DiagramNode x="615" y="340" w="130" h="50" label="Snowflake" sub="RBAC + cost mgmt" color={COLORS.cyan} icon="❄" delay={0.6} />
      <DiagramNode x="760" y="340" w="110" h="50" label="dbt" sub="Transforms" color={COLORS.cyan} icon="🔧" delay={0.65} />

      {/* Infra */}
      <DiagramNode x="30" y="462" w="130" h="38" label="Terraform" sub="IaC" color={COLORS.green} icon="🏗" delay={0.7} />
      <DiagramNode x="180" y="462" w="110" h="38" label="ArgoCD" sub="GitOps" color={COLORS.green} icon="🔄" delay={0.75} />
      <DiagramNode x="310" y="462" w="120" h="38" label="Helm Charts" sub="K8s packages" color={COLORS.green} icon="📦" delay={0.8} />
      <DiagramNode x="450" y="462" w="110" h="38" label="GitHub" sub="CI/CD" color={COLORS.green} icon="🐙" delay={0.85} />
      <DiagramNode x="580" y="462" w="130" h="38" label="CodeRabbit" sub="AI code review" color={COLORS.green} icon="🤖" delay={0.9} />
      <DiagramNode x="730" y="462" w="140" h="38" label="Datadog + Slack" sub="Observability" color={COLORS.green} icon="📈" delay={0.95} />

      {/* Flow arrows */}
      <AnimatedLine x1="105" y1="105" x2="105" y2="210" color={COLORS.orange} delay={0.5} />
      <AnimatedLine x1="300" y1="260" x2="115" y2="340" color={COLORS.accent} delay={0.7} />
      <AnimatedLine x1="560" y1="365" x2="615" y2="365" color={COLORS.cyan} delay={0.8} />
    </svg>
  );
}

// ─── Zooplus Diagram ───
function ZooplusDiagram() {
  return (
    <svg viewBox="0 0 900 280" width="100%" style={{ maxWidth: 900 }}>
      <text x="20" y="25" fontSize="11" fill={COLORS.textDim} fontFamily={FONT} textTransform="uppercase" letterSpacing="2">Before: Legacy Bottleneck</text>
      <rect x="15" y="35" width="420" height="80" rx="12" fill="none" stroke={COLORS.red} strokeWidth="1" strokeDasharray="6 4" opacity="0.4" />
      <DiagramNode x="30" y="48" w="180" h="50" label="Oracle DB (20yr old)" sub="Single source of truth" color={COLORS.red} icon="🗄" delay={0.1} />
      <DiagramNode x="240" y="48" w="180" h="50" label="Analytics Queries" sub="⚠ Killed prod pages" color={COLORS.red} icon="💀" delay={0.2} />
      <AnimatedLine x1="210" y1="73" x2="240" y2="73" color={COLORS.red} delay={0.3} />

      <text x="470" y="25" fontSize="11" fill={COLORS.textDim} fontFamily={FONT} textTransform="uppercase" letterSpacing="2">After: Decoupled Platform (Built from scratch)</text>
      <rect x="460" y="35" width="425" height="230" rx="12" fill="none" stroke={COLORS.green} strokeWidth="1" strokeDasharray="6 4" opacity="0.3" />
      <DiagramNode x="475" y="48" w="140" h="45" label="Oracle (Prod)" sub="Untouched ✓" color={COLORS.green} icon="🗄" delay={0.3} />
      <DiagramNode x="650" y="48" w="140" h="45" label="Python Pipelines" sub="Data mirroring" color={COLORS.accent} icon="🐍" delay={0.4} />
      <DiagramNode x="475" y="115" w="140" h="45" label="AWS Data Lake" sub="S3 + compute" color={COLORS.accent} icon="☁" delay={0.5} />
      <DiagramNode x="650" y="115" w="140" h="45" label="Docker + K8s" sub="FluxCD GitOps" color={COLORS.accent} icon="🐳" delay={0.55} />
      <DiagramNode x="475" y="185" w="140" h="45" label="Vue.js Dashboards" sub="Internal tooling" color={COLORS.purple} icon="📊" delay={0.6} />
      <DiagramNode x="650" y="185" w="140" h="45" label="Self-Service" sub="Company-wide analytics" color={COLORS.green} icon="✅" delay={0.65} />

      <AnimatedLine x1="615" y1="70" x2="650" y2="70" color={COLORS.accent} delay={0.5} />
      <AnimatedLine x1="545" y1="93" x2="545" y2="115" color={COLORS.accent} delay={0.55} />
      <AnimatedLine x1="720" y1="93" x2="720" y2="115" color={COLORS.accent} delay={0.6} />
      <AnimatedLine x1="545" y1="160" x2="545" y2="185" color={COLORS.purple} delay={0.7} />

      {/* Impact box */}
      <rect x="30" y="150" width="400" height="100" rx="10" fill={COLORS.bgCard} stroke={COLORS.green} strokeWidth="1.5" opacity="0.9" />
      <text x="50" y="178" fontSize="12" fill={COLORS.green} fontFamily={FONT} fontWeight="700">IMPACT</text>
      <text x="50" y="200" fontSize="11" fill={COLORS.textMuted} fontFamily={FONT_SANS}>• Zero prod degradation from analytics</text>
      <text x="50" y="218" fontSize="11" fill={COLORS.textMuted} fontFamily={FONT_SANS}>• Fraction of Oracle licensing cost</text>
      <text x="50" y="236" fontSize="11" fill={COLORS.textMuted} fontFamily={FONT_SANS}>• Company-wide self-service analytics</text>
    </svg>
  );
}

// ─── Parallels Table ───
function ParallelsSection() {
  const rows = [
    { behavior: "IaC Everything", prof: "Terraform + Helm", home: "Ansible + Jinja2", icon: "🏗" },
    { behavior: "GitOps Auto-Deploy", prof: "ArgoCD + GitHub CI", home: "Webhook + auto-rebuild", icon: "🔄" },
    { behavior: "Containerized Workloads", prof: "K8s Pod Operator on EKS", home: "Docker Compose on Pi", icon: "🐳" },
    { behavior: "Reverse Proxy", prof: "EKS Ingress / Karpenter", home: "Caddy + lazy wake", icon: "🔀" },
    { behavior: "Secrets Management", prof: "AWS Secrets Manager", home: "Ansible vault + env", icon: "🔒" },
    { behavior: "Auto Backups", prof: "S3 lifecycle policies", home: "rclone nightly to cloud", icon: "💾" },
    { behavior: "Monitoring", prof: "Datadog + Slack alerts", home: "Healthcheck.io + ntfy", icon: "📈" },
    { behavior: "Multi-Source Ingestion", prof: "DLT / Airbyte / SQS", home: "Hermes agent scrapers", icon: "⬇" },
    { behavior: "Enabling Non-Tech Users", prof: "Streamlit + dbt", home: "Telegram bot for family", icon: "👥" },
    { behavior: "AI-First Engineering", prof: "CodeRabbit + Claude/GPT", home: "Hermes multi-agent", icon: "🤖" },
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px',
        fontFamily: FONT, fontSize: 13,
      }}>
        <thead>
          <tr style={{ textTransform: 'uppercase', fontSize: 10, letterSpacing: 2, color: COLORS.textDim }}>
            <th style={{ textAlign: 'left', padding: '8px 16px', width: '28%' }}>Pattern</th>
            <th style={{ textAlign: 'left', padding: '8px 16px', width: '36%' }}>
              <span style={{ color: COLORS.accent }}>● </span>Professional
            </th>
            <th style={{ textAlign: 'left', padding: '8px 16px', width: '36%' }}>
              <span style={{ color: COLORS.green }}>● </span>Home Lab
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{
              background: i % 2 === 0 ? COLORS.bgCard : 'transparent',
              borderRadius: 8,
              animation: `fadeInUp 0.4s ease-out ${0.3 + i * 0.05}s both`,
            }}>
              <td style={{ padding: '10px 16px', color: COLORS.text, fontWeight: 600, borderRadius: '8px 0 0 8px' }}>
                {r.icon} {r.behavior}
              </td>
              <td style={{ padding: '10px 16px', color: COLORS.textMuted }}>{r.prof}</td>
              <td style={{ padding: '10px 16px', color: COLORS.textMuted, borderRadius: '0 8px 8px 0' }}>{r.home}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── AI Strategy Section ───
function AIStrategySection() {
  const [expanded, setExpanded] = useState(null);

  const tableRows = [
    {
      topic: 'AI adoption',
      icon: '🔧',
      assisted: 'Tools handed to engineers, same processes',
      native: 'Workflows redesigned around AI capabilities',
    },
    {
      topic: 'Code authorship',
      icon: '💻',
      assisted: 'Engineers prompt AI, submit PRs, wait in queue',
      native: 'AI writes, tests, iterates — humans set criteria and supervise',
    },
    {
      topic: 'Stakeholder → code',
      icon: '🔗',
      assisted: 'Request → PM → ticket → dev → QA → deploy',
      native: 'Request → one technical human with judgment → deployed artifact',
    },
    {
      topic: 'Business context',
      icon: '🧠',
      assisted: 'Trapped in wikis, heads, and tribal knowledge',
      native: 'Structured, versioned, machine-readable — callable by agents via MCP',
    },
    {
      topic: 'Evaluation',
      icon: '✅',
      assisted: 'Humans squinting at PRs',
      native: 'Automated pipelines testing AI output against business criteria',
    },
    {
      topic: 'Team structure',
      icon: '👥',
      assisted: 'Same departments, same handoffs, AI sprinkled in',
      native: 'Flat, fast teams — criteria holders who ship directly',
    },
    {
      topic: 'Model dependency',
      icon: '🔄',
      assisted: 'Workflows tied to one model or provider',
      native: 'Model-agnostic orchestration — swap Claude for Gemini without breaking anything',
    },
    {
      topic: 'What breaks next',
      icon: '⚠',
      assisted: 'Nothing yet — but speed gains evaporate into process',
      native: 'Ready to absorb agents, multi-modal input, autonomous coordination',
    },
  ];

  const phases = [
    {
      id: 'assisted',
      label: 'AI-Assisted',
      subtitle: 'Where most companies are',
      color: COLORS.orange,
      glow: COLORS.orangeGlow,
      points: [
        'AI tools in engineers\' hands. Same team structure. Same review chains. Same sprint cadence.',
        'The work gets done faster — then waits. PMs still translate for developers. QA still reviews what AI already tested.',
        'Documentation is written for human onboarding instead of structured for agent consumption.',
        'The productivity gain evaporates into process bottleneck.',
      ],
      questions: [
        'What does your company offer that GPT won\'t do autonomously in 18 months?',
        'How many humans does a stakeholder request pass through before it becomes running code? Could that number be one?',
        'What percentage of your engineering output is already AI-generated? If you don\'t know — that\'s the answer.',
      ],
    },
    {
      id: 'native',
      label: 'AI-Native',
      subtitle: 'Where forward companies are moving',
      color: COLORS.green,
      glow: COLORS.greenGlow,
      points: [
        'Context as infrastructure. Your competitive edge isn\'t code — models write code. Your edge is business context that models can\'t access without you.',
        'MCP server layers exposing your proprietary domain knowledge as tool-callable endpoints. When a model can query your business rules in real time — that\'s a moat.',
        'Evaluation frameworks that test AI outputs against business criteria before production, not after.',
        'Model-agnostic orchestration. Your workflows can\'t break when you swap providers next quarter.',
        'Stakeholder-to-deployment interfaces. One request becomes a deployed artifact with one technical human in the loop.',
        'Cost-aware compute routing. Knowing when a task needs a $0.002 call, a $0.06 call, or a human.',
      ],
      questions: [],
    },
  ];

  return (
    <div>
      {/* Hook */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.accentGlow}, ${COLORS.purpleGlow})`,
        border: `1px solid ${COLORS.accent}44`,
        borderRadius: 12,
        padding: '24px 28px',
        marginBottom: 32,
        animation: 'fadeInUp 0.5s ease-out 0.1s both',
      }}>
        <p style={{
          fontSize: 18, fontWeight: 600, fontFamily: FONT_SANS, color: COLORS.text,
          margin: '0 0 12px 0', lineHeight: 1.5,
        }}>
          If your best engineer automated 80% of their workflow tomorrow, would your organization capture that speed?
        </p>
        <p style={{
          fontSize: 14, color: COLORS.textMuted, margin: 0, lineHeight: 1.7, fontFamily: FONT_SANS,
        }}>
          Or would the work sit in review queues, approval chains, and sprint ceremonies designed around the assumption that building takes weeks?
        </p>
      </div>

      {/* Comparison table */}
      <div style={{ marginBottom: 8, animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
        <p style={{
          fontSize: 11, fontFamily: FONT, color: COLORS.textDim, textTransform: 'uppercase',
          letterSpacing: 3, margin: '0 0 16px 0',
        }}>At a glance</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px',
            fontFamily: FONT_SANS, fontSize: 13,
          }}>
            <thead>
              <tr style={{ fontSize: 11, letterSpacing: 1 }}>
                <th style={{ textAlign: 'left', padding: '8px 16px', width: '22%', color: COLORS.textDim, fontFamily: FONT, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 400 }}>
                  Area
                </th>
                <th style={{ textAlign: 'left', padding: '8px 16px', width: '39%' }}>
                  <span style={{ color: COLORS.orange }}>● </span>
                  <span style={{ color: COLORS.orange, fontWeight: 700, fontSize: 13 }}>AI-Assisted</span>
                  <span style={{ color: COLORS.textDim, fontWeight: 400, fontSize: 11, marginLeft: 8 }}>most companies today</span>
                </th>
                <th style={{ textAlign: 'left', padding: '8px 16px', width: '39%' }}>
                  <span style={{ color: COLORS.green }}>● </span>
                  <span style={{ color: COLORS.green, fontWeight: 700, fontSize: 13 }}>AI-Native</span>
                  <span style={{ color: COLORS.textDim, fontWeight: 400, fontSize: 11, marginLeft: 8 }}>where leaders are moving</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r, i) => (
                <tr key={i} style={{
                  background: i % 2 === 0 ? COLORS.bgCard : 'transparent',
                  animation: `fadeInUp 0.4s ease-out ${0.25 + i * 0.05}s both`,
                }}>
                  <td style={{
                    padding: '10px 16px', fontWeight: 600, color: COLORS.text,
                    fontFamily: FONT, fontSize: 12, borderRadius: '8px 0 0 8px',
                    whiteSpace: 'nowrap',
                  }}>
                    {r.icon} {r.topic}
                  </td>
                  <td style={{ padding: '10px 16px', color: COLORS.textMuted, lineHeight: 1.5 }}>
                    {r.assisted}
                  </td>
                  <td style={{
                    padding: '10px 16px', color: COLORS.text, lineHeight: 1.5,
                    borderRadius: '0 8px 8px 0',
                  }}>
                    {r.native}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{
          fontSize: 13, color: COLORS.textMuted, fontFamily: FONT_SANS, fontStyle: 'italic',
          textAlign: 'center', margin: '16px 0 32px 0',
        }}>
          Most companies are in the first column. The window to move to the second is closing.
        </p>
      </div>

      {/* Phase detail cards */}
      <div style={{ marginBottom: 8, animation: 'fadeInUp 0.5s ease-out 0.3s both' }}>
        <p style={{
          fontSize: 11, fontFamily: FONT, color: COLORS.textDim, textTransform: 'uppercase',
          letterSpacing: 3, margin: '0 0 16px 0',
        }}>What each phase actually looks like</p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {phases.map((phase, pi) => (
            <div key={phase.id} style={{
              flex: '1 1 340px',
              background: COLORS.bgCard,
              border: `1px solid ${phase.color}44`,
              borderRadius: 12,
              overflow: 'hidden',
              animation: `fadeInUp 0.5s ease-out ${0.35 + pi * 0.1}s both`,
            }}>
              {/* Card header */}
              <div
                onClick={() => setExpanded(expanded === phase.id ? null : phase.id)}
                style={{
                  padding: '16px 20px',
                  background: `linear-gradient(135deg, ${phase.glow}, transparent)`,
                  borderBottom: expanded === phase.id ? `1px solid ${phase.color}33` : 'none',
                  cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
              >
                <div>
                  <div style={{
                    fontSize: 16, fontWeight: 700, color: phase.color,
                    fontFamily: FONT_SANS, marginBottom: 2,
                  }}>
                    {phase.label}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: FONT_SANS }}>
                    {phase.subtitle}
                  </div>
                </div>
                <span style={{
                  color: phase.color, fontSize: 18, lineHeight: 1,
                  transform: expanded === phase.id ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}>▾</span>
              </div>

              {/* Card body — always shown */}
              <div style={{ padding: '16px 20px' }}>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {phase.points.map((pt, j) => (
                    <li key={j} style={{
                      fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6,
                      fontFamily: FONT_SANS, marginBottom: 10,
                      paddingLeft: 16, position: 'relative',
                    }}>
                      <span style={{
                        position: 'absolute', left: 0, top: 6,
                        width: 5, height: 5, borderRadius: '50%',
                        background: phase.color, display: 'block',
                      }} />
                      {pt}
                    </li>
                  ))}
                </ul>

                {expanded === phase.id && phase.questions.length > 0 && (
                  <div style={{
                    marginTop: 12, padding: '12px 16px',
                    background: `${phase.glow}`,
                    border: `1px solid ${phase.color}33`,
                    borderRadius: 8,
                  }}>
                    <p style={{
                      fontSize: 11, fontFamily: FONT, color: phase.color,
                      textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 10px 0',
                    }}>Ask yourself</p>
                    {phase.questions.map((q, j) => (
                      <p key={j} style={{
                        fontSize: 13, color: COLORS.text, fontFamily: FONT_SANS,
                        lineHeight: 1.6, margin: j < phase.questions.length - 1 ? '0 0 8px 0' : 0,
                      }}>
                        — {q}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What I bring */}
      <div style={{
        marginTop: 32,
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.accent}44`,
        borderRadius: 12,
        padding: '24px 28px',
        animation: 'fadeInUp 0.5s ease-out 0.5s both',
      }}>
        <p style={{
          fontSize: 11, fontFamily: FONT, color: COLORS.accent,
          textTransform: 'uppercase', letterSpacing: 3, margin: '0 0 12px 0',
        }}>What I bring</p>
        <p style={{
          fontSize: 14, fontFamily: FONT_SANS, color: COLORS.text,
          lineHeight: 1.7, margin: '0 0 12px 0', fontWeight: 600,
        }}>
          I don't build what you need today. I build what you'll wish you'd started six months ago.
        </p>
        <p style={{
          fontSize: 13, fontFamily: FONT_SANS, color: COLORS.textMuted,
          lineHeight: 1.7, margin: '0 0 12px 0',
        }}>
          11+ years of data engineering. Civil Engineering degree from one of Spain's hardest technical programs. Self-taught into a professional software career. I've built production platforms from scratch, stabilized failing infrastructure with 2-person teams, and run 30+ containerized services from my home lab with the same engineering discipline I apply at work.
        </p>
        <p style={{
          fontSize: 13, fontFamily: FONT_SANS, color: COLORS.textMuted,
          lineHeight: 1.7, margin: 0,
        }}>
          The differentiator: I've been working AI-first for over a year — not as an experiment, as my daily operating model. I generate architectural options with AI, evaluate tradeoffs, catch failures early, and ship. I've built multi-user AI agent systems, automated my entire development workflow, and learned firsthand what the infrastructure needs to look like.
        </p>
      </div>

      {/* CTA */}
      <div style={{
        marginTop: 28, textAlign: 'center',
        animation: 'fadeInUp 0.5s ease-out 0.6s both',
      }}>
        <p style={{
          fontSize: 14, fontFamily: FONT_SANS, color: COLORS.textMuted,
          margin: '0 0 6px 0',
        }}>
          <em>"We're already doing this"</em> — great, let's get into specifics.
        </p>
        <p style={{
          fontSize: 14, fontFamily: FONT_SANS, color: COLORS.textMuted,
          margin: '0 0 20px 0',
        }}>
          <em>"This sounds extreme"</em> — we should talk sooner.
        </p>
        <a
          href="https://www.linkedin.com/in/YOUR_HANDLE"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '14px 36px',
            background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
            color: '#fff',
            borderRadius: 8,
            fontFamily: FONT_SANS,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: 'none',
            boxShadow: `0 4px 24px ${COLORS.accentGlow}`,
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Let's talk →
        </a>
      </div>
    </div>
  );
}

// ─── Main App ───
export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('homelab');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(16px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes drawLine {
        to { stroke-dashoffset: 0; }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      * { box-sizing: border-box; }
      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
      ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const sections = [
    { id: 'homelab', label: 'Home Lab', icon: '🏠' },
    { id: 'professional', label: 'Data Platform', icon: '☁' },
    { id: 'zooplus', label: 'Greenfield Build', icon: '🚀' },
    { id: 'parallels', label: 'Engineering DNA', icon: '🧬' },
    { id: 'ai-strategy', label: 'AI Strategy', icon: '⚡' },
  ];

  const tabStyle = (id) => ({
    padding: '10px 20px',
    background: activeSection === id ? COLORS.accentGlow : 'transparent',
    border: `1px solid ${activeSection === id ? COLORS.accent : COLORS.border}`,
    borderRadius: 8,
    color: activeSection === id ? COLORS.accent : COLORS.textMuted,
    cursor: 'pointer',
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: activeSection === id ? 700 : 400,
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: FONT_SANS,
      padding: '0 0 60px 0',
    }}>
      {/* Grid background */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `
          linear-gradient(${COLORS.border}22 1px, transparent 1px),
          linear-gradient(90deg, ${COLORS.border}22 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <header style={{
          paddingTop: 60, paddingBottom: 40,
          animation: 'fadeInUp 0.8s ease-out',
        }}>
          <div style={{
            fontSize: 11, fontFamily: FONT, color: COLORS.accent,
            textTransform: 'uppercase', letterSpacing: 4, marginBottom: 12,
          }}>
            Technical Architecture Portfolio
          </div>
          <h1 style={{
            fontSize: 42, fontWeight: 700, fontFamily: FONT_SANS,
            margin: '0 0 8px 0',
            background: `linear-gradient(135deg, ${COLORS.text} 0%, ${COLORS.accent} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Fidel Perez Rubio
          </h1>
          <p style={{
            fontSize: 16, color: COLORS.textMuted, margin: '0 0 8px 0',
            fontFamily: FONT_SANS, fontWeight: 500,
          }}>
            Senior Data Engineer · AI-First Engineering
          </p>
          <p style={{
            fontSize: 13, color: COLORS.textDim, margin: 0,
            fontFamily: FONT, lineHeight: 1.7, maxWidth: 700,
          }}>
            Same principles at every scale — infrastructure as code, containerize everything,
            automate away toil, monitor proactively, and design for reliability so a small team
            can manage a large surface area.
          </p>

          {/* Stats bar */}
          <div style={{
            display: 'flex', gap: 32, marginTop: 28, flexWrap: 'wrap',
          }}>
            {[
              { n: '11+', label: 'Years Engineering' },
              { n: '30+', label: 'Services (Home Lab)' },
              { n: '20+', label: 'Data Sources (Prof)' },
              { n: '2', label: 'Nodes, Zero Touch' },
            ].map((s, i) => (
              <div key={i} style={{ animation: `fadeInUp 0.5s ease-out ${0.3 + i*0.1}s both` }}>
                <div style={{ fontSize: 28, fontWeight: 700, fontFamily: FONT, color: COLORS.accent }}>{s.n}</div>
                <div style={{ fontSize: 11, color: COLORS.textDim, fontFamily: FONT, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </header>

        {/* Nav tabs */}
        <nav style={{
          display: 'flex', gap: 10, marginBottom: 32,
          overflowX: 'auto', paddingBottom: 4,
        }}>
          {sections.map(s => (
            <button key={s.id} style={tabStyle(s.id)} onClick={() => setActiveSection(s.id)}>
              {s.icon} {s.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div style={{
          background: `${COLORS.bgCard}cc`,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 16,
          padding: 32,
          backdropFilter: 'blur(8px)',
          animation: 'fadeInUp 0.5s ease-out',
        }}
          key={activeSection} // force re-render for animations
        >
          {activeSection === 'homelab' && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px 0', fontFamily: FONT_SANS }}>
                  🏠 Home Lab Infrastructure
                </h2>
                <p style={{ color: COLORS.textMuted, fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                  Two-node setup (Raspberry Pi + Ubuntu server) running 30+ containerized services.
                  Self-healing, zero-touch operation with automatic DNS, backups, rebuilds, and wake-on-demand.
                </p>
                <div style={{
                  display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap',
                }}>
                  {['Docker', 'Ansible', 'Caddy', 'Headscale', 'Playwright', 'Python', 'MiniMax'].map(t => (
                    <span key={t} style={{
                      padding: '4px 12px', background: COLORS.greenGlow, border: `1px solid ${COLORS.green}44`,
                      borderRadius: 20, fontSize: 11, fontFamily: FONT, color: COLORS.green,
                    }}>{t}</span>
                  ))}
                </div>
              </div>
              <HomeLabDiagram />
            </>
          )}

          {activeSection === 'professional' && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px 0', fontFamily: FONT_SANS }}>
                  ☁ Production Data Platform
                </h2>
                <p style={{ color: COLORS.textMuted, fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                  De facto tech lead of a 2-3 person team. Full ownership of infrastructure, ingestion, orchestration,
                  and warehouse. Transformed a platform with daily failures to near-zero incidents.
                </p>
                <p style={{ color: COLORS.textDim, fontSize: 12, fontFamily: FONT, margin: '8px 0 0 0', fontStyle: 'italic' }}>
                  Company details anonymized — architecture patterns and technology choices are my own.
                </p>
                <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                  {['Airflow', 'Snowflake', 'Terraform', 'EKS', 'DLT', 'Airbyte', 'ArgoCD', 'dbt'].map(t => (
                    <span key={t} style={{
                      padding: '4px 12px', background: COLORS.accentGlow, border: `1px solid ${COLORS.accent}44`,
                      borderRadius: 20, fontSize: 11, fontFamily: FONT, color: COLORS.accent,
                    }}>{t}</span>
                  ))}
                </div>
              </div>
              <ProfessionalDiagram />
            </>
          )}

          {activeSection === 'zooplus' && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px 0', fontFamily: FONT_SANS }}>
                  🚀 Greenfield Data Platform — European E-commerce Retailer
                </h2>
                <p style={{ color: COLORS.textMuted, fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                  Designed and built the company-wide big data infrastructure from scratch. Decoupled analytics
                  from a 20-year-old production Oracle database, eliminating availability risk and slashing costs.
                </p>
                <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
                  {['Python', 'AWS', 'Docker', 'Kubernetes', 'FluxCD', 'Argo', 'Vue.js'].map(t => (
                    <span key={t} style={{
                      padding: '4px 12px', background: COLORS.purpleGlow, border: `1px solid ${COLORS.purple}44`,
                      borderRadius: 20, fontSize: 11, fontFamily: FONT, color: COLORS.purple,
                    }}>{t}</span>
                  ))}
                </div>
              </div>
              <ZooplusDiagram />
            </>
          )}

          {activeSection === 'parallels' && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px 0', fontFamily: FONT_SANS }}>
                  🧬 Engineering DNA — Same Instincts at Every Scale
                </h2>
                <p style={{ color: COLORS.textMuted, fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                  Whether it's a production data platform on AWS or a Raspberry Pi at home,
                  the same principles apply. This table maps the consistent engineering behaviors
                  across professional and personal infrastructure.
                </p>
              </div>
              <ParallelsSection />
            </>
          )}

          {activeSection === 'ai-strategy' && (
            <>
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 8px 0', fontFamily: FONT_SANS }}>
                  ⚡ AI Strategy — The Transition Most Companies Are Missing
                </h2>
                <p style={{ color: COLORS.textMuted, fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                  The tools exist. The question is whether your operating model can capture the value.
                </p>
              </div>
              <AIStrategySection />
            </>
          )}
        </div>

        {/* Footer */}
        <footer style={{
          marginTop: 40, paddingTop: 20, borderTop: `1px solid ${COLORS.border}`,
          textAlign: 'center', color: COLORS.textDim, fontSize: 12, fontFamily: FONT,
        }}>
          Built with the same AI-first approach this portfolio demonstrates · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
}
