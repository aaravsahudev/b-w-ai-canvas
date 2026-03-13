import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Download,
  Copy,
  Monitor,
  Smartphone,
  Check,
  Code2,
  X,
  ChevronRight,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { generateWebsite } from "@/utils/codeGenerator";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(){}<>";

interface ProjectState {
  id: string;
  prompt: string;
  code: string;
  timestamp: number;
}

type ChatMsg = {
  id: string;
  role: "user" | "ai";
  text: string;
};

const BUILDING_MSGS = [
  "Analyzing your request...",
  "Scaffolding layout structure...",
  "Generating styles and typography...",
  "Writing component logic...",
  "Applying responsive breakpoints...",
  "Finalizing and rendering...",
];

const Workspace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const project = location.state as ProjectState | null;

  const [code, setCode] = useState(project?.code ?? "");
  const [streamedCode, setStreamedCode] = useState("");
  const [chat, setChat] = useState<ChatMsg[]>([
    {
      id: "welcome",
      role: "ai",
      text: `Your website is ready. I built it based on: "${project?.prompt}". Ask me to change colors, layout, content, add sections — anything you need.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [codeOpen, setCodeOpen] = useState(false);
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [cipherText, setCipherText] = useState("");
  const [copied, setCopied] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const codeEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) navigate("/generate");
  }, [project, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isBuilding]);

  useEffect(() => {
    if (codeOpen) {
      codeEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [streamedCode, codeOpen]);

  // Cipher animation in chat
  useEffect(() => {
    if (!isBuilding) { setCipherText(""); return; }
    const id = setInterval(() => {
      setCipherText(
        Array.from({ length: 32 }, () =>
          CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join("")
      );
    }, 45);
    return () => clearInterval(id);
  }, [isBuilding]);

  // Cycle build step messages
  useEffect(() => {
    if (!isBuilding) { setBuildStep(0); setBuildProgress(0); return; }
    let step = 0;
    const id = setInterval(() => {
      step = Math.min(step + 1, BUILDING_MSGS.length - 1);
      setBuildStep(step);
      setBuildProgress(Math.round(((step + 1) / BUILDING_MSGS.length) * 100));
    }, 380);
    return () => clearInterval(id);
  }, [isBuilding]);

  // Stream code character by character when isBuilding finishes
  const streamCode = useCallback((newCode: string) => {
    setStreamedCode("");
    setCodeOpen(true);
    let i = 0;
    const chunkSize = 12;
    const id = setInterval(() => {
      i += chunkSize;
      setStreamedCode(newCode.slice(0, i));
      if (i >= newCode.length) {
        setStreamedCode(newCode);
        clearInterval(id);
      }
    }, 10);
    return () => clearInterval(id);
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim() || isBuilding) return;
    const userText = input.trim();
    setInput("");

    setChat((prev) => [...prev, { id: crypto.randomUUID(), role: "user", text: userText }]);
    setIsBuilding(true);

    const delay = 2200 + Math.random() * 800;
    setTimeout(() => {
      const newCode = generateWebsite(userText);
      setCode(newCode);
      setIsBuilding(false);
      streamCode(newCode);
      setChat((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "ai",
          text: "Done! Live preview updated. The code panel on the right shows the generated source. Want me to refine anything?",
        },
      ]);
    }, delay);
  }, [input, isBuilding, streamCode]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = "data:text/html;charset=utf-8," + encodeURIComponent(code);
    a.download = "website.html";
    a.click();
  };

  if (!project) return null;

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0 bg-background">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/generate")}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-mono text-xs"
          >
            <ArrowLeft size={13} /> New
          </button>
          <div className="w-px h-4 bg-border" />
          <img src={logo} alt="QWS" className="h-5" />
          {isBuilding && (
            <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground animate-pulse">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              {BUILDING_MSGS[buildStep]}
            </div>
          )}
          {!isBuilding && (
            <span className="font-mono text-[10px] text-muted-foreground hidden sm:block truncate max-w-[240px]">
              {project.prompt.slice(0, 50)}{project.prompt.length > 50 ? "…" : ""}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Device toggle */}
          <div className="flex border border-border">
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`px-2.5 py-1.5 transition-colors ${deviceMode === "desktop" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Monitor size={12} />
            </button>
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`px-2.5 py-1.5 border-l border-border transition-colors ${deviceMode === "mobile" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Smartphone size={12} />
            </button>
          </div>

          {/* Code panel toggle */}
          <button
            onClick={() => setCodeOpen((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border font-mono text-xs transition-colors ${
              codeOpen
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
            }`}
          >
            <Code2 size={11} /> Code
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border font-mono text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border font-mono text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <Download size={11} /> Export
          </button>
        </div>
      </div>

      {/* ── MAIN AREA ───────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT: Chat panel ── */}
        <div className="w-72 shrink-0 flex flex-col border-r border-border bg-background">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {chat.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-5 h-5 shrink-0 flex items-center justify-center font-mono text-[9px] font-bold mt-0.5 ${
                  msg.role === "user" ? "bg-foreground text-background" : "border border-foreground text-foreground"
                }`}>
                  {msg.role === "user" ? "U" : "Q"}
                </div>
                <div className={`max-w-[190px] px-3 py-2 font-mono text-[11px] leading-relaxed ${
                  msg.role === "user" ? "bg-foreground text-background" : "bg-secondary text-foreground"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isBuilding && (
              <div className="flex gap-2 animate-slide-up">
                <div className="w-5 h-5 shrink-0 flex items-center justify-center font-mono text-[9px] font-bold border border-foreground">Q</div>
                <div className="bg-secondary flex-1 p-3 space-y-2">
                  {/* Progress bar */}
                  <div className="w-full h-px bg-border">
                    <div
                      className="h-px bg-foreground transition-all duration-500"
                      style={{ width: `${buildProgress}%` }}
                    />
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground">{BUILDING_MSGS[buildStep]}</div>
                  <div className="font-mono text-[9px] text-muted-foreground/50 animate-cipher break-all leading-loose">
                    {cipherText}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 shrink-0">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Change something..."
                disabled={isBuilding}
                rows={2}
                className="flex-1 bg-secondary border border-border text-foreground font-mono text-xs p-2.5 resize-none outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground"
                style={{ caretColor: "hsl(var(--foreground))" }}
                data-testid="chat-input"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isBuilding}
                className="btn-primary p-2.5 disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
                data-testid="chat-send"
              >
                <Send size={12} />
              </button>
            </div>
            <p className="font-mono text-[9px] text-muted-foreground mt-1.5">Enter to send · Shift+Enter for newline</p>
          </div>
        </div>

        {/* ── CENTER: Live Preview ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#111] relative">
          {/* Building overlay */}
          {isBuilding && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
              <div className="relative w-16 h-16 mb-6">
                <svg viewBox="0 0 80 80" fill="none" style={{ width: "100%", height: "100%", animation: "spin 2s linear infinite" }}>
                  <circle cx="40" cy="40" r="32" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" strokeDasharray="4 8" />
                  <circle cx="40" cy="40" r="22" stroke="white" strokeWidth="5" fill="none"
                    strokeDasharray="60 80" strokeLinecap="round" style={{ animation: "spin 1.2s linear infinite reverse" }} />
                </svg>
              </div>
              <div className="font-mono text-sm text-foreground mb-2">{BUILDING_MSGS[buildStep]}</div>
              <div className="w-48 h-px bg-border">
                <div className="h-px bg-foreground transition-all duration-500" style={{ width: `${buildProgress}%` }} />
              </div>
              <div className="font-mono text-[10px] text-muted-foreground mt-2">{buildProgress}%</div>
            </div>
          )}

          {/* Preview frame */}
          <div className={`flex-1 flex items-start justify-center overflow-auto ${deviceMode === "mobile" ? "p-8 bg-secondary" : ""}`}>
            <iframe
              key={code}
              srcDoc={code}
              sandbox="allow-scripts"
              title="Website Preview"
              className={`border-0 ${deviceMode === "mobile" ? "w-[375px] h-[812px] shadow-2xl" : "w-full h-full"}`}
              style={{ background: "#fff" }}
            />
          </div>
        </div>

        {/* ── RIGHT: Code Panel (slide in) ── */}
        <div
          className="flex flex-col border-l border-border bg-background overflow-hidden shrink-0 transition-all duration-300"
          style={{ width: codeOpen ? 440 : 0 }}
        >
          {codeOpen && (
            <>
              {/* Code panel header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <Code2 size={12} className="text-muted-foreground" />
                  <span className="font-mono text-[10px] text-muted-foreground tracking-widest">SOURCE CODE</span>
                  {isBuilding && (
                    <span className="flex items-center gap-1 font-mono text-[9px] text-green-400 animate-pulse">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                      GENERATING
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setCodeOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Streaming code content */}
              <div className="flex-1 overflow-auto p-4 bg-background">
                <pre
                  className="font-mono text-[10px] leading-relaxed text-foreground whitespace-pre-wrap break-words"
                  style={{ minHeight: "100%" }}
                >
                  {isBuilding ? (
                    <span className="text-muted-foreground animate-cipher">
                      {cipherText.repeat(6).slice(0, 200)}
                    </span>
                  ) : (
                    <>
                      {streamedCode || code}
                      {/* Blinking cursor at end */}
                      {streamedCode && streamedCode.length < code.length && (
                        <span className="animate-cursor-blink inline-block w-2 h-3 bg-foreground ml-0.5 align-middle" />
                      )}
                    </>
                  )}
                </pre>
                <div ref={codeEndRef} />
              </div>

              {/* Code panel footer */}
              <div className="border-t border-border px-4 py-2.5 flex items-center justify-between shrink-0">
                <span className="font-mono text-[9px] text-muted-foreground">
                  {code.split("\n").length} lines · {(code.length / 1024).toFixed(1)} KB
                </span>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                    {copied ? <Check size={10} /> : <Copy size={10} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <span className="text-border">·</span>
                  <button onClick={handleDownload} className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                    <Download size={10} /> Export
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Workspace;
