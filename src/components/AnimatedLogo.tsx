const AnimatedLogo = ({ size = 32 }: { size?: number }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3, flexShrink: 0 }}>
      <style>{`
        @keyframes navSpinRing {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes navSpinRingRev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes navCircleGlow {
          0%, 100% { stroke-opacity: 0.8; }
          50%       { stroke-opacity: 1; }
        }
        @keyframes navTailPulse {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1; }
        }
        @keyframes navDotPulse {
          0%, 100% { r: 3; opacity: 0.2; }
          50%       { r: 4.5; opacity: 0.5; }
        }
        .nav-q-ring-outer {
          animation: navSpinRing 10s linear infinite;
          transform-origin: 40px 40px;
        }
        .nav-q-ring-inner {
          animation: navSpinRingRev 6s linear infinite;
          transform-origin: 40px 40px;
        }
        .nav-q-circle { animation: navCircleGlow 2.5s ease-in-out infinite; }
        .nav-q-tail   { animation: navTailPulse 2.5s ease-in-out infinite 0.4s; }
        .nav-q-dot    { animation: navDotPulse 2.5s ease-in-out infinite; }
      `}</style>

      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: size, height: size, overflow: "visible", flexShrink: 0 }}
      >
        <circle
          className="nav-q-ring-outer"
          cx="40" cy="40" r="37"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="1"
          strokeDasharray="3 9"
          fill="none"
        />
        <circle
          className="nav-q-ring-inner"
          cx="40" cy="40" r="31"
          stroke="currentColor"
          strokeOpacity="0.08"
          strokeWidth="0.5"
          strokeDasharray="2 6"
          fill="none"
        />
        <circle
          className="nav-q-circle"
          cx="40" cy="40" r="24"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <line
          className="nav-q-tail"
          x1="57" y1="57" x2="68" y2="68"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle className="nav-q-dot" cx="40" cy="40" r="3" fill="currentColor" fillOpacity="0.25" />
      </svg>

      <span style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 800,
        fontSize: size * 0.56,
        letterSpacing: "-0.025em",
        whiteSpace: "nowrap",
        lineHeight: 1,
      }}>
        Quick<span style={{ fontWeight: 400, opacity: 0.65 }}>WebStack</span>
      </span>
    </div>
  );
};

export default AnimatedLogo;
