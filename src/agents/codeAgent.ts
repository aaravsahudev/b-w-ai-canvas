import { generateWebsite } from "@/utils/codeGenerator";

export interface CodeAgentResult {
  html: string;
  prompt: string;
  model: string;
  timestamp: number;
}

export function runCodeAgent(prompt: string, modelId: string): CodeAgentResult {
  const html = generateWebsite(prompt);
  return {
    html,
    prompt,
    model: modelId,
    timestamp: Date.now(),
  };
}

export const CODE_AGENT_CAPABILITIES = [
  "HTML / CSS / JavaScript",
  "React / Vue / Svelte",
  "Python / Node.js / Go",
  "SQL / GraphQL",
  "Shell / Bash scripts",
  "TypeScript definitions",
];
