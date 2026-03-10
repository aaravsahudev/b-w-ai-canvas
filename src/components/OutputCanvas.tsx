import { useState, useEffect } from "react";

interface Generation {
  id: number;
  prompt: string;
  output: string;
  timestamp: string;
}

interface OutputCanvasProps {
  generations: Generation[];
  isGenerating: boolean;
}

const OutputCanvas = ({ generations, isGenerating }: OutputCanvasProps) => {
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 500);
    return () => clearInterval(interval);
  }, []);

  if (generations.length === 0 && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8">
        <div className="font-display text-6xl md:text-8xl font-bold tracking-tighter leading-none text-center">
          <span className="block animate-slide-up">QUICK</span>
          <span className="block animate-slide-up" style={{ animationDelay: "0.1s" }}>WEB</span>
          <span className="block animate-slide-up" style={{ animationDelay: "0.2s" }}>STACK</span>
        </div>
        <p className="font-mono text-xs tracking-[0.3em] mt-8 animate-slide-up" style={{ animationDelay: "0.4s" }}>
          AI GENERATION TERMINAL v1.0
        </p>
        <div className="mt-4 font-mono text-xs animate-slide-up" style={{ animationDelay: "0.5s" }}>
          AWAITING INPUT{cursorVisible ? "█" : " "}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Current / latest generation */}
      {generations.length > 0 && (
        <div className="flex-1 flex flex-col justify-center px-8 animate-slide-up">
          <div className="font-mono text-xs tracking-widest mb-4">
            OUTPUT #{generations[generations.length - 1].id}
          </div>
          <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {generations[generations.length - 1].output}
          </div>
          <div className="font-mono text-xs tracking-widest mt-8">
            {generations[generations.length - 1].timestamp}
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-mono text-lg animate-text-glitch">
            PROCESSING{cursorVisible ? "█" : " "}
          </div>
        </div>
      )}

      {/* Stacked previous generations (Z-axis receding) */}
      {generations.length > 1 && (
        <div className="absolute bottom-4 left-8 right-8">
          <div className="font-mono text-xs tracking-widest opacity-30">
            {generations.length - 1} PREVIOUS GENERATION{generations.length > 2 ? "S" : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default OutputCanvas;
