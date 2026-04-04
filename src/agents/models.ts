export interface AgentModel {
  id: string;
  name: string;
  tag: string;
  badge: string;
  desc: string;
  color: string;
  symbol: string;
  route?: string;
}

export const MODELS: AgentModel[] = [
  {
    id: "qws-ultra-v4",
    name: "QWS-ULTRA-V4",
    tag: "Language · Reasoning",
    badge: "DEFAULT",
    desc: "General purpose language model with advanced reasoning",
    color: "#ffffff",
    symbol: "◈",
  },
  {
    id: "qws-vision-3",
    name: "QWS-VISION-3",
    tag: "Image · Multimodal",
    badge: "VISION",
    desc: "Image generation, analysis, and multimodal tasks",
    color: "#a78bfa",
    symbol: "◉",
  },
  {
    id: "qws-code-x",
    name: "QWS-CODE-X",
    tag: "Code · Synthesis",
    badge: "CODE",
    desc: "Code generation, debugging, and refactoring across 50+ languages",
    color: "#34d399",
    symbol: "⌘",
    route: "/generate",
  },
  {
    id: "qws-audio-2",
    name: "QWS-AUDIO-2",
    tag: "Speech · Music",
    badge: "AUDIO",
    desc: "Text-to-speech synthesis and music generation",
    color: "#fbbf24",
    symbol: "◎",
  },
  {
    id: "qws-agent-1",
    name: "QWS-AGENT-1",
    tag: "Autonomous · Planning",
    badge: "AGENT",
    desc: "Autonomous multi-step task planning and execution",
    color: "#60a5fa",
    symbol: "◇",
  },
  {
    id: "qws-ppt-1",
    name: "QWS-PPT-1",
    tag: "Presentation · Slides",
    badge: "PPT",
    desc: "Generate stunning PowerPoint decks from a single prompt",
    color: "#fb923c",
    symbol: "▣",
    route: "/presentation",
  },
  {
    id: "qws-research-1",
    name: "QWS-RESEARCH-1",
    tag: "Research · Synthesis",
    badge: "RESEARCH",
    desc: "Deep research, summarization, and knowledge synthesis",
    color: "#e879f9",
    symbol: "◆",
  },
  {
    id: "qws-data-1",
    name: "QWS-DATA-1",
    tag: "Data · Analytics",
    badge: "DATA",
    desc: "Data analysis, chart generation, and statistical insights",
    color: "#2dd4bf",
    symbol: "◐",
  },
];

export const DEFAULT_MODEL = MODELS[0];
