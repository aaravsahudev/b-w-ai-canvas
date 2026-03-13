import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { generateWebsite } from "@/utils/codeGenerator";
import AnimatedLogo from "@/components/AnimatedLogo";

const EXAMPLES = [
  { label: "SaaS landing page", icon: "🚀" },
  { label: "Developer portfolio", icon: "💼" },
  { label: "Analytics dashboard", icon: "📊" },
  { label: "Online store", icon: "🛍️" },
  { label: "Restaurant website", icon: "🍽️" },
  { label: "Pricing page", icon: "💎" },
  { label: "Blog homepage", icon: "✍️" },
  { label: "Personal resume", icon: "📄" },
];

const MODELS = [
  { id: "qws-ultra-v4",  name: "QWS-ULTRA-V4",  tag: "Language · Reasoning",  badge: "DEFAULT" },
  { id: "qws-vision-3",  name: "QWS-VISION-3",  tag: "Image · Multimodal",    badge: "VISION" },
  { id: "qws-code-x",    name: "QWS-CODE-X",    tag: "Code · Synthesis",      badge: "CODE" },
  { id: "qws-audio-2",   name: "QWS-AUDIO-2",   tag: "Speech · Music",        badge: "AUDIO" },
  { id: "qws-agent-1",   name: "QWS-AGENT-1",   tag: "Autonomous · Planning", badge: "AGENT" },
];

const Generate = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleBuild = () => {
    if (!prompt.trim() || isBuilding) return;
    setIsBuilding(true);
    setTimeout(() => {
      const code = generateWebsite(prompt);
      navigate("/workspace", {
        state: {
          id: crypto.randomUUID(),
          prompt: prompt.trim(),
          code,
          model: selectedModel,
          timestamp: Date.now(),
        },
      });
    }, 100);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleBuild(); }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="cursor-pointer" onClick={() => navigate("/home")}>
          <AnimatedLogo size={34} />
        </div>
        <div className="flex items-center gap-3">
          <button className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Sign in
          </button>
          <button className="btn-primary text-xs px-5 py-2.5">Get started</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-16">
        <div className="flex items-center gap-2 mb-8 px-4 py-2 border border-border font-mono text-xs text-muted-foreground animate-fade-in">
          <Sparkles size={11} />
          AI-POWERED WEBSITE GENERATOR
        </div>

        <h1
          className="font-display font-bold tracking-tight text-center mb-5 max-w-3xl leading-none animate-slide-up"
          style={{ fontSize: "clamp(2.5rem, 7vw, 6.5rem)" }}
        >
          What do you want to{" "}
          <em style={{ fontStyle: "italic" }}>build?</em>
        </h1>

        <p
          className="font-mono text-sm text-muted-foreground text-center max-w-md mb-10 leading-relaxed animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          Describe any website. Our AI generates a complete, beautiful,
          fully-working site with live preview — instantly.
        </p>

        {/* Model selector */}
        <div
          className="w-full max-w-2xl mb-3 animate-slide-up relative"
          style={{ animationDelay: "0.12s" }}
        >
          <button
            onClick={() => setModelOpen((v) => !v)}
            className="flex items-center justify-between w-full border border-border px-4 py-3 font-mono text-xs text-foreground hover:border-foreground transition-colors bg-background"
            data-testid="model-selector"
          >
            <div className="flex items-center gap-3">
              <span className="border border-border px-1.5 py-0.5 text-[9px] tracking-widest text-muted-foreground">
                {selectedModel.badge}
              </span>
              <span className="font-bold">{selectedModel.name}</span>
              <span className="text-muted-foreground hidden sm:inline">{selectedModel.tag}</span>
            </div>
            <ChevronDown size={13} className={`text-muted-foreground transition-transform ${modelOpen ? "rotate-180" : ""}`} />
          </button>

          {modelOpen && (
            <div className="absolute top-full left-0 right-0 z-30 border border-border border-t-0 bg-background">
              {MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => { setSelectedModel(m); setModelOpen(false); }}
                  className={`flex items-center gap-3 w-full px-4 py-3 font-mono text-xs text-left hover:bg-foreground hover:text-background transition-colors border-b border-border last:border-b-0 ${
                    selectedModel.id === m.id ? "bg-foreground text-background" : "text-foreground"
                  }`}
                  data-testid={`model-option-${m.id}`}
                >
                  <span className={`border px-1.5 py-0.5 text-[9px] tracking-widest shrink-0 ${
                    selectedModel.id === m.id ? "border-background text-background" : "border-border text-muted-foreground"
                  }`}>
                    {m.badge}
                  </span>
                  <span className="font-bold">{m.name}</span>
                  <span className={`hidden sm:inline ${selectedModel.id === m.id ? "opacity-75" : "text-muted-foreground"}`}>
                    {m.tag}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main input box */}
        <div
          className="w-full max-w-2xl border border-border focus-within:border-foreground transition-colors animate-slide-up"
          style={{ animationDelay: "0.15s" }}
          onClick={() => modelOpen && setModelOpen(false)}
        >
          <textarea
            ref={inputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Describe the website you want to create..."
            disabled={isBuilding}
            rows={3}
            className="w-full bg-background text-foreground font-mono text-sm p-5 resize-none outline-none border-0 placeholder:text-muted-foreground"
            style={{ caretColor: "hsl(var(--foreground))" }}
            data-testid="main-prompt-input"
          />
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <span className="font-mono text-[10px] text-muted-foreground">
              Press Enter ↵ to build
            </span>
            <button
              onClick={handleBuild}
              disabled={!prompt.trim() || isBuilding}
              className="btn-primary text-xs px-5 py-2.5 gap-2 disabled:opacity-20 disabled:cursor-not-allowed"
              data-testid="build-button"
            >
              {isBuilding ? "Building..." : <><span>Build it</span> <ArrowRight size={13} /></>}
            </button>
          </div>
        </div>

        {/* Example chips */}
        <div
          className="flex flex-wrap gap-2 justify-center mt-8 max-w-xl animate-fade-in"
          style={{ animationDelay: "0.25s" }}
        >
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => { setPrompt(ex.label); inputRef.current?.focus(); setModelOpen(false); }}
              className="flex items-center gap-1.5 px-3 py-2 border border-border font-mono text-[11px] text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              data-testid={`example-${ex.label.replace(/\s+/g, "-")}`}
            >
              <span>{ex.icon}</span>{ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <div className="px-6 py-3 border-t border-border flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted-foreground">Powered by QuickWebStack AI</span>
        <span className="font-mono text-[10px] text-muted-foreground hidden sm:block">No signup required · Free to use</span>
      </div>
    </div>
  );
};

export default Generate;
