import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

const services = [
  { name: "API Gateway",            status: "OPERATIONAL", uptime: "99.98%" },
  { name: "QWS-ULTRA-V4",           status: "OPERATIONAL", uptime: "99.97%" },
  { name: "QWS-VISION-3",           status: "OPERATIONAL", uptime: "99.95%" },
  { name: "QWS-CODE-X",             status: "OPERATIONAL", uptime: "99.99%" },
  { name: "QWS-AUDIO-2",            status: "DEGRADED",    uptime: "98.42%" },
  { name: "QWS-AGENT-1",            status: "OPERATIONAL", uptime: "99.89%" },
  { name: "Fine-Tuning Service",     status: "OPERATIONAL", uptime: "99.91%" },
  { name: "Dashboard & Console",    status: "OPERATIONAL", uptime: "99.96%" },
  { name: "Webhooks",               status: "OPERATIONAL", uptime: "99.93%" },
  { name: "EU-West Region",         status: "OPERATIONAL", uptime: "99.97%" },
  { name: "AP-Southeast Region",    status: "OPERATIONAL", uptime: "99.88%" },
  { name: "SA-East Region",         status: "MAINTENANCE", uptime: "—" },
];

const incidents = [
  {
    date: "MAR 8, 2026",
    title: "QWS-AUDIO-2 Elevated Latency",
    status: "ONGOING",
    detail: "Investigating intermittent latency spikes on long-form audio synthesis requests exceeding 60 seconds. All other audio endpoints are unaffected.",
  },
  {
    date: "MAR 1, 2026",
    title: "SA-East Region Maintenance Window",
    status: "SCHEDULED",
    detail: "Planned hardware upgrade to SA-East GPU cluster on Mar 15, 02:00–06:00 UTC. Requests will be automatically routed to US-East fallback.",
  },
  {
    date: "FEB 22, 2026",
    title: "API Gateway 503 Errors — RESOLVED",
    status: "RESOLVED",
    detail: "A configuration change caused 503 errors for 4% of API requests over 11 minutes. The issue was rolled back at 14:23 UTC. All services restored.",
  },
];

const statusStyle: Record<string, { dot: string; text: string; label: string }> = {
  OPERATIONAL: { dot: "bg-green-400",  text: "text-green-400",  label: "OPERATIONAL" },
  DEGRADED:    { dot: "bg-yellow-400", text: "text-yellow-400", label: "DEGRADED" },
  MAINTENANCE: { dot: "bg-blue-400",   text: "text-blue-400",   label: "MAINTENANCE" },
  OUTAGE:      { dot: "bg-red-400",    text: "text-red-400",    label: "OUTAGE" },
};

const incidentStyle: Record<string, string> = {
  ONGOING:   "text-yellow-400 border-yellow-400/30",
  SCHEDULED: "text-blue-400 border-blue-400/30",
  RESOLVED:  "text-muted-foreground border-border",
};

const overallOk = services.every(s => s.status === "OPERATIONAL" || s.status === "MAINTENANCE");

const Status = () => {
  const navigate = useNavigate();

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
        <div className="mb-16">
          <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">SYSTEM STATUS</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-8">STATUS</h1>

          <div className={`flex items-center gap-3 p-5 border ${overallOk ? "border-green-400/30" : "border-yellow-400/30"}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${overallOk ? "bg-green-400" : "bg-yellow-400"} animate-pulse`} />
            <span className={`font-mono text-sm font-bold tracking-wide ${overallOk ? "text-green-400" : "text-yellow-400"}`}>
              {overallOk ? "ALL SYSTEMS OPERATIONAL" : "SOME SYSTEMS DEGRADED"}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground ml-auto">
              Last updated: {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} UTC
            </span>
          </div>
        </div>

        {/* Services */}
        <div className="mb-16">
          <div className="font-mono text-[10px] tracking-[0.5em] uppercase mb-6 text-muted-foreground">SERVICES</div>
          <div className="border border-border">
            {services.map((svc, i) => {
              const s = statusStyle[svc.status];
              return (
                <div key={svc.name} className={`flex items-center justify-between px-6 py-4 ${i < services.length - 1 ? "border-b border-border" : ""}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    <span className="font-mono text-sm">{svc.name}</span>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="font-mono text-[10px] text-muted-foreground hidden sm:block">
                      {svc.uptime !== "—" ? `${svc.uptime} UPTIME` : "—"}
                    </span>
                    <span className={`font-mono text-[10px] tracking-widest ${s.text}`}>{s.label}</span>
                  </div>
                </div>
              );
            })}
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
