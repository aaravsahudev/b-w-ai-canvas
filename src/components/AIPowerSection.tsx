import { useEffect, useRef, useState } from "react";
import { Brain, Cpu, Layers, GitBranch, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NODE_COUNT = 22;
const EDGE_PAIRS = [
  [0, 4], [1, 4], [2, 5], [3, 5],
  [4, 8], [4, 9], [5, 9], [5, 10],
  [6, 8], [7, 10],
  [8, 14], [9, 14], [9, 15], [10, 15], [10, 16],
  [11, 14], [12, 15], [13, 16],
  [14, 19], [15, 19], [15, 20], [16, 20],
  [17, 19], [18, 20],
  [19, 21], [20, 21],
];

const LAYER_X = [0.04, 0.18, 0.36, 0.54, 0.72, 0.88, 0.96];
const LAYERS: number[][] = [
  [0, 1, 2, 3],
  [4, 5],
  [6, 7],
  [8, 9, 10],
  [11, 12, 13],
  [14, 15, 16],
  [17, 18],
  [19, 20],
  [21],
];

const flatLayers: number[][] = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18],
  [19, 20, 21],
];

const getNodePos = (
  idx: number,
  layers: number[][],
  w: number,
  h: number
): [number, number] => {
  for (let li = 0; li < layers.length; li++) {
    const layer = layers[li];
    const ni = layer.indexOf(idx);
    if (ni !== -1) {
      const x = ((li + 1) / (layers.length + 1)) * w;
      const y = ((ni + 1) / (layer.length + 1)) * h;
      return [x, y];
    }
  }
  return [w / 2, h / 2];
};

const metrics = [
  { icon: Brain, label: "ACTIVE MODELS", value: "50+", sub: "Multimodal AI engines" },
  { icon: Cpu, label: "GPU FLOPS", value: "4.2 EF", sub: "Distributed compute" },
  { icon: Layers, label: "PARAMETERS", value: "1.8T", sub: "Cross-architecture" },
  { icon: GitBranch, label: "PARALLEL THREADS", value: "256K", sub: "Concurrent inference" },
];

const AIPowerSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const [pulseNode, setPulseNode] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      t += 0.012;

      const positions: [number, number][] = Array.from({ length: NODE_COUNT }, (_, i) =>
        getNodePos(i, flatLayers, W(), H())
      );

      EDGE_PAIRS.forEach(([a, b]) => {
        const [x1, y1] = positions[a];
        const [x2, y2] = positions[b];
        const pulse = (Math.sin(t + a * 0.4 + b * 0.3) + 1) / 2;
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, `rgba(255,255,255,${0.04 + pulse * 0.1})`);
        grad.addColorStop(0.5, `rgba(255,255,255,${0.12 + pulse * 0.2})`);
        grad.addColorStop(1, `rgba(255,255,255,${0.04 + pulse * 0.1})`);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.8 + pulse * 0.6;
        ctx.stroke();
      });

      positions.forEach(([x, y], i) => {
        const pulse = (Math.sin(t * 1.2 + i * 0.7) + 1) / 2;
        const r = 3.5 + pulse * 2;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
        grd.addColorStop(0, `rgba(255,255,255,${0.7 + pulse * 0.3})`);
        grd.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section id="ai-power" className="py-32 px-6 border-t border-border overflow-hidden">
      <style>{`
        @keyframes aiMetricCount {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ai-metric { animation: aiMetricCount 0.6s ease both; }
        @keyframes aiScanLine {
          0%   { top: 0%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .ai-scan { animation: aiScanLine 4s linear infinite; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-6">
          <div>
            <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">
              AI ENGINE
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
              POWERED BY
              <br />
              INTELLIGENCE
            </h2>
          </div>
          <p className="font-mono text-xs text-muted-foreground max-w-sm leading-relaxed">
            QuickWebStack runs on a proprietary multi-model AI infrastructure — blending
            the world's most capable language, vision, and reasoning engines into one seamless API.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border mb-px">
          {/* Neural network canvas */}
          <div className="bg-background relative" style={{ minHeight: 360 }}>
            <div className="absolute inset-0 font-mono text-[10px] tracking-widest text-muted-foreground p-6">
              NEURAL NETWORK · LIVE VISUALIZATION
            </div>
            <div className="ai-scan absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" style={{ position: "absolute" }} />
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "100%", minHeight: 360, display: "block" }}
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
                { name: "QWS-VISION-3", type: "Image · Multimodal", load: 78 },
                { name: "QWS-CODE-X", type: "Code · Synthesis", load: 88 },
                { name: "QWS-AUDIO-2", type: "Speech · Music", load: 61 },
                { name: "QWS-AGENT-1", type: "Autonomous · Planning", load: 72 },
              ].map((model, i) => (
                <div key={model.name} className="bg-background flex items-center justify-between px-6 py-4 group hover:bg-foreground hover:text-background transition-colors duration-100">
                  <div>
                    <div className="font-display text-sm font-bold tracking-tight">{model.name}</div>
                    <div className="font-mono text-[10px] text-muted-foreground group-hover:text-background mt-0.5">
                      {model.type}
                    </div>
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
            <div
              key={m.label}
              className="bg-background p-8 ai-metric"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
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
            <div className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-3">
              ACCESS THE FULL POWER
            </div>
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
