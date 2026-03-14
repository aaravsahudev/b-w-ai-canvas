import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

const posts = [
  {
    tag: "PRODUCT",
    date: "MAR 10, 2026",
    title: "Introducing QWS-AGENT-1: Autonomous AI That Plans and Executes",
    excerpt: "Today we're launching our most ambitious model yet — an autonomous agent capable of breaking down complex goals into executable steps and completing them without human intervention.",
    readTime: "6 MIN",
    featured: true,
  },
  {
    tag: "ENGINEERING",
    date: "FEB 28, 2026",
    title: "How We Achieved Sub-50ms Inference at Global Scale",
    excerpt: "A deep dive into the infrastructure decisions, GPU cluster topology, and model optimization techniques that power QuickWebStack's real-time inference.",
    readTime: "12 MIN",
    featured: false,
  },
  {
    tag: "RESEARCH",
    date: "FEB 14, 2026",
    title: "Multi-Modal Fusion: Combining Vision and Language in One Request",
    excerpt: "Our research team explains the architecture behind our new multi-modal API and how we handle joint embeddings across text and image inputs.",
    readTime: "9 MIN",
    featured: false,
  },
  {
    tag: "PRODUCT",
    date: "JAN 30, 2026",
    title: "QWS-ULTRA-V4 Is Here: 1.8T Parameters, 128K Context",
    excerpt: "Our most powerful language model ships with an expanded context window, improved factual accuracy, and a new reasoning chain that outperforms GPT-4 on 12 of 14 benchmarks.",
    readTime: "5 MIN",
    featured: false,
  },
  {
    tag: "DEVELOPER",
    date: "JAN 15, 2026",
    title: "Building Production-Grade AI Apps with the QWS JavaScript SDK",
    excerpt: "A practical guide to integrating streaming generation, error handling, retry logic, and cost management into your JavaScript application.",
    readTime: "15 MIN",
    featured: false,
  },
  {
    tag: "COMPANY",
    date: "JAN 2, 2026",
    title: "2026 Roadmap: What We're Building and Why",
    excerpt: "As we enter the new year, our team reflects on 2025's milestones and shares the ambitious plans we have for the next 12 months.",
    readTime: "7 MIN",
    featured: false,
  },
];

const tagColors: Record<string, string> = {
  PRODUCT:     "text-green-400",
  ENGINEERING: "text-blue-400",
  RESEARCH:    "text-purple-400",
  DEVELOPER:   "text-yellow-400",
  COMPANY:     "text-muted-foreground",
};

const Blog = () => {
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
          <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">INSIGHTS</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">BLOG</h1>
          <p className="font-mono text-sm text-muted-foreground max-w-lg leading-relaxed">
            Product updates, engineering deep-dives, AI research, and company news from the QuickWebStack team.
          </p>
        </div>

        {/* Featured post */}
        {posts.filter(p => p.featured).map(post => (
          <div key={post.title} className="bg-foreground text-background p-10 md:p-14 mb-px cursor-pointer group">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[10px] tracking-[0.4em] border border-background/30 px-2 py-1">FEATURED</span>
              <span className={`font-mono text-[10px] tracking-[0.3em] ${tagColors[post.tag]} group-hover:opacity-90`}>{post.tag}</span>
              <span className="font-mono text-[10px] opacity-50">{post.date} · {post.readTime} READ</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4 max-w-3xl leading-tight">{post.title}</h2>
            <p className="font-mono text-sm opacity-75 leading-relaxed max-w-2xl mb-8">{post.excerpt}</p>
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest">
              READ ARTICLE <ArrowRight size={13} />
            </div>
          </div>
        ))}

        {/* Post grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {posts.filter(p => !p.featured).map(post => (
            <div key={post.title} className="bg-background p-8 group hover:bg-foreground hover:text-background transition-colors duration-150 cursor-pointer flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <span className={`font-mono text-[10px] tracking-widest ${tagColors[post.tag]} group-hover:text-background`}>{post.tag}</span>
                <span className="font-mono text-[10px] text-muted-foreground group-hover:text-background opacity-60">{post.date}</span>
              </div>
              <h3 className="font-display text-base font-bold mb-3 leading-snug flex-1">{post.title}</h3>
              <p className="font-mono text-xs text-muted-foreground group-hover:text-background leading-relaxed mb-6">{post.excerpt}</p>
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span className="text-muted-foreground group-hover:text-background">{post.readTime} READ</span>
                <span className="flex items-center gap-1 text-muted-foreground group-hover:text-background tracking-widest">
                  READ <ArrowRight size={10} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
