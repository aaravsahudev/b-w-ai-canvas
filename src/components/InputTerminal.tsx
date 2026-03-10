import { useState, useRef, useEffect } from "react";
import AsciiCipher from "./AsciiCipher";
import logo from "@/assets/logo.png";

interface InputTerminalProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  onMenuOpen: () => void;
}

const InputTerminal = ({ onGenerate, isGenerating, onMenuOpen }: InputTerminalProps) => {
  const [prompt, setPrompt] = useState("");
  const [cipherActive, setCipherActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating) return;
    setCipherActive(true);
    setTimeout(() => {
      setCipherActive(false);
      onGenerate(prompt);
      setPrompt("");
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  useEffect(() => {
    setLineCount(prompt.split("\n").length);
  }, [prompt]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-foreground">
        <img src={logo} alt="QuickWebStack" className="h-6" />
        <button
          onClick={onMenuOpen}
          className="bg-background text-foreground border border-foreground w-12 h-12 flex items-center justify-center cursor-pointer text-2xl font-display hover:bg-foreground hover:text-background transition-none"
        >
          +
        </button>
      </div>

      {/* Terminal body */}
      <div className="flex-1 flex flex-col justify-end p-6">
        {/* Status line */}
        <div className="font-mono text-xs tracking-[0.3em] mb-6">
          {isGenerating ? "STATUS: GENERATING" : "STATUS: READY"}
        </div>

        {/* Prompt display with cipher */}
        {cipherActive && prompt && (
          <div className="font-mono text-lg mb-6">
            <AsciiCipher text={prompt} isActive={cipherActive} />
          </div>
        )}

        {/* Line numbers + textarea */}
        <div className="flex gap-4 mb-6">
          <div className="font-mono text-xs select-none pt-4">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="leading-6">
                {String(i + 1).padStart(3, "0")}
              </div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ENTER PROMPT_"
            className="terminal-input resize-none flex-1 min-h-[120px]"
            rows={Math.max(3, lineCount)}
            disabled={isGenerating}
          />
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="btn-generate w-full disabled:opacity-20 disabled:cursor-not-allowed"
        >
          {isGenerating ? "PROCESSING..." : "GENERATE →"}
        </button>

        {/* Footer meta */}
        <div className="flex justify-between mt-6 font-mono text-xs tracking-widest">
          <span>QUICKWEBSTACK</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default InputTerminal;
