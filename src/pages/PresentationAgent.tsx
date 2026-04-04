import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Download, ChevronLeft, ChevronRight, Maximize2, X, Edit3 } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";
import { generateSlides, THEMES, type SlideData, type Theme, type ThemeKey } from "@/agents/pptAgent";

type PageState = "home" | "config" | "generating" | "viewer";

const STYLES = [
  { value: "professional", label: "Executive / Corporate" },
  { value: "startup",      label: "Startup Pitch" },
  { value: "creative",     label: "Creative & Editorial" },
  { value: "academic",     label: "Academic / Research" },
  { value: "minimal",      label: "Minimal & Clean" },
];

const SLIDE_COUNTS = [5, 7, 10, 12];

const STEPS = [
  "Analyzing prompt structure",
  "Composing slide content",
  "Rendering layouts & themes",
  "Preparing PPTX export",
];

export default function PresentationAgent() {
  const navigate = useNavigate();
  const [page, setPage] = useState<PageState>("home");
  const [prompt, setPrompt] = useState("");
  const [slideCount, setSlideCount] = useState(7);
  const [style, setStyle] = useState("professional");
  const [theme, setTheme] = useState<ThemeKey>("midnight");
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [current, setCurrent] = useState(0);
  const [step, setStep] = useState(-1);
  const [fullscreen, setFullscreen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const t = THEMES[theme];
  const slide = slides[current];

  const generate = async () => {
    setPage("generating");
    setStep(0);
    await delay(600); setStep(1);
    await delay(500); setStep(2);
    const generated = generateSlides(prompt, slideCount, style);
    await delay(400); setStep(3);
    await delay(300);
    setSlides(generated);
    setCurrent(0);
    setPage("viewer");
    setStep(-1);
  };

  const downloadPPTX = async () => {
    try {
      const PptxGenJS = (await import("pptxgenjs")).default;
      const pptx = new PptxGenJS();
      pptx.layout = "LAYOUT_16x9";

      slides.forEach((s) => {
        const slide = pptx.addSlide();
        const bg = t.dark.replace("#", "");
        const ac = t.accent.replace("#", "");
        const tx = t.text.replace("#", "");

        slide.background = { color: bg };

        slide.addShape(pptx.ShapeType.rect, {
          x: 0, y: 0, w: "100%", h: 0.06, fill: { color: ac }, line: { color: ac },
        });

        slide.addText(s.title, {
          x: 0.5, y: 0.3, w: 9, h: 0.8,
          fontSize: s.type === "title" ? 36 : 28,
          bold: true,
          color: tx,
          fontFace: "Calibri",
        });

        if (s.subtitle) {
          slide.addText(s.subtitle, {
            x: 0.5, y: 1.2, w: 9, h: 0.5,
            fontSize: 14,
            color: ac,
            fontFace: "Calibri",
          });
        }

        if (s.body && s.body.length > 0) {
          const bodyY = (s.subtitle ? 1.8 : 1.4);
          s.body.forEach((line, i) => {
            slide.addText(`• ${line}`, {
              x: 0.5, y: bodyY + i * 0.7, w: 9, h: 0.6,
              fontSize: 12,
              color: tx,
              fontFace: "Calibri",
            });
          });
        }

        if (s.stats) {
          s.stats.forEach((stat, i) => {
            const x = 0.5 + i * 3.2;
            slide.addText(stat.value, { x, y: 2.5, w: 3, h: 0.8, fontSize: 32, bold: true, color: ac, fontFace: "Calibri", align: "center" });
            slide.addText(stat.label, { x, y: 3.4, w: 3, h: 0.4, fontSize: 12, color: tx, fontFace: "Calibri", align: "center" });
          });
        }

        if (s.chart) {
          const chartData = [{
            name: s.chart.title,
            labels: s.chart.labels,
            values: s.chart.values,
          }];
          slide.addChart(pptx.ChartType.bar, chartData, {
            x: 0.5, y: 1.8, w: 9, h: 3.5,
            chartColors: [ac],
            showLegend: false,
            showTitle: true,
            title: s.chart.title,
            titleColor: tx,
            titleFontSize: 12,
          });
        }

        if (s.speaker_note) {
          slide.addNotes(s.speaker_note);
        }
      });

      await pptx.writeFile({ fileName: `QWS-Presentation-${Date.now()}.pptx` });
    } catch (err) {
      console.error("PPTX export failed:", err);
    }
  };

  const prevSlide = () => setCurrent((c) => Math.max(0, c - 1));
  const nextSlide = () => setCurrent((c) => Math.min(slides.length - 1, c + 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (page !== "viewer") return;
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background flex items-center justify-between px-6 h-16">
        <div className="cursor-pointer" onClick={() => navigate("/home")}>
          <AnimatedLogo size={26} />
        </div>
        <div className="flex items-center gap-3">
          {page !== "home" && (
            <button
              onClick={() => setPage(page === "viewer" ? "config" : "home")}
              className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={13} /> Back
            </button>
          )}
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground border border-border px-2 py-1">
            QWS-PPT-1
          </span>
        </div>
      </nav>

      <div className="flex-1 pt-16">

        {/* ── HOME ── */}
        {page === "home" && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-5 py-16">
            <div className="font-mono text-[10px] tracking-[0.5em] uppercase mb-4 text-muted-foreground">
              PRESENTATION AGENT
            </div>
            <h1
              className="font-display font-bold tracking-tight text-center mb-5 max-w-3xl leading-none"
              style={{ fontSize: "clamp(2.2rem, 6vw, 5.5rem)" }}
            >
              Build stunning<br />
              <em style={{ fontStyle: "italic" }}>decks in seconds</em>
            </h1>
            <p className="font-mono text-sm text-muted-foreground text-center max-w-md mb-10 leading-relaxed">
              Describe your topic — QWS-PPT-1 generates a complete, polished presentation
              with live charts and speaker notes. Export real .pptx files instantly.
            </p>

            <div className="w-full max-w-2xl border border-border focus-within:border-foreground transition-colors mb-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Investor pitch for a sustainable AI startup targeting enterprise clients..."
                rows={4}
                className="w-full bg-background text-foreground font-mono text-sm p-5 resize-none outline-none border-0 placeholder:text-muted-foreground"
              />
              <div className="flex items-center justify-between px-5 py-3 border-t border-border">
                <span className="font-mono text-[10px] text-muted-foreground">
                  Describe your topic in detail for best results
                </span>
                <button
                  onClick={() => {
                    if (prompt.trim()) setPage("config");
                  }}
                  disabled={!prompt.trim()}
                  className="btn-primary text-xs px-5 py-2.5 gap-2 disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  Configure Deck <ArrowRight size={13} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border w-full max-w-2xl">
              {[
                { icon: "🧠", title: "AI Content", desc: "Smart bullet points & speaker notes generated per slide" },
                { icon: "📊", title: "Live Charts", desc: "Bar, line & donut charts with real data visualizations" },
                { icon: "🎨", title: "8 Themes", desc: "Midnight Gold, Sapphire, Emerald & more luxury palettes" },
                { icon: "⬇", title: "PPTX Export", desc: "Download real PowerPoint files ready for any boardroom" },
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
          <div className="flex h-[calc(100vh-4rem)]">
            <div className="w-72 shrink-0 border-r border-border p-6 overflow-y-auto flex flex-col gap-6">
              <div>
                <div className="font-display text-xl font-bold mb-1">Customize</div>
                <div className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Refine before generating</div>
              </div>

              <div>
                <div className="font-mono text-[9px] tracking-[0.5em] uppercase mb-3 text-muted-foreground">TOPIC</div>
                <div className="border border-border p-3 font-mono text-xs text-muted-foreground leading-relaxed">
                  {prompt.length > 100 ? prompt.slice(0, 100) + "…" : prompt}
                </div>
              </div>

              <div>
                <div className="font-mono text-[9px] tracking-[0.5em] uppercase mb-3 text-muted-foreground">SLIDE COUNT</div>
                <div className="flex gap-2">
                  {SLIDE_COUNTS.map((n) => (
                    <button
                      key={n}
                      onClick={() => setSlideCount(n)}
                      className={`font-mono text-xs px-3 py-2 border transition-colors ${
                        slideCount === n
                          ? "bg-foreground text-background border-foreground"
                          : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-mono text-[9px] tracking-[0.5em] uppercase mb-3 text-muted-foreground">STYLE</div>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-background border border-border text-foreground font-mono text-xs p-2.5 outline-none focus:border-foreground"
                >
                  {STYLES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="font-mono text-[9px] tracking-[0.5em] uppercase mb-3 text-muted-foreground">COLOR THEME</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.entries(THEMES) as [ThemeKey, typeof THEMES[ThemeKey]][]).map(([key, th]) => (
                    <button
                      key={key}
                      onClick={() => setTheme(key)}
                      className={`border p-2 transition-all ${
                        theme === key ? "border-foreground" : "border-border hover:border-foreground/50"
                      }`}
                    >
                      <div
                        className="w-full h-5 mb-1.5"
                        style={{ background: th.swatch }}
                      />
                      <div className="font-mono text-[9px] text-muted-foreground text-left">{th.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generate}
                className="btn-primary w-full py-3.5 text-xs gap-2 flex items-center justify-center"
              >
                Generate Presentation <ArrowRight size={13} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-secondary/20">
              <div className="font-display text-base font-bold mb-6 tracking-tight">
                Slide Structure Preview — {slideCount} slides
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {Array.from({ length: slideCount }).map((_, i) => {
                  const types = ["title","intro","content","stats","chart","performance","comparison","quote","content","chart","stats","conclusion"];
                  const type = i === 0 ? "title" : i === slideCount - 1 ? "conclusion" : types[i] || "content";
                  return (
                    <MiniThumb key={i} index={i} type={type} theme={THEMES[theme]} />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── GENERATING ── */}
        {page === "generating" && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-8">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border border-border rounded-full" />
              <div
                className="absolute inset-0 rounded-full border-t border-foreground"
                style={{ animation: "spin 0.8s linear infinite" }}
              />
            </div>
            <div className="text-center">
              <div className="font-display text-2xl font-bold mb-2">Crafting your deck…</div>
              <p className="font-mono text-xs text-muted-foreground">QWS-PPT-1 is composing slides</p>
            </div>
            <div className="flex flex-col gap-2 w-80">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className={`flex items-center gap-3 px-4 py-3 border font-mono text-xs transition-colors ${
                    step === i
                      ? "border-foreground bg-foreground/5 text-foreground"
                      : step > i
                      ? "border-border text-muted-foreground"
                      : "border-border/30 text-muted-foreground/30"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      step === i ? "bg-foreground" : step > i ? "bg-muted-foreground/40" : "bg-border"
                    }`}
                  />
                  {s}
                </div>
              ))}
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* ── VIEWER ── */}
        {page === "viewer" && slide && (
          <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Viewer top bar */}
            <div className="shrink-0 flex items-center justify-between px-5 py-2.5 border-b border-border bg-background">
              <div className="font-display text-sm font-bold truncate max-w-xs">
                {slides[0]?.title || "Presentation"}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={prevSlide} disabled={current === 0} className="w-7 h-7 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors">
                  <ChevronLeft size={14} />
                </button>
                <span className="font-mono text-[10px] text-muted-foreground w-12 text-center">
                  {current + 1}/{slides.length}
                </span>
                <button onClick={nextSlide} disabled={current === slides.length - 1} className="w-7 h-7 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-20 transition-colors">
                  <ChevronRight size={14} />
                </button>
                <div className="w-px h-5 bg-border mx-1" />
                <button onClick={() => setEditOpen(!editOpen)} className="flex items-center gap-1.5 border border-border px-3 py-1.5 font-mono text-[10px] text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                  <Edit3 size={11} /> Edit
                </button>
                <button onClick={() => setFullscreen(true)} className="flex items-center gap-1.5 border border-border px-3 py-1.5 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                  <Maximize2 size={11} /> Preview
                </button>
                <button onClick={downloadPPTX} className="btn-primary text-[10px] px-4 py-1.5 gap-1.5 flex items-center">
                  <Download size={11} /> Download PPTX
                </button>
              </div>
            </div>

            {/* Main viewer */}
            <div className="flex-1 flex overflow-hidden">
              {/* Slide canvas */}
              <div className="flex-1 flex items-center justify-center p-8 bg-secondary/10">
                <div className="w-full max-w-3xl">
                  <div
                    className="w-full border border-border overflow-hidden shadow-2xl"
                    style={{ aspectRatio: "16/9" }}
                  >
                    <SlideRenderer slide={slide} theme={t} />
                  </div>
                </div>
              </div>

              {/* Notes panel */}
              {!editOpen && (
                <div className="w-56 shrink-0 border-l border-border p-5 overflow-y-auto">
                  <div className="font-mono text-[9px] tracking-[0.4em] uppercase mb-4 text-muted-foreground">
                    SPEAKER NOTES
                  </div>
                  <p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
                    {slide.speaker_note}
                  </p>
                  {slide.highlight && (
                    <div className="mt-4 border border-border p-3">
                      <div className="font-mono text-[9px] tracking-widest text-muted-foreground mb-1.5">KEY TAKEAWAY</div>
                      <p className="font-mono text-xs font-bold leading-relaxed">{slide.highlight}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Edit panel */}
              {editOpen && (
                <div className="w-72 shrink-0 border-l border-border flex flex-col">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">Edit Slide</span>
                    <button onClick={() => setEditOpen(false)} className="w-6 h-6 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground">
                      <X size={12} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div>
                      <div className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-2">TITLE</div>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => {
                          const newSlides = [...slides];
                          newSlides[current] = { ...newSlides[current], title: e.target.value };
                          setSlides(newSlides);
                        }}
                        className="w-full bg-background border border-border text-foreground font-mono text-xs p-2.5 outline-none focus:border-foreground"
                      />
                    </div>
                    {slide.body.map((line, li) => (
                      <div key={li}>
                        <div className="font-mono text-[9px] tracking-widest uppercase text-muted-foreground mb-2">POINT {li + 1}</div>
                        <textarea
                          value={line}
                          rows={3}
                          onChange={(e) => {
                            const newSlides = [...slides];
                            const newBody = [...newSlides[current].body];
                            newBody[li] = e.target.value;
                            newSlides[current] = { ...newSlides[current], body: newBody };
                            setSlides(newSlides);
                          }}
                          className="w-full bg-background border border-border text-foreground font-mono text-[11px] p-2.5 resize-none outline-none focus:border-foreground leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="shrink-0 flex gap-2 items-center px-4 py-2 border-t border-border overflow-x-auto bg-background" style={{ minHeight: 72 }}>
              {slides.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`shrink-0 w-24 h-14 border overflow-hidden relative transition-all ${
                    current === i ? "border-foreground" : "border-border hover:border-foreground/40"
                  }`}
                >
                  <div className="w-full h-full scale-[0.18] origin-top-left" style={{ width: "556%", height: "556%" }}>
                    <SlideRenderer slide={s} theme={t} />
                  </div>
                  <div className="absolute bottom-0.5 left-1 font-mono text-[7px] text-white/40">{i + 1}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen */}
      {fullscreen && slide && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="absolute top-3 right-4 flex gap-2 z-10">
            <button onClick={prevSlide} disabled={current === 0} className="w-9 h-9 border border-white/20 bg-black/60 flex items-center justify-center text-white disabled:opacity-20">
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center px-3 h-9 border border-white/10 bg-black/50 font-mono text-[10px] text-white/50">
              {current + 1}/{slides.length}
            </div>
            <button onClick={nextSlide} disabled={current === slides.length - 1} className="w-9 h-9 border border-white/20 bg-black/60 flex items-center justify-center text-white disabled:opacity-20">
              <ChevronRight size={16} />
            </button>
            <button onClick={() => setFullscreen(false)} className="w-9 h-9 border border-white/20 bg-black/60 flex items-center justify-center text-white">
              <X size={14} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-5xl" style={{ aspectRatio: "16/9" }}>
              <SlideRenderer slide={slide} theme={t} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function SlideRenderer({ slide, theme: t }: { slide: SlideData; theme: Theme }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: t.dark,
        color: t.text,
        fontFamily: "'Space Grotesk', 'JetBrains Mono', monospace",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg,${t.accent},${t.accent2},transparent)`, flexShrink: 0 }} />

      {/* Left bar */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(180deg,${t.accent},transparent)` }} />

      <div style={{ flex: 1, padding: "5% 6% 5% 7%", display: "flex", flexDirection: "column", gap: "3%" }}>

        {/* Title slide */}
        {slide.type === "title" && (
          <>
            <div style={{ fontSize: "clamp(12px,4vw,42px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: "70%", marginTop: "auto" }}>
              {slide.title}
            </div>
            {slide.subtitle && (
              <div style={{ fontSize: "clamp(8px,1.2vw,14px)", color: t.accent, fontWeight: 600, maxWidth: "60%", lineHeight: 1.5 }}>
                {slide.subtitle}
              </div>
            )}
            <div style={{ width: 40, height: 2, background: t.accent, marginTop: "2%" }} />
            <div style={{ marginTop: "auto", marginBottom: "2%" }} />
          </>
        )}

        {/* Regular slides */}
        {slide.type !== "title" && (
          <>
            <div style={{ fontSize: "clamp(9px,2.2vw,22px)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
              {slide.title}
            </div>

            {slide.stats && (
              <div style={{ display: "flex", gap: "4%", flex: 1, alignItems: "center" }}>
                {slide.stats.map((s, i) => (
                  <div key={i} style={{ flex: 1, border: `1px solid ${t.accent}30`, padding: "4%", textAlign: "center" }}>
                    <div style={{ fontSize: "clamp(12px,3vw,32px)", fontWeight: 800, color: t.accent }}>{s.value}</div>
                    <div style={{ fontSize: "clamp(6px,0.9vw,10px)", color: t.text, opacity: 0.6, marginTop: "6%" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {slide.chart && (
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "clamp(6px,0.8vw,9px)", color: t.accent, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "2%" }}>
                  {slide.chart.title}
                </div>
                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "1.5%" }}>
                  {slide.chart.values.map((v, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "3%", height: "100%" }}>
                      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                        <div style={{ width: "100%", height: `${v}%`, background: `linear-gradient(0deg,${t.accent},${t.accent2})`, borderRadius: "2px 2px 0 0" }} />
                      </div>
                      <div style={{ fontSize: "clamp(5px,0.6vw,7px)", color: t.text, opacity: 0.5, whiteSpace: "nowrap" }}>{slide.chart!.labels[i]}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {slide.performance && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3%", flex: 1 }}>
                {slide.performance.map((p, i) => (
                  <div key={i} style={{ border: `1px solid ${t.accent}20`, padding: "4%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ fontSize: "clamp(5px,0.8vw,9px)", color: t.text, opacity: 0.5, marginBottom: "4%" }}>{p.label}</div>
                    <div style={{ fontSize: "clamp(10px,2.5vw,26px)", fontWeight: 800, color: t.accent }}>{p.value}{p.unit}</div>
                    <div style={{ marginTop: "6%", height: 3, background: `${t.accent}20`, position: "relative" }}>
                      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${p.value}%`, background: t.accent, transition: "width 0.6s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {slide.type === "quote" && slide.body[0] && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "4%" }}>
                <div style={{ fontSize: "clamp(8px,1.6vw,18px)", fontStyle: "italic", opacity: 0.9, lineHeight: 1.6, maxWidth: "80%" }}>
                  {slide.body[0]}
                </div>
              </div>
            )}

            {slide.type !== "quote" && !slide.stats && !slide.chart && !slide.performance && slide.body.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "2.5%", flex: 1 }}>
                {slide.body.map((line, i) => (
                  <div key={i} style={{ display: "flex", gap: "2%", alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: t.accent, flexShrink: 0, marginTop: "0.6%" }} />
                    <div style={{ fontSize: "clamp(6px,1vw,11px)", opacity: 0.85, lineHeight: 1.6 }}>{line}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Slide number */}
      <div style={{ position: "absolute", bottom: "3%", right: "4%", fontSize: "clamp(5px,0.7vw,8px)", color: t.text, opacity: 0.2, fontFamily: "monospace" }}>
        QWS-PPT-1
      </div>
    </div>
  );
}

function MiniThumb({ index, type, theme: t }: { index: number; type: string; theme: Theme }) {
  return (
    <div className="border border-border relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
      <div style={{ width: "100%", height: "100%", background: t.dark }}>
        <div style={{ height: 2, background: t.accent }} />
        <div style={{ padding: "8%", display: "flex", flexDirection: "column", gap: "6%" }}>
          <div style={{ height: 4, background: t.accent, width: "60%" }} />
          <div style={{ height: 2, background: `${t.text}20`, width: "80%" }} />
          <div style={{ height: 2, background: `${t.text}20`, width: "70%" }} />
          <div style={{ height: 2, background: `${t.text}20`, width: "50%" }} />
        </div>
      </div>
      <div className="absolute bottom-1 left-1.5 font-mono text-[7px] text-white/30">{String(index + 1).padStart(2, "0")}</div>
      <div className="absolute top-1 right-1.5 font-mono text-[7px] text-white/25">{type}</div>
    </div>
  );
}
