import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

// ─── Types ────────────────────────────────────────────────────────────────────
type StatusKey = "OPERATIONAL" | "DEGRADED" | "OUTAGE" | "MAINTENANCE";
type Pattern    = "bullish" | "rising" | "bearish" | "flat";
type Range      = "24h" | "7d" | "30d";

// ─── Constants ────────────────────────────────────────────────────────────────
const NOW = new Date("2026-03-14T12:00:00");
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function pad(n: number) { return String(n).padStart(2, "0"); }
function fmtDate(d: Date) { return `${d.getDate()} ${MONTHS[d.getMonth()]}`; }
function fmtTime(d: Date) { return `${pad(d.getHours())}:${pad(d.getMinutes())}`; }

const STATUS_DEFS: Record<StatusKey, {
  color: string; pillBg: string; pillBorder: string; pillText: string;
  dot: string; text: string; label: string;
}> = {
  OPERATIONAL: { color:"#4ade80", pillBg:"rgba(74,222,128,0.12)",  pillBorder:"rgba(74,222,128,0.3)",  pillText:"#4ade80",  dot:"bg-green-400",  text:"text-green-400",  label:"OPERATIONAL" },
  DEGRADED:    { color:"#facc15", pillBg:"rgba(250,204,21,0.12)",   pillBorder:"rgba(250,204,21,0.3)",   pillText:"#facc15",  dot:"bg-yellow-400", text:"text-yellow-400", label:"DEGRADED"    },
  OUTAGE:      { color:"#f87171", pillBg:"rgba(248,113,113,0.12)",  pillBorder:"rgba(248,113,113,0.3)",  pillText:"#f87171",  dot:"bg-red-400",    text:"text-red-400",    label:"OUTAGE"      },
  MAINTENANCE: { color:"#60a5fa", pillBg:"rgba(96,165,250,0.12)",   pillBorder:"rgba(96,165,250,0.3)",   pillText:"#60a5fa",  dot:"bg-blue-400",   text:"text-blue-400",   label:"MAINTENANCE" },
};

const rangeConfigs: Record<Range, { count: number; step: number; fmtAxis: (d: Date) => string; fmtTip: (d: Date) => string }> = {
  "24h": { count:48, step:30*60*1000,       fmtAxis:d=>fmtTime(d),  fmtTip:d=>`${fmtDate(d)} ${fmtTime(d)} UTC` },
  "7d":  { count:56, step:3*60*60*1000,     fmtAxis:d=>fmtDate(d),  fmtTip:d=>`${fmtDate(d)} ${fmtTime(d)} UTC` },
  "30d": { count:60, step:12*60*60*1000,    fmtAxis:d=>fmtDate(d),  fmtTip:d=>`${fmtDate(d)} 2026`              },
};

// ─── Services data ────────────────────────────────────────────────────────────
const services: {
  name: string; uptime: string; speed: number; reconnect: number;
  pattern: Pattern; statuses: StatusKey[];
}[] = [
  { name:"API Gateway",         uptime:"99.98%", speed:38,  reconnect:20, pattern:"bullish", statuses:["OPERATIONAL","DEGRADED","OPERATIONAL"]              },
  { name:"QWS-ULTRA-V4",        uptime:"99.97%", speed:42,  reconnect:25, pattern:"rising",  statuses:["OPERATIONAL","OPERATIONAL","OPERATIONAL"]            },
  { name:"QWS-VISION-3",        uptime:"99.95%", speed:55,  reconnect:22, pattern:"bullish", statuses:["OPERATIONAL","OPERATIONAL","DEGRADED","OPERATIONAL"]  },
  { name:"QWS-CODE-X",          uptime:"99.99%", speed:29,  reconnect:30, pattern:"rising",  statuses:["OPERATIONAL"]                                        },
  { name:"QWS-AUDIO-2",         uptime:"98.42%", speed:310, reconnect:12, pattern:"bearish", statuses:["DEGRADED","OUTAGE","DEGRADED","OPERATIONAL"]          },
  { name:"QWS-AGENT-1",         uptime:"99.89%", speed:68,  reconnect:18, pattern:"rising",  statuses:["OPERATIONAL","OPERATIONAL"]                          },
  { name:"Fine-Tuning Service", uptime:"99.91%", speed:72,  reconnect:20, pattern:"bullish", statuses:["OPERATIONAL"]                                        },
  { name:"Dashboard & Console", uptime:"99.96%", speed:32,  reconnect:15, pattern:"rising",  statuses:["OPERATIONAL","OPERATIONAL"]                          },
  { name:"Webhooks",            uptime:"99.93%", speed:44,  reconnect:20, pattern:"bullish", statuses:["OPERATIONAL"]                                        },
  { name:"EU-West Region",      uptime:"99.97%", speed:39,  reconnect:22, pattern:"rising",  statuses:["OPERATIONAL"]                                        },
  { name:"AP-Southeast Region", uptime:"99.88%", speed:61,  reconnect:18, pattern:"bullish", statuses:["OPERATIONAL","DEGRADED","OPERATIONAL"]               },
  { name:"SA-East Region",      uptime:"—",      speed:0,   reconnect:25, pattern:"flat",    statuses:["MAINTENANCE","OPERATIONAL"]                          },
];

const incidents = [
  { date:"MAR 8, 2026",  title:"QWS-AUDIO-2 Elevated Latency",        status:"ONGOING",   detail:"Investigating intermittent latency spikes on long-form audio synthesis requests exceeding 60 seconds. All other audio endpoints are unaffected." },
  { date:"MAR 1, 2026",  title:"SA-East Region Maintenance Window",    status:"SCHEDULED", detail:"Planned hardware upgrade to SA-East GPU cluster on Mar 15, 02:00–06:00 UTC. Requests will be automatically routed to US-East fallback." },
  { date:"FEB 22, 2026", title:"API Gateway 503 Errors — RESOLVED",   status:"RESOLVED",  detail:"A configuration change caused 503 errors for 4% of API requests over 11 minutes. The issue was rolled back at 14:23 UTC. All services restored." },
];

const incidentStyle: Record<string, string> = {
  ONGOING:   "text-yellow-400 border-yellow-400/30",
  SCHEDULED: "text-blue-400 border-blue-400/30",
  RESOLVED:  "text-muted-foreground border-border",
};

// ─── Chart helpers ────────────────────────────────────────────────────────────
function genPath(pattern: Pattern, count: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const noise = (Math.random() - 0.5) * 0.08;
    let y = 0.5;
    if (pattern === "bullish") y = 0.5 + 0.2 * Math.cos(t * Math.PI * 2) + noise;
    else if (pattern === "bearish") y = 0.5 - 0.2 * Math.cos(t * Math.PI * 2) + noise;
    else if (pattern === "rising")  y = 0.75 - t * 0.5 + Math.sin(t * Math.PI * 4) * 0.06 + noise;
    else y = 0.5 + Math.sin(t * Math.PI * 3) * 0.04 + noise * 0.4;
    return Math.max(0.08, Math.min(0.92, y));
  });
}

function drawCanvas(canvas: HTMLCanvasElement, pts: number[], color: string) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * dpr;
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  const pL = 2, pR = 2, pT = 8, pB = 4;
  const cw = W - pL - pR, ch = H - pT - pB;
  const n = pts.length;

  // Fill
  ctx.beginPath();
  ctx.moveTo(pL, pT + pts[0] * ch);
  for (let i = 1; i < n; i++) {
    const x0 = pL + ((i-1)/(n-1)) * cw, y0 = pT + pts[i-1] * ch;
    const x1 = pL + (i/(n-1)) * cw,     y1 = pT + pts[i]   * ch;
    ctx.bezierCurveTo((x0+x1)/2, y0, (x0+x1)/2, y1, x1, y1);
  }
  ctx.lineTo(pL + cw, pT + ch);
  ctx.lineTo(pL, pT + ch);
  ctx.closePath();
  ctx.fillStyle = color + "18";
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(pL, pT + pts[0] * ch);
  for (let i = 1; i < n; i++) {
    const x0 = pL + ((i-1)/(n-1)) * cw, y0 = pT + pts[i-1] * ch;
    const x1 = pL + (i/(n-1)) * cw,     y1 = pT + pts[i]   * ch;
    ctx.bezierCurveTo((x0+x1)/2, y0, (x0+x1)/2, y1, x1, y1);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.lineJoin = "round";
  ctx.lineCap  = "round";
  ctx.stroke();

  // Trend arrow
  const lx = pL + cw, ly = pT + pts[n-1] * ch;
  const going = ly < (pT + pts[n-5] * ch) ? -1 : 1;
  ctx.beginPath();
  ctx.moveTo(lx-6, ly + going*6);
  ctx.lineTo(lx,   ly);
  ctx.lineTo(lx+6, ly + going*6);
  ctx.strokeStyle = going === -1 ? "#4ade80" : "#f87171";
  ctx.lineWidth = 2;
  ctx.lineJoin  = "round";
  ctx.stroke();
}

// ─── ServiceChart component ───────────────────────────────────────────────────
interface ServiceChartProps {
  pattern:  Pattern;
  range:    Range;
  color:    string;
  name:     string;
  speed:    number;
  statuses: StatusKey[];
  reconnect: number;
}

const ServiceChart = ({ pattern, range, color, name, speed, statuses, reconnect }: ServiceChartProps) => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const ptsRef     = useRef<number[]>([]);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const [tooltip,   setTooltip]   = useState<{ html: string; left: number } | null>(null);
  const [liveColor, setLiveColor] = useState(color);
  const [liveStatus,setLiveStatus]= useState<StatusKey>(statuses[0]);
  const [liveSpeed, setLiveSpeed] = useState(speed === 0 ? "—" : `${speed}ms`);
  const [elapsed,   setElapsed]   = useState(0);

  const cfg        = rangeConfigs[range];
  const timestamps = Array.from({ length: cfg.count }, (_, i) =>
    new Date(NOW.getTime() - (cfg.count - 1 - i) * cfg.step)
  );

  // Draw / redraw
  const redraw = useCallback((pts: number[], c: string) => {
    const canvas = canvasRef.current;
    if (canvas && canvas.offsetWidth > 0) drawCanvas(canvas, pts, c);
  }, []);

  // Init + range change
  useEffect(() => {
    ptsRef.current = genPath(pattern, cfg.count);
    redraw(ptsRef.current, liveColor);
  }, [range, pattern]);

  // Resize observer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => redraw(ptsRef.current, liveColor));
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [liveColor, redraw]);

  // Reconnect cycle → status change
  useEffect(() => {
    let rc      = reconnect;
    let elapsed = 0;
    let idx     = 0;

    const id = setInterval(() => {
      rc--; elapsed++;
      setElapsed(elapsed);

      if (rc <= 0) {
        idx = (idx + 1) % statuses.length;
        const next     = statuses[idx];
        const def      = STATUS_DEFS[next];
        const newPts   = genPath(pattern, rangeConfigs[range].count);
        ptsRef.current = newPts;
        rc      = reconnect;
        elapsed = 0;
        setElapsed(0);
        setLiveColor(def.color);
        setLiveStatus(next);
        setLiveSpeed(next === "MAINTENANCE" ? "—" : next === "OUTAGE" ? "timeout" : next === "DEGRADED" ? `${Math.round(speed * 3)}ms` : `${speed}ms`);
        redraw(newPts, def.color);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [range, pattern, statuses, reconnect, speed, redraw]);

  const def = STATUS_DEFS[liveStatus];

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full transition-colors duration-500" style={{ background: liveColor }} />
          <span className="font-mono text-sm">{name}</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-mono text-[10px] text-muted-foreground hidden sm:block transition-colors duration-300" style={{ color: liveColor }}>
            {liveSpeed}
          </span>
          <span
            className="font-mono text-[10px] tracking-widest px-2 py-0.5 rounded-full border transition-all duration-500"
            style={{ background: def.pillBg, color: def.pillText, borderColor: def.pillBorder }}
          >
            {def.label}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="relative" ref={wrapRef}>
        {tooltip && (
          <div
            className="absolute z-10 bg-foreground text-background font-mono text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap leading-relaxed"
            style={{ left: tooltip.left, top: -42, transform: "translateX(-50%)" }}
            dangerouslySetInnerHTML={{ __html: tooltip.html }}
          />
        )}
        <canvas
          ref={canvasRef}
          height={72}
          style={{ width: "100%", display: "block" }}
          onMouseMove={(e) => {
            const rect = canvasRef.current!.getBoundingClientRect();
            const idx  = Math.min(ptsRef.current.length - 1, Math.max(0, Math.round(((e.clientX - rect.left) / rect.width) * (ptsRef.current.length - 1))));
            const ms   = liveStatus === "MAINTENANCE" ? 0 : Math.round(20 + ptsRef.current[idx] * 180);
            const ts   = timestamps[Math.min(idx, timestamps.length - 1)];
            const wRect = wrapRef.current!.getBoundingClientRect();
            const left  = Math.max(60, Math.min(e.clientX - wRect.left, wRect.width - 60));
            setTooltip({ html: `<strong>${cfg.fmtTip(ts)}</strong><br/>${ms ? ms + "ms · " : ""}${liveStatus}`, left });
          }}
          onMouseLeave={() => setTooltip(null)}
        />
      </div>

      {/* Axis */}
      <div className="flex justify-between mt-1 mb-3">
        <span className="font-mono text-[9px] text-muted-foreground">{cfg.fmtAxis(timestamps[0])}</span>
        <span className="font-mono text-[9px] text-muted-foreground">{cfg.fmtAxis(timestamps[Math.floor(cfg.count / 2)])}</span>
        <span className="font-mono text-[9px] text-muted-foreground">Now</span>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 border border-border divide-x divide-border">
        <div className="px-4 py-2">
          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Speed</div>
          <div className="font-mono text-xs font-medium transition-colors duration-300" style={{ color: liveStatus === "OPERATIONAL" ? "#4ade80" : liveStatus === "DEGRADED" ? "#facc15" : "#f87171" }}>
            {liveSpeed}
          </div>
        </div>
        <div className="px-4 py-2">
          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Status</div>
          <div className="font-mono text-xs font-medium transition-colors duration-500" style={{ color: liveColor }}>
            {def.label}
          </div>
        </div>
        <div className="px-4 py-2">
          <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Last update</div>
          <div className="font-mono text-xs text-muted-foreground">
            {elapsed === 0 ? "just now" : elapsed < 60 ? `${elapsed}s ago` : `${Math.floor(elapsed / 60)}m ago`}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Status page ─────────────────────────────────────────────────────────
const Status = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState<Range>("24h");

  const initialOk = services.every(s => s.statuses[0] === "OPERATIONAL" || s.statuses[0] === "MAINTENANCE");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => navigate("/home")}>
            <AnimatedLogo size={26} />
          </div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={13} /> Back
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-32 pb-24">

        {/* Header */}
        <div className="mb-16">
          <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">SYSTEM STATUS</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-8">STATUS</h1>
          <div className={`flex items-center gap-3 p-5 border ${initialOk ? "border-green-400/30" : "border-yellow-400/30"}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${initialOk ? "bg-green-400" : "bg-yellow-400"} animate-pulse`} />
            <span className={`font-mono text-sm font-bold tracking-wide ${initialOk ? "text-green-400" : "text-yellow-400"}`}>
              {initialOk ? "ALL SYSTEMS OPERATIONAL" : "SOME SYSTEMS DEGRADED"}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground ml-auto">
              Last updated: {pad(NOW.getHours())}:{pad(NOW.getMinutes())} UTC · {fmtDate(NOW)} 2026
            </span>
          </div>
        </div>

        {/* Services */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="font-mono text-[10px] tracking-[0.5em] uppercase text-muted-foreground">SERVICES</div>
            <div className="flex gap-1">
              {(["24h", "7d", "30d"] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`font-mono text-[10px] px-3 py-1 border transition-colors ${range === r ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-border divide-y divide-border">
            {services.map((svc) => (
              <div key={svc.name} className="px-6 py-5">
                <ServiceChart
                  pattern={svc.pattern}
                  range={range}
                  color={STATUS_DEFS[svc.statuses[0]].color}
                  name={svc.name}
                  speed={svc.speed}
                  statuses={svc.statuses}
                  reconnect={svc.reconnect}
                />
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-5 mt-4">
            {([["#4ade80","Operational"],["#facc15","Degraded"],["#f87171","Outage"],["#60a5fa","Maintenance"]] as const).map(([c,l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm" style={{ background: c }} />
                <span className="font-mono text-[10px] text-muted-foreground">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Incidents */}
        <div>
          <div className="font-mono text-[10px] tracking-[0.5em] uppercase mb-6 text-muted-foreground">INCIDENTS & MAINTENANCE</div>
          <div className="space-y-0">
            {incidents.map((inc) => (
              <div key={inc.title} className="border-t border-border py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <h3 className="font-display text-sm font-bold">{inc.title}</h3>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-[10px] text-muted-foreground">{inc.date}</span>
                    <span className={`font-mono text-[9px] tracking-[0.4em] border px-2 py-0.5 ${incidentStyle[inc.status]}`}>
                      {inc.status}
                    </span>
                  </div>
                </div>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">{inc.detail}</p>
              </div>
            ))}
            <div className="border-t border-border pt-6 font-mono text-xs text-muted-foreground">
              NO FURTHER INCIDENTS IN THE LAST 90 DAYS
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Status;