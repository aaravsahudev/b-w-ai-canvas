import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

const entries = [
  {
    version: "v4.2.1",
    date: "MAR 10, 2026",
    type: "PATCH",
    changes: [
      { tag: "FIX", text: "Resolved latency spikes on QWS-CODE-X during peak hours" },
      { tag: "FIX", text: "Fixed audio output clipping on QWS-AUDIO-2 for long-form synthesis" },
      { tag: "IMPROVE", text: "Reduced cold-start time for custom fine-tuned models by 30%" },
    ],
  },
  {
    version: "v4.2.0",
    date: "MAR 1, 2026",
    type: "MINOR",
    changes: [
      { tag: "NEW", text: "QWS-AGENT-1 launched — autonomous planning and multi-step task execution" },
      { tag: "NEW", text: "Webhook support for generation completion events" },
      { tag: "IMPROVE", text: "API response streaming now 2× faster via chunked transfer encoding" },
      { tag: "FIX", text: "Resolved rare JSON parse error in batch generation mode" },
    ],
  },
  {
    version: "v4.1.0",
    date: "FEB 15, 2026",
    type: "MINOR",
    changes: [
      { tag: "NEW", text: "Multi-modal generation: combine text + image inputs in a single request" },
      { tag: "NEW", text: "Dashboard analytics: track token usage, latency, and model performance" },
      { tag: "IMPROVE", text: "QWS-ULTRA-V4 context window expanded from 32K to 128K tokens" },
    ],
  },
  {
    version: "v4.0.0",
    date: "JAN 20, 2026",
    type: "MAJOR",
    changes: [
      { tag: "NEW", text: "QWS-ULTRA-V4 — flagship language model with 1.8T parameters" },
      { tag: "NEW", text: "Unified API v2: single endpoint for all model types" },
      { tag: "NEW", text: "Fine-tuning API for custom model training on private datasets" },
      { tag: "BREAK", text: "API v1 endpoints deprecated — migrate to v2 by Apr 1, 2026" },
      { tag: "IMPROVE", text: "99.95% uptime SLA across all regions" },
    ],
  },
  {
    version: "v3.8.2",
    date: "DEC 5, 2025",
    type: "PATCH",
    changes: [
      { tag: "FIX", text: "Security patch for authentication token refresh edge case" },
      { tag: "FIX", text: "Fixed rate limit headers returning incorrect values" },
    ],
  },
];

const tagColors: Record<string, string> = {
  NEW:     "text-green-400 border-green-400/30",
  FIX:     "text-yellow-400 border-yellow-400/30",
  IMPROVE: "text-blue-400 border-blue-400/30",
  BREAK:   "text-red-400 border-red-400/30",
};

const typeColors: Record<string, string> = {
  MAJOR: "bg-foreground text-background",
  MINOR: "border border-border text-muted-foreground",
  PATCH: "border border-border text-muted-foreground",
};

const Changelog = () => {
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
        <div className="mb-20">
          <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">HISTORY</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">CHANGELOG</h1>
          <p className="font-mono text-sm text-muted-foreground max-w-lg leading-relaxed">
            A complete record of every release — new features, improvements, bug fixes, and breaking changes.
          </p>
        </div>

        <div className="space-y-0">
          {entries.map((entry, i) => (
            <div key={entry.version} className="border-t border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-6">
                <div className="flex items-center gap-4">
                  <span className="font-display text-2xl font-bold">{entry.version}</span>
                  <span className={`font-mono text-[9px] tracking-[0.4em] px-2 py-1 ${typeColors[entry.type]}`}>
                    {entry.type}
                  </span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">{entry.date}</span>
              </div>
              <div className="pb-8 space-y-2.5">
                {entry.changes.map((c, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <span className={`font-mono text-[9px] tracking-widest border px-1.5 py-0.5 mt-0.5 shrink-0 ${tagColors[c.tag] ?? "text-muted-foreground border-border"}`}>
                      {c.tag}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground leading-relaxed">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="border-t border-border pt-8 font-mono text-xs text-muted-foreground text-center">
            END OF CHANGELOG · SEE OLDER RELEASES ON GITHUB
          </div>
        </div>
      </div>
    </div>
  );
};

export default Changelog;
