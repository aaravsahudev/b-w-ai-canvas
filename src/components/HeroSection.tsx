import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-16 relative overflow-hidden">
      {/* Background grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-border animate-pulse-line"
            style={{
              left: `${(i + 1) * 12.5}%`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div
          className="font-mono text-xs tracking-[0.5em] uppercase mb-8 animate-slide-up text-muted-foreground"
        >
          AI-POWERED GENERATION PLATFORM
        </div>

        <h1
          className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tighter mb-8 animate-slide-up"
          style={{ animationDelay: "0.15s" }}
        >
          CREATE
          <br />
          ANYTHING
          <span className="animate-cursor-blink">_</span>
        </h1>

        <p
          className="font-mono text-sm md:text-base max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up text-muted-foreground"
          style={{ animationDelay: "0.3s" }}
        >
          QuickWebStack puts the full force of generative AI at your fingertips.
          From text and visuals to code and beyond — build faster, create bolder.
        </p>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up"
          style={{ animationDelay: "0.45s" }}
        >
          <a href="#generate" className="btn-primary text-sm py-4 px-10 gap-3">
            START GENERATING <ArrowRight size={16} />
          </a>
          <a href="#features" className="btn-outline text-sm py-4 px-10">
            EXPLORE FEATURES
          </a>
        </div>

        {/* Stats bar */}
        <div
          className="mt-20 grid grid-cols-3 gap-px bg-border max-w-xl mx-auto animate-slide-up"
          style={{ animationDelay: "0.6s" }}
        >
          {[
            { value: "10M+", label: "GENERATIONS" },
            { value: "50MS", label: "AVG LATENCY" },
            { value: "99.9%", label: "UPTIME" },
          ].map((stat) => (
            <div key={stat.label} className="bg-background p-6 text-center">
              <div className="font-display text-2xl md:text-3xl font-bold">{stat.value}</div>
              <div className="font-mono text-xs tracking-widest mt-1 text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
