import { useState, useCallback } from "react";
import InputTerminal from "@/components/InputTerminal";
import OutputCanvas from "@/components/OutputCanvas";
import NavOverlay from "@/components/NavOverlay";

interface Generation {
  id: number;
  prompt: string;
  output: string;
  timestamp: string;
}

const SAMPLE_OUTPUTS = [
  "The neural pathways converge at node 7x4a. Pattern recognition complete. Output matrix established across 4,096 dimensional vectors. Confidence: 0.97. The generative model has identified 12 unique structural patterns within the input data, correlating temporal sequences with spatial embeddings.",
  "ANALYSIS COMPLETE\n\nPrimary structure: Hierarchical attention network\nLayers processed: 128\nToken throughput: 47,000/sec\nLatent space dimensionality: 2048\n\nThe model has successfully decomposed the input into its constituent semantic components. Cross-attention scores indicate high relevance across all query dimensions.",
  "Rendering pipeline initialized.\n\nStage 1: Tokenization — COMPLETE\nStage 2: Embedding — COMPLETE\nStage 3: Transformer inference — COMPLETE\nStage 4: Decoding — COMPLETE\n\nFinal output assembled from 16 parallel generation threads. Denoising steps: 50. Classifier-free guidance scale: 7.5.",
];

const Index = () => {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  const handleGenerate = useCallback((prompt: string) => {
    setIsGenerating(true);

    // Simulate AI generation
    const duration = 1500 + Math.random() * 2000;
    setTimeout(() => {
      // Flash invert effect
      setFlashActive(true);
      setTimeout(() => setFlashActive(false), 50);

      const newGen: Generation = {
        id: generations.length + 1,
        prompt,
        output: SAMPLE_OUTPUTS[generations.length % SAMPLE_OUTPUTS.length],
        timestamp: new Date().toISOString().replace("T", " // ").slice(0, 22),
      };
      setGenerations((prev) => [...prev, newGen]);
      setIsGenerating(false);
    }, duration);
  }, [generations.length]);

  return (
    <div
      className={`h-screen w-screen overflow-hidden bg-background text-foreground ${
        flashActive ? "animate-flash" : ""
      }`}
    >
      {/* Split screen layout */}
      <div className="flex h-full">
        {/* Left: Input Terminal */}
        <div className="w-1/2 h-full border-r border-foreground">
          <InputTerminal
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            onMenuOpen={() => setMenuOpen(true)}
          />
        </div>

        {/* Right: Output Canvas */}
        <div className="w-1/2 h-full">
          <OutputCanvas generations={generations} isGenerating={isGenerating} />
        </div>
      </div>

      {/* Navigation Overlay */}
      <NavOverlay isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
};

export default Index;
