import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Intro = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fadeOut, setFadeOut] = useState(false);

  // Auto-navigate after animation completes
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2800);
    const navTimer = setTimeout(() => navigate("/generate"), 3400);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let animId: number;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      o: Math.random() * 0.4 + 0.1,
    }));

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.o})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: "#000",
        transition: "opacity 0.6s ease",
        opacity: fadeOut ? 0 : 1,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
      onClick={() => navigate("/generate")}
    >
      {/* Moving grid background */}
      <style>{`
        @keyframes gridShift { from { transform:translate(0,0); } to { transform:translate(60px,60px); } }
        @keyframes glowPulse { 0%,100% { opacity:.5; transform:scale(1); } 50% { opacity:1; transform:scale(1.15); } }
        @keyframes iconEntry { from { opacity:0; transform:scale(0.3) rotate(-45deg); } to { opacity:1; transform:scale(1) rotate(0deg); } }
        @keyframes drawCircle { from { stroke-dashoffset:220; } to { stroke-dashoffset:0; } }
        @keyframes drawTail { from { opacity:0; transform:scaleX(0); } to { opacity:1; transform:scaleX(1); } }
        @keyframes spinRing { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes textEntry { from { opacity:0; transform:translateX(30px); } to { opacity:1; transform:translateX(0); } }
        @keyframes subEntry { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes lineGrow { from { width:0; } to { width:100%; } }
        @keyframes dotPulse { 0%,100% { opacity:.15; } 50% { opacity:.4; } }

        .intro-grid {
          position:fixed; inset:0; pointer-events:none;
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px);
          background-size:60px 60px;
          animation:gridShift 20s linear infinite;
        }
        .intro-glow {
          position:absolute; width:500px; height:200px;
          background:radial-gradient(ellipse at center,rgba(255,255,255,0.07) 0%,transparent 70%);
          border-radius:50%;
          animation:glowPulse 3s ease-in-out infinite;
        }
        .intro-icon {
          position:relative; width:90px; height:90px; flex-shrink:0;
          animation:iconEntry 1s cubic-bezier(0.16,1,0.3,1) both;
        }
        .q-circle {
          animation:drawCircle 1s 0.2s cubic-bezier(0.65,0,0.35,1) both;
          stroke-dasharray:220; stroke-dashoffset:220;
        }
        .q-tail {
          animation:drawTail 0.5s 0.9s cubic-bezier(0.34,1.56,0.64,1) both;
          transform-origin:38px 52px; opacity:0;
        }
        .q-ring { animation:spinRing 8s linear infinite; transform-origin:40px 40px; }
        .intro-text { animation:textEntry 0.8s 0.6s cubic-bezier(0.16,1,0.3,1) both; opacity:0; }
        .intro-sub { animation:subEntry 0.8s 1.1s cubic-bezier(0.16,1,0.3,1) both; opacity:0; }
        .intro-line {
          position:absolute; bottom:-18px; left:0; height:1px;
          background:linear-gradient(90deg,rgba(255,255,255,0.5),rgba(255,255,255,0.05),transparent);
          animation:lineGrow 0.8s 1.2s cubic-bezier(0.16,1,0.3,1) both; width:0;
        }
        .intro-dot { animation:dotPulse 2s ease-in-out infinite 1.5s; }
      `}</style>

      <div className="intro-grid" />
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none" }} />
      <div className="intro-glow" />

      {/* Logo wrap */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 26, cursor: "pointer" }}>
        {/* Q icon */}
        <div className="intro-icon">
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            <circle className="q-ring" cx="40" cy="40" r="37"
              stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 8" fill="none" />
            <circle className="q-circle" cx="40" cy="40" r="28"
              stroke="white" strokeWidth="7" fill="none" strokeLinecap="round" />
            <line className="q-tail" x1="51" y1="51" x2="65" y2="65"
              stroke="white" strokeWidth="7" strokeLinecap="round" />
            <circle className="intro-dot" cx="40" cy="40" r="4" fill="rgba(255,255,255,0.15)" />
          </svg>
        </div>

        {/* Text */}
        <div style={{ position: "relative", lineHeight: 1, paddingBottom: 20 }}>
          <div className="intro-text" style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "3rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>
              <span style={{ fontWeight: 800 }}>Quick</span>
              <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.75)" }}>WebStack</span>
            </span>
          </div>
          <div className="intro-sub" style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.35em",
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
            marginTop: 6,
          }}>
            web infrastructure · fast
          </div>
          <div className="intro-line" />
        </div>
      </div>

      {/* Click hint */}
      <div style={{
        position: "fixed",
        bottom: "2.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.65rem",
        letterSpacing: "0.2em",
        color: "rgba(255,255,255,0.2)",
        textTransform: "uppercase",
        animation: "subEntry 0.8s 2s both",
      }}>
        Click to skip
      </div>
    </div>
  );
};

export default Intro;
