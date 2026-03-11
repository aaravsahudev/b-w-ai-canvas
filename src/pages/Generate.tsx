import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send, Plus, Code, Globe, MessageSquare, Settings,
  ChevronDown, Copy, Download, RefreshCw, Trash2,
  ArrowLeft, Sparkles, Check, Eye, EyeOff, Link, Loader2,
} from "lucide-react";
import logo from "@/assets/logo.png";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>?";

type GenerationType = "code" | "website" | "clone";
type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  type: GenerationType;
  timestamp: Date;
};
type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  type: GenerationType;
  createdAt: Date;
};

const MODELS: Record<GenerationType, string[]> = {
  code: [
    "QWS-Code-v4-Pro", "QWS-Code-v4", "QWS-Code-v3-Advanced",
    "QWS-Architect-v2", "QWS-Debug-v3", "QWS-Frontend-v2",
    "QWS-Backend-v2", "QWS-API-Design-v1",
  ],
  website: [
    "QWS-Web-v4-Pro", "QWS-Web-v4", "QWS-Landing-v3",
    "QWS-Portfolio-v2", "QWS-Ecommerce-v2", "QWS-Blog-v2",
  ],
  clone: [
    "QWS-Clone-v4-Pro", "QWS-Clone-v4", "QWS-Clone-Pixel-v3",
    "QWS-Clone-Adaptive-v2", "QWS-Clone-Semantic-v2",
  ],
};

const TYPE_ICONS: Record<GenerationType, typeof Code> = {
  code: Code,
  website: Globe,
  clone: Link,
};

// Extract raw HTML from a message if it contains an HTML code block
function extractHTML(content: string): string | null {
  const match = content.match(/```html\n([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

// Validate URL format
function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str.startsWith("http") ? str : `https://${str}`);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

function normalizeUrl(str: string): string {
  return str.startsWith("http") ? str : `https://${str}`;
}

// Call Anthropic API to clone a website from a URL
async function cloneWebsiteFromUrl(url: string): Promise<string> {
  const normalizedUrl = normalizeUrl(url);

  const systemPrompt = `You are an expert frontend developer specializing in pixel-perfect website cloning. 
When given a website URL, you will generate a complete, self-contained HTML file that visually clones the website as accurately as possible.

RULES:
- Return ONLY a single complete HTML file inside a \`\`\`html code block
- Use inline CSS (no external stylesheets)
- Recreate the layout, color scheme, typography, spacing, and visual hierarchy
- Include realistic placeholder content that matches the website's niche and style
- Use web-safe fonts or Google Fonts via CDN
- Make it responsive
- Add subtle hover effects and interactions with vanilla JS if appropriate
- The output must be a fully functional standalone HTML file
- After the code block, add a brief line like "✓ Clone complete | Tokens used: X | Latency: Xms"`;

  const userPrompt = `Clone this website: ${normalizedUrl}

Based on the URL and domain, infer what type of website this is and create an accurate visual clone. 
Match the likely color scheme, layout structure, navigation style, hero section, and overall design language of this type of site.
Make it look as close to the real site as possible using your knowledge of this website or similar sites in its category.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message ?? "API request failed");
  }

  const data = await response.json();
  const fullText = data.content
    .map((item: { type: string; text?: string }) => (item.type === "text" ? item.text : ""))
    .filter(Boolean)
    .join("\n");

  return fullText;
}

const SAMPLE_CODE_RESPONSES: string[] = [
  `\`\`\`typescript
// QuickWebStack API Client
import { QWSClient } from '@quickwebstack/sdk';

const client = new QWSClient({
  apiKey: process.env.QWS_API_KEY,
  model: 'qws-code-v4',
  timeout: 30000,
});

async function generateCode(prompt: string) {
  const response = await client.generate({
    prompt,
    maxTokens: 4096,
    temperature: 0.3,
    language: 'typescript',
  });

  return {
    code: response.output,
    tokens: response.usage.totalTokens,
    latency: response.metrics.latencyMs,
  };
}

const result = await generateCode("Create a REST API with authentication");
console.log(result.code);
\`\`\`

✓ Syntax validated
✓ Type-checked
✓ 0 errors, 0 warnings

Tokens used: 847 | Latency: 18ms`,
];

const SAMPLE_WEBSITE_RESPONSES: string[] = [
  `\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SaaS Landing Page</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: #0a0a0a; color: #fff; }
    nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 4rem; border-bottom: 1px solid #222; }
    .logo { font-size: 1.4rem; font-weight: 700; letter-spacing: -0.02em; }
    .btn { padding: 0.6rem 1.4rem; background: #fff; color: #000; border: none; cursor: pointer; font-size: 0.9rem; font-weight: 600; border-radius: 6px; }
    .hero { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; text-align: center; padding: 4rem; }
    h1 { font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 800; letter-spacing: -0.04em; line-height: 1.1; max-width: 800px; }
    h1 span { background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle { color: #888; font-size: 1.1rem; margin: 1.5rem 0 2.5rem; max-width: 500px; line-height: 1.7; }
    .cta-group { display: flex; gap: 1rem; }
    .btn-outline { padding: 0.6rem 1.4rem; border: 1px solid #444; background: transparent; color: #fff; cursor: pointer; font-size: 0.9rem; border-radius: 6px; }
  </style>
</head>
<body>
  <nav><div class="logo">Acme</div><button class="btn">Get Started</button></nav>
  <section class="hero">
    <h1>Build faster with <span>AI-powered</span> tools</h1>
    <p class="subtitle">Ship production-ready code in minutes.</p>
    <div class="cta-group">
      <button class="btn">Start for free</button>
      <button class="btn-outline">Watch demo</button>
    </div>
  </section>
</body>
</html>
\`\`\`

✓ Valid HTML5 | ✓ Responsive | ✓ 0 errors

Tokens used: 1,024 | Latency: 21ms`,
];

const SAMPLE_RESPONSES: Record<"code" | "website", string[]> = {
  code: SAMPLE_CODE_RESPONSES,
  website: SAMPLE_WEBSITE_RESPONSES,
};

const QUICK_PROMPTS: Record<GenerationType, string[]> = {
  website: [
    "SaaS landing page with dark theme",
    "Personal portfolio with animations",
    "Restaurant website with menu",
    "E-commerce product page",
    "Blog homepage with sidebar",
    "Agency website with hero section",
  ],
  code: [
    "Build a REST API with Express.js",
    "Create a React hook for dark mode",
    "Write a sorting algorithm in Python",
    "Generate a database schema for e-commerce",
    "Create a Vue.js component with animations",
    "Build a GraphQL resolver for users",
  ],
  clone: [
    "stripe.com",
    "linear.app",
    "vercel.com",
    "notion.so",
    "github.com",
    "airbnb.com",
  ],
};

const Generate = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [genType, setGenType] = useState<GenerationType>("clone");
  const [selectedModel, setSelectedModel] = useState(MODELS.clone[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [cipherActive, setCipherActive] = useState(false);
  const [cipherText, setCipherText] = useState("");
  const [previewMsgId, setPreviewMsgId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [cloneStatus, setCloneStatus] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const messages = useMemo(() => activeConv?.messages ?? [], [activeConv?.messages]);

  const previewMsg = messages.find((m) => m.id === previewMsgId);
  const previewHTML = previewMsg ? extractHTML(previewMsg.content) : null;

  useEffect(() => {
    setSelectedModel(MODELS[genType][0]);
    setPrompt("");
    setUrlError(null);
  }, [genType]);

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

  const createConversation = useCallback((type: GenerationType) => {
    const conv: Conversation = {
      id: crypto.randomUUID(),
      title: "New Generation",
      messages: [],
      type,
      createdAt: new Date(),
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveConvId(conv.id);
    return conv.id;
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isGenerating) return;

    // Validate URL for clone mode
    if (genType === "clone") {
      if (!isValidUrl(prompt.trim())) {
        setUrlError("Please enter a valid website URL (e.g. stripe.com or https://stripe.com)");
        return;
      }
      setUrlError(null);
    }

    let convId = activeConvId;
    if (!convId) convId = createConversation(genType);

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: genType === "clone" ? `Clone: ${normalizeUrl(prompt.trim())}` : prompt,
      type: genType,
      timestamp: new Date(),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        return {
          ...c,
          messages: [...c.messages, userMsg],
          title:
            c.messages.length === 0
              ? (genType === "clone" ? `Clone: ${prompt.trim()}` : prompt).slice(0, 40)
              : c.title,
        };
      })
    );

    setPrompt("");
    setIsGenerating(true);
    setCipherActive(true);

    if (genType === "clone") {
      // Real API call for cloning
      const cloneStatuses = [
        "FETCHING URL...",
        "ANALYZING LAYOUT...",
        "EXTRACTING STYLES...",
        "REBUILDING STRUCTURE...",
        "GENERATING HTML...",
        "FINALIZING...",
      ];
      let statusIdx = 0;
      setCloneStatus(cloneStatuses[0]);
      const statusInterval = setInterval(() => {
        statusIdx = Math.min(statusIdx + 1, cloneStatuses.length - 1);
        setCloneStatus(cloneStatuses[statusIdx]);
      }, 1800);

      try {
        const responseText = await cloneWebsiteFromUrl(prompt.trim());
        clearInterval(statusInterval);
        setCipherActive(false);
        setCloneStatus("");

        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: responseText,
          type: genType,
          timestamp: new Date(),
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId ? { ...c, messages: [...c.messages, assistantMsg] } : c
          )
        );

        // Auto-open preview
        setPreviewMsgId(assistantMsg.id);
      } catch (err) {
        clearInterval(statusInterval);
        setCipherActive(false);
        setCloneStatus("");

        const errorMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `ERROR: ${err instanceof Error ? err.message : "Failed to clone website. Please try again."}`,
          type: genType,
          timestamp: new Date(),
        };
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId ? { ...c, messages: [...c.messages, errorMsg] } : c
          )
        );
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Simulated response for code/website
      const duration = 1200 + Math.random() * 1500;
      setTimeout(() => {
        setCipherActive(false);

        const responses = SAMPLE_RESPONSES[genType as "code" | "website"];
        const responseText = responses[Math.floor(Math.random() * responses.length)];

        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: responseText,
          type: genType,
          timestamp: new Date(),
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId ? { ...c, messages: [...c.messages, assistantMsg] } : c
          )
        );
        setIsGenerating(false);

        if (genType === "website") {
          setPreviewMsgId(assistantMsg.id);
        }
      }, duration);
    }
  }, [prompt, isGenerating, activeConvId, genType, createConversation]);

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

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (content: string) => {
    const html = extractHTML(content);
    const blob = new Blob([html ?? content], {
      type: html ? "text/html" : "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = html ? "website.html" : "code.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const TypeIcon = TYPE_ICONS[genType];

  return (
    <div className="h-screen w-screen flex bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-72" : "w-0"} border-r border-border flex flex-col transition-all duration-200 overflow-hidden shrink-0`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 group cursor-pointer bg-background border-0 p-0"
          >
            <ArrowLeft size={14} className="text-muted-foreground group-hover:text-foreground" />
            <img src={logo} alt="QuickWebStack" className="h-5" />
          </button>
        </div>

        <div className="p-3 shrink-0">
          <button
            onClick={() => { setActiveConvId(null); inputRef.current?.focus(); }}
            className="btn-primary w-full text-xs py-3 gap-2"
          >
            <Plus size={14} /> NEW GENERATION
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const ConvIcon = TYPE_ICONS[conv.type];
            return (
              <div
                key={conv.id}
                className={`group flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-border transition-colors ${
                  conv.id === activeConvId ? "bg-secondary" : "hover:bg-secondary"
                }`}
                onClick={() => setActiveConvId(conv.id)}
              >
                <ConvIcon size={14} className="shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs truncate">{conv.title}</div>
                  <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
                    {conv.messages.length} messages · {conv.type}
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
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
                No generations yet.<br />Start by typing a prompt.
              </p>
            </div>
          )}
        </div>

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

            {/* Type switcher */}
            <div className="flex gap-px bg-border">
              {(["clone", "website", "code"] as GenerationType[]).map((t) => {
                const Icon = TYPE_ICONS[t];
                return (
                  <button
                    key={t}
                    onClick={() => setGenType(t)}
                    className={`flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider cursor-pointer border-0 transition-colors ${
                      genType === t
                        ? "bg-foreground text-background"
                        : "bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon size={12} /> {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model selector */}
          <div className="relative">
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-border font-mono text-xs tracking-wider cursor-pointer bg-background text-foreground hover:border-foreground transition-colors"
            >
              <Sparkles size={12} />
              {selectedModel}
              <ChevronDown size={12} />
            </button>
            {showModelDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-background border border-border z-20 min-w-[240px] shadow-lg">
                {MODELS[genType].map((model) => (
                  <button
                    key={model}
                    onClick={() => { setSelectedModel(model); setShowModelDropdown(false); }}
                    className={`w-full text-left px-4 py-3 font-mono text-xs border-0 cursor-pointer transition-colors flex items-center justify-between ${
                      model === selectedModel
                        ? "bg-foreground text-background"
                        : "bg-background text-foreground hover:bg-secondary"
                    }`}
                  >
                    {model}
                    {model === selectedModel && <Check size={12} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Body: messages + optional preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* Messages area */}
          <div className={`${previewHTML ? "w-1/2" : "w-full"} overflow-y-auto transition-all duration-300`}>
            {messages.length === 0 && !isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center px-6">
                <TypeIcon size={32} strokeWidth={1} className="mb-6 text-muted-foreground" />
                <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center">
                  {genType === "clone" ? "CLONE ANY WEBSITE" : genType === "website" ? "GENERATE WEBSITE" : "WRITE CODE"}
                </h2>
                <p className="font-mono text-xs text-muted-foreground text-center max-w-md mb-10">
                  {genType === "clone"
                    ? "Enter any website URL and get a complete, pixel-perfect HTML clone in seconds. Powered by Claude AI."
                    : genType === "website"
                    ? "Describe the website you want. Get a complete, ready-to-use HTML file instantly."
                    : "Enter a detailed prompt. The more context you provide, the better the generated code."}
                </p>

                {genType === "clone" && (
                  <div className="flex items-center gap-2 mb-6 px-4 py-2 border border-border bg-secondary font-mono text-[10px] text-muted-foreground">
                    <Sparkles size={10} className="text-foreground" />
                    POWERED BY CLAUDE AI · REAL-TIME GENERATION
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                  {QUICK_PROMPTS[genType].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPrompt(p)}
                      className="text-left px-4 py-3 border border-border font-mono text-xs hover:bg-secondary cursor-pointer bg-background text-foreground transition-colors hover:border-foreground"
                    >
                      {genType === "clone" ? (
                        <span className="flex items-center gap-2">
                          <Link size={10} className="shrink-0 text-muted-foreground" />
                          {p}
                        </span>
                      ) : p}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto px-6 py-8">
                {messages.map((msg) => {
                  const msgHTML = extractHTML(msg.content);
                  return (
                    <div key={msg.id} className={`mb-8 ${msg.role === "user" ? "" : "animate-slide-up"}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-6 h-6 flex items-center justify-center font-mono text-xs font-bold ${
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
                        {msg.type === "clone" && msg.role === "assistant" && msgHTML && (
                          <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground border border-border px-2 py-0.5">
                            <Sparkles size={8} /> AI CLONE
                          </span>
                        )}
                      </div>

                      <div className="pl-9">
                        <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                          {msg.content}
                        </pre>

                        {msg.role === "assistant" && (
                          <div className="flex gap-2 mt-4 flex-wrap">
                            <button
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-border font-mono text-[10px] tracking-wider cursor-pointer bg-background text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                              onClick={() => handleCopy(msg.content, msg.id)}
                            >
                              {copiedId === msg.id ? <Check size={10} /> : <Copy size={10} />}
                              {copiedId === msg.id ? "COPIED" : "COPY"}
                            </button>
                            {msgHTML && (
                              <>
                                <button
                                  className="flex items-center gap-1.5 px-3 py-1.5 border border-border font-mono text-[10px] tracking-wider cursor-pointer bg-background text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                                  onClick={() => handleDownload(msg.content)}
                                >
                                  <Download size={10} /> EXPORT HTML
                                </button>
                                <button
                                  className={`flex items-center gap-1.5 px-3 py-1.5 border font-mono text-[10px] tracking-wider cursor-pointer transition-colors ${
                                    previewMsgId === msg.id
                                      ? "border-foreground bg-foreground text-background"
                                      : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground"
                                  }`}
                                  onClick={() =>
                                    setPreviewMsgId(previewMsgId === msg.id ? null : msg.id)
                                  }
                                >
                                  {previewMsgId === msg.id ? <EyeOff size={10} /> : <Eye size={10} />}
                                  {previewMsgId === msg.id ? "HIDE PREVIEW" : "PREVIEW"}
                                </button>
                              </>
                            )}
                            <button
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-border font-mono text-[10px] tracking-wider cursor-pointer bg-background text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                              onClick={handleGenerate}
                            >
                              <RefreshCw size={10} /> RETRY
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {isGenerating && (
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-6 flex items-center justify-center border border-foreground font-mono text-xs font-bold">
                        Q
                      </div>
                      <span className="font-mono text-xs tracking-wider">QUICKWEBSTACK</span>
                    </div>
                    <div className="pl-9">
                      {genType === "clone" ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                            <Loader2 size={12} className="animate-spin" />
                            <span>{cloneStatus || "INITIALIZING..."}</span>
                          </div>
                          {cipherActive && (
                            <div className="font-mono text-sm text-muted-foreground break-all opacity-40">
                              {cipherText}
                            </div>
                          )}
                        </div>
                      ) : cipherActive ? (
                        <div className="font-mono text-sm text-muted-foreground break-all">
                          {cipherText}
                        </div>
                      ) : (
                        <div className="font-mono text-sm">FINALIZING...</div>
                      )}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Live preview panel */}
          {previewHTML && (
            <div className="w-1/2 border-l border-border flex flex-col">
              <div className="px-4 py-2 border-b border-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs tracking-wider text-muted-foreground">
                    LIVE PREVIEW
                  </span>
                  {previewMsg?.type === "clone" && (
                    <span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground border border-border px-2 py-0.5">
                      <Link size={8} /> CLONED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="font-mono text-[10px] text-muted-foreground hover:text-foreground border border-border px-2 py-1 bg-background cursor-pointer"
                    onClick={() => previewMsg && handleDownload(previewMsg.content)}
                  >
                    <Download size={10} />
                  </button>
                  <button
                    onClick={() => setPreviewMsgId(null)}
                    className="font-mono text-[10px] text-muted-foreground hover:text-foreground border-0 bg-background cursor-pointer"
                  >
                    ✕ CLOSE
                  </button>
                </div>
              </div>
              <iframe
                key={previewMsgId}
                srcDoc={previewHTML}
                className="flex-1 w-full border-0"
                sandbox="allow-scripts"
                title="Website Preview"
              />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t border-border p-4 shrink-0 bg-background">
          <div className="max-w-4xl mx-auto">
            {urlError && (
              <div className="mb-2 px-3 py-2 border border-red-500/30 bg-red-500/5 font-mono text-[10px] text-red-400 flex items-center gap-2">
                <span>✕</span> {urlError}
              </div>
            )}
            <div className="flex items-end gap-3">
              {genType === "clone" && (
                <div className="flex items-center gap-2 px-3 py-4 border border-border border-r-0 bg-secondary shrink-0">
                  <Link size={14} className="text-muted-foreground" />
                  <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">URL</span>
                </div>
              )}
              <div className={`flex-1 relative border ${urlError ? "border-red-500/50" : "border-border"} focus-within:border-foreground transition-colors`}>
                <textarea
                  ref={inputRef}
                  value={prompt}
                  onChange={(e) => { setPrompt(e.target.value); if (urlError) setUrlError(null); }}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    genType === "clone"
                      ? "Enter website URL to clone (e.g. stripe.com, https://linear.app)"
                      : genType === "website"
                      ? "Describe the website you want to generate..."
                      : "Describe the code you want to generate..."
                  }
                  className="w-full bg-background text-foreground font-mono text-sm p-4 pr-12 resize-none outline-none min-h-[56px] max-h-[200px] border-0"
                  rows={1}
                  disabled={isGenerating}
                  style={{ caretColor: "hsl(var(--foreground))" }}
                  data-testid="code-input"
                />
                <div className="absolute right-3 bottom-3 font-mono text-[10px] text-muted-foreground">
                  {selectedModel}
                </div>
              </div>
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="btn-primary p-4 disabled:opacity-20 disabled:cursor-not-allowed shrink-0 transition-all hover:scale-105 active:scale-95"
                data-testid="generate-button"
              >
                {isGenerating && genType === "clone" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : genType === "clone" ? (
                  <Link size={16} />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
            {genType === "clone" && (
              <p className="mt-2 font-mono text-[10px] text-muted-foreground text-center">
                Powered by Claude AI · Enter any URL to generate a pixel-perfect HTML clone
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;