import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Code2, Zap, Key, Globe, Terminal } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

const sections = [
  {
    icon: Zap,
    title: "QUICK START",
    desc: "Get generating in under 60 seconds. No setup required.",
    items: ["Create an account", "Choose your AI model", "Enter a prompt", "Export your output"],
  },
  {
    icon: Code2,
    title: "API REFERENCE",
    desc: "Full REST API with SDKs for Python, JavaScript, Go, and Rust.",
    items: ["Authentication", "Endpoints", "Rate limits", "Webhooks"],
  },
  {
    icon: Key,
    title: "AUTHENTICATION",
    desc: "Secure API key management and OAuth 2.0 flows.",
    items: ["API keys", "OAuth scopes", "Token rotation", "IP allowlists"],
  },
  {
    icon: Globe,
    title: "MODELS",
    desc: "Detailed specs for every model in the QuickWebStack fleet.",
    items: ["QWS-ULTRA-V4", "QWS-VISION-3", "QWS-CODE-X", "QWS-AUDIO-2"],
  },
  {
    icon: Terminal,
    title: "CLI",
    desc: "Command-line tool for integrating QWS into your build pipeline.",
    items: ["Installation", "Commands", "Config files", "CI/CD integration"],
  },
  {
    icon: BookOpen,
    title: "TUTORIALS",
    desc: "Step-by-step guides for common use cases and workflows.",
    items: ["Build a landing page", "Generate UI components", "Automate content", "Fine-tuning guide"],
  },
];

const Docs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => navigate("/home")}>
            <AnimatedLogo size={26} />
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={13} /> Back
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="mb-20">
          <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">DOCUMENTATION</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
            DOCS &<br />REFERENCE
          </h1>
          <p className="font-mono text-sm text-muted-foreground max-w-lg leading-relaxed">
            Everything you need to build with QuickWebStack — from quick start guides
            to full API documentation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {sections.map((s, i) => (
            <div
              key={s.title}
              className="bg-background p-8 group hover:bg-foreground hover:text-background transition-colors duration-150 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-6">
                <s.icon size={20} strokeWidth={1.2} />
                <span className="font-mono text-xs text-muted-foreground group-hover:text-background">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
              </div>
              <h3 className="font-display text-base font-bold mb-2 tracking-tight">{s.title}</h3>
              <p className="font-mono text-xs text-muted-foreground group-hover:text-background leading-relaxed mb-5">{s.desc}</p>
              <ul className="space-y-1.5">
                {s.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 font-mono text-xs text-muted-foreground group-hover:text-background">
                    <span className="w-1 h-1 bg-muted-foreground group-hover:bg-background rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Docs;
