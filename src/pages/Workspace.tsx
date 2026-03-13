import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Eye,
  Code2,
  Download,
  Copy,
  RefreshCw,
  Plus,
  Monitor,
  Smartphone,
  Check,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { generateWebsite } from "@/utils/codeGenerator";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

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

const Workspace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const project = location.state as ProjectState | null;

  const [code, setCode] = useState(project?.code ?? "");
  const [chat, setChat] = useState<ChatMsg[]>([
    {
      id: "welcome",
      role: "ai",
      text: `I've built your website based on: "${project?.prompt}". You can see the live preview on the right. Ask me to change anything — colors, layout, content, sections — and I'll update it instantly.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [cipherText, setCipherText] = useState("");
  const [copied, setCopied] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!project) navigate("/generate");
  }, [project, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    if (!isBuilding) { setCipherText(""); return; }
    const id = setInterval(() => {
      setCipherText(
        Array.from({ length: 40 }, () =>
          CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join("")
      );
    }, 40);
    return () => clearInterval(id);
  }, [isBuilding]);

  const handleSend = useCallback(() => {
    if (!input.trim() || isBuilding) return;

    const userText = input.trim();
    setInput("");

    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: "user", text: userText };
    setChat((prev) => [...prev, userMsg]);
    setIsBuilding(true);

    const delay = 1400 + Math.random() * 1000;
    setTimeout(() => {
      const newCode = generateWebsite(userText);
      setCode(newCode);
      setIsBuilding(false);

      const aiMsg: ChatMsg = {
        id: crypto.randomUUID(),
        role: "ai",
        text: `Done! I've updated your website based on your request. The live preview has been refreshed. Want me to tweak anything else?`,
      };
      setChat((prev) => [...prev, aiMsg]);
    }, delay);
  }, [input, isBuilding]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/generate")}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-mono text-xs"
          >
            <ArrowLeft size={13} /> New
          </button>
          <div className="w-px h-4 bg-border" />
          <img src={logo} alt="QWS" className="h-4" />
          <span className="font-mono text-xs text-muted-foreground hidden sm:block truncate max-w-[200px]">
            {project.prompt.slice(0, 40)}{project.prompt.length > 40 ? "…" : ""}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex border border-border">
            <button
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs transition-colors ${
                viewMode === "preview"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye size={11} /> Preview
            </button>
            <button
              onClick={() => setViewMode("code")}
              className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs border-l border-border transition-colors ${
                viewMode === "code"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code2 size={11} /> Code
            </button>
          </div>

          {/* Device toggle (preview only) */}
          {viewMode === "preview" && (
            <div className="flex border border-border">
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`px-2.5 py-1.5 transition-colors ${
                  deviceMode === "desktop" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Monitor size={13} />
              </button>
              <button
                onClick={() => setDeviceMode("mobile")}
                className={`px-2.5 py-1.5 border-l border-border transition-colors ${
                  deviceMode === "mobile" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Smartphone size={13} />
              </button>
            </div>
          )}

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

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT — Chat */}
        <div className="w-80 shrink-0 flex flex-col border-r border-border bg-background">
          {/* Chat history */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chat.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`w-6 h-6 shrink-0 flex items-center justify-center font-mono text-[10px] font-bold mt-0.5 ${
                    msg.role === "user"
                      ? "bg-foreground text-background"
                      : "border border-foreground text-foreground"
                  }`}
                >
                  {msg.role === "user" ? "U" : "Q"}
                </div>
                {/* Bubble */}
                <div
                  className={`rounded-none max-w-[200px] px-3 py-2.5 font-mono text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-foreground text-background"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Generating indicator */}
            {isBuilding && (
              <div className="flex gap-2.5 animate-slide-up">
                <div className="w-6 h-6 shrink-0 flex items-center justify-center font-mono text-[10px] font-bold border border-foreground">
                  Q
                </div>
                <div className="bg-secondary px-3 py-2.5 max-w-[200px]">
                  <div className="font-mono text-[10px] text-muted-foreground animate-cipher leading-loose break-all">
                    {cipherText || "Rebuilding..."}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <div className="border-t border-border p-3 shrink-0">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask to change anything..."
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
                <Send size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT — Preview / Code */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {viewMode === "preview" ? (
            <div
              className={`flex-1 flex items-start justify-center overflow-auto bg-secondary ${
                deviceMode === "mobile" ? "p-6" : ""
              }`}
            >
              <iframe
                ref={iframeRef}
                key={code}
                srcDoc={code}
                sandbox="allow-scripts"
                title="Website Preview"
                className={`border-0 bg-white ${
                  deviceMode === "mobile"
                    ? "w-[375px] h-[812px] shadow-2xl"
                    : "w-full h-full"
                }`}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <pre className="font-mono text-xs leading-relaxed p-6 text-foreground whitespace-pre-wrap break-words">
                {code}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workspace;
