import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send,
  Plus,
  FileText,
  Image,
  Code,
  Music,
  MessageSquare,
  Settings,
  ChevronDown,
  Copy,
  Download,
  RefreshCw,
  Trash2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import logo from "@/assets/logo.png";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>?";

type GenerationType = "text" | "image" | "code" | "audio";
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
  text: ["QWS-Ultra-v4", "QWS-Fast-v3", "QWS-Creative-v2"],
  image: ["QWS-Vision-v3", "QWS-Pixel-v2", "QWS-Art-v1"],
  code: ["QWS-Code-v4", "QWS-Debug-v2", "QWS-Architect-v1"],
  audio: ["QWS-Audio-v2", "QWS-Voice-v1", "QWS-Music-v1"],
};

const TYPE_ICONS: Record<GenerationType, typeof FileText> = {
  text: FileText,
  image: Image,
  code: Code,
  audio: Music,
};

const SAMPLE_RESPONSES: Record<GenerationType, string[]> = {
  text: [
    "The architecture of modern neural networks draws from decades of mathematical innovation. At their core, transformers leverage self-attention mechanisms to process sequential data in parallel — a breakthrough that fundamentally changed how we approach language understanding.\n\nKey developments include:\n• Multi-head attention for capturing diverse contextual relationships\n• Layer normalization for training stability\n• Residual connections enabling deeper architectures\n• Positional encodings for sequence-aware processing\n\nThese components work in concert to produce outputs that exhibit remarkable coherence and contextual awareness across extended sequences.",
    "QuickWebStack's generation pipeline processes your request through a multi-stage inference system:\n\n1. TOKENIZATION — Your input is decomposed into subword units using byte-pair encoding, producing an average of 1.3 tokens per word.\n\n2. EMBEDDING — Tokens are mapped to 2048-dimensional vectors in a learned semantic space.\n\n3. INFERENCE — The transformer stack processes embeddings through 96 attention layers with 16,384 hidden dimensions.\n\n4. DECODING — Output probabilities are sampled using nucleus sampling (top-p=0.95) with temperature scaling for controlled creativity.\n\nTotal pipeline latency: 23ms on average.",
  ],
  image: [
    "IMAGE GENERATED SUCCESSFULLY\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n┃                               ┃\n┃    ┌─────────────────────┐    ┃\n┃    │                     │    ┃\n┃    │   [Generated Image] │    ┃\n┃    │    1024 × 1024px     │    ┃\n┃    │    Format: PNG       │    ┃\n┃    │    Size: 2.4 MB      │    ┃\n┃    │                     │    ┃\n┃    └─────────────────────┘    ┃\n┃                               ┃\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nModel: QWS-Vision-v3\nSteps: 50 | Guidance: 7.5\nSeed: 847291035\nTime: 3.2s",
  ],
  code: [
    '```typescript\n// QuickWebStack API Client\nimport { QWSClient } from \'@quickwebstack/sdk\';\n\nconst client = new QWSClient({\n  apiKey: process.env.QWS_API_KEY,\n  model: \'qws-code-v4\',\n  timeout: 30000,\n});\n\nasync function generateCode(prompt: string) {\n  const response = await client.generate({\n    prompt,\n    maxTokens: 4096,\n    temperature: 0.3,\n    language: \'typescript\',\n  });\n\n  return {\n    code: response.output,\n    tokens: response.usage.totalTokens,\n    latency: response.metrics.latencyMs,\n  };\n}\n\n// Usage\nconst result = await generateCode(\n  "Create a REST API with authentication"\n);\nconsole.log(result.code);\n```\n\n✓ Syntax validated\n✓ Type-checked\n✓ 0 errors, 0 warnings\n\nTokens used: 847 | Latency: 18ms',
  ],
  audio: [
    "AUDIO GENERATION COMPLETE\n\n━━━━ WAVEFORM ━━━━━━━━━━━━━━━━━\n╭──────────────────────────────╮\n│ ▁▂▃▅▇█▇▅▃▂▁▂▃▅▇█▇▅▃▂▁▂▃▅▇  │\n│ █▇▅▃▂▁▂▃▅▇█▇▅▃▂▁▁▂▃▅▇█▇▅▃  │\n╰──────────────────────────────╯\n\nFormat: WAV (44.1kHz, 16-bit)\nDuration: 00:32\nSize: 5.2 MB\nBPM: 120\nKey: C Minor\n\nModel: QWS-Music-v1\nLatency: 4.8s",
  ],
};

const Generate = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [genType, setGenType] = useState<GenerationType>("text");
  const [selectedModel, setSelectedModel] = useState(MODELS.text[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [cipherActive, setCipherActive] = useState(false);
  const [cipherText, setCipherText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const messages = activeConv?.messages ?? [];

  useEffect(() => {
    setSelectedModel(MODELS[genType][0]);
  }, [genType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Cipher animation
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
      type: genType,
      createdAt: new Date(),
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveConvId(conv.id);
    return conv.id;
  }, [genType]);

  const handleGenerate = useCallback(() => {
    if (!prompt.trim() || isGenerating) return;

    let convId = activeConvId;
    if (!convId) {
      convId = createConversation();
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
      type: genType,
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

      const responses = SAMPLE_RESPONSES[genType];
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
    }, duration);
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

  const TypeIcon = TYPE_ICONS[genType];

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
            const Icon = TYPE_ICONS[conv.type];
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
                <Icon size={14} className="shrink-0 text-muted-foreground" />
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

            {/* Type selector */}
            <div className="flex gap-px bg-border">
              {(["text", "image", "code", "audio"] as GenerationType[]).map(
                (t) => {
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
                }
              )}
            </div>
          </div>

          {/* Model selector */}
          <div className="relative">
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-border font-mono text-xs tracking-wider cursor-pointer bg-background text-foreground hover:border-foreground"
            >
              <Sparkles size={12} />
              {selectedModel}
              <ChevronDown size={12} />
            </button>
            {showModelDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-background border border-border z-20 min-w-[200px]">
                {MODELS[genType].map((model) => (
                  <button
                    key={model}
                    onClick={() => {
                      setSelectedModel(model);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 font-mono text-xs border-0 cursor-pointer ${
                      model === selectedModel
                        ? "bg-foreground text-background"
                        : "bg-background text-foreground hover:bg-secondary"
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 && !isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center px-6">
              <TypeIcon size={32} strokeWidth={1} className="mb-6 text-muted-foreground" />
              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center">
                {genType === "text" && "GENERATE TEXT"}
                {genType === "image" && "CREATE IMAGES"}
                {genType === "code" && "WRITE CODE"}
                {genType === "audio" && "PRODUCE AUDIO"}
              </h2>
              <p className="font-mono text-xs text-muted-foreground text-center max-w-md mb-10">
                Enter a detailed prompt below. The more context you provide, the
                better the output.
              </p>

              {/* Quick prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                {genType === "text" && [
                  "Explain quantum computing in simple terms",
                  "Write a product description for an AI tool",
                  "Create a technical blog post outline",
                  "Summarize the latest trends in AI",
                ].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="text-left px-4 py-3 border border-border font-mono text-xs hover:bg-secondary cursor-pointer bg-background text-foreground"
                  >
                    {p}
                  </button>
                ))}
                {genType === "image" && [
                  "A futuristic city skyline at sunset",
                  "Abstract geometric art in monochrome",
                  "Product mockup on marble surface",
                  "Portrait of a cyberpunk character",
                ].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="text-left px-4 py-3 border border-border font-mono text-xs hover:bg-secondary cursor-pointer bg-background text-foreground"
                  >
                    {p}
                  </button>
                ))}
                {genType === "code" && [
                  "Build a REST API with Express.js",
                  "Create a React hook for dark mode",
                  "Write a sorting algorithm in Python",
                  "Generate a database schema for e-commerce",
                ].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="text-left px-4 py-3 border border-border font-mono text-xs hover:bg-secondary cursor-pointer bg-background text-foreground"
                  >
                    {p}
                  </button>
                ))}
                {genType === "audio" && [
                  "Lo-fi hip hop beat with rain sounds",
                  "Epic orchestral trailer music",
                  "Ambient soundscape for meditation",
                  "Upbeat electronic dance track",
                ].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="text-left px-4 py-3 border border-border font-mono text-xs hover:bg-secondary cursor-pointer bg-background text-foreground"
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
                >
                  {/* Message header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-6 h-6 flex items-center justify-center font-mono text-xs ${
                        msg.role === "user"
                          ? "bg-foreground text-background"
                          : "border border-foreground"
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
                    <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.content}
                    </pre>

                    {/* Action buttons for assistant messages */}
                    {msg.role === "assistant" && (
                      <div className="flex gap-2 mt-4">
                        {[
                          { icon: Copy, label: "COPY" },
                          { icon: Download, label: "EXPORT" },
                          { icon: RefreshCw, label: "RETRY" },
                        ].map((action) => (
                          <button
                            key={action.label}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-border font-mono text-[10px] tracking-wider cursor-pointer bg-background text-muted-foreground hover:text-foreground hover:border-foreground"
                          >
                            <action.icon size={10} /> {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Generating state */}
              {isGenerating && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 flex items-center justify-center border border-foreground font-mono text-xs">
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
        <div className="border-t border-border p-4 shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative border border-border focus-within:border-foreground">
                <textarea
                  ref={inputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Describe what you want to ${genType === "text" ? "generate" : genType === "image" ? "create" : genType === "code" ? "build" : "produce"}...`}
                  className="w-full bg-background text-foreground font-mono text-sm p-4 pr-12 resize-none outline-none min-h-[56px] max-h-[200px] border-0"
                  rows={1}
                  disabled={isGenerating}
                  style={{ caretColor: "hsl(var(--foreground))" }}
                />
                <div className="absolute right-3 bottom-3 font-mono text-[10px] text-muted-foreground">
                  {selectedModel}
                </div>
              </div>
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="btn-primary p-4 disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="font-mono text-[10px] text-muted-foreground tracking-wider">
                SHIFT+ENTER FOR NEW LINE — ENTER TO GENERATE
              </div>
              <div className="font-mono text-[10px] text-muted-foreground tracking-wider">
                QUICKWEBSTACK v1.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Generate;
