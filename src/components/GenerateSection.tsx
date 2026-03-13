import { useState, useEffect, useCallback } from "react";
import { Send, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>?/|";

const SAMPLE_OUTPUTS = [
  `> ANALYSIS COMPLETE

Primary structure: Hierarchical attention network
Layers processed: 128
Token throughput: 47,000/sec
Latent space dimensionality: 2048

The model has successfully decomposed the input into its constituent semantic components. Cross-attention scores indicate high relevance across all query dimensions.`,
  `> GENERATION PIPELINE ACTIVE

Stage 1: Tokenization ............. COMPLETE
Stage 2: Embedding ................ COMPLETE
Stage 3: Transformer Inference .... COMPLETE
Stage 4: Decoding ................. COMPLETE

Final output assembled from 16 parallel generation threads.
Denoising steps: 50 | Guidance scale: 7.5
Quality score: 0.94`,
  `> NEURAL SYNTHESIS REPORT

Input tokens: 342
Output tokens: 1,847
Model: QWS-Ultra-v4
Temperature: 0.7
Top-p: 0.95

The generative model identified 12 unique structural patterns, correlating temporal sequences with spatial embeddings across 4,096 dimensional vectors.`,
];

const GenerateSection = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [showCipher, setShowCipher] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [genCount, setGenCount] = useState(0);

  useEffect(() => {
    if (!showCipher || !prompt) return;
    const interval = setInterval(() => {
      setCipherText(
        prompt.split("").map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join("")
      );
    }, 30);
    return () => clearInterval(interval);
  }, [showCipher, prompt]);

  const handleGenerate = useCallback(() => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setShowCipher(true);
    setOutput("");

    setTimeout(() => {
      setShowCipher(false);
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 50);

      const result = SAMPLE_OUTPUTS[genCount % SAMPLE_OUTPUTS.length];
      setOutput(result);
      setGenCount((c) => c + 1);
      setIsGenerating(false);
      setPrompt("");
    }, 2000);
  }, [prompt, isGenerating, genCount]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <section
      id="generate"
      className={`py-32 px-6 border-t border-border ${flashActive ? "animate-flash" : ""}`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">
              TERMINAL
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
              GENERATE NOW
            </h2>
          </div>
          <button
            onClick={() => navigate("/generate")}
            className="btn-primary text-sm py-4 px-10 gap-3 flex items-center w-fit shrink-0"
          >
            OPEN FULL IDE <ArrowRight size={14} />
          </button>
        </div>

        {/* Terminal window */}
        <div className="border border-border">
          <div className="border-b border-border px-6 py-3 flex items-center justify-between">
            <div className="font-mono text-xs tracking-widest text-muted-foreground">
              QWS://TERMINAL
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 border border-border" />
              <div className="w-3 h-3 border border-border" />
              <div className="w-3 h-3 bg-foreground" />
            </div>
          </div>

          <div className="min-h-[300px] p-6 border-b border-border">
            {!output && !isGenerating && (
              <div className="flex items-center justify-center h-[250px]">
                <div className="text-center">
                  <div className="font-display text-2xl font-bold mb-2">AWAITING INPUT</div>
                  <div className="font-mono text-xs text-muted-foreground tracking-widest">
                    ENTER A PROMPT TO BEGIN GENERATION
                  </div>
                </div>
              </div>
            )}
            {showCipher && (
              <div className="font-mono text-sm animate-cipher leading-relaxed">{cipherText}</div>
            )}
            {isGenerating && !showCipher && (
              <div className="font-mono text-sm animate-text-glitch">PROCESSING...</div>
            )}
            {output && !isGenerating && (
              <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap animate-slide-up">
                {output}
              </pre>
            )}
          </div>

          <div className="flex">
            <div className="flex-1 relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">{">"}</span>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your prompt..."
                className="terminal-input pl-12 pr-6 min-h-[60px] resize-none border-0 bg-background"
                rows={1}
                disabled={isGenerating}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="btn-primary px-8 border-l border-border disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>
        </div>

        <div className="flex justify-between mt-4 font-mono text-xs tracking-widest text-muted-foreground">
          <span>MODEL: QWS-ULTRA-V4</span>
          <span>GENERATIONS: {genCount}</span>
        </div>
      </div>
    </section>
  );
};

export default GenerateSection;
