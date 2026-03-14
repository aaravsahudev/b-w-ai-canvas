import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Rocket, Star, Cpu, Globe, Shield } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

const roadmap = [
  {
    quarter: "Q2 2026",
    status: "IN PROGRESS",
    highlight: true,
    items: [
      { icon: Rocket, title: "QWS-ULTRA-V5", desc: "Next-gen language model with 2T parameters. 40% faster inference, improved reasoning and factual accuracy." },
      { icon: Cpu, title: "Real-Time Voice API", desc: "Sub-200ms voice synthesis with 50+ natural voices and emotion control." },
      { icon: Globe, title: "Multi-Region Inference", desc: "New nodes in EU-West, AP-Southeast, and SA-East for global sub-50ms latency." },
    ],
  },
  {
    quarter: "Q3 2026",
    status: "PLANNED",
    highlight: false,
    items: [
      { icon: Star, title: "Collaborative Workspace", desc: "Real-time multiplayer AI generation — share sessions, co-edit prompts, and review outputs together." },
      { icon: Shield, title: "Enterprise SSO & Audit Logs", desc: "SAML 2.0, Okta integration, and full tamper-proof audit logging for compliance." },
      { icon: Cpu, title: "Custom Model Fine-Tuning UI", desc: "No-code interface to upload datasets and fine-tune models without writing a single line of code." },
    ],
  },
  {
    quarter: "Q4 2026",
    status: "PLANNED",
    highlight: false,
    items: [
      { icon: Globe, title: "Agent Marketplace", desc: "Publish and discover community-built AI agents. Run complex multi-step workflows with a single API call." },
      { icon: Rocket, title: "On-Premise Deployment", desc: "Deploy the full QuickWebStack stack on your own infrastructure. Air-gapped support for defense and finance." },
      { icon: Star, title: "iOS & Android Apps", desc: "Native mobile apps with offline model caching, push notifications, and biometric authentication." },
    ],
  },
];

const UpcomingUpdates = () => {
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

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="mb-20">
          <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">ROADMAP</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
            UPCOMING<br />UPDATES
          </h1>
          <p className="font-mono text-sm text-muted-foreground max-w-lg leading-relaxed">
            A transparent look at what we're building next. Priorities may shift as we learn,
            but this reflects our current direction.
          </p>
        </div>

        <div className="space-y-px">
          {roadmap.map((phase) => (
            <div key={phase.quarter} className={`${phase.highlight ? "bg-foreground text-background" : "bg-background"}`}>
              <div className="border-b border-border px-8 py-5 flex items-center justify-between">
                <div className="font-display text-xl font-bold tracking-tight">{phase.quarter}</div>
                <div className={`font-mono text-[10px] tracking-[0.4em] px-3 py-1 border ${
                  phase.status === "IN PROGRESS"
                    ? phase.highlight ? "border-background/40 text-background/80" : "border-green-400/40 text-green-400"
                    : phase.highlight ? "border-background/20 text-background/50" : "border-border text-muted-foreground"
                }`}>
                  {phase.status}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
                {phase.items.map((item) => (
                  <div key={item.title} className={`p-8 ${phase.highlight ? "bg-foreground" : "bg-background"}`}>
                    <item.icon size={20} strokeWidth={1.2} className={`mb-5 ${phase.highlight ? "opacity-70" : "text-muted-foreground"}`} />
                    <h3 className="font-display text-base font-bold mb-3 tracking-tight">{item.title}</h3>
                    <p className={`font-mono text-xs leading-relaxed ${phase.highlight ? "opacity-70" : "text-muted-foreground"}`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 border border-border p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-muted-foreground" />
              <span className="font-mono text-xs text-muted-foreground tracking-widest">STAY UPDATED</span>
            </div>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed max-w-sm">
              Subscribe to our changelog to get notified when new features ship.
            </p>
          </div>
          <button onClick={() => navigate("/changelog")} className="btn-primary text-xs py-3 px-8 shrink-0">
            VIEW CHANGELOG
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpcomingUpdates;
