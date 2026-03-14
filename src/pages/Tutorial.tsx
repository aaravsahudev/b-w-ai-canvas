import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, BarChart2, Code2, Image, Mic, Bot } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

const guides = [
  {
    icon: Code2,
    title: "GETTING STARTED",
    level: "BEGINNER",
    time: "5 MIN",
    desc: "Build your first AI-powered website in under 5 minutes with the QuickWebStack workspace.",
    steps: ["Create an account", "Open the workspace", "Enter a prompt", "Export your site"],
  },
  {
    icon: BarChart2,
    title: "USING THE API",
    level: "INTERMEDIATE",
    time: "15 MIN",
    desc: "Integrate QuickWebStack into your own application using the REST API and JavaScript SDK.",
    steps: ["Get your API key", "Install the SDK", "Make your first call", "Handle streaming responses"],
  },
  {
    icon: Image,
    title: "IMAGE GENERATION",
    level: "BEGINNER",
    time: "8 MIN",
    desc: "Generate photorealistic images and illustrations from natural language descriptions.",
    steps: ["Select QWS-VISION-3 model", "Write a descriptive prompt", "Adjust guidance scale", "Download in high resolution"],
  },
  {
    icon: Code2,
    title: "CODE SYNTHESIS",
    level: "INTERMEDIATE",
    time: "20 MIN",
    desc: "Generate, refactor, and debug production-ready code across 50+ programming languages.",
    steps: ["Select QWS-CODE-X", "Describe your function", "Review and iterate", "Export to your editor"],
  },
  {
    icon: Mic,
    title: "VOICE & AUDIO",
    level: "INTERMEDIATE",
    time: "12 MIN",
    desc: "Convert text to natural speech, generate music, and design custom soundscapes.",
    steps: ["Select QWS-AUDIO-2", "Choose voice and style", "Adjust tone and pace", "Export as MP3/WAV"],
  },
  {
    icon: Bot,
    title: "BUILDING AGENTS",
    level: "ADVANCED",
    time: "45 MIN",
    desc: "Create autonomous AI agents that can plan, research, and execute multi-step tasks.",
    steps: ["Configure QWS-AGENT-1", "Define goals and tools", "Set safety constraints", "Deploy and monitor"],
  },
];

const levelColors: Record<string, string> = {
  BEGINNER:     "text-green-400 border-green-400/30",
  INTERMEDIATE: "text-yellow-400 border-yellow-400/30",
  ADVANCED:     "text-red-400 border-red-400/30",
};

const Tutorial = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => navigate("/home")}>
            <AnimatedLogo size={26} />
          </div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={13} /> Back
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="mb-20">
          <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">LEARN</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
            TUTORIALS<br />&amp; GUIDES
          </h1>
          <p className="font-mono text-sm text-muted-foreground max-w-lg leading-relaxed">
            Step-by-step walkthroughs for every capability. From your first prompt to production deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {guides.map((g, i) => (
            <div
              key={g.title}
              className="bg-background p-8 group hover:bg-foreground hover:text-background transition-colors duration-150 cursor-pointer flex flex-col"
            >
              <div className="flex items-start justify-between mb-6">
                <g.icon size={20} strokeWidth={1.2} className="text-muted-foreground group-hover:text-background" />
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[9px] tracking-widest border px-1.5 py-0.5 ${levelColors[g.level]} group-hover:border-background/40 group-hover:text-background`}>
                    {g.level}
                  </span>
                </div>
              </div>

              <h3 className="font-display text-base font-bold mb-2 tracking-tight">{g.title}</h3>
              <div className="flex items-center gap-1.5 mb-4">
                <Clock size={10} className="text-muted-foreground group-hover:text-background" />
                <span className="font-mono text-[10px] text-muted-foreground group-hover:text-background">{g.time} READ</span>
              </div>
              <p className="font-mono text-xs leading-relaxed text-muted-foreground group-hover:text-background mb-6 flex-1">{g.desc}</p>

              <ol className="space-y-1.5 mb-6">
                {g.steps.map((step, si) => (
                  <li key={si} className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground group-hover:text-background">
                    <span className="w-4 h-4 border border-border group-hover:border-background/40 flex items-center justify-center text-[8px] shrink-0">
                      {si + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>

              <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-muted-foreground group-hover:text-background mt-auto">
                START GUIDE <ArrowRight size={10} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
