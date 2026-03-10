import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-16 relative overflow-hidden">
      {/* Animated grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-px bg-border animate-pulse-line"
            style={{ left: `${(i + 1) * 8.33}%`, animationDelay: `${i * 0.25}s` }}
          />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-px bg-border animate-pulse-line"
            style={{ top: `${(i + 1) * 16.66}%`, animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 border border-border px-5 py-2 mb-10 font-mono text-xs tracking-widest animate-slide-up"
        >
          <Sparkles size={12} /> AI-POWERED GENERATION PLATFORM
        </div>

        <h1
          className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-bold leading-[0.85] tracking-tighter mb-10 animate-slide-up"
          style={{ animationDelay: "0.15s" }}
        >
          QUICK
          <br />
          WEB
          <br />
          STACK<span className="animate-cursor-blink">_</span>
        </h1>

        <p
          className="font-mono text-sm md:text-base max-w-2xl mx-auto mb-14 leading-relaxed animate-slide-up text-muted-foreground"
          style={{ animationDelay: "0.3s" }}
        >
          The ultimate AI generation workspace. Create text, images, code, and
          more — all in one powerful platform built for speed and precision.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
          style={{ animationDelay: "0.45s" }}
        >
          <button
            onClick={() => navigate("/generate")}
            className="btn-primary text-sm py-5 px-12 gap-3"
          >
            START CREATING <ArrowRight size={16} />
          </button>
          <a href="#features" className="btn-outline text-sm py-5 px-12">
            SEE HOW IT WORKS
          </a>
        </div>

        {/* Stats */}
        <div
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-border max-w-3xl mx-auto animate-slide-up"
          style={{ animationDelay: "0.6s" }}
        >
          {[
            { value: "10M+", label: "GENERATIONS" },
            { value: "<50MS", label: "LATENCY" },
            { value: "99.9%", label: "UPTIME" },
            { value: "50+", label: "AI MODELS" },
          ].map((stat) => (
            <div key={stat.label} className="bg-background p-6 text-center">
              <div className="font-display text-xl md:text-3xl font-bold">
                {stat.value}
              </div>
              <div className="font-mono text-[10px] tracking-widest mt-1 text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: "1s" }}>
        <div className="w-px h-16 bg-foreground animate-pulse-line" />
      </div>
    </section>
  );
};

export default HeroSection;
