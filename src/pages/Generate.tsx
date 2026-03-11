import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send,
  Plus,
  Code,
  MessageSquare,
  Settings,
  ChevronDown,
  Copy,
  Download,
  RefreshCw,
  Trash2,
  ArrowLeft,
  Sparkles,
  Check,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { generateCode, CodeLanguage } from "@/utils/codeGenerator";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>?";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};
type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
};

const LANGUAGES: CodeLanguage[] = ["html", "react", "vue", "nextjs"];

const LANGUAGE_NAMES: Record<CodeLanguage, string> = {
  html: "HTML",
  react: "React",
  vue: "Vue.js",
  nextjs: "Next.js",
};

const Generate = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>("html");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [cipherActive, setCipherActive] = useState(false);
  const [cipherText, setCipherText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const messages = useMemo(() => activeConv?.messages ?? [], [activeConv?.messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!cipherActive) return;
    const interval = setInterval(() => {
      setCipherText(
        Array.from({ length: 60 }, () =>
          CHARS[Math.floor(Math.random() * CHARS.length)]
        ).join("")
      );
    }, 30);
    return () => clearInterval(interval);
  }, [cipherActive]);

  const createConversation = useCallback(() => {
    const conv: Conversation = {
      id: crypto.randomUUID(),
      title: "New Generation",
      messages: [],
      createdAt: new Date(),
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveConvId(conv.id);
    return conv.id;
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;

    let convId = activeConvId;
    if (!convId) {
      convId = createConversation();
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
      timestamp: new Date(),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        const updated = {
          ...c,
          messages: [...c.messages, userMsg],
          title:
            c.messages.length === 0
              ? prompt.slice(0, 40) + (prompt.length > 40 ? "..." : "")
              : c.title,
        };
        return updated;
      })
    );

    setPrompt("");
    setIsGenerating(true);
    setCipherActive(true);

    const duration = 1200 + Math.random() * 1500;
    setTimeout(() => {
      setCipherActive(false);

      // Generate code using the code generator utility
      const generatedCode = generateCode(prompt, selectedLanguage);

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `✓ ${LANGUAGE_NAMES[selectedLanguage]} website generated successfully!`,
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, messages: [...c.messages, assistantMsg] } : c
        )
      );
      setIsGenerating(false);

      // Navigate to the app preview with the generated project
      setTimeout(() => {
        navigate("/app", {
          state: {
            id: crypto.randomUUID(),
            title: prompt.slice(0, 50),
            code: generatedCode,
            language: selectedLanguage,
            prompt: prompt,
          },
        });
      }, 500);
    }, duration);
  }, [prompt, isGenerating, activeConvId, selectedLanguage, createConversation, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) setActiveConvId(null);
  };

  return (
    <div className="h-screen w-screen flex bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } border-r border-border flex flex-col transition-all duration-200 overflow-hidden shrink-0`}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 group cursor-pointer bg-background border-0 p-0">
            <ArrowLeft size={14} className="text-muted-foreground group-hover:text-foreground" />
            <img src={logo} alt="QuickWebStack" className="h-5" />
          </button>
        </div>

        {/* New conversation */}
        <div className="p-3 shrink-0">
          <button
            onClick={() => {
              setActiveConvId(null);
              inputRef.current?.focus();
            }}
            className="btn-primary w-full text-xs py-3 gap-2"
          >
            <Plus size={14} /> NEW GENERATION
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            return (
              <div
                key={conv.id}
                className={`group flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-border transition-colors ${
                  conv.id === activeConvId
                    ? "bg-secondary"
                    : "hover:bg-secondary"
                }`}
                onClick={() => setActiveConvId(conv.id)}
              >
                <Code size={14} className="shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs truncate">{conv.title}</div>
                  <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
                    {conv.messages.length} messages
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConversation(conv.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 bg-background border-0 cursor-pointer p-1 text-muted-foreground hover:text-foreground"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}

          {conversations.length === 0 && (
            <div className="p-6 text-center">
              <MessageSquare size={20} className="mx-auto mb-3 text-muted-foreground" />
              <p className="font-mono text-xs text-muted-foreground">
                No generations yet.
                <br />
                Start by typing a prompt.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-border shrink-0">
          <button className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground cursor-pointer bg-background border-0 p-0 w-full">
            <Settings size={14} /> SETTINGS
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="border-b border-border px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-background border border-border w-8 h-8 flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground hover:border-foreground"
            >
              ≡
            </button>

            {/* Language selector */}
            <div className="flex gap-px bg-border">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider cursor-pointer border-0 transition-colors ${
                    selectedLanguage === lang
                      ? "bg-foreground text-background"
                      : "bg-background text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`lang-${lang}`}
                >
                  <Code size={12} /> {LANGUAGE_NAMES[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Generate status */}
          <div className="flex items-center gap-3">
            {isGenerating && (
              <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground animate-pulse">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                GENERATING...
              </div>
            )}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 && !isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center px-6">
              <Code size={32} strokeWidth={1} className="mb-6 text-muted-foreground" />
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center">
                GENERATE NOW
              </h2>
              <p className="font-mono text-xs text-muted-foreground text-center max-w-md mb-10">
                Describe your website idea. Our AI will generate code in your chosen language and show you a live preview.
              </p>

              {/* Quick prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                {[
                  "Create a landing page with hero section",
                  "Build a portfolio website with projects",
                  "Design a dashboard with charts",
                  "Make a pricing page with plans",
                  "Create a blog homepage",
                  "Build a contact form page",
                ].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="text-left px-4 py-3 border border-border font-mono text-xs hover:bg-secondary cursor-pointer bg-background text-foreground transition-colors hover:border-foreground"
                    data-testid={`quick-prompt-${p.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-6 py-8">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-8 ${msg.role === "user" ? "" : "animate-slide-up"}`}
                  data-testid={`message-${msg.id}`}
                >
                  {/* Message header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-6 h-6 flex items-center justify-center font-mono text-xs font-bold transition-colors ${
                        msg.role === "user"
                          ? "bg-foreground text-background"
                          : "border border-foreground text-foreground"
                      }`}
                    >
                      {msg.role === "user" ? "U" : "Q"}
                    </div>
                    <span className="font-mono text-xs tracking-wider">
                      {msg.role === "user" ? "YOU" : "QUICKWEBSTACK"}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>

                  {/* Message content */}
                  <div className="pl-9">
                    <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                      {msg.content}
                    </pre>
                  </div>
                </div>
              ))}

              {/* Generating state */}
              {isGenerating && (
                <div className="mb-8 animate-slide-up" data-testid="generating-message">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 flex items-center justify-center border border-foreground font-mono text-xs font-bold">
                      Q
                    </div>
                    <span className="font-mono text-xs tracking-wider">
                      QUICKWEBSTACK
                    </span>
                  </div>
                  <div className="pl-9">
                    {cipherActive ? (
                      <div className="font-mono text-sm animate-cipher text-muted-foreground">
                        {cipherText}
                      </div>
                    ) : (
                      <div className="font-mono text-sm animate-text-glitch">
                        FINALIZING...
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-border p-4 shrink-0 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative border border-border focus-within:border-foreground transition-colors">
                <textarea
                  ref={inputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe the website you want to generate..."
                  className="w-full bg-background text-foreground font-mono text-sm p-4 pr-12 resize-none outline-none min-h-[56px] max-h-[200px] border-0"
                  rows={1}
                  disabled={isGenerating}
                  style={{ caretColor: "hsl(var(--foreground))" }}
                  data-testid="website-input"
                />
                <div className="absolute right-3 bottom-3 font-mono text-[10px] text-muted-foreground">
                  {LANGUAGE_NAMES[selectedLanguage]}
                </div>
              </div>
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="btn-primary p-4 disabled:opacity-20 disabled:cursor-not-allowed shrink-0 transition-all hover:scale-105 active:scale-95"
                data-testid="generate-button"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;
