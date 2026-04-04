import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Download, Copy, CheckCheck } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

type PageState = "home" | "config" | "generating" | "report";

type AnalysisType = "swot" | "market" | "financial" | "competitive" | "full";

const ANALYSIS_TYPES: { value: AnalysisType; label: string; desc: string; icon: string }[] = [
  { value: "swot",        label: "SWOT Analysis",          desc: "Strengths, weaknesses, opportunities & threats", icon: "🧩" },
  { value: "market",      label: "Market Research",         desc: "Market size, TAM/SAM/SOM, growth trends",        icon: "📊" },
  { value: "financial",   label: "Financial Projections",   desc: "Revenue model, cost structure, P&L forecast",    icon: "💰" },
  { value: "competitive", label: "Competitive Analysis",    desc: "Competitor landscape, positioning, moat",        icon: "⚔️" },
  { value: "full",        label: "Full Business Report",    desc: "Complete 360° intelligence briefing",            icon: "📋" },
];

interface KPI { label: string; value: string; change: string; up: boolean }
interface SwotItem { text: string }
interface Swot { strengths: SwotItem[]; weaknesses: SwotItem[]; opportunities: SwotItem[]; threats: SwotItem[] }
interface Competitor { name: string; strength: number; focus: string }
interface ChartBar { label: string; value: number }
interface Report {
  company: string;
  type: AnalysisType;
  overview: string;
  kpis: KPI[];
  swot: Swot;
  competitors: Competitor[];
  chartData: ChartBar[];
  recommendations: string[];
  risks: string[];
  executiveSummary: string;
}

const STEPS = [
  "Scanning market intelligence",
  "Running SWOT framework",
  "Modeling financial projections",
  "Mapping competitive landscape",
  "Compiling executive briefing",
];

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sign(up: boolean) { return up ? "+" : "-"; }

function generateReport(prompt: string, industry: string, type: AnalysisType): Report {
  const words = prompt.split(/\s+/).filter(Boolean);
  const company = words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const ind = industry || "Technology";

  const up1 = rnd(0, 1) === 1;
  const up2 = rnd(0, 1) === 1;
  const up3 = true;
  const up4 = rnd(0, 1) === 1;

  return {
    company,
    type,
    overview: `${company} operates in the ${ind} sector, targeting a rapidly expanding addressable market. The business demonstrates ${up3 ? "strong" : "moderate"} fundamentals with clear differentiation potential. Based on current market vectors and competitive dynamics, the outlook is ${up3 ? "cautiously optimistic" : "mixed"}.`,
    kpis: [
      { label: "Market TAM", value: `$${rnd(2, 48)}B`,    change: `${sign(up1)}${rnd(8, 34)}%`, up: up1 },
      { label: "Growth Rate", value: `${rnd(12, 68)}%`,   change: `${sign(up2)}${rnd(2, 18)}pp`, up: up2 },
      { label: "Revenue Est.", value: `$${rnd(1, 12)}M`,  change: `${sign(up3)}${rnd(15, 55)}%`, up: up3 },
      { label: "Margin Potential", value: `${rnd(18, 62)}%`, change: `${sign(up4)}${rnd(2, 12)}pp`, up: up4 },
    ],
    swot: {
      strengths: [
        { text: `Strong product-market fit in the ${ind} space with differentiated positioning` },
        { text: `Experienced team with deep domain expertise in core ${ind.toLowerCase()} operations` },
        { text: "First-mover advantage in a rapidly emerging sub-category with high barriers to entry" },
      ],
      weaknesses: [
        { text: "Limited brand awareness compared to established incumbents in the space" },
        { text: "Dependency on a small number of key customers creates revenue concentration risk" },
        { text: "Current infrastructure requires significant investment to scale to next growth phase" },
      ],
      opportunities: [
        { text: `${ind} market projected to grow at ${rnd(14, 32)}% CAGR through 2028 — white space available` },
        { text: "Regulatory tailwinds and enterprise digitization trends align with core product value prop" },
        { text: `Partnership potential with complementary ${ind.toLowerCase()} platforms to accelerate distribution` },
      ],
      threats: [
        { text: "Big tech players have begun entering adjacent market segments with bundled solutions" },
        { text: `Macroeconomic headwinds may delay enterprise budget approvals in Q3–Q4 ${new Date().getFullYear()}` },
        { text: "Talent competition for senior engineers and GTM executives remains intense and costly" },
      ],
    },
    competitors: [
      { name: "Market Leader A", strength: rnd(75, 92), focus: "Enterprise scale" },
      { name: "Challenger B",   strength: rnd(55, 74), focus: "SMB segment" },
      { name: "Disruptor C",    strength: rnd(38, 58), focus: "AI-native" },
      { name: company,          strength: rnd(40, 65), focus: "Differentiated niche" },
    ],
    chartData: [
      { label: "2022", value: rnd(12, 25) },
      { label: "2023", value: rnd(24, 40) },
      { label: "2024", value: rnd(38, 58) },
      { label: "2025E",value: rnd(52, 78) },
      { label: "2026E",value: rnd(68, 95) },
      { label: "2027E",value: rnd(80, 99) },
    ],
    recommendations: [
      `Prioritize ${ind} enterprise sales motion — ICP shows highest LTV and lowest churn`,
      "Invest in a content and community flywheel to reduce CAC by 30–40% over 18 months",
      "Explore strategic partnerships with 2–3 complementary platforms for accelerated distribution",
      `File IP protection for core ${ind.toLowerCase()} technology before entering new geographies`,
    ],
    risks: [
      "Market concentration: avoid over-reliance on single verticals or customer segments",
      `${ind} regulatory changes could require rapid product adaptation — monitor EMEA/APAC closely`,
      "Burn rate vs. revenue growth requires close monitoring — maintain 18+ months runway",
    ],
    executiveSummary: `${company} is positioned to capture meaningful share of the ${ind} market through a combination of strong product differentiation and emerging go-to-market traction. The primary strategic priority is scaling the enterprise sales engine while protecting the core innovation moat. Near-term risks are manageable with disciplined execution. Recommended course: accelerate growth investment while maintaining operational efficiency targets.`,
  };
}

export default function BusinessAnalysis() {
  const navigate = useNavigate();
  const [page, setPage] = useState<PageState>("home");
  const [prompt, setPrompt] = useState("");
  const [industry, setIndustry] = useState("");
  const [analysisType, setAnalysisType] = useState<AnalysisType>("full");
  const [report, setReport] = useState<Report | null>(null);
  const [stepIdx, setStepIdx] = useState(-1);
  const [copied, setCopied] = useState(false);

  const ACC = "#22d3ee";

  const generate = async () => {
    setPage("generating");
    for (let i = 0; i < STEPS.length; i++) {
      setStepIdx(i);
      await delay(520 + i * 80);
    }
    const r = generateReport(prompt, industry, analysisType);
    setReport(r);
    setPage("report");
    setStepIdx(-1);
  };

  const copyReport = () => {
    if (!report) return;
    const text = [
      `# ${report.company} — Business Intelligence Report`,
      `\n## Executive Summary\n${report.executiveSummary}`,
      `\n## SWOT Analysis`,
      `### Strengths\n${report.swot.strengths.map(s => `• ${s.text}`).join("\n")}`,
      `### Weaknesses\n${report.swot.weaknesses.map(s => `• ${s.text}`).join("\n")}`,
      `### Opportunities\n${report.swot.opportunities.map(s => `• ${s.text}`).join("\n")}`,
      `### Threats\n${report.swot.threats.map(s => `• ${s.text}`).join("\n")}`,
      `\n## Recommendations\n${report.recommendations.map(r => `• ${r}`).join("\n")}`,
      `\n## Key Risks\n${report.risks.map(r => `• ${r}`).join("\n")}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" style={{ "--biz-acc": ACC } as React.CSSProperties}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background flex items-center justify-between px-6 h-16">
        <div className="cursor-pointer" onClick={() => navigate("/home")}>
          <AnimatedLogo size={26} />
        </div>
        <div className="flex items-center gap-3">
          {page !== "home" && (
            <button
              onClick={() => setPage(page === "report" ? "config" : "home")}
              className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={13} /> Back
            </button>
          )}
          <span className="font-mono text-[10px] tracking-widest border px-2 py-1" style={{ borderColor: `${ACC}40`, color: ACC }}>
            QWS-BIZ-4
          </span>
        </div>
      </nav>

      <div className="flex-1 pt-16">

        {/* ── HOME ── */}
        {page === "home" && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-5 py-16"
            style={{ background: `radial-gradient(ellipse 70% 45% at 50% 0%, ${ACC}12, transparent 60%)` }}>
            <div className="font-mono text-[10px] tracking-[0.5em] uppercase mb-4" style={{ color: ACC }}>
              BUSINESS INTELLIGENCE ENGINE
            </div>
            <h1 className="font-display font-bold tracking-tight text-center mb-5 max-w-3xl leading-none"
              style={{ fontSize: "clamp(2.2rem, 6vw, 5.5rem)" }}>
              Instant business<br />
              <em style={{ fontStyle: "italic", color: ACC }}>intelligence</em>
            </h1>
            <p className="font-mono text-sm text-muted-foreground text-center max-w-md mb-10 leading-relaxed">
              Describe a company or idea — QWS-BIZ-4 generates a complete SWOT,
              competitive landscape, financial projections, and strategic recommendations.
            </p>

            <div className="w-full max-w-2xl mb-4" style={{ borderColor: `${ACC}40` }}>
              <div className="border border-border focus-within:border-opacity-100 transition-colors"
                style={{ "--tw-border-opacity": 1 } as React.CSSProperties}>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. AI-powered logistics startup targeting last-mile delivery in Southeast Asia..."
                  rows={3}
                  className="w-full bg-background text-foreground font-mono text-sm p-5 resize-none outline-none border-0 placeholder:text-muted-foreground"
                  style={{ caretColor: ACC }}
                />
                <div className="flex items-center justify-between px-5 py-3 border-t border-border gap-4">
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="Industry (e.g. Logistics, FinTech, HealthTech...)"
                    className="flex-1 bg-background font-mono text-xs text-foreground outline-none border-0 placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={() => { if (prompt.trim()) setPage("config"); }}
                    disabled={!prompt.trim()}
                    className="shrink-0 flex items-center gap-2 font-mono text-xs px-5 py-2.5 font-bold transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                    style={{ background: ACC, color: "#000" }}
                  >
                    Configure <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border w-full max-w-2xl mt-6">
              {[
                { icon: "🧩", title: "SWOT Matrix",    desc: "4-quadrant strategic strengths & risk framework" },
                { icon: "📊", title: "Market Sizing",  desc: "TAM / SAM / SOM with growth trajectory charts" },
                { icon: "⚔️", title: "Competitors",    desc: "Landscape mapping with positioning analysis" },
                { icon: "🎯", title: "Recommendations",desc: "Actionable strategic moves ranked by impact" },
              ].map((f) => (
                <div key={f.title} className="bg-background p-6">
                  <div className="text-xl mb-3">{f.icon}</div>
                  <div className="font-display text-xs font-bold mb-2">{f.title}</div>
                  <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CONFIG ── */}
        {page === "config" && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-5 py-16">
            <div className="w-full max-w-2xl">
              <div className="font-display text-2xl font-bold mb-2">Choose analysis type</div>
              <p className="font-mono text-xs text-muted-foreground mb-8">Select the intelligence framework to apply</p>

              <div className="flex flex-col gap-2 mb-8">
                {ANALYSIS_TYPES.map((at) => (
                  <button
                    key={at.value}
                    onClick={() => setAnalysisType(at.value)}
                    className="flex items-center gap-4 p-4 border text-left transition-all"
                    style={{
                      borderColor: analysisType === at.value ? ACC : "hsl(var(--border))",
                      background: analysisType === at.value ? `${ACC}08` : "transparent",
                    }}
                  >
                    <div className="text-2xl shrink-0">{at.icon}</div>
                    <div className="flex-1">
                      <div className="font-mono text-sm font-bold mb-0.5">{at.label}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">{at.desc}</div>
                    </div>
                    <div className="w-4 h-4 border shrink-0 flex items-center justify-center"
                      style={{ borderColor: analysisType === at.value ? ACC : "hsl(var(--border))" }}>
                      {analysisType === at.value && (
                        <div className="w-2 h-2" style={{ background: ACC }} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={generate}
                className="w-full py-4 font-mono text-sm font-bold flex items-center justify-center gap-3 transition-all"
                style={{ background: ACC, color: "#000" }}
              >
                Run Analysis <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* ── GENERATING ── */}
        {page === "generating" && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-8">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border border-border rounded-full" />
              <div className="absolute inset-0 rounded-full border-t-2" style={{ borderColor: ACC, animation: "spin 0.8s linear infinite" }} />
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold mb-2">Running intelligence engine…</div>
              <p className="font-mono text-xs text-muted-foreground">QWS-BIZ-4 is compiling your report</p>
            </div>
            <div className="flex flex-col gap-2 w-80">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-3 px-4 py-3 border font-mono text-xs transition-all"
                  style={{
                    borderColor: stepIdx === i ? `${ACC}60` : stepIdx > i ? "hsl(var(--border))" : "hsl(var(--border)/0.3)",
                    background: stepIdx === i ? `${ACC}08` : "transparent",
                    color: stepIdx === i ? ACC : stepIdx > i ? "hsl(var(--muted-foreground))" : "hsl(var(--muted-foreground)/0.3)",
                  }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: stepIdx === i ? ACC : stepIdx > i ? "hsl(var(--muted-foreground)/0.4)" : "hsl(var(--border))" }} />
                  {s}
                </div>
              ))}
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── REPORT ── */}
        {page === "report" && report && (
          <div className="max-w-5xl mx-auto px-5 py-12 space-y-10">
            {/* Report header */}
            <div className="flex items-start justify-between gap-4 border-b border-border pb-6">
              <div>
                <div className="font-mono text-[10px] tracking-[0.4em] uppercase mb-2" style={{ color: ACC }}>
                  INTELLIGENCE REPORT · QWS-BIZ-4
                </div>
                <h2 className="font-display text-3xl font-bold tracking-tight">{report.company}</h2>
                <div className="font-mono text-xs text-muted-foreground mt-1">
                  {ANALYSIS_TYPES.find(a => a.value === report.type)?.label} · Generated {new Date().toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={copyReport}
                  className="flex items-center gap-2 border border-border px-4 py-2.5 font-mono text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                  {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-bold transition-all"
                  style={{ background: ACC, color: "#000" }}>
                  <Download size={12} /> Export
                </button>
              </div>
            </div>

            {/* Executive summary */}
            <div className="border-l-2 pl-5" style={{ borderColor: ACC }}>
              <div className="font-mono text-[9px] tracking-[0.4em] uppercase mb-3" style={{ color: ACC }}>EXECUTIVE SUMMARY</div>
              <p className="font-mono text-sm text-muted-foreground leading-relaxed">{report.executiveSummary}</p>
            </div>

            {/* KPI cards */}
            <div>
              <div className="font-mono text-[9px] tracking-[0.4em] uppercase mb-4 text-muted-foreground">KEY METRICS</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
                {report.kpis.map((kpi) => (
                  <div key={kpi.label} className="bg-background p-5">
                    <div className="font-mono text-[9px] text-muted-foreground tracking-widest uppercase mb-2">{kpi.label}</div>
                    <div className="font-display text-3xl font-bold mb-1">{kpi.value}</div>
                    <div className="font-mono text-xs" style={{ color: kpi.up ? "#34d399" : "#f87171" }}>
                      {kpi.change} YoY
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart + Competitors side by side */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Growth chart */}
              <div className="border border-border p-5">
                <div className="font-mono text-[9px] tracking-[0.4em] uppercase mb-5 text-muted-foreground">MARKET GROWTH TRAJECTORY</div>
                <div className="flex items-end gap-2 h-40">
                  {report.chartData.map((bar) => (
                    <div key={bar.label} className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full rounded-sm transition-all"
                        style={{ height: `${bar.value}%`, background: `linear-gradient(0deg, ${ACC}, ${ACC}80)` }}
                      />
                      <div className="font-mono text-[8px] text-muted-foreground">{bar.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitors */}
              <div className="border border-border p-5">
                <div className="font-mono text-[9px] tracking-[0.4em] uppercase mb-5 text-muted-foreground">COMPETITIVE STRENGTH MAP</div>
                <div className="flex flex-col gap-3">
                  {report.competitors.map((c) => (
                    <div key={c.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold">{c.name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{c.strength}%</span>
                      </div>
                      <div className="h-1.5 bg-border/50">
                        <div
                          className="h-full transition-all"
                          style={{ width: `${c.strength}%`, background: c.name === report.company ? ACC : "hsl(var(--muted-foreground)/0.4)" }}
                        />
                      </div>
                      <div className="font-mono text-[9px] text-muted-foreground mt-0.5">{c.focus}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SWOT */}
            <div>
              <div className="font-mono text-[9px] tracking-[0.4em] uppercase mb-4 text-muted-foreground">SWOT FRAMEWORK</div>
              <div className="grid grid-cols-2 gap-px bg-border">
                {([
                  { key: "strengths",    label: "Strengths",    color: "#34d399" },
                  { key: "weaknesses",   label: "Weaknesses",   color: "#f87171" },
                  { key: "opportunities",label: "Opportunities", color: ACC },
                  { key: "threats",      label: "Threats",      color: "#fbbf24" },
                ] as const).map((q) => (
                  <div key={q.key} className="bg-background p-5">
                    <div className="font-mono text-[9px] tracking-widest uppercase mb-4 font-bold" style={{ color: q.color }}>
                      {q.label}
                    </div>
                    <div className="flex flex-col gap-3">
                      {report.swot[q.key].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full shrink-0 mt-1.5" style={{ background: q.color }} />
                          <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations + Risks */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-border p-5">
                <div className="font-mono text-[9px] tracking-[0.4em] uppercase mb-4" style={{ color: ACC }}>
                  STRATEGIC RECOMMENDATIONS
                </div>
                <div className="flex flex-col gap-3">
                  {report.recommendations.map((r, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="font-mono text-[10px] font-bold shrink-0 mt-0.5" style={{ color: ACC }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">{r}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-border p-5">
                <div className="font-mono text-[9px] tracking-[0.4em] uppercase mb-4 text-[#f87171]">
                  KEY RISKS
                </div>
                <div className="flex flex-col gap-3">
                  {report.risks.map((r, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="font-mono text-[10px] font-bold shrink-0 mt-0.5 text-[#f87171]">⚠</div>
                      <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">{r}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6 flex items-center justify-between">
              <span className="font-mono text-[10px] text-muted-foreground">Generated by QWS-BIZ-4 · QuickWebStack Intelligence Engine</span>
              <button onClick={() => { setPage("home"); setReport(null); }}
                className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                New Analysis →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
