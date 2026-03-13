import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

const team = [
  { name: "Alex Chen", role: "CEO & Co-Founder", bio: "Former ML Lead at OpenAI. Stanford CS PhD." },
  { name: "Mia Russo", role: "CTO & Co-Founder", bio: "Built inference infrastructure at Scale AI." },
  { name: "Sam Park", role: "Head of Research", bio: "10 years in generative model development." },
  { name: "Jordan Kim", role: "VP of Product", bio: "Previously led product at Vercel and Linear." },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => navigate("/home")}>
            <AnimatedLogo size={26} />
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={13} /> Back
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="mb-20">
          <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">ABOUT US</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
            BUILDING THE<br />AI FUTURE
          </h1>
          <p className="font-mono text-sm text-muted-foreground max-w-2xl leading-relaxed">
            QuickWebStack was founded in 2024 with a single mission: make the world's most powerful AI
            infrastructure accessible to every creator, developer, and business — at any scale.
          </p>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border mb-px">
          <div className="bg-background p-10 md:p-16">
            <div className="font-mono text-[10px] tracking-[0.5em] uppercase mb-4 text-muted-foreground">MISSION</div>
            <h2 className="font-display text-3xl font-bold tracking-tight mb-6">DEMOCRATIZE AI GENERATION</h2>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              We believe the best AI tools should be available to everyone — not just well-funded labs. 
              Our infrastructure-first approach means developers get production-grade models without 
              the complexity of managing GPU clusters or inference pipelines.
            </p>
          </div>
          <div className="bg-foreground text-background p-10 md:p-16">
            <div className="font-mono text-[10px] tracking-[0.5em] uppercase mb-4 opacity-60">VISION</div>
            <h2 className="font-display text-3xl font-bold tracking-tight mb-6">ONE PLATFORM, INFINITE CREATION</h2>
            <p className="font-mono text-xs leading-relaxed opacity-75">
              A world where any idea can be instantly materialized — text, images, code, audio — through a
              single unified API. No configuration. No infrastructure headaches. Just pure creative output.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mb-24">
          {[
            { value: "2024", label: "FOUNDED" },
            { value: "10M+", label: "GENERATIONS" },
            { value: "180K+", label: "DEVELOPERS" },
            { value: "99.9%", label: "UPTIME" },
          ].map((s) => (
            <div key={s.label} className="bg-background p-8 text-center">
              <div className="font-display text-3xl md:text-4xl font-bold mb-2">{s.value}</div>
              <div className="font-mono text-[10px] tracking-widest text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="mb-16">
          <div className="font-mono text-xs tracking-[0.5em] uppercase mb-10 text-muted-foreground">TEAM</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {team.map((member) => (
              <div key={member.name} className="bg-background p-8">
                <div className="w-12 h-12 border border-border flex items-center justify-center font-display text-xl font-bold mb-6">
                  {member.name[0]}
                </div>
                <div className="font-display text-sm font-bold mb-1">{member.name}</div>
                <div className="font-mono text-[10px] text-muted-foreground mb-3 tracking-wide">{member.role}</div>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
