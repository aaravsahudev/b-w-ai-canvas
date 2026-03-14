import { useEffect, useRef } from "react";
import { Brain, Cpu, Layers, GitBranch, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const metrics = [
  { icon: Brain,     label: "ACTIVE MODELS",    value: "50+",    sub: "Multimodal AI engines" },
  { icon: Cpu,       label: "GPU FLOPS",         value: "4.2 EF", sub: "Distributed compute" },
  { icon: Layers,    label: "PARAMETERS",        value: "1.8T",   sub: "Cross-architecture" },
  { icon: GitBranch, label: "PARALLEL THREADS",  value: "256K",   sub: "Concurrent inference" },
];

interface NodeItem {
  x: number; y: number;
  tx: number; ty: number;
  layer: number;
  phase: number;
  shimSpeed: number;
  targets: { x: number; y: number }[];
  targetIdx: number;
  morphT: number;
  morphSpeed: number;
  waitTimer: number;
}

interface Pulse {
  from: number;
  to: number;
  t: number;
}

const LAYER_DEF = [3, 4, 4, 3];
const MIN_DIST = 70;

const AIPowerSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let pulseTimer: ReturnType<typeof setInterval>;

    const setup = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    setup();
    window.addEventListener("resize", setup);

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    const randTarget = () => ({
      x: W() * 0.08 + Math.random() * W() * 0.84,
      y: H() * 0.1  + Math.random() * H() * 0.8,
    });

    const nodes: NodeItem[] = [];
    const connections: { from: number; to: number }[] = [];
    const pulses: Pulse[] = [];

    const padX = W() * 0.18;
    const layerGap = (W() - padX * 2) / (LAYER_DEF.length - 1);

    LAYER_DEF.forEach((count, li) => {
      const x = padX + layerGap * li;
      const nodeGap = H() / (count + 1);
      for (let ni = 0; ni < count; ni++) {
        const ox = x, oy = nodeGap * (ni + 1);
        const targets = Array.from({ length: 6 }, randTarget);
        targets.unshift({ x: ox, y: oy });
        nodes.push({
          x: ox, y: oy,
          tx: ox, ty: oy,
          layer: li,
          phase: Math.random() * Math.PI * 2,
          shimSpeed: 0.008 + Math.random() * 0.006,
          targets,
          targetIdx: 0,
          morphT: 0,
          morphSpeed: 0.0012 + Math.random() * 0.001,
          waitTimer: Math.random() * 300,
        });
      }
    });

    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (b.layer === a.layer + 1) connections.push({ from: i, to: j });
      });
    });

    const spawnPulse = () => {
      const c = connections[Math.floor(Math.random() * connections.length)];
      if (!pulses.find(p => p.from === c.from && p.to === c.to && p.t < 0.1)) {
        pulses.push({ from: c.from, to: c.to, t: 0 });
      }
    };
    pulseTimer = setInterval(spawnPulse, 120);

    const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());

      // Update target positions
      nodes.forEach(n => {
        if (n.waitTimer > 0) { n.waitTimer--; }
        else {
          n.morphT += n.morphSpeed;
          if (n.morphT >= 1) {
            n.morphT = 0;
            n.targetIdx = (n.targetIdx + 1) % n.targets.length;
            if (Math.random() < 0.4) {
              const ri = 1 + Math.floor(Math.random() * (n.targets.length - 1));
              n.targets[ri] = randTarget();
            }
            n.waitTimer = 120 + Math.random() * 200;
          }
          const from = n.targets[n.targetIdx];
          const to   = n.targets[(n.targetIdx + 1) % n.targets.length];
          const e    = easeInOut(n.morphT);
          n.tx = from.x + (to.x - from.x) * e;
          n.ty = from.y + (to.y - from.y) * e;
        }
      });

      // Repulsion — keep nodes apart
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
          if (dist < MIN_DIST) {
            const force = (MIN_DIST - dist) / MIN_DIST * 0.5;
            const nx = (dx / dist) * force, ny = (dy / dist) * force;
            a.tx -= nx; a.ty -= ny;
            b.tx += nx; b.ty += ny;
          }
        }
      }

      // Clamp + lerp
      nodes.forEach(n => {
        n.tx = Math.max(20, Math.min(W() - 20, n.tx));
        n.ty = Math.max(20, Math.min(H() - 20, n.ty));
        n.x += (n.tx - n.x) * 0.03;
        n.y += (n.ty - n.y) * 0.03;
      });

      // Lines
      connections.forEach(c => {
        const a = nodes[c.from], b = nodes[c.to];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += 0.008;
        if (p.t >= 1) { pulses.splice(i, 1); continue; }
        const a = nodes[p.from], b = nodes[p.to];
        const px = a.x + (b.x - a.x) * p.t;
        const py = a.y + (b.y - a.y) * p.t;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.sin(p.t * Math.PI) * 0.9})`;
        ctx.fill();
      }

      // Nodes with dim & shine
      nodes.forEach(n => {
        n.phase += n.shimSpeed;
        const glow = 0.5 + 0.5 * Math.sin(n.phase);
        ctx.beginPath();
        ctx.arc(n.x, n.y, 8 + 3 * glow, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,255,255,${0.08 + 0.14 * glow})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.4 + 0.55 * glow})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(pulseTimer);
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
              style={{ width: "100%", height: "100%", minHeight: 380, display: "block", background: "#000" }}
            />
          </div>

          {/* Model stack */}
          <div className="bg-background p-8 md:p-10">
            <div className="font-mono text-[10px] tracking-[0.5em] uppercase mb-6 text-muted-foreground">
              MODEL STACK
            </div>
            <div className="flex flex-col gap-px bg-border">
              {[
                { name: "QWS-ULTRA-V4", type: "Language · Reasoning",  load: 94 },
                { name: "QWS-VISION-3", type: "Image · Multimodal",    load: 78 },
                { name: "QWS-CODE-X",   type: "Code · Synthesis",      load: 88 },
                { name: "QWS-AUDIO-2",  type: "Speech · Music",        load: 61 },
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