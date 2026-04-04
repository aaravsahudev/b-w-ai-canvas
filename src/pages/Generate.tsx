import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { generateWebsite } from "@/utils/codeGenerator";
import AnimatedLogo from "@/components/AnimatedLogo";
import { MODELS, type AgentModel } from "@/agents/models";

const EXAMPLES = [
  { label: "SaaS landing page",   icon: "🚀" },
  { label: "Developer portfolio", icon: "💼" },
  { label: "Analytics dashboard", icon: "📊" },
  { label: "Online store",        icon: "🛍️" },
  { label: "Restaurant website",  icon: "🍽️" },
  { label: "Pricing page",        icon: "💎" },
  { label: "Blog homepage",       icon: "✍️" },
  { label: "Personal resume",     icon: "📄" },
];

const Generate = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AgentModel>(MODELS[0]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSelectModel = (m: AgentModel) => {
    if (m.route && m.route !== "/generate") {
      navigate(m.route);
      return;
    }
    setSelectedModel(m);
    inputRef.current?.focus();
  };

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
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-10">
        <div className="flex items-center gap-2 mb-6 px-4 py-2 border border-border font-mono text-xs text-muted-foreground animate-fade-in">
          <Sparkles size={11} />
          AI-POWERED GENERATION SUITE
        </div>

        <h1
          className="font-display font-bold tracking-tight text-center mb-4 max-w-3xl leading-none animate-slide-up"
          style={{ fontSize: "clamp(2.2rem, 6.5vw, 6rem)" }}
        >
          What do you want to{" "}
          <em style={{ fontStyle: "italic" }}>build?</em>
        </h1>

        <p
          className="font-mono text-sm text-muted-foreground text-center max-w-md mb-8 leading-relaxed animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          Pick an AI model then describe what you want — websites, presentations, code, audio, and more.
        </p>

        {/* ── MODEL CARD SELECTOR ── */}
        <div
          className="w-full max-w-4xl mb-4 animate-slide-up"
          style={{ animationDelay: "0.12s" }}
        >
          <div className="font-mono text-[9px] tracking-[0.4em] uppercase text-muted-foreground mb-3">
            SELECT MODEL — {MODELS.length} AVAILABLE
          </div>
          <div
            className="grid gap-px"
            style={{ gridTemplateColumns: `repeat(${MODELS.length}, minmax(0,1fr))` }}
          >
            {MODELS.map((m) => {
              const isSelected = selectedModel.id === m.id;
              const isRedirect = m.route && m.route !== "/generate";
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectModel(m)}
                  data-testid={`model-card-${m.id}`}
                  className={`flex flex-col items-start p-3 border-b-2 transition-all duration-150 group ${
                    isSelected
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-transparent hover:border-foreground/30"
                  }`}
                  style={isSelected ? {} : { borderColor: "transparent" }}
                  title={m.desc}
                >
                  <div
                    className="text-base mb-2 leading-none"
                    style={{ color: isSelected ? "var(--background)" : m.color }}
                  >
                    {m.symbol}
                  </div>
                  <div className="font-mono text-[8px] font-bold tracking-widest truncate w-full">
                    {m.badge}
                  </div>
                  <div
                    className={`font-mono text-[8px] mt-0.5 truncate w-full ${
                      isSelected ? "opacity-70" : "text-muted-foreground"
                    }`}
                  >
                    {isRedirect ? "→ Launch" : m.tag.split(" · ")[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected model detail strip */}
          <div className={`flex items-center gap-3 px-4 py-2.5 border border-t-0 border-border ${selectedModel ? "" : "opacity-0"}`}>
            <div style={{ color: selectedModel.color }} className="text-sm">{selectedModel.symbol}</div>
            <div>
              <span className="font-mono text-xs font-bold">{selectedModel.name}</span>
              <span className="font-mono text-xs text-muted-foreground ml-2">{selectedModel.tag}</span>
            </div>
            <div className="ml-auto font-mono text-[10px] text-muted-foreground hidden sm:block">
              {selectedModel.desc}
            </div>
          </div>
        </div>

        {/* Main input box */}
        <div
          className="w-full max-w-4xl border border-border focus-within:border-foreground transition-colors animate-slide-up"
          style={{ animationDelay: "0.16s" }}
        >
          <textarea
            ref={inputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Describe what you want ${selectedModel.name} to generate...`}
            disabled={isBuilding}
            rows={3}
            className="w-full bg-background text-foreground font-mono text-sm p-5 resize-none outline-none border-0 placeholder:text-muted-foreground"
            style={{ caretColor: "hsl(var(--foreground))" }}
            data-testid="main-prompt-input"
          />
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <span className="font-mono text-[10px] text-muted-foreground">
              Press Enter ↵ to build · Shift+Enter for new line
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
          className="flex flex-wrap gap-2 justify-center mt-6 max-w-3xl animate-fade-in"
          style={{ animationDelay: "0.25s" }}
        >
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => { setPrompt(ex.label); inputRef.current?.focus(); }}
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
        <span className="font-mono text-[10px] text-muted-foreground">Powered by QuickWebStack AI · {MODELS.length} models available</span>
        <span className="font-mono text-[10px] text-muted-foreground hidden sm:block">No signup required · Free to use</span>
      </div>
    </div>
  );
};

export default Generate;
