import { useLocation } from "react-router-dom";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <>
      <style>{`
        @keyframes ptFadeUp {
          0%   { opacity: 0; transform: translateY(22px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes ptScanLine {
          0%   { transform: scaleX(0); transform-origin: left; }
          50%  { transform: scaleX(1); transform-origin: left; }
          51%  { transform-origin: right; }
          100% { transform: scaleX(0); transform-origin: right; }
        }
        .pt-wrapper {
          animation: ptFadeUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
          min-height: 100vh;
        }
        .pt-scan {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: rgba(255,255,255,0.35);
          z-index: 9999;
          pointer-events: none;
          animation: ptScanLine 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
      <div className="pt-scan" key={`scan-${location.pathname}`} />
      <div className="pt-wrapper" key={location.pathname}>
        {children}
      </div>
    </>
  );
};

export default PageTransition;
