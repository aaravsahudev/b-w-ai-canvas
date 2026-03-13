import { useEffect, useRef } from "react";
import { Brain, Cpu, Layers, GitBranch, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const metrics = [
  { icon: Brain,     label: "ACTIVE MODELS",    value: "50+",  sub: "Multimodal AI engines" },
  { icon: Cpu,       label: "GPU FLOPS",         value: "4.2 EF", sub: "Distributed compute" },
  { icon: Layers,    label: "PARAMETERS",        value: "1.8T", sub: "Cross-architecture" },
  { icon: GitBranch, label: "PARALLEL THREADS",  value: "256K", sub: "Concurrent inference" },
];

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  layer: number;
  r: number;
  phase: number;
}

interface Pulse {
  edgeIdx: number;
  t: number;
  speed: number;
  opacity: number;
}

const AIPowerSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const setup = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    setup();
    window.addEventListener("resize", setup);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const LAYERS = [4, 5, 6, 5, 4];
    const TOTAL = LAYERS.reduce((a, b) => a + b, 0);

    const getPos = (layerIdx: number, nodeIdx: number): [number, number] => {
      const totalLayers = LAYERS.length;
      const x = ((layerIdx + 1) / (totalLayers + 1)) * W();
      const count = LAYERS[layerIdx];
      const y = ((nodeIdx + 1) / (count + 1)) * H();
      return [x, y];
    };

    const edges: [number, number, number, number][] = [];
    let offset = 0;
    for (let li = 0; li < LAYERS.length - 1; li++) {
      for (let ni = 0; ni < LAYERS[li]; ni++) {
        for (let nj = 0; nj < LAYERS[li + 1]; nj++) {
          edges.push([li, ni, li + 1, nj]);
        }
      }
      offset += LAYERS[li];
    }

    const pulses: Pulse[] = [];
    const spawnPulse = () => {
      const ei = Math.floor(Math.random() * edges.length);
      pulses.push({ edgeIdx: ei, t: 0, speed: 0.012 + Math.random() * 0.01, opacity: 0.6 + Math.random() * 0.4 });
    };

    let spawnTimer = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      tick += 0.008;
      spawnTimer++;

      if (spawnTimer % 6 === 0) spawnPulse();

      for (const e of edges) {
        const [li, ni, lj, nj] = e;
        const [x1, y1] = getPos(li, ni);
        const [x2, y2] = getPos(lj, nj);
        const alpha = 0.04 + 0.04 * Math.sin(tick + li * 0.5 + ni * 0.3);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t > 1) { pulses.splice(i, 1); continue; }

        const [li, ni, lj, nj] = edges[p.edgeIdx];
        const [x1, y1] = getPos(li, ni);
        const [x2, y2] = getPos(lj, nj);
        const px = x1 + (x2 - x1) * p.t;
        const py = y1 + (y2 - y1) * p.t;

        const grd = ctx.createRadialGradient(px, py, 0, px, py, 7);
        grd.addColorStop(0, `rgba(255,255,255,${p.opacity})`);
        grd.addColorStop(0.4, `rgba(255,255,255,${p.opacity * 0.4})`);
        grd.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      for (let li = 0; li < LAYERS.length; li++) {
        for (let ni = 0; ni < LAYERS[li]; ni++) {
          const [x, y] = getPos(li, ni);
          const pulse = (Math.sin(tick * 1.3 + li * 0.8 + ni * 0.5) + 1) / 2;
          const r = 3 + pulse * 2.5;

          const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
          grd.addColorStop(0, `rgba(255,255,255,${0.65 + pulse * 0.35})`);
          grd.addColorStop(0.5, `rgba(255,255,255,${0.2 + pulse * 0.15})`);
          grd.addColorStop(1, "rgba(255,255,255,0)");
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", setup);
    };
  }, []);

  return (
    <section id="ai-power" className="py-32 px-6 border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-6">
          <div>
            <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">AI ENGINE</div>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
              POWERED BY<br />INTELLIGENCE
            </h2>
          </div>
          <p className="font-mono text-xs text-muted-foreground max-w-sm leading-relaxed">
            QuickWebStack runs on a proprietary multi-model AI infrastructure — blending
            the world's most capable language, vision, and reasoning engines into one seamless API.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border mb-px">
          {/* Neural network canvas */}
          <div className="bg-background relative overflow-hidden" style={{ minHeight: 380 }}>
            <div className="absolute top-6 left-6 font-mono text-[10px] tracking-widest text-muted-foreground z-10">
              NEURAL NETWORK · LIVE VISUALIZATION
            </div>
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "100%", minHeight: 380, display: "block" }}
            />
          </div>

          {/* Model stack */}
          <div className="bg-background p-8 md:p-10">
            <div className="font-mono text-[10px] tracking-[0.5em] uppercase mb-6 text-muted-foreground">
              MODEL STACK
            </div>
            <div className="flex flex-col gap-px bg-border">
              {[
                { name: "QWS-ULTRA-V4", type: "Language · Reasoning", load: 94 },
                { name: "QWS-VISION-3", type: "Image · Multimodal",   load: 78 },
                { name: "QWS-CODE-X",   type: "Code · Synthesis",     load: 88 },
                { name: "QWS-AUDIO-2",  type: "Speech · Music",       load: 61 },
                { name: "QWS-AGENT-1",  type: "Autonomous · Planning", load: 72 },
              ].map((model) => (
                <div
                  key={model.name}
                  className="bg-background flex items-center justify-between px-6 py-4 group hover:bg-foreground hover:text-background transition-colors duration-100 cursor-pointer"
                >
                  <div>
                    <div className="font-display text-sm font-bold tracking-tight">{model.name}</div>
                    <div className="font-mono text-[10px] text-muted-foreground group-hover:text-background mt-0.5">{model.type}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-px bg-border relative">
                      <div
                        className="absolute left-0 top-0 h-full bg-foreground group-hover:bg-background transition-colors"
                        style={{ width: `${model.load}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground group-hover:text-background w-8 text-right">
                      {model.load}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {metrics.map((m, i) => (
            <div key={m.label} className="bg-background p-8" style={{ animationDelay: `${i * 0.12}s` }}>
              <m.icon size={18} strokeWidth={1} className="mb-4 text-muted-foreground" />
              <div className="font-display text-3xl font-bold mb-1">{m.value}</div>
              <div className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase mb-0.5">{m.label}</div>
              <div className="font-mono text-[10px] text-muted-foreground opacity-60">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 border border-border p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-3">ACCESS THE FULL POWER</div>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed max-w-md">
              Unlock 50+ AI models, real-time inference, and a developer API built
              for production workloads — all under one unified platform.
            </p>
          </div>
          <button
            onClick={() => navigate("/generate")}
            className="btn-primary text-sm py-5 px-12 gap-3 shrink-0 flex items-center"
          >
            TRY THE AI ENGINE <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default AIPowerSection;
