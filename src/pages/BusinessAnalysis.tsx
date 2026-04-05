import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedLogo from "@/components/AnimatedLogo";

/* ─── TYPES ─────────────────────────────────────────────── */
type Mode = "idea" | "financial";
type Page = "home" | "generating" | "report";

interface Metric { label: string; value: string; sub: string }
interface FinCard { label: string; value: string; sub: string }
interface Rival { name: string; founded: string; stage: string; threat: number; funding: string; growth: string; employees: string; revenue: string; strength: string; weakness: string }
interface RiskBar { name: string; score: number }
interface Report {
  name: string; tagline: string; desc: string;
  metrics: Metric[]; fins: FinCard[];
  rivals: Rival[]; risks: RiskBar[];
  swot: { s: string[]; w: string[]; o: string[]; t: string[] };
  chartBars: { label: string; value: number }[];
  recs: string[];
  execSummary: string;
}

/* ─── DATA ──────────────────────────────────────────────── */
const SECTORS = ["All","FinTech","HealthTech","EdTech","Climate Tech","AI / ML","Web3 / Crypto","B2B SaaS","Consumer Apps","Deep Tech","Logistics","AgriTech","PropTech","LegalTech","HRTech","SpaceTech"];
const STEPS_GEN = ["Analysing market signals…","Modelling competitive moat…","Running financial projections…","Mapping risk matrix…","Compiling executive briefing…"];

function rnd(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

function buildReport(prompt: string, sector: string): Report {
  const words = prompt.split(/\s+/);
  const name = words.slice(0, 2).map(w => w[0]?.toUpperCase() + w.slice(1)).join("") + (sector ? `.${sector.split(" ")[0]}` : ".AI");
  const ind = sector || "Technology";

  const rivals: Rival[] = [
    { name:"Nexora Labs",  founded:"2019", stage:"Series B", threat: rnd(70,92), funding:`$${rnd(40,120)}M`, growth:`+${rnd(80,200)}% YoY`, employees:`${rnd(80,300)}`, revenue:`$${rnd(8,30)}M ARR`, strength:"Broad enterprise adoption",    weakness:"Slow product iteration cycle" },
    { name:"Aurum Systems",founded:"2021", stage:"Series A", threat: rnd(48,70), funding:`$${rnd(15,45)}M`,  growth:`+${rnd(40,100)}% YoY`, employees:`${rnd(30,80)}`,  revenue:`$${rnd(2,9)}M ARR`,  strength:"AI-native architecture",        weakness:"Limited go-to-market reach" },
    { name:"Vanta Corp",   founded:"2020", stage:"Seed",     threat: rnd(28,50), funding:`$${rnd(3,15)}M`,   growth:`+${rnd(20,60)}% YoY`,  employees:`${rnd(10,35)}`,  revenue:`$${rnd(0.5,3)}M ARR`, strength:"Niche vertical focus",         weakness:"Undifferentiated pricing" },
  ];

  return {
    name,
    tagline: `Redefining ${ind} through intelligent automation and precision data`,
    desc: `${name} operates at the intersection of ${ind} and next-generation AI infrastructure. The venture targets an underserved segment characterised by high fragmentation, outdated tooling, and a measurable willingness-to-pay among enterprise decision-makers. With a capital-efficient GTM motion and a proprietary data moat, the company is positioned for asymmetric upside.`,
    execSummary: `${name} presents a compelling investment thesis within the ${ind} vertical. Early validation metrics signal strong product-market fit, with a TAM trajectory supporting a $${rnd(2,8)}B+ outcome at full penetration. The primary risk vector is competitive commoditisation, mitigated by the company's proprietary dataset and sticky workflow integrations. Recommended: proceed to diligence with priority focus on unit economics and retention cohorts.`,
    metrics: [
      { label: "Market TAM",    value: `$${rnd(4,48)}B`,   sub: `${ind} addressable market 2026E` },
      { label: "Revenue Run Rate",value:`$${rnd(1,12)}M`,  sub: `+${rnd(40,180)}% YoY growth` },
      { label: "Projected Margin",value:`${rnd(22,68)}%`,  sub: `Gross margin at scale` },
    ],
    fins: [
      { label:"Seed Round Target", value:`$${rnd(1,4)}M`,    sub:`Pre-seed / Seed bridge` },
      { label:"18-mo Runway",      value:`${rnd(14,24)} mo`, sub:`At current burn rate` },
      { label:"Break-even",        value:`Mo ${rnd(18,36)}`, sub:`Conservative projection` },
      { label:"5Y IRR Target",     value:`${rnd(28,55)}×`,   sub:`Venture return multiple` },
    ],
    rivals,
    swot: {
      s: [`Proprietary ${ind} dataset with ${rnd(2,10)}M+ data points — durable competitive moat`, `Founding team combines ${rnd(8,20)} years ${ind} domain expertise with elite engineering talent`, `First-mover position in a niche sub-vertical with high switching costs`],
      w: ["Limited brand awareness versus incumbents; requires significant GTM investment", `Customer concentration risk: top ${rnd(2,5)} accounts represent ${rnd(40,65)}% of ARR`, "Infrastructure scaling costs may compress margins in growth phase prior to Series A"],
      o: [`${ind} regulatory tailwinds in EU/APAC creating immediate demand for compliant solutions`, `Platform expansion opportunity: ${rnd(3,7)} adjacent verticals are addressable with minor product pivots`, `Enterprise software budget migration from legacy systems accelerating post-2024`],
      t: ["Big tech incumbents (AWS, Google, Microsoft) eyeing the space with bundled alternatives", `Macroeconomic tightening may elongate enterprise sales cycles through ${new Date().getFullYear() + 1}`, "Talent market remains hyper-competitive for senior ML engineers and GTM leaders"],
    },
    chartBars: [
      { label:"2023",   value: rnd(10,20) },
      { label:"2024",   value: rnd(22,38) },
      { label:"2025",   value: rnd(40,58) },
      { label:"2026E",  value: rnd(55,75) },
      { label:"2027E",  value: rnd(68,88) },
      { label:"2028E",  value: rnd(80,99) },
    ],
    risks: [
      { name:"Market Risk",        score: rnd(25,55) },
      { name:"Execution Risk",     score: rnd(35,60) },
      { name:"Competitive Risk",   score: rnd(45,70) },
      { name:"Regulatory Risk",    score: rnd(18,48) },
      { name:"Funding Risk",       score: rnd(20,50) },
    ],
    recs: [
      `Accelerate product-led growth: launch a free tier targeting ${rnd(500,2000)} sign-ups in 90 days`,
      `File provisional IP on core ${ind.toLowerCase()} inference engine before entering US/EU markets`,
      `Hire a VP of Sales with ${ind} vertical experience in the next 60 days — critical for Series A narrative`,
      `Establish 2–3 design-partner contracts with named enterprise logos to de-risk diligence`,
    ],
  };
}

/* ─── ROW ANIMATION WRAPPER ─────────────────────────────── */
function Row({ children, delay: d = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <div
      className={`biz-row ${className}`}
      style={{ "--row-delay": `${d}s` } as React.CSSProperties}
    >
      <div className="biz-row-sweep" />
      {children}
    </div>
  );
}

/* ─── THREAT COLOR ───────────────────────────────────────── */
function threatColor(v: number) {
  if (v >= 75) return "#e04040";
  if (v >= 55) return "#d4a843";
  return "#34c97a";
}

/* ─── MAIN COMPONENT ─────────────────────────────────────── */
export default function BusinessAnalysis() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("idea");
  const [page, setPage] = useState<Page>("home");
  const [sector, setSector] = useState("");
  const [prompt, setPrompt] = useState("");
  const [stepIdx, setStepIdx] = useState(-1);
  const [report, setReport] = useState<Report | null>(null);
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user"|"ai"; text: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const generate = async () => {
    if (!prompt.trim()) return;
    setPage("generating");
    for (let i = 0; i < STEPS_GEN.length; i++) {
      setStepIdx(i);
      await delay(480 + i * 90);
    }
    const r = buildReport(prompt, sector);
    setReport(r);
    setPage("report");
    setStepIdx(-1);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const q = chatInput.trim();
    setChatInput("");
    setMessages(m => [...m, { role: "user", text: q }]);
    setTimeout(() => {
      setMessages(m => [...m, { role: "ai", text: `Based on the intelligence report for ${report?.name || "this venture"}, ${q.toLowerCase().includes("risk") ? "the primary risks are execution speed and competitive commoditisation. I recommend maintaining an 18-month runway buffer." : q.toLowerCase().includes("fund") ? "a Series A at a $12–18M round size is achievable after hitting $1.5M ARR with strong retention cohorts." : "the outlook is cautiously optimistic. Focus on narrowing the ICP and optimising CAC payback below 12 months."}` }]);
    }, 900);
  };

  /* ── GOLD ACCENT ── */
  const G = "#c8a96e";
  const GD = "#7a6030";

  return (
    <div style={{ minHeight: "100vh", background: "#0c0c0e", color: "#f7f5f0", fontFamily: "'JetBrains Mono', 'DM Mono', monospace", position: "relative", overflow: "hidden" }}>

      {/* ── GLOBAL CSS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

        /* grain */
        .biz-grain { position:fixed;inset:0;z-index:9990;pointer-events:none;opacity:.022;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }

        /* grid lines bg */
        .biz-grid { position:fixed;inset:0;pointer-events:none;z-index:0;
          background-image:repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(200,169,110,.04) 79px,rgba(200,169,110,.04) 80px),
            repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(200,169,110,.02) 79px,rgba(200,169,110,.02) 80px); }

        /* row sweep animation */
        @keyframes rowIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sweepGold { 0%{transform:translateX(-100%);opacity:0} 40%{opacity:1} 100%{transform:translateX(200%);opacity:0} }
        @keyframes goldShimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes rowGlow { 0%,100%{box-shadow:0 0 0 0 rgba(200,169,110,0)} 50%{box-shadow:0 0 24px 0 rgba(200,169,110,.04)} }
        @keyframes barGrow { from{width:0} to{width:var(--bar-w)} }
        @keyframes threatGrow { from{width:0} to{width:var(--threat-w)} }
        @keyframes pulse { 0%,100%{opacity:.7} 50%{opacity:.2} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes msgIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sectionFade { from{opacity:0} to{opacity:1} }

        .biz-row {
          position:relative;overflow:hidden;
          animation:rowIn .55s cubic-bezier(.22,1,.36,1) both;
          animation-delay:var(--row-delay,0s);
        }
        .biz-row-sweep {
          position:absolute;top:0;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,rgba(200,169,110,.4),transparent);
          animation:sweepGold 5s ease-in-out infinite;
          animation-delay:var(--row-delay,0s);
          pointer-events:none;z-index:10;
        }

        .gold-text { background:linear-gradient(90deg,#7a6030 0%,#f0d080 35%,#c8a96e 50%,#f0d080 65%,#7a6030 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:goldShimmer 4s linear infinite; }

        .serif { font-family:'Cormorant Garamond',serif; }

        /* section cards */
        .biz-card { background:#141418;border:1px solid #252529;padding:22px 24px;position:relative;overflow:hidden; animation:rowGlow 6s ease-in-out infinite; }
        .biz-card::before { content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(180deg,rgba(200,169,110,.6),transparent); }

        /* threat bar */
        .threat-fill { height:100%;position:absolute;left:0;top:0;animation:threatGrow 1.2s cubic-bezier(.22,1,.36,1) forwards; }

        /* advisor panel */
        .advisor-panel { width:0;overflow:hidden;flex-shrink:0;display:flex;flex-direction:column;background:#141418;border-left:1px solid transparent;transition:width .4s cubic-bezier(.22,1,.36,1),border-color .4s; }
        .advisor-panel.open { width:400px;border-color:rgba(255,255,255,.06); }

        /* sector pills */
        .spill { font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:#4a4a55;border:1px solid #252529;background:transparent;padding:5px 12px;cursor:pointer;transition:all .18s;white-space:nowrap; }
        .spill:hover { border-color:rgba(200,169,110,.4);color:#c8a96e;background:rgba(200,169,110,.05); }
        .spill.active { border-color:#c8a96e;color:#0c0c0e;background:#c8a96e; }

        /* risk bar */
        .rb-fill { height:100%;width:0;animation:barGrow .9s cubic-bezier(.22,1,.36,1) forwards;animation-delay:var(--row-delay,.1s); }

        /* msg */
        .chat-msg { animation:msgIn .28s ease; }
      `}</style>

      {/* grain + grid */}
      <div className="biz-grain" />
      <div className="biz-grid" />

      {/* ── NAV ── */}
      <header style={{ position:"fixed",top:0,left:0,right:0,zIndex:300,height:58,padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(12,12,14,.95)",borderBottom:"1px solid rgba(255,255,255,.055)",backdropFilter:"blur(22px)" }}>
        <div style={{ cursor:"pointer" }} onClick={() => navigate("/home")}>
          <AnimatedLogo size={26} />
        </div>

        {/* Mode toggle */}
        <div style={{ display:"flex",background:"#141418",border:"1px solid rgba(255,255,255,.07)",borderRadius:100,padding:3,gap:2,position:"relative" }}>
          <div style={{ position:"absolute",top:3,bottom:3,width:"calc(50% - 3px)",background:"#f7f5f0",borderRadius:100,transition:"transform .35s cubic-bezier(.34,1.56,.64,1)",transform:mode==="financial"?"translateX(calc(100% + 2px))":"none",pointerEvents:"none" }} />
          {(["idea","financial"] as Mode[]).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ position:"relative",zIndex:1,fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:".12em",textTransform:"uppercase",padding:"8px 18px",border:"none",background:"transparent",color:mode===m?"#0c0c0e":"#4a4a55",borderRadius:100,cursor:"pointer",transition:"color .2s",whiteSpace:"nowrap" }}>
              {m === "idea" ? "Startup Ideas" : "Financial Analysis"}
            </button>
          ))}
        </div>

        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".3em",textTransform:"uppercase",color:G }}>QWS-BIZ-4</span>
          {page === "report" && (
            <button onClick={() => setAdvisorOpen(o => !o)} style={{ height:34,display:"flex",alignItems:"center",gap:9,padding:"0 14px",background:"transparent",border:`1px solid rgba(200,169,110,.35)`,color:G,fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:".12em",textTransform:"uppercase",cursor:"pointer",transition:"all .2s" }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:G,opacity:.7,animation:"pulse 2s infinite" }} />
              Advisor
            </button>
          )}
        </div>
      </header>

      {/* ── MAIN CANVAS ── */}
      <div style={{ display:"flex",height:"100vh",paddingTop:58,position:"relative",zIndex:1 }}>

        {/* ── LEFT: MAIN PANEL ── */}
        <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0 }}>

          {/* Scroll area */}
          <div style={{ flex:1,overflowY:"auto",padding:page==="report"?"48px 64px 40px":"0",scrollbarWidth:"thin",scrollbarColor:"#252529 transparent" }}>

            {/* ── HOME ── */}
            {page === "home" && (
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"calc(100vh - 90px)",padding:"52px 24px 48px",textAlign:"center" }}>

                {/* Eyebrow */}
                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".45em",textTransform:"uppercase",color:"#4a4a55",marginBottom:26,display:"flex",alignItems:"center",gap:16 }}>
                  <div style={{ width:28,height:1,background:"#252529" }} />
                  {mode === "idea" ? "Venture Intelligence Studio" : "Financial Analysis Engine"}
                  <div style={{ width:28,height:1,background:"#252529" }} />
                </div>

                {/* Headline */}
                <h1 className="serif" style={{ fontWeight:300,fontStyle:"italic",fontSize:"clamp(36px,5.5vw,72px)",lineHeight:1.08,letterSpacing:"-.01em",color:"#f7f5f0",marginBottom:18 }}>
                  {mode === "idea"
                    ? <>Generate your<br />next <span className="gold-text">billion-dollar</span><br />startup idea.</>
                    : <>Unlock deep<br /><span className="gold-text">financial clarity</span><br />in seconds.</>}
                </h1>

                {/* Subtitle */}
                <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,lineHeight:2,color:"#4a4a55",maxWidth:400,marginBottom:32 }}>
                  {mode === "idea"
                    ? "Describe a problem space. QWS-BIZ-4 generates a full venture brief — with SWOT, competitor intelligence, financial projections, and an AI advisor."
                    : "Enter a company or concept. Receive institutional-grade analysis with risk scoring, revenue modelling, and strategic recommendations."}
                </p>

                {/* Textarea */}
                <div style={{ width:"100%",maxWidth:640,marginBottom:18 }}>
                  <div style={{ border:"1px solid rgba(200,169,110,.25)",background:"#141418",overflow:"hidden",transition:"border-color .2s" }}
                    onFocus={e => (e.currentTarget.style.borderColor="rgba(200,169,110,.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor="rgba(200,169,110,.25)")}>
                    <textarea
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (prompt.trim()) generate(); } }}
                      placeholder={mode === "idea"
                        ? "e.g. A platform that helps small restaurants automate inventory and reduce food waste using AI…"
                        : "e.g. Analyse the financial viability of a SaaS platform for enterprise HR automation in Southeast Asia…"}
                      rows={4}
                      style={{ width:"100%",background:"transparent",border:"none",color:"#f7f5f0",fontFamily:"'JetBrains Mono',monospace",fontSize:12,padding:"18px 20px",outline:"none",resize:"none",caretColor:G,lineHeight:1.8 }}
                    />
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 20px 13px",borderTop:"1px solid rgba(255,255,255,.05)" }}>
                      <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#252529" }}>Be specific — sector, problem, geography and scale</span>
                      <button
                        onClick={generate}
                        disabled={!prompt.trim()}
                        style={{ background:prompt.trim()?G:"transparent",color:prompt.trim()?"#0c0c0e":GD,border:`1px solid ${prompt.trim()?"transparent":"rgba(200,169,110,.2)"}`,fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,letterSpacing:".15em",textTransform:"uppercase",padding:"9px 20px",cursor:prompt.trim()?"pointer":"not-allowed",transition:"all .15s" }}
                        data-testid="biz-analyse-btn"
                      >
                        Analyse →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sector pills inline */}
                <div style={{ display:"flex",flexWrap:"wrap",gap:5,justifyContent:"center",maxWidth:640,marginBottom:36 }}>
                  {SECTORS.map(s => (
                    <button key={s} className={`spill${sector===(s==="All"?"":s)?" active":""}`} onClick={() => setSector(s==="All"?"":s)} data-testid={`sector-${s}`}>
                      {s}
                    </button>
                  ))}
                </div>

                {/* Feature cards */}
                <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"#252529",width:"100%",maxWidth:680 }}>
                  {[
                    { icon:"⬡", label:"SWOT Matrix",    desc:"Strengths, weaknesses, opportunities and threats analysis" },
                    { icon:"◈", label:"Market Sizing",   desc:"TAM, revenue projections and 5-year growth trajectory" },
                    { icon:"◇", label:"Competitors",     desc:"Rival intelligence with threat scores and differentiators" },
                    { icon:"◎", label:"AI Advisor",      desc:"Live chat advisor for strategy, funding and risk guidance" },
                  ].map(f => (
                    <div key={f.label} style={{ background:"#0c0c0e",padding:"18px 16px",textAlign:"left" }}>
                      <div style={{ fontSize:17,marginBottom:10,color:G }}>{f.icon}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:".2em",textTransform:"uppercase",fontWeight:700,marginBottom:7,color:"#f7f5f0" }}>{f.label}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#4a4a55",lineHeight:1.7 }}>{f.desc}</div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* ── GENERATING ── */}
            {page === "generating" && (
              <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"calc(100vh - 160px)",gap:24 }}>
                <div style={{ width:48,height:48,borderRadius:"50%",border:"1px solid #252529",borderTopColor:`rgba(200,169,110,.65)`,animation:"spin 1s linear infinite" }} />
                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:".25em",textTransform:"uppercase",color:"#4a4a55" }}>
                  {STEPS_GEN[stepIdx] || "Compiling report…"}
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:8,minWidth:320 }}>
                  {STEPS_GEN.map((s, i) => (
                    <div key={s} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 16px",border:`1px solid ${i===stepIdx?"rgba(200,169,110,.3)":i<stepIdx?"rgba(255,255,255,.05)":"rgba(255,255,255,.03)"}`,background:i===stepIdx?"rgba(200,169,110,.05)":"transparent",fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:i===stepIdx?G:i<stepIdx?"#4a4a55":"#252529",transition:"all .3s" }}>
                      <div style={{ width:5,height:5,borderRadius:"50%",background:i===stepIdx?G:i<stepIdx?"#4a4a55":"#252529",flexShrink:0 }} />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── REPORT ── */}
            {page === "report" && report && (
              <div style={{ display:"flex",flexDirection:"column",gap:28 }}>

                {/* Name & tagline */}
                <Row delay={0}>
                  <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:14 }}>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".32em",textTransform:"uppercase",color:GD }}>INTELLIGENCE REPORT</div>
                    <div style={{ flex:1,height:1,background:`linear-gradient(90deg,${GD},transparent)` }} />
                  </div>
                  <h2 className="serif" style={{ fontWeight:600,fontSize:"clamp(52px,7vw,88px)",lineHeight:.9,letterSpacing:"-.02em",color:"#f7f5f0",marginBottom:14 }}>{report.name}</h2>
                  <div className="serif" style={{ fontStyle:"italic",fontWeight:300,fontSize:20,color:"#8888a0",lineHeight:1.5,marginBottom:0 }}>{report.tagline}</div>
                </Row>

                {/* Exec summary */}
                <Row delay={0.06}>
                  <div className="biz-card">
                    <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".3em",textTransform:"uppercase",color:"#4a4a55",marginBottom:12 }}>EXECUTIVE SUMMARY</div>
                    <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:2,color:"#d0cec8" }}>{report.execSummary}</p>
                  </div>
                </Row>

                {/* Metrics */}
                <Row delay={0.10}>
                  <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:1,background:"#252529",border:"1px solid #252529" }}>
                    {report.metrics.map(m => (
                      <div key={m.label} className="biz-card" style={{ borderRadius:0,border:"none" }}>
                        <div className="serif" style={{ fontWeight:600,fontSize:42,letterSpacing:"-.01em",display:"block",marginBottom:6,color:"#f7f5f0" }}>{m.value}</div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:"#4a4a55",marginBottom:5 }}>{m.label}</div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:G }}>{m.sub}</div>
                      </div>
                    ))}
                  </div>
                </Row>

                {/* Financial cards */}
                <Row delay={0.14}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".3em",textTransform:"uppercase",color:"#4a4a55",marginBottom:14 }}>FINANCIAL PROJECTIONS</div>
                  <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10 }}>
                    {report.fins.map(f => (
                      <div key={f.label} className="biz-card" style={{ transition:"border-color .2s" }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor="rgba(200,169,110,.22)")}
                        onMouseLeave={e => (e.currentTarget.style.borderColor="#252529")}>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:".28em",textTransform:"uppercase",color:"#4a4a55",marginBottom:9 }}>{f.label}</div>
                        <div className="serif" style={{ fontSize:22,color:"#f7f5f0",lineHeight:1.25 }}>{f.value}</div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#4a4a55",marginTop:6,lineHeight:1.7 }}>{f.sub}</div>
                      </div>
                    ))}
                  </div>
                </Row>

                {/* Growth chart */}
                <Row delay={0.18}>
                  <div className="biz-card">
                    <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:22 }}>
                      <div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".3em",textTransform:"uppercase",color:"#4a4a55",marginBottom:5 }}>MARKET GROWTH</div>
                        <div className="serif" style={{ fontStyle:"italic",fontSize:20,color:"#f7f5f0" }}>Revenue trajectory projection</div>
                      </div>
                      <div style={{ display:"flex",gap:12,alignItems:"center" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:6,fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".08em",color:"#4a4a55",textTransform:"uppercase" }}>
                          <div style={{ width:9,height:9,background:G }} /> Revenue
                        </div>
                      </div>
                    </div>
                    <div style={{ display:"flex",alignItems:"flex-end",gap:8,height:120 }}>
                      {report.chartBars.map((b, i) => (
                        <div key={b.label} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6,height:"100%" }}>
                          <div style={{ flex:1,display:"flex",alignItems:"flex-end",width:"100%" }}>
                            <div style={{ width:"100%",background:`linear-gradient(0deg,${G},rgba(200,169,110,.4))`,borderRadius:"2px 2px 0 0",animation:"barGrow .8s cubic-bezier(.22,1,.36,1) both",animationDelay:`${0.08*i}s`,height:`${b.value}%` }} />
                          </div>
                          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#4a4a55" }}>{b.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".1em",color:"#252529",marginTop:13 }}>Source: QWS-BIZ-4 financial model v2.1 · Projections are estimates</div>
                  </div>
                </Row>

                {/* SWOT */}
                <Row delay={0.22}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".3em",textTransform:"uppercase",color:"#4a4a55",marginBottom:14 }}>SWOT FRAMEWORK</div>
                  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                    {([
                      { key:"s" as const, label:"Strengths",    color:"rgba(52,201,122,.9)" },
                      { key:"w" as const, label:"Weaknesses",   color:"rgba(224,64,64,.9)" },
                      { key:"o" as const, label:"Opportunities",color:G },
                      { key:"t" as const, label:"Threats",      color:"rgba(251,191,36,.9)" },
                    ]).map(({ key, label, color }) => (
                      <div key={key} className="biz-card">
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".3em",textTransform:"uppercase",marginBottom:14,color }}>{label}</div>
                        {report.swot[key].map((item, i) => (
                          <div key={i} style={{ display:"flex",gap:12,padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,.04)",fontFamily:"'JetBrains Mono',monospace",fontSize:11,lineHeight:1.7,color:"#d0cec8" }}>
                            <div style={{ color,fontSize:10,paddingTop:3,flexShrink:0,opacity:.7 }}>◆</div>
                            {item}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </Row>

                {/* Competitors */}
                <Row delay={0.26}>
                  <div style={{ display:"flex",alignItems:"baseline",gap:12,marginBottom:20 }}>
                    <div className="serif" style={{ fontStyle:"italic",fontSize:22,color:"#f7f5f0" }}>Competitive Landscape</div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".25em",textTransform:"uppercase",color:"#4a4a55" }}>{report.rivals.length} key rivals</div>
                  </div>
                  {report.rivals.map((r, i) => (
                    <div key={r.name} style={{ border:"1px solid #252529",background:"#141418",marginBottom:12,overflow:"hidden",transition:"border-color .2s" }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor="rgba(255,255,255,.12)")}
                      onMouseLeave={e => (e.currentTarget.style.borderColor="#252529")}>
                      {/* Threat bar */}
                      <div style={{ height:2,width:"100%",background:"#252529",position:"relative",overflow:"hidden" }}>
                        <div className="threat-fill" style={{ "--threat-w":`${r.threat}%`,"--row-delay":`${0.1+i*0.15}s`,background:threatColor(r.threat) } as React.CSSProperties} />
                      </div>
                      <div style={{ padding:"18px 20px 16px" }}>
                        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:14 }}>
                          <div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:17,letterSpacing:".04em",color:"#f7f5f0",marginBottom:5 }}>{r.name}</div>
                            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".15em",textTransform:"uppercase",color:"#4a4a55" }}>Founded {r.founded}</span>
                              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:".15em",textTransform:"uppercase",border:"1px solid rgba(255,255,255,.1)",padding:"2px 8px",color:"#8888a0" }}>{r.stage}</span>
                            </div>
                          </div>
                          <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",flexShrink:0 }}>
                            <div className="serif" style={{ fontWeight:600,fontSize:32,lineHeight:1,letterSpacing:"-.01em",color:threatColor(r.threat) }}>{r.threat}</div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:".2em",textTransform:"uppercase",color:"#4a4a55",marginTop:2 }}>Threat Score</div>
                          </div>
                        </div>
                        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"#252529",marginBottom:14 }}>
                          {[["Funding",r.funding],["Growth",r.growth],["Team",r.employees],["Revenue",r.revenue]].map(([l,v]) => (
                            <div key={l} style={{ background:"#141418",padding:"10px 12px" }}>
                              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:".2em",textTransform:"uppercase",color:"#4a4a55",marginBottom:5 }}>{l}</div>
                              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:13,color: l==="Growth" ? `rgba(200,169,110,.9)` : "#f7f5f0" }}>{v}</div>
                            </div>
                          ))}
                        </div>
                        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                          <div style={{ padding:"10px 12px",background:"rgba(255,255,255,.03)",border:"1px solid rgba(255,255,255,.06)" }}>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(255,255,255,.35)",marginBottom:5 }}>Strength</div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,lineHeight:1.6,color:"#d0cec8" }}>{r.strength}</div>
                          </div>
                          <div style={{ padding:"10px 12px",background:"rgba(200,169,110,.03)",border:"1px solid rgba(200,169,110,.08)" }}>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(200,169,110,.4)",marginBottom:5 }}>Weakness</div>
                            <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,lineHeight:1.6,color:"#d0cec8" }}>{r.weakness}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Row>

                {/* Risk */}
                <Row delay={0.30}>
                  <div className="biz-card">
                    <div style={{ display:"grid",gridTemplateColumns:"auto 1fr",gap:32,alignItems:"center" }}>
                      <div style={{ display:"flex",flexDirection:"column",alignItems:"center" }}>
                        <div className="serif" style={{ fontWeight:600,fontSize:64,lineHeight:1,letterSpacing:"-.02em",color:G }}>{Math.round(report.risks.reduce((a,r)=>a+r.score,0)/report.risks.length)}</div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".25em",textTransform:"uppercase",color:"#4a4a55",marginTop:6 }}>Risk Score</div>
                        <div className="serif" style={{ fontStyle:"italic",fontSize:15,marginTop:10,textAlign:"center",color:"#8888a0" }}>Moderate</div>
                      </div>
                      <div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".3em",textTransform:"uppercase",color:"#4a4a55",marginBottom:16 }}>RISK BREAKDOWN</div>
                        <div style={{ display:"flex",flexDirection:"column",gap:11 }}>
                          {report.risks.map((rb, i) => (
                            <div key={rb.name}>
                              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:5 }}>
                                <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:".08em",color:"#d0cec8" }}>{rb.name}</span>
                                <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#4a4a55" }}>{rb.score}</span>
                              </div>
                              <div style={{ height:3,background:"#252529",position:"relative",overflow:"hidden" }}>
                                <div className="rb-fill" style={{ "--bar-w":`${rb.score}%`,"--row-delay":`${0.32+i*0.08}s`,background:`linear-gradient(90deg,${GD},${G})` } as React.CSSProperties} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Row>

                {/* Recommendations */}
                <Row delay={0.34}>
                  <div className="biz-card">
                    <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".3em",textTransform:"uppercase",color:GD,marginBottom:16 }}>STRATEGIC RECOMMENDATIONS</div>
                    {report.recs.map((r, i) => (
                      <div key={i} style={{ display:"flex",gap:16,padding:"12px 0",borderBottom:i<report.recs.length-1?"1px solid rgba(255,255,255,.04)":"none" }}>
                        <div className="serif" style={{ fontWeight:600,fontSize:24,lineHeight:1,color:G,flexShrink:0,paddingTop:2 }}>{String(i+1).padStart(2,"0")}</div>
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:12,lineHeight:1.9,color:"#d0cec8" }}>{r}</div>
                      </div>
                    ))}
                  </div>
                </Row>

                {/* Advisor trigger */}
                <Row delay={0.38}>
                  <div style={{ paddingBottom:60 }}>
                    <button onClick={() => setAdvisorOpen(true)} style={{ display:"inline-flex",alignItems:"center",gap:10,background:"#141418",color:G,border:`1px solid rgba(200,169,110,.35)`,fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:".18em",textTransform:"uppercase",padding:"13px 24px",cursor:"pointer",transition:"all .25s" }}
                      onMouseEnter={e => { e.currentTarget.style.background="rgba(200,169,110,.07)"; e.currentTarget.style.borderColor=G; }}
                      onMouseLeave={e => { e.currentTarget.style.background="#141418"; e.currentTarget.style.borderColor="rgba(200,169,110,.35)"; }}>
                      <div style={{ width:6,height:6,borderRadius:"50%",background:G,opacity:.7,animation:"pulse 2s infinite" }} />
                      Open AI Advisor
                    </button>
                  </div>
                </Row>

              </div>
            )}
          </div>

          {/* ── SECTOR PILLS ── (report only) */}
          {page === "report" && (
            <div style={{ display:"flex",flexWrap:"wrap",gap:6,padding:"10px 28px 0",borderTop:"1px solid rgba(255,255,255,.04)",flexShrink:0 }}>
              {SECTORS.map(s => (
                <button key={s} className={`spill${sector===(s==="All"?"":s)?" active":""}`} onClick={() => setSector(s==="All"?"":s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* ── INPUT BAR ── (report only) */}
          {page === "report" && (
            <div style={{ flexShrink:0,borderTop:"1px solid rgba(255,255,255,.07)",padding:"16px 28px 20px",background:"#0c0c0e",position:"relative",zIndex:10 }}>
              <div style={{ display:"flex",alignItems:"stretch",border:"1px solid rgba(255,255,255,.1)",background:"#141418",overflow:"hidden",transition:"border-color .2s" }}
                onFocus={e => (e.currentTarget.style.borderColor="rgba(255,255,255,.22)")}
                onBlur={e => (e.currentTarget.style.borderColor="rgba(255,255,255,.1)")}>
                <input
                  ref={inputRef}
                  type="text"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={e => { if (e.key==="Enter") generate(); }}
                  placeholder={mode==="idea" ? "Describe a problem or market gap to explore…" : "Enter a company, sector, or financial scenario to analyse…"}
                  style={{ flex:1,background:"transparent",border:"none",color:"#f7f5f0",fontFamily:"'JetBrains Mono',monospace",fontSize:12,padding:"16px 20px",outline:"none" }}
                />
                <button onClick={generate} disabled={!prompt.trim()} style={{ background: prompt.trim() ? G : "#252529", color: prompt.trim() ? "#0c0c0e" : "#4a4a55", border:"none", fontFamily:"'JetBrains Mono',monospace", fontWeight:700, fontSize:11, letterSpacing:".14em", textTransform:"uppercase", padding:"0 32px", cursor: prompt.trim() ? "pointer" : "not-allowed", transition:"background .15s", flexShrink:0 }}>
                  {page === "report" ? "Regenerate" : "Analyse"}
                </button>
              </div>
              <div style={{ display:"flex",justifyContent:"space-between",marginTop:9 }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".14em",color:"#252529" }}>Enter ↵ to generate · Select a sector above to filter</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".14em",textTransform:"uppercase",color:"#252529" }}>Model: <span style={{ color:"#4a4a55" }}>QWS-BIZ-4</span></span>
              </div>
            </div>
          )}
        </div>

        {/* ── ADVISOR PANEL ── */}
        <div className={`advisor-panel${advisorOpen?" open":""}`}>
          <div style={{ padding:"22px 26px 18px",borderBottom:"1px solid rgba(255,255,255,.05)",display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexShrink:0 }}>
            <div>
              <div className="serif" style={{ fontWeight:300,fontStyle:"italic",fontSize:22,color:"#f7f5f0" }}>AI Advisor</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:"#4a4a55",marginTop:3,display:"flex",alignItems:"center",gap:7 }}>
                <div style={{ width:16,height:1,background:"#4a4a55" }} />
                Venture Intelligence
              </div>
            </div>
            <button onClick={() => setAdvisorOpen(false)} style={{ background:"none",border:"1px solid rgba(255,255,255,.07)",color:"#8888a0",width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:12,transition:"all .15s" }}>×</button>
          </div>

          <div style={{ flex:1,overflowY:"auto",padding:"20px 26px",display:"flex",flexDirection:"column",gap:14,scrollbarWidth:"thin",scrollbarColor:"#252529 transparent" }}>
            {messages.length === 0 && (
              <div style={{ height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,textAlign:"center" }}>
                <div style={{ width:56,height:56,borderRadius:"50%",border:"1px solid #252529",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"#4a4a55" }}>◑</div>
                <div className="serif" style={{ fontStyle:"italic",fontSize:17,color:"#4a4a55" }}>Ask me anything about this venture</div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,lineHeight:1.9,color:"#252529" }}>Risk factors · Funding strategy<br />Market entry · Team building</div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className="chat-msg">
                <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:7 }}>
                  <div style={{ width:5,height:5,borderRadius:"50%",background:m.role==="ai"?G:"#8888a0" }} />
                  <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:".25em",textTransform:"uppercase",color:"#4a4a55" }}>{m.role==="ai"?"Advisor":"You"}</span>
                </div>
                <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11.5,lineHeight:1.85,padding:"13px 15px",border:`1px solid ${m.role==="ai"?"rgba(255,255,255,.06)":"rgba(255,255,255,.07)"}`,background:m.role==="ai"?"rgba(12,12,14,.5)":"rgba(255,255,255,.04)",color:m.role==="ai"?"#d0cec8":"#f7f5f0",marginLeft:m.role==="user"?22:0,marginRight:m.role==="ai"?22:0,position:"relative" }}>
                  {m.role==="ai" && <div style={{ position:"absolute",left:0,top:0,bottom:0,width:2,background:`linear-gradient(180deg,rgba(200,169,110,.55),transparent)` }} />}
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding:"14px 26px 18px",borderTop:"1px solid rgba(255,255,255,.05)",flexShrink:0 }}>
            <div style={{ display:"flex",border:"1px solid rgba(255,255,255,.08)",background:"rgba(12,12,14,.6)",overflow:"hidden",transition:"border-color .2s" }}>
              <textarea
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();} }}
                placeholder="Ask the advisor…"
                rows={1}
                style={{ flex:1,background:"transparent",border:"none",color:"#f7f5f0",fontFamily:"'JetBrains Mono',monospace",fontSize:11.5,padding:"12px 15px",outline:"none",resize:"none",height:44,lineHeight:1.4 }}
              />
              <button onClick={sendChat} disabled={!chatInput.trim()} style={{ background:"transparent",border:"none",borderLeft:"1px solid rgba(255,255,255,.07)",color:G,fontSize:17,padding:"0 16px",cursor:"pointer",transition:"all .15s",display:"flex",alignItems:"center" }}>→</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
