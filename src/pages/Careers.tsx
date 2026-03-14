import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin, Clock } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

const roles = [
  {
    dept: "ENGINEERING",
    jobs: [
      { title: "Senior ML Engineer — Inference Optimization",    location: "San Francisco / Remote", type: "FULL-TIME" },
      { title: "Staff Backend Engineer — API Platform",          location: "San Francisco / Remote", type: "FULL-TIME" },
      { title: "Frontend Engineer — Developer Experience",       location: "Remote",                 type: "FULL-TIME" },
      { title: "DevOps Engineer — GPU Infrastructure",           location: "San Francisco",          type: "FULL-TIME" },
    ],
  },
  {
    dept: "RESEARCH",
    jobs: [
      { title: "Research Scientist — Large Language Models",     location: "San Francisco",          type: "FULL-TIME" },
      { title: "Research Engineer — Multi-Modal Systems",        location: "San Francisco / Remote", type: "FULL-TIME" },
    ],
  },
  {
    dept: "PRODUCT & DESIGN",
    jobs: [
      { title: "Senior Product Manager — Developer Platform",    location: "San Francisco / Remote", type: "FULL-TIME" },
      { title: "Product Designer — AI Interfaces",               location: "Remote",                 type: "FULL-TIME" },
    ],
  },
  {
    dept: "GO-TO-MARKET",
    jobs: [
      { title: "Developer Advocate",                             location: "Remote",                 type: "FULL-TIME" },
      { title: "Solutions Engineer — Enterprise",                location: "New York / Remote",       type: "FULL-TIME" },
    ],
  },
];

const perks = [
  { title: "REMOTE FIRST", desc: "Work from anywhere. We have team hubs in SF, NY, and London." },
  { title: "COMPUTE ACCESS", desc: "Unlimited access to our GPU cluster for personal AI projects." },
  { title: "EQUITY", desc: "Meaningful equity packages that reflect the value you bring." },
  { title: "HEALTH & WELLNESS", desc: "Full medical, dental, vision. $200/month wellness stipend." },
  { title: "LEARNING BUDGET", desc: "$3,000 annually for courses, conferences, and books." },
  { title: "ASYNC CULTURE", desc: "No unnecessary meetings. Deep work is a core value." },
];

const Careers = () => {
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
          <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">JOIN US</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">
            CAREERS
          </h1>
          <p className="font-mono text-sm text-muted-foreground max-w-lg leading-relaxed">
            We're building the infrastructure layer for the AI era. If you want to work on hard problems
            with exceptional people, we'd love to hear from you.
          </p>
        </div>

        {/* Perks */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-border mb-16">
          {perks.map((p) => (
            <div key={p.title} className="bg-background p-6">
              <div className="font-mono text-[10px] tracking-widest mb-3 text-foreground">{p.title}</div>
              <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Open roles */}
        <div className="font-mono text-[10px] tracking-[0.5em] uppercase mb-8 text-muted-foreground">OPEN ROLES</div>
        <div className="space-y-0">
          {roles.map((dept) => (
            <div key={dept.dept}>
              <div className="border-t border-border py-4 px-0">
                <span className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground">{dept.dept}</span>
              </div>
              {dept.jobs.map((job) => (
                <div
                  key={job.title}
                  className="border-t border-border py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 group cursor-pointer hover:bg-foreground hover:text-background transition-colors px-4 -mx-4"
                >
                  <div>
                    <div className="font-display text-sm font-bold group-hover:text-background mb-1">{job.title}</div>
                    <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground group-hover:text-background">
                      <span className="flex items-center gap-1"><MapPin size={9} /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock size={9} /> {job.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-muted-foreground group-hover:text-background shrink-0">
                    APPLY <ArrowRight size={10} />
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div className="border-t border-border pt-8 font-mono text-xs text-muted-foreground">
            Don't see a fit? Send us your resume at{" "}
            <span className="text-foreground">careers@quickwebstack.dev</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
