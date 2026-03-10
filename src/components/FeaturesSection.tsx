import { Zap, Image, Code, FileText, Music, Globe } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "TEXT GENERATION",
    description: "Generate articles, stories, summaries, and creative content with advanced language models.",
  },
  {
    icon: Image,
    title: "IMAGE CREATION",
    description: "Create stunning visuals from text prompts. Photorealistic renders, illustrations, and abstract art.",
  },
  {
    icon: Code,
    title: "CODE SYNTHESIS",
    description: "Generate production-ready code across 50+ languages. Debug, refactor, and optimize instantly.",
  },
  {
    icon: Zap,
    title: "REAL-TIME PROCESSING",
    description: "Sub-50ms inference times with our distributed GPU cluster. No queues, no waiting.",
  },
  {
    icon: Music,
    title: "AUDIO GENERATION",
    description: "Create music, sound effects, and voice synthesis from text descriptions.",
  },
  {
    icon: Globe,
    title: "MULTI-LANGUAGE",
    description: "Generate and translate content across 100+ languages with native-quality output.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground animate-slide-up">
            CAPABILITIES
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight animate-slide-up" style={{ animationDelay: "0.1s" }}>
            BUILT FOR
            <br />
            POWER USERS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="bg-background p-8 group hover:bg-foreground hover:text-background transition-colors duration-150 cursor-default"
            >
              <feature.icon
                size={24}
                strokeWidth={1}
                className="mb-6 group-hover:text-background"
              />
              <h3 className="font-display text-lg font-bold mb-3 tracking-tight">
                {feature.title}
              </h3>
              <p className="font-mono text-xs leading-relaxed text-muted-foreground group-hover:text-background">
                {feature.description}
              </p>
              <div className="mt-6 font-mono text-xs tracking-widest">
                [{String(i + 1).padStart(2, "0")}]
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
