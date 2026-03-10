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

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>?";

type GenerationType = "code";
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
    "QWS-Code-v4-Pro",
    "QWS-Code-v4",
    "QWS-Code-v3-Advanced",
    "QWS-Architect-v2",
    "QWS-Debug-v3",
    "QWS-Frontend-v2",
    "QWS-Backend-v2",
    "QWS-API-Design-v1",
  ],
};

const TYPE_ICONS: Record<GenerationType, typeof Code> = {
  code: Code,
};

const SAMPLE_RESPONSES: Record<GenerationType, string[]> = {
  code: [
    '```typescript\n// QuickWebStack API Client\nimport { QWSClient } from \'@quickwebstack/sdk\';\n\nconst client = new QWSClient({\n  apiKey: process.env.QWS_API_KEY,\n  model: \'qws-code-v4\',\n  timeout: 30000,\n});\n\nasync function generateCode(prompt: string) {\n  const response = await client.generate({\n    prompt,\n    maxTokens: 4096,\n    temperature: 0.3,\n    language: \'typescript\',\n  });\n\n  return {\n    code: response.output,\n    tokens: response.usage.totalTokens,\n    latency: response.metrics.latencyMs,\n  };\n}\n\n// Usage\nconst result = await generateCode(\n  "Create a REST API with authentication"\n);\nconsole.log(result.code);\n```\n\n✓ Syntax validated\n✓ Type-checked\n✓ 0 errors, 0 warnings\n\nTokens used: 847 | Latency: 18ms',
    '```javascript\n// Express.js REST API with Authentication\nimport express from "express";\nimport jwt from "jsonwebtoken";\nimport bcrypt from "bcrypt";\n\nconst app = express();\nconst SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";\n\nconst users = [];\n\n// Middleware\napp.use(express.json());\n\nconst authenticateToken = (req, res, next) => {\n  const authHeader = req.headers["authorization"];\n  const token = authHeader && authHeader.split(" ")[1];\n\n  if (!token) return res.sendStatus(401);\n\n  jwt.verify(token, SECRET_KEY, (err, user) => {\n    if (err) return res.sendStatus(403);\n    req.user = user;\n    next();\n  });\n};\n\n// Routes\napp.post("/auth/register", async (req, res) => {\n  const { username, password } = req.body;\n  const hashedPassword = await bcrypt.hash(password, 10);\n  users.push({ username, password: hashedPassword });\n  res.status(201).json({ message: "User registered" });\n});\n\napp.post("/auth/login", async (req, res) => {\n  const { username, password } = req.body;\n  const user = users.find(u => u.username === username);\n  \n  if (!user) return res.status(400).json({ message: "User not found" });\n  \n  const isValid = await bcrypt.compare(password, user.password);\n  if (!isValid) return res.status(400).json({ message: "Invalid password" });\n  \n  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });\n  res.json({ token });\n});\n\napp.get("/protected", authenticateToken, (req, res) => {\n  res.json({ message: `Hello ${req.user.username}` });\n});\n\napp.listen(3000, () => console.log("Server running on port 3000"));\n```\n\n✓ Successfully compiled\n✓ Dependencies resolved\n✓ 0 errors\n\nTokens used: 1,247 | Latency: 24ms',
    '```python\n# FastAPI with SQLAlchemy ORM\nfrom fastapi import FastAPI, Depends, HTTPException\nfrom sqlalchemy import create_engine, Column, Integer, String\nfrom sqlalchemy.ext.declarative import declarative_base\nfrom sqlalchemy.orm import sessionmaker, Session\nfrom pydantic import BaseModel\nfrom typing import List\n\nDATABASE_URL = "sqlite:///./test.db"\nengine = create_engine(DATABASE_URL)\nSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)\nBase = declarative_base()\n\napp = FastAPI()\n\nclass User(Base):\n    __tablename__ = "users"\n    id = Column(Integer, primary_key=True)\n    username = Column(String, unique=True)\n    email = Column(String, unique=True)\n\nBase.metadata.create_all(bind=engine)\n\nclass UserSchema(BaseModel):\n    username: str\n    email: str\n    \n    class Config:\n        from_attributes = True\n\ndef get_db():\n    db = SessionLocal()\n    try:\n        yield db\n    finally:\n        db.close()\n\n@app.post("/users/", response_model=UserSchema)\ndef create_user(user: UserSchema, db: Session = Depends(get_db)):\n    db_user = User(**user.dict())\n    db.add(db_user)\n    db.commit()\n    db.refresh(db_user)\n    return db_user\n\n@app.get("/users/", response_model=List[UserSchema])\ndef read_users(db: Session = Depends(get_db)):\n    return db.query(User).all()\n\nif __name__ == "__main__":\n    import uvicorn\n    uvicorn.run(app, host="0.0.0.0", port=8000)\n```\n\n✓ Type hints validated\n✓ Async functions optimized\n✓ 0 warnings\n\nTokens used: 1,156 | Latency: 19ms',
  ],
};

const Generate = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [genType] = useState<GenerationType>("code");
  const [selectedModel, setSelectedModel] = useState(MODELS.code[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [cipherActive, setCipherActive] = useState(false);
  const [cipherText, setCipherText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const messages = useMemo(() => activeConv?.messages ?? [], [activeConv?.messages]);

  useEffect(() => {
    setSelectedModel(MODELS.code[0]);
  }, []);

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
      type: "code",
      createdAt: new Date(),
    };
    setConversations((prev) => [conv, ...prev]);
    setActiveConvId(conv.id);
    return conv.id;
  }, []);

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
      type: "code",
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

      const responses = SAMPLE_RESPONSES.code;
      const responseText = responses[Math.floor(Math.random() * responses.length)];

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: responseText,
        type: "code",
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, messages: [...c.messages, assistantMsg] } : c
        )
      );
      setIsGenerating(false);
    }, duration);
  }, [prompt, isGenerating, activeConvId, createConversation]);

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

  const TypeIcon = Code;

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

            {/* Type indicator - CODE ONLY */}
            <div className="flex gap-px bg-border">
              <button
                className="flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider cursor-pointer border-0 transition-colors bg-foreground text-background"
              >
                <Code size={12} /> CODE
              </button>
            </div>
          </div>

          {/* Model selector */}
          <div className="relative">
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center gap-2 px-4 py-2 border border-border font-mono text-xs tracking-wider cursor-pointer bg-background text-foreground hover:border-foreground transition-colors"
              data-testid="model-selector"
            >
              <Sparkles size={12} />
              {selectedModel}
              <ChevronDown size={12} />
            </button>
            {showModelDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-background border border-border z-20 min-w-[240px] shadow-lg animate-in fade-in slide-in-from-top-2">
                {MODELS.code.map((model) => (
                  <button
                    key={model}
                    onClick={() => {
                      setSelectedModel(model);
                      setShowModelDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 font-mono text-xs border-0 cursor-pointer transition-colors flex items-center justify-between ${
                      model === selectedModel
                        ? "bg-foreground text-background"
                        : "bg-background text-foreground hover:bg-secondary"
                    }`}
                    data-testid={`model-option-${model}`}
                  >
                    {model}
                    {model === selectedModel && <Check size={12} />}
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
                WRITE CODE
              </h2>
              <p className="font-mono text-xs text-muted-foreground text-center max-w-md mb-10">
                Enter a detailed prompt below. The more context you provide, the
                better the generated code.
              </p>

              {/* Quick prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                {[
                  "Build a REST API with Express.js",
                  "Create a React hook for dark mode",
                  "Write a sorting algorithm in Python",
                  "Generate a database schema for e-commerce",
                  "Create a Vue.js component with animations",
                  "Build a GraphQL resolver for users",
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

                    {/* Action buttons for assistant messages */}
                    {msg.role === "assistant" && (
                      <div className="flex gap-2 mt-4 flex-wrap">
                        {[
                          { icon: Copy, label: "COPY", action: "copy" },
                          { icon: Download, label: "EXPORT", action: "export" },
                          { icon: RefreshCw, label: "RETRY", action: "retry" },
                        ].map((action) => (
                          <button
                            key={action.label}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-border font-mono text-[10px] tracking-wider cursor-pointer bg-background text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                            onClick={() => {
                              if (action.action === "copy") {
                                navigator.clipboard.writeText(msg.content);
                              }
                            }}
                            data-testid={`action-${action.action}-${msg.id}`}
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
                  placeholder="Describe the code you want to generate..."
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
