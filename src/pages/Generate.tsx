import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { generateWebsite } from "@/utils/codeGenerator";
import AnimatedLogo from "@/components/AnimatedLogo";
import { MODELS, type AgentModel } from "@/agents/models";

const SOON = [
  { tag: "Autonomous · Actions",    desc: "Full computer-use agent with tool access and persistent memory" },
  { tag: "Video · Generation",      desc: "Text-to-video synthesis and real-time scene composition" },
  { tag: "Quantum · Reasoning",     desc: "Beyond-classical inference at unprecedented complexity scale" },
];

/* ── Unique animated background per model ─────────────────── */
function CardBg({ id, color: c }: { id: string; color: string }) {

  if (id === "qws-ultra-v4") return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden" }}>
      <div style={{ position:"absolute",inset:"-10px",backgroundImage:`repeating-linear-gradient(45deg,rgba(226,232,240,.06) 0,rgba(226,232,240,.06) 1px,transparent 1px,transparent 22px)`,animation:"ultraDrift 12s linear infinite" }} />
      <div style={{ position:"absolute",left:0,right:0,height:1,top:"30%",background:`rgba(226,232,240,.08)`,animation:"ultraScanH 6s ease-in-out infinite" }} />
    </div>
  );

  if (id === "qws-vision-3") return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden" }}>
      <div style={{ position:"absolute",width:200,height:200,borderRadius:"50%",background:`radial-gradient(circle,${c}38,transparent)`,filter:"blur(35px)",animation:"visionBlob1 9s ease-in-out infinite",top:"-20%",left:"-15%" }} />
      <div style={{ position:"absolute",width:120,height:120,borderRadius:"50%",background:`radial-gradient(circle,${c}22,transparent)`,filter:"blur(25px)",animation:"visionBlob2 12s ease-in-out infinite",bottom:"-10%",right:"-10%" }} />
    </div>
  );

  if (id === "qws-code-x") return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden" }}>
      {[1.5,1.2,1.8,1.1,1.6,1.3,1.9].map((dur,i) => (
        <div key={i} style={{ position:"absolute",left:`${i*14+2}%`,top:0,width:1.5,height:"200%",background:`linear-gradient(180deg,transparent 0%,${c}60 38%,${c} 50%,${c}60 62%,transparent 100%)`,animation:`codeRain ${dur}s linear infinite`,animationDelay:`${-(i*0.28)}s`,transform:"translateY(-50%)" }} />
      ))}
    </div>
  );

  if (id === "qws-audio-2") return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden",display:"flex",alignItems:"flex-end",gap:3,padding:"0 14px 8px" }}>
      {[42,68,82,52,91,72,57,86,46,76,60,88].map((h,i) => (
        <div key={i} style={{ flex:1,height:`${h}%`,background:`${c}28`,border:`1px solid ${c}45`,borderBottom:"none",animation:`audioBars ${0.45+i*0.07}s ease-in-out infinite alternate`,animationDelay:`${i*0.04}s`,transformOrigin:"bottom",minWidth:0 }} />
      ))}
    </div>
  );

  if (id === "qws-biz-4") return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden" }}>
      {[0,1,2,3,4,5,6].map(i => (
        <div key={i} style={{ position:"absolute",left:0,right:0,height:1,top:`${i*16+4}%`,background:`rgba(200,169,110,.05)` }} />
      ))}
      <div style={{ position:"absolute",left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${c}80,${c},${c}80,transparent)`,animation:"bizBeam 2.8s ease-in-out infinite",boxShadow:`0 0 8px ${c}70` }} />
    </div>
  );

  if (id === "qws-ppt-1") return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden" }}>
      {[{w:"58%",dur:"9s",op:50},{w:"40%",dur:"6s",op:35,rev:true},{w:"24%",dur:"14s",op:65}].map((r,i) => (
        <div key={i} style={{ position:"absolute",top:"50%",left:"50%",width:r.w,aspectRatio:"16/9",border:`1px solid ${c}${r.op.toString(16).padStart(2,"0")}`,transform:"translate(-50%,-50%)",animation:`pptSpin ${r.dur} linear infinite`,animationDirection:i%2===0?"normal":"reverse" }} />
      ))}
    </div>
  );

  if (id === "qws-research-1") return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden" }}>
      {[0,.8,1.6,2.4].map(delay => (
        <div key={delay} style={{ position:"absolute",top:"50%",left:"50%",width:32,height:32,borderRadius:"50%",border:`1.5px solid ${c}90`,animation:"researchRing 3.2s ease-out infinite",animationDelay:`${delay}s` }} />
      ))}
      <div style={{ position:"absolute",top:"50%",left:"50%",width:8,height:8,borderRadius:"50%",background:c,transform:"translate(-50%,-50%)",boxShadow:`0 0 12px ${c}` }} />
    </div>
  );

  if (id === "qws-data-1") return (
    <div style={{ position:"absolute",inset:0,overflow:"hidden",display:"flex",alignItems:"flex-end",gap:2,padding:"0 10px 8px" }}>
      {[55,80,40,90,65,75,50,85,60,70].map((h,i) => (
        <div key={i} style={{ flex:1,height:`${h}%`,background:`linear-gradient(0deg,${c}55,${c}18)`,border:`1px solid ${c}40`,borderBottom:"none",animation:`dataBars ${0.65+i*0.1}s ease-in-out infinite alternate`,animationDelay:`${i*0.07}s`,transformOrigin:"bottom",minWidth:0 }} />
      ))}
    </div>
  );

  return null;
}

/* ── Main Hub component ───────────────────────────────────── */
const Generate = () => {
  const navigate = useNavigate();
  const [activeModel, setActiveModel] = useState<AgentModel | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleCard = (m: AgentModel) => {
    if (m.route && m.route !== "/generate") { navigate(m.route); return; }
    setActiveModel(prev => prev?.id === m.id ? null : m);
    setPrompt("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleBuild = () => {
    if (!prompt.trim() || isBuilding || !activeModel) return;
    setIsBuilding(true);
    setTimeout(() => {
      const code = generateWebsite(prompt);
      navigate("/workspace", { state: { id: crypto.randomUUID(), prompt: prompt.trim(), code, model: activeModel, timestamp: Date.now() } });
    }, 100);
  };

  return (
    <>
      <style>{`
        @keyframes ultraDrift    { from{background-position:0 0} to{background-position:22px 22px} }
        @keyframes ultraScanH    { 0%,100%{top:5%;opacity:0} 20%{opacity:.4} 80%{opacity:.4} 100%{top:90%;opacity:0} }
        @keyframes visionBlob1   { 0%,100%{transform:translate(0%,0%)} 33%{transform:translate(100%,55%)} 66%{transform:translate(25%,90%)} }
        @keyframes visionBlob2   { 0%,100%{transform:translate(0%,0%)} 33%{transform:translate(-70%,-35%)} 66%{transform:translate(40%,-70%)} }
        @keyframes codeRain      { from{transform:translateY(-50%)} to{transform:translateY(50%)} }
        @keyframes audioBars     { from{transform:scaleY(.12)} to{transform:scaleY(1)} }
        @keyframes bizBeam       { 0%{top:0%;opacity:0} 6%{opacity:1} 90%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes pptSpin       { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
        @keyframes researchRing  { 0%{transform:translate(-50%,-50%) scale(.3);opacity:.9} 100%{transform:translate(-50%,-50%) scale(8);opacity:0} }
        @keyframes dataBars      { from{transform:scaleY(.15);opacity:.35} to{transform:scaleY(1);opacity:1} }
        @keyframes cardIn        { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes promptSlideUp { from{opacity:0;transform:translateY(100%)} to{opacity:1;transform:translateY(0)} }

        .hub-card { animation:cardIn .48s cubic-bezier(.22,1,.36,1) both; }
        .hub-card:hover { border-color:var(--card-color) !important; box-shadow:0 0 30px var(--card-glow) !important; }
        .hub-card:hover .card-launch { opacity:1 !important; transform:translateY(0) !important; }
        .hub-card:hover .card-top-bar { opacity:1 !important; }
      `}</style>

      <div style={{ minHeight:"100vh",background:"#060809",color:"#f0f0f0",display:"flex",flexDirection:"column",fontFamily:"'JetBrains Mono',monospace" }}>

        {/* Nav */}
        <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:50,height:54,padding:"0 24px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(6,8,9,.96)",borderBottom:"1px solid rgba(255,255,255,.07)",backdropFilter:"blur(20px)" }}>
          <div style={{ cursor:"pointer" }} onClick={() => navigate("/home")}>
            <AnimatedLogo size={24} />
          </div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".5em",color:"rgba(255,255,255,.25)",textTransform:"uppercase" }}>
            INTELLIGENCE SUITE
          </div>
          <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"rgba(255,255,255,.2)",letterSpacing:".2em" }}>
            {MODELS.length} MODELS · {SOON.length} INCOMING
          </div>
        </nav>

        {/* Hero */}
        <div style={{ paddingTop:54,textAlign:"center",padding:"74px 24px 32px" }}>
          <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontSize:"clamp(1.8rem,4.5vw,3.2rem)",fontWeight:800,letterSpacing:"-.025em",marginBottom:10,lineHeight:1.1 }}>
            Select an <em style={{ fontStyle:"italic" }}>intelligence</em> model
          </div>
          <p style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"rgba(255,255,255,.35)",maxWidth:380,margin:"0 auto" }}>
            Each model specialises in a different domain. Hover to preview, click to launch.
          </p>
        </div>

        {/* Grid */}
        <div style={{ flex:1,padding:"0 18px",maxWidth:1440,margin:"0 auto",width:"100%",paddingBottom:activeModel?200:80 }}>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:2 }}>

            {MODELS.map((m, idx) => {
              const isActive = activeModel?.id === m.id;
              return (
                <div
                  key={m.id}
                  className="hub-card"
                  style={{
                    "--card-color": m.color,
                    "--card-glow": `${m.color}25`,
                    animationDelay: `${idx * 0.038}s`,
                    position:"relative",
                    height:260,
                    background:"#0d1015",
                    border:`1px solid ${isActive ? m.color : "rgba(255,255,255,.07)"}`,
                    cursor:"pointer",
                    overflow:"hidden",
                    transition:"border-color .22s,box-shadow .22s",
                    boxShadow: isActive ? `0 0 35px ${m.color}30,inset 0 0 20px ${m.color}08` : "none",
                  } as React.CSSProperties}
                  onClick={() => handleCard(m)}
                >
                  <CardBg id={m.id} color={m.color} />

                  {/* Top accent bar */}
                  <div className="card-top-bar" style={{ position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${m.color},transparent)`,opacity:isActive?1:0,transition:"opacity .25s" }} />

                  {/* Gradient overlay from bottom */}
                  <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"60%",background:"linear-gradient(0deg,#0d1015 40%,transparent)",pointerEvents:"none" }} />

                  {/* Content */}
                  <div style={{ position:"relative",zIndex:2,height:"100%",padding:"18px 18px 14px",display:"flex",flexDirection:"column" }}>
                    {/* Top row */}
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:".2em",color:m.color,border:`1px solid ${m.color}45`,padding:"3px 7px" }}>
                        {m.badge}
                      </div>
                      {m.route && m.route !== "/generate" && (
                        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(255,255,255,.2)" }}>↗</div>
                      )}
                    </div>

                    {/* Symbol — centered */}
                    <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"flex-start",paddingLeft:2 }}>
                      <div style={{ fontSize:52,lineHeight:1,color:m.color,textShadow:`0 0 24px ${m.color}70`,transition:"text-shadow .25s" }}>
                        {m.symbol}
                      </div>
                    </div>

                    {/* Bottom info */}
                    <div>
                      <div style={{ fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:13,letterSpacing:"-.01em",marginBottom:3,color:"#f0f0f0" }}>{m.name}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"rgba(255,255,255,.35)",letterSpacing:".06em",marginBottom:7 }}>{m.tag}</div>
                      <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(255,255,255,.28)",lineHeight:1.55,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{m.desc}</div>
                    </div>

                    {/* Launch label */}
                    <div className="card-launch" style={{ marginTop:10,opacity:0,transform:"translateY(8px)",transition:"opacity .22s,transform .22s" }}>
                      <div style={{ display:"inline-flex",alignItems:"center",gap:6,fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:".15em",textTransform:"uppercase",color:m.color,borderTop:`1px solid ${m.color}40`,paddingTop:6,width:"100%" }}>
                        {m.route && m.route !== "/generate" ? `Launch ${m.badge} →` : `${m.cta} →`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 3 Coming Soon */}
            {SOON.map((s, i) => (
              <div
                key={`soon-${i}`}
                className="hub-card"
                style={{ animationDelay:`${(MODELS.length+i)*0.038}s`,position:"relative",height:260,background:"#090a0b",border:"1px dashed rgba(255,255,255,.1)",overflow:"hidden" } as React.CSSProperties}
              >
                {/* Subtle pattern */}
                <div style={{ position:"absolute",inset:0,backgroundImage:"radial-gradient(rgba(255,255,255,.03) 1px,transparent 1px)",backgroundSize:"18px 18px" }} />
                <div style={{ position:"relative",zIndex:2,height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,textAlign:"center",padding:20 }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:26,color:"rgba(255,255,255,.1)",letterSpacing:12,lineHeight:1 }}>•••</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,letterSpacing:".25em",textTransform:"uppercase",color:"rgba(255,255,255,.12)",border:"1px dashed rgba(255,255,255,.1)",padding:"3px 10px" }}>COMING SOON</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"rgba(255,255,255,.2)",letterSpacing:".08em" }}>{s.tag}</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"rgba(255,255,255,.15)",lineHeight:1.6,maxWidth:160 }}>{s.desc}</div>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* ── Bottom prompt panel ── slides up when model selected */}
        {activeModel && (
          <div
            style={{
              position:"fixed",bottom:0,left:0,right:0,zIndex:40,
              background:"#0d1015",
              borderTop:`1px solid ${activeModel.color}50`,
              padding:"14px 24px 18px",
              animation:"promptSlideUp .3s cubic-bezier(.22,1,.36,1)",
              boxShadow:`0 -16px 50px ${activeModel.color}15`,
            }}
          >
            <div style={{ maxWidth:860,margin:"0 auto" }}>
              {/* Panel header */}
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                <div style={{ fontSize:16,color:activeModel.color,textShadow:`0 0 10px ${activeModel.color}70` }}>{activeModel.symbol}</div>
                <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,letterSpacing:".2em",color:activeModel.color }}>{activeModel.name}</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"rgba(255,255,255,.3)" }}>· {activeModel.tag}</span>
                <button onClick={() => setActiveModel(null)} style={{ marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:"rgba(255,255,255,.3)",background:"transparent",border:"none",cursor:"pointer",lineHeight:1 }}>✕</button>
              </div>

              {/* Input row */}
              <div style={{ display:"flex",border:`1px solid ${activeModel.color}35`,overflow:"hidden" }}>
                <textarea
                  ref={inputRef}
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={e => { if (e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleBuild();} }}
                  placeholder={`Describe what you want ${activeModel.name} to ${activeModel.verb}...`}
                  rows={2}
                  style={{ flex:1,background:"transparent",border:"none",color:"#f0f0f0",fontFamily:"'JetBrains Mono',monospace",fontSize:12,padding:"12px 16px",outline:"none",resize:"none",caretColor:activeModel.color,lineHeight:1.6 }}
                  data-testid="main-prompt-input"
                />
                <button
                  onClick={handleBuild}
                  disabled={!prompt.trim()||isBuilding}
                  style={{ background:prompt.trim()?activeModel.color:"transparent",color:prompt.trim()?"#000":activeModel.color,border:`1px solid ${activeModel.color}50`,borderRight:"none",borderTop:"none",borderBottom:"none",fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:700,letterSpacing:".15em",textTransform:"uppercase",padding:"0 22px",cursor:prompt.trim()?"pointer":"not-allowed",transition:"all .15s",flexShrink:0,opacity:isBuilding?.5:1 }}
                  data-testid="build-button"
                >
                  {isBuilding ? "…" : activeModel.cta}
                </button>
              </div>

              {/* Quick examples */}
              <div style={{ display:"flex",gap:6,marginTop:8,flexWrap:"wrap" }}>
                {activeModel.examples.slice(0,6).map(ex => (
                  <button
                    key={ex.label}
                    onClick={() => { setPrompt(ex.label); inputRef.current?.focus(); }}
                    style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"rgba(255,255,255,.3)",border:"1px solid rgba(255,255,255,.1)",background:"transparent",padding:"4px 9px",cursor:"pointer",transition:"all .15s",letterSpacing:".03em" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor=`${activeModel.color}60`;(e.currentTarget as HTMLElement).style.color=activeModel.color; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,.1)";(e.currentTarget as HTMLElement).style.color="rgba(255,255,255,.3)"; }}
                  >
                    {ex.icon} {ex.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Generate;
