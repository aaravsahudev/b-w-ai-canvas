import {
  FileText,
  Image,
  Code,
  Zap,
  Music,
  Globe,
  Cpu,
  Shield,
  Layers,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "TEXT GENERATION",
    desc: "Articles, stories, summaries and creative writing powered by state-of-the-art language models.",
  },
  {
    icon: Image,
    title: "IMAGE CREATION",
    desc: "Generate photorealistic images, illustrations, and concept art from text descriptions.",
  },
  {
    icon: Code,
    title: "CODE SYNTHESIS",
    desc: "Production-ready code in 50+ languages. Debug, refactor, and optimize in seconds.",
  },
  {
    icon: Zap,
    title: "REAL-TIME SPEED",
    desc: "Sub-50ms inference on distributed GPU clusters. Zero queues, zero downtime.",
  },
  {
    icon: Music,
    title: "AUDIO & VOICE",
    desc: "Music composition, sound design, and natural voice synthesis from text prompts.",
  },
  {
    icon: Globe,
    title: "100+ LANGUAGES",
    desc: "Generate and translate content with native-quality output across all major languages.",
  },
  {
    icon: Cpu,
    title: "CUSTOM MODELS",
    desc: "Fine-tune and deploy custom AI models trained on your own data and workflows.",
  },
  {
    icon: Shield,
    title: "ENTERPRISE SECURITY",
    desc: "SOC-2 compliant infrastructure with end-to-end encryption and data isolation.",
  },
  {
    icon: Layers,
    title: "API ACCESS",
    desc: "RESTful API with SDKs for Python, JavaScript, Go, and Rust. Build anything.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-6">
          <div>
            <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">
              CAPABILITIES
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
              EVERYTHING
              <br />
              YOU NEED
            </h2>
          </div>
          <p className="font-mono text-xs text-muted-foreground max-w-sm leading-relaxed">
            One platform, unlimited creative power. QuickWebStack combines the
            best AI models into a single, blazing-fast interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-background p-8 md:p-10 group hover:bg-foreground hover:text-background transition-colors duration-150 cursor-default"
            >
              <div className="flex items-center justify-between mb-6">
                <f.icon
                  size={22}
                  strokeWidth={1.2}
                  className="group-hover:text-background"
                />
                <span className="font-mono text-xs text-muted-foreground group-hover:text-background">
                  [{String(i + 1).padStart(2, "0")}]
                </span>
              </div>
              <h3 className="font-display text-base font-bold mb-3 tracking-tight">
                {f.title}
              </h3>
              <p className="font-mono text-xs leading-relaxed text-muted-foreground group-hover:text-background">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
