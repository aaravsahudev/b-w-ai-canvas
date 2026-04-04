import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { generateWebsite } from "@/utils/codeGenerator";
import AnimatedLogo from "@/components/AnimatedLogo";
import { MODELS, type AgentModel } from "@/agents/models";

const Generate = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AgentModel>(MODELS[0]);
  const [prevModel, setPrevModel] = useState<AgentModel | null>(null);
  const [animating, setAnimating] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const acc = selectedModel.color;

  const handleSelectModel = useCallback((m: AgentModel) => {
    if (m.id === selectedModel.id) return;
    if (m.route && m.route !== "/generate") {
      navigate(m.route);
      return;
    }
    setPrevModel(selectedModel);
    setAnimating(true);
    setSelectedModel(m);
    setPrompt("");
    setTimeout(() => setAnimating(false), 380);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [selectedModel, navigate]);

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
    <>
      <style>{`
        @keyframes modelIn {
          0%  { opacity: 0; transform: translateY(12px) scale(0.99); }
          100%{ opacity: 1; transform: translateY(0)  scale(1); }
        }
        @keyframes scanFlash {
          0%  { opacity: 0; transform: translateX(-100%); }
          40% { opacity: 1; }
          100%{ opacity: 0; transform: translateX(100%); }
        }
        @keyframes bgPulse {
          0%  { opacity: 0; }
          50% { opacity: 1; }
          100%{ opacity: 0; }
        }
        .model-in { animation: modelIn 0.36s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* Full-page background glow — changes with model */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-500"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${acc}18, transparent 65%)`,
        }}
      />

      {/* Scan flash on model switch */}
      {animating && (
        <div
          className="fixed top-0 left-0 right-0 h-0.5 pointer-events-none z-50"
          style={{
            background: `linear-gradient(90deg, transparent, ${acc}, transparent)`,
            animation: "scanFlash 0.38s ease-out both",
          }}
        />
      )}

      <div className="min-h-screen flex flex-col relative z-10">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0 bg-background/90 backdrop-blur-sm">
          <div className="cursor-pointer" onClick={() => navigate("/home")}>
            <AnimatedLogo size={34} />
          </div>
          <div className="flex items-center gap-4">
            <span
              className="font-mono text-[10px] tracking-[0.3em] uppercase transition-colors duration-500"
              style={{ color: acc }}
            >
              {selectedModel.name}
            </span>
            <button
              onClick={handleBuild}
              disabled={!prompt.trim() || isBuilding}
              className="font-mono text-xs px-5 py-2.5 font-bold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: acc, color: "#000" }}
            >
              {isBuilding ? "Building…" : selectedModel.cta}
            </button>
          </div>
        </nav>

        {/* ── MODEL STRIP ── */}
        <div className="border-b border-border bg-background/60 backdrop-blur-sm">
          <div className="flex overflow-x-auto">
            {MODELS.map((m) => {
              const isSelected = selectedModel.id === m.id;
              const isRedirect = m.route && m.route !== "/generate";
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleSelectModel(m)}
                  data-testid={`model-card-${m.id}`}
                  className="flex-1 min-w-[80px] flex flex-col items-center py-3 px-2 gap-1.5 relative transition-all duration-200 group shrink-0"
                  style={{
                    background: isSelected ? `${m.color}14` : "transparent",
                  }}
                >
                  {/* Active bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 transition-all duration-300"
                    style={{ background: isSelected ? m.color : "transparent" }}
                  />

                  {/* Symbol */}
                  <div
                    className="text-lg leading-none transition-all duration-300"
                    style={{
                      color: isSelected ? m.color : "hsl(var(--muted-foreground)/0.5)",
                      textShadow: isSelected ? `0 0 12px ${m.color}80` : "none",
                      transform: isSelected ? "scale(1.15)" : "scale(1)",
                    }}
                  >
                    {m.symbol}
                  </div>

                  {/* Badge */}
                  <div
                    className="font-mono font-bold leading-none transition-colors duration-300"
                    style={{
                      fontSize: 7,
                      letterSpacing: "0.12em",
                      color: isSelected ? m.color : "hsl(var(--muted-foreground)/0.4)",
                    }}
                  >
                    {m.badge}
                  </div>

                  {/* Redirect indicator */}
                  {isRedirect && (
                    <div className="font-mono text-[6px] text-muted-foreground/30 group-hover:text-muted-foreground transition-colors">
                      ↗
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── MAIN CONTENT ── animates on model switch */}
        <div
          ref={contentRef}
          key={selectedModel.id}
          className="flex-1 flex flex-col items-center justify-center px-5 py-10 model-in"
        >
          {/* Model identity pill */}
          <div
            className="flex items-center gap-2.5 mb-8 px-4 py-2 border transition-all duration-500"
            style={{ borderColor: `${acc}40`, background: `${acc}08` }}
          >
            <div className="text-base leading-none" style={{ color: acc, textShadow: `0 0 10px ${acc}60` }}>
              {selectedModel.symbol}
            </div>
            <div className="font-mono text-[10px] tracking-[0.35em] uppercase" style={{ color: acc }}>
              {selectedModel.name}
            </div>
            <div className="w-px h-3 bg-current opacity-20" style={{ color: acc }} />
            <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              {selectedModel.tag}
            </div>
          </div>

          {/* Heading — changes verb with model */}
          <h1
            className="font-display font-bold tracking-tight text-center mb-4 max-w-3xl leading-none"
            style={{ fontSize: "clamp(2.2rem, 6.5vw, 5.5rem)" }}
          >
            What do you want to{" "}
            <em style={{ fontStyle: "italic", color: acc, textShadow: `0 0 30px ${acc}40`, transition: "color 0.4s, text-shadow 0.4s" }}>
              {selectedModel.verb}?
            </em>
          </h1>

          <p className="font-mono text-sm text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
            {selectedModel.desc}
          </p>

          {/* ── INPUT BOX ── */}
          <div
            className="w-full max-w-3xl mb-6 transition-all duration-400"
            style={{
              borderColor: `${acc}40`,
              boxShadow: `0 0 0 1px ${acc}20`,
              border: `1px solid ${acc}30`,
            }}
          >
            <textarea
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKey}
              placeholder={`Describe what you want ${selectedModel.name} to ${selectedModel.verb}...`}
              disabled={isBuilding}
              rows={3}
              className="w-full bg-background text-foreground font-mono text-sm p-5 resize-none outline-none border-0 placeholder:text-muted-foreground"
              style={{ caretColor: acc }}
              data-testid="main-prompt-input"
            />
            <div
              className="flex items-center justify-between px-5 py-3 border-t transition-colors duration-400"
              style={{ borderColor: `${acc}20` }}
            >
              <span className="font-mono text-[10px] text-muted-foreground">
                Enter ↵ to {selectedModel.verb} · Shift+Enter for new line
              </span>
              <button
                onClick={handleBuild}
                disabled={!prompt.trim() || isBuilding}
                className="flex items-center gap-2 font-mono text-xs px-5 py-2.5 font-bold transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed"
                style={{ background: prompt.trim() ? acc : "transparent", color: prompt.trim() ? "#000" : acc, border: `1px solid ${acc}60` }}
                data-testid="build-button"
              >
                {isBuilding ? "Working…" : <>{selectedModel.cta} <ArrowRight size={13} /></>}
              </button>
            </div>
          </div>

          {/* ── EXAMPLE CHIPS ── model-specific ── */}
          <div className="flex flex-wrap gap-2 justify-center max-w-3xl">
            {selectedModel.examples.map((ex) => (
              <button
                key={ex.label}
                onClick={() => { setPrompt(ex.label); inputRef.current?.focus(); }}
                className="flex items-center gap-1.5 px-3 py-2 border font-mono text-[11px] text-muted-foreground transition-all duration-200"
                style={{ borderColor: "hsl(var(--border))" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${acc}60`;
                  (e.currentTarget as HTMLElement).style.color = acc;
                  (e.currentTarget as HTMLElement).style.background = `${acc}08`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "hsl(var(--border))";
                  (e.currentTarget as HTMLElement).style.color = "";
                  (e.currentTarget as HTMLElement).style.background = "";
                }}
                data-testid={`example-${ex.label.replace(/\s+/g, "-")}`}
              >
                <span>{ex.icon}</span>{ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── BOTTOM STATUS BAR ── */}
        <div
          className="px-6 py-2.5 border-t flex items-center justify-between transition-all duration-500"
          style={{ borderColor: `${acc}20` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: acc, boxShadow: `0 0 6px ${acc}` }} />
            <span className="font-mono text-[10px] text-muted-foreground">
              {selectedModel.name} · {selectedModel.tag}
            </span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground hidden sm:block">
            {MODELS.length} models · QuickWebStack AI
          </span>
        </div>
      </div>
    </>
  );
};

export default Generate;
