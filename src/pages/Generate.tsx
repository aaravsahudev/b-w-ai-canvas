import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import logo from "@/assets/logo.png";
import { generateWebsite } from "@/utils/codeGenerator";

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

const Generate = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
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
          timestamp: Date.now(),
        },
      });
    }, 100);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleBuild();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <img src={logo} alt="QuickWebStack" className="h-6" />
        </div>
        <div className="flex items-center gap-3">
          <button className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
            Sign in
          </button>
          <button className="btn-primary text-xs px-5 py-2.5">
            Get started
          </button>
        </div>
      </nav>

      {/* Hero content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-16">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-8 px-4 py-2 border border-border font-mono text-xs text-muted-foreground animate-fade-in">
          <Sparkles size={11} />
          AI-POWERED WEBSITE GENERATOR
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-center mb-6 max-w-3xl leading-none animate-slide-up">
          What do you want to <span style={{ fontStyle: "italic" }}>build?</span>
        </h1>

        <p className="font-mono text-sm text-muted-foreground text-center max-w-md mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Describe any website. Our AI generates a complete, beautiful,
          fully-working site and shows you a live preview instantly.
        </p>

        {/* Main input */}
        <div
          className="w-full max-w-2xl border border-border focus-within:border-foreground transition-colors animate-slide-up"
          style={{ animationDelay: "0.15s" }}
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
              Press Enter to build
            </span>
            <button
              onClick={handleBuild}
              disabled={!prompt.trim() || isBuilding}
              className="btn-primary text-xs px-5 py-2.5 gap-2 disabled:opacity-20 disabled:cursor-not-allowed"
              data-testid="build-button"
            >
              {isBuilding ? (
                <>Building...</>
              ) : (
                <>Build it <ArrowRight size={13} /></>
              )}
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
              onClick={() => {
                setPrompt(ex.label);
                inputRef.current?.focus();
              }}
              className="flex items-center gap-1.5 px-3 py-2 border border-border font-mono text-[11px] text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              data-testid={`example-${ex.label.replace(/\s+/g, "-")}`}
            >
              <span>{ex.icon}</span>
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer strip */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted-foreground">
          Powered by QuickWebStack AI
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          No signup required
        </span>
      </div>
    </div>
  );
};

export default Generate;
