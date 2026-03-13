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
  FileCode,
  FileType,
  Braces,
} from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";
import { generateWebsite } from "@/utils/codeGenerator";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(){}<>";

interface ModelInfo {
  id: string;
  name: string;
  tag: string;
  badge: string;
}

interface ProjectState {
  id: string;
  prompt: string;
  code: string;
  model?: ModelInfo;
  timestamp: number;
}

type ChatMsg = {
  id: string;
  role: "user" | "ai";
  text: string;
};

type FileTab = "html" | "css" | "js";

const BUILDING_MSGS = [
  "Analyzing your request...",
  "Scaffolding layout structure...",
  "Generating styles and typography...",
  "Writing component logic...",
  "Applying responsive breakpoints...",
  "Finalizing and rendering...",
];

const extractCss = (html: string): string => {
  const match = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  return match ? match[1].trim() : "/* No styles found */";
};

const extractJs = (html: string): string => {
  const match = html.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  return match ? match[1].trim() : "// No scripts found";
};

const FILE_TABS: { id: FileTab; label: string; icon: React.ElementType; ext: string }[] = [
  { id: "html", label: "index.html",  icon: FileCode, ext: "HTML" },
  { id: "css",  label: "styles.css",  icon: FileType, ext: "CSS" },
  { id: "js",   label: "script.js",   icon: Braces,   ext: "JS" },
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
      text: project?.prompt
        ? `Your website is ready. I built it based on: "${project.prompt}". Ask me to change colors, layout, content, or add sections.`
        : "Welcome! Describe the website you'd like to build and I'll generate it for you.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [codeOpen, setCodeOpen] = useState(false);
  const [activeFile, setActiveFile] = useState<FileTab>("html");
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
    if (codeOpen) codeEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [streamedCode, codeOpen]);

  useEffect(() => {
    if (!isBuilding) { setCipherText(""); return; }
    const id = setInterval(() => {
      setCipherText(
        Array.from({ length: 32 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("")
      );
    }, 45);
    return () => clearInterval(id);
  }, [isBuilding]);

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

  const streamCode = useCallback((newCode: string) => {
    setStreamedCode("");
    setCodeOpen(true);
    setActiveFile("html");
    let i = 0;
    const chunkSize = 14;
    const id = setInterval(() => {
      i += chunkSize;
      setStreamedCode(newCode.slice(0, i));
      if (i >= newCode.length) { setStreamedCode(newCode); clearInterval(id); }
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
          text: "Done! Live preview updated. The code panel shows the generated source. Want me to refine anything?",
        },
      ]);
    }, delay);
  }, [input, isBuilding, streamCode]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const getFileContent = (tab: FileTab): string => {
    const src = streamedCode || code;
    if (tab === "css") return extractCss(src);
    if (tab === "js")  return extractJs(src);
    return src;
  };

  const copyContent = getFileContent(activeFile);

  const handleCopy = () => {
    navigator.clipboard.writeText(copyContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    if (activeFile === "html") {
      a.href = "data:text/html;charset=utf-8," + encodeURIComponent(code);
      a.download = "index.html";
    } else if (activeFile === "css") {
      a.href = "data:text/css;charset=utf-8," + encodeURIComponent(extractCss(code));
      a.download = "styles.css";
    } else {
      a.href = "data:text/javascript;charset=utf-8," + encodeURIComponent(extractJs(code));
      a.download = "script.js";
    }
    a.click();
  };

  if (!project) return null;

  const modelName = project.model?.name ?? "QWS-ULTRA-V4";

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* ── TOP BAR */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0 bg-background">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate("/generate")}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-mono text-xs shrink-0"
          >
            <ArrowLeft size={13} /> New
          </button>
          <div className="w-px h-4 bg-border shrink-0" />
          <div className="shrink-0">
            <AnimatedLogo size={22} />
          </div>
          <div className="w-px h-4 bg-border shrink-0 hidden sm:block" />
          {isBuilding ? (
            <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground animate-pulse min-w-0">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full shrink-0" />
              <span className="truncate">{BUILDING_MSGS[buildStep]}</span>
            </div>
          ) : (
            <span className="font-mono text-[10px] text-muted-foreground hidden sm:block truncate max-w-[200px]">
              {project.prompt.slice(0, 48)}{project.prompt.length > 48 ? "…" : ""}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-mono text-[9px] text-muted-foreground border border-border px-1.5 py-0.5 hidden md:inline-flex items-center">
            {modelName}
          </span>
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
          <button
            onClick={() => setCodeOpen((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border font-mono text-xs transition-colors ${
              codeOpen ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground"
            }`}
          >
            <Code2 size={11} /> <span className="hidden sm:inline">Code</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border font-mono text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-border font-mono text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
          >
            <Download size={11} /> <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* ── MAIN AREA */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT: Chat panel */}
        <div className="w-64 md:w-72 shrink-0 flex flex-col border-r border-border bg-background">
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {chat.map((msg) => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-5 h-5 shrink-0 flex items-center justify-center font-mono text-[9px] font-bold mt-0.5 ${
                  msg.role === "user" ? "bg-foreground text-background" : "border border-foreground text-foreground"
                }`}>
                  {msg.role === "user" ? "U" : "Q"}
                </div>
                <div className={`max-w-[170px] md:max-w-[190px] px-3 py-2 font-mono text-[11px] leading-relaxed ${
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
                  <div className="w-full h-px bg-border">
                    <div className="h-px bg-foreground transition-all duration-500" style={{ width: `${buildProgress}%` }} />
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground">{BUILDING_MSGS[buildStep]}</div>
                  <div className="font-mono text-[9px] text-muted-foreground/50 animate-cipher break-all leading-loose">{cipherText}</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

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
            <p className="font-mono text-[9px] text-muted-foreground mt-1.5">Enter to send · Shift+Enter newline</p>
          </div>
        </div>

        {/* CENTER: Live Preview */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#111] relative">
          {isBuilding && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
              <div className="relative w-14 h-14 mb-6">
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

          <div className={`flex-1 flex items-start justify-center overflow-auto ${deviceMode === "mobile" ? "p-8 bg-secondary" : ""}`}>
            {code ? (
              <iframe
                key={code}
                srcDoc={code}
                sandbox="allow-scripts"
                title="Website Preview"
                className={`border-0 ${deviceMode === "mobile" ? "w-[375px] h-[812px] shadow-2xl" : "w-full h-full"}`}
                style={{ background: "#fff" }}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <div className="text-center font-mono text-muted-foreground">
                  <div className="text-lg font-bold mb-2">PREVIEW EMPTY</div>
                  <div className="text-xs">Send a message to generate your website</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Code Panel */}
        <div
          className="flex flex-col border-l border-border bg-background overflow-hidden shrink-0 transition-all duration-300"
          style={{ width: codeOpen ? 420 : 0 }}
        >
          {codeOpen && (
            <>
              {/* File tabs */}
              <div className="flex items-stretch border-b border-border shrink-0 overflow-x-auto">
                {FILE_TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFile(tab.id)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 font-mono text-[10px] whitespace-nowrap border-r border-border transition-colors ${
                        activeFile === tab.id
                          ? "bg-foreground text-background"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon size={10} />
                      {tab.label}
                    </button>
                  );
                })}
                <div className="flex-1" />
                <button
                  onClick={() => setCodeOpen(false)}
                  className="px-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Code status bar */}
              <div className="flex items-center gap-2 px-4 py-1.5 border-b border-border bg-secondary shrink-0">
                <span className="font-mono text-[9px] text-muted-foreground tracking-widest">
                  {FILE_TABS.find(t => t.id === activeFile)?.ext}
                </span>
                {isBuilding && (
                  <span className="flex items-center gap-1 font-mono text-[9px] text-green-400 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                    GENERATING
                  </span>
                )}
              </div>

              {/* Code content */}
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
                      {getFileContent(activeFile)}
                      {streamedCode && streamedCode.length < code.length && activeFile === "html" && (
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
                  {getFileContent(activeFile).split("\n").length} lines
                </span>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors">
                    {copied ? <Check size={10} /> : <Copy size={10} />} {copied ? "Copied" : "Copy"}
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
