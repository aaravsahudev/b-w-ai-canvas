export type SlideType =
  | "title"
  | "intro"
  | "content"
  | "stats"
  | "chart"
  | "performance"
  | "comparison"
  | "quote"
  | "conclusion";

export interface StatItem { value: string; label: string }
export interface ChartData {
  type: "bar" | "line" | "donut";
  labels: string[];
  values: number[];
  unit: string;
  title: string;
}
export interface PerfItem { label: string; value: number; unit: string }

export interface SlideData {
  type: SlideType;
  title: string;
  subtitle?: string;
  body: string[];
  stats?: StatItem[];
  chart?: ChartData;
  performance?: PerfItem[];
  highlight?: string;
  speaker_note: string;
}

export type ThemeKey =
  | "midnight"
  | "obsidian"
  | "sapphire"
  | "emerald"
  | "rouge"
  | "copper"
  | "amethyst"
  | "slate";

export interface Theme {
  name: string;
  dark: string;
  accent: string;
  accent2: string;
  text: string;
  muted: string;
  swatch: string;
}

export const THEMES: Record<ThemeKey, Theme> = {
  midnight: {
    name: "Midnight Gold",
    dark: "#0a0a12",
    accent: "#d4a843",
    accent2: "#f0c855",
    text: "#ede8d5",
    muted: "#7a5c10",
    swatch: "linear-gradient(135deg,#0a0a12,#1c1500,#d4a843)",
  },
  obsidian: {
    name: "Obsidian",
    dark: "#0c0d1a",
    accent: "#7c72f5",
    accent2: "#b8b2ff",
    text: "#ece8ff",
    muted: "#4a40b8",
    swatch: "linear-gradient(135deg,#0c0d1a,#1c1842,#7c72f5)",
  },
  sapphire: {
    name: "Sapphire",
    dark: "#05101e",
    accent: "#4a8ff5",
    accent2: "#90c0fd",
    text: "#e0edff",
    muted: "#1c4488",
    swatch: "linear-gradient(135deg,#05101e,#0c274d,#4a8ff5)",
  },
  emerald: {
    name: "Emerald",
    dark: "#030e09",
    accent: "#2ec974",
    accent2: "#7ee8b0",
    text: "#d8f5e8",
    muted: "#186040",
    swatch: "linear-gradient(135deg,#030e09,#0b2e1a,#2ec974)",
  },
  rouge: {
    name: "Noir Rouge",
    dark: "#0e0404",
    accent: "#e04040",
    accent2: "#f89898",
    text: "#f8e8e8",
    muted: "#842020",
    swatch: "linear-gradient(135deg,#0e0404,#3c0808,#e04040)",
  },
  copper: {
    name: "Copper",
    dark: "#150a00",
    accent: "#d48028",
    accent2: "#f0b060",
    text: "#f2e4cc",
    muted: "#7a3a00",
    swatch: "linear-gradient(135deg,#150a00,#462000,#d48028)",
  },
  amethyst: {
    name: "Amethyst",
    dark: "#100514",
    accent: "#c068f5",
    accent2: "#e4aafd",
    text: "#f0e4ff",
    muted: "#601888",
    swatch: "linear-gradient(135deg,#100514,#3a0d5c,#c068f5)",
  },
  slate: {
    name: "Steel Slate",
    dark: "#0a1222",
    accent: "#5c98f0",
    accent2: "#90c4ff",
    text: "#dce8f8",
    muted: "#284a80",
    swatch: "linear-gradient(135deg,#0a1222,#182e50,#5c98f0)",
  },
};

function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function extractKeywords(prompt: string): string[] {
  const stop = new Set(["a","an","the","and","or","but","for","to","of","in","on","at","by","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","can","create","make","build","generate","about","with","from"]);
  return prompt.toLowerCase().split(/\W+/).filter(w => w.length > 3 && !stop.has(w)).slice(0, 6);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function generateSlides(prompt: string, count: number, style: string): SlideData[] {
  const kw = extractKeywords(prompt);
  const topic = capitalize(kw[0] || "Your Topic");
  const topic2 = capitalize(kw[1] || "Strategy");
  const topic3 = capitalize(kw[2] || "Growth");

  const styleHints: Record<string, string> = {
    professional: "Executive summary with data-driven insights and strategic recommendations.",
    startup: "Disruptive approach to solving a real-world problem with measurable traction.",
    creative: "Innovative perspective on emerging trends reshaping the industry landscape.",
    academic: "Evidence-based analysis with rigorous methodology and peer-reviewed findings.",
    minimal: "Core insight communicated with clarity, precision, and zero noise.",
  };

  const sequence: SlideType[] = ["title","intro","content","stats","chart","performance","comparison","quote","content","chart","stats","conclusion"];
  const types: SlideType[] = sequence.slice(0, count) as SlideType[];
  types[0] = "title";
  types[count - 1] = "conclusion";
  if (count > 5) types[Math.floor(count * 0.6)] = "quote";

  const slides: SlideData[] = types.map((type, i) => {
    const base = {
      type,
      title: "",
      body: [] as string[],
      speaker_note: `Slide ${i + 1}: Discuss ${topic} in context of ${topic2}. Engage your audience with key insights from the data.`,
    };

    switch (type) {
      case "title":
        return {
          ...base,
          title: prompt.length < 40 ? capitalize(prompt) : `${topic} — ${topic2}`,
          subtitle: styleHints[style] || styleHints.professional,
          body: [],
          highlight: undefined,
        };

      case "intro":
        return {
          ...base,
          title: `The ${topic} Opportunity`,
          subtitle: `Setting the stage for ${topic2}`,
          body: [
            `${topic} represents one of the most significant shifts in the ${topic2} landscape over the past decade.`,
            `Organizations that embrace ${topic3} early are seeing 3× faster growth and 60% higher customer retention rates.`,
            `This presentation outlines a clear path from current state to ${topic}-led transformation.`,
          ],
          highlight: `${topic} creates $${rnd(2,9)}.${rnd(1,9)}T market opportunity by 2028`,
        };

      case "content":
        return {
          ...base,
          title: i === 2 ? `Why ${topic} Matters Now` : `${topic2} Implementation Framework`,
          body: [
            `Phase 1: Assess current ${topic} capabilities and identify quick wins across the organization.`,
            `Phase 2: Deploy ${topic2} infrastructure with cross-functional team alignment and clear OKRs.`,
            `Phase 3: Scale proven models globally while maintaining quality and compliance standards.`,
            `Phase 4: Continuously iterate using real-time performance data and stakeholder feedback loops.`,
          ],
          highlight: `${rnd(72, 94)}% of leaders cite ${topic} as top-3 priority`,
        };

      case "stats":
        return {
          ...base,
          title: `${topic} By the Numbers`,
          body: [`Key performance indicators demonstrating the measurable impact of ${topic} initiatives across ${topic2}.`],
          stats: [
            { value: `$${rnd(1,9)}.${rnd(1,9)}B`, label: "Market Size" },
            { value: `${rnd(2,5)}×`, label: "ROI Multiple" },
            { value: `${rnd(40,89)}%`, label: "Adoption Rate" },
          ],
          highlight: `${rnd(3,8)}× faster delivery vs legacy approach`,
        };

      case "chart":
        return {
          ...base,
          title: `${topic2} Growth Trajectory`,
          body: [`Quarterly performance across all ${topic} segments shows consistent upward momentum.`],
          chart: {
            type: "bar",
            labels: ["Q1","Q2","Q3","Q4","Q1'26","Q2'26"],
            values: [rnd(28,42), rnd(38,55), rnd(48,65), rnd(58,78), rnd(68,85), rnd(75,95)],
            unit: "%",
            title: `${topic} Growth (YoY%)`,
          },
          highlight: `+${rnd(34,67)}% year-over-year growth`,
        };

      case "performance":
        return {
          ...base,
          title: "KPI Dashboard",
          body: [`Real-time performance metrics tracking ${topic} impact across all business units.`],
          performance: [
            { label: "Efficiency Score", value: rnd(74, 94), unit: "%" },
            { label: "User Satisfaction", value: rnd(82, 97), unit: "%" },
            { label: `${topic} Index`, value: rnd(68, 91), unit: "%" },
            { label: "Cost Reduction", value: rnd(30, 58), unit: "%" },
          ],
          highlight: "Exceeding all KPI targets for Q2 2026",
        };

      case "comparison":
        return {
          ...base,
          title: "Before vs After",
          body: [
            `Without ${topic}: Manual processes, siloed data, slow decision cycles averaging 3-4 weeks.`,
            `With ${topic}: Automated workflows, unified intelligence, decisions in under 24 hours.`,
            `The gap widens over time — early adopters are now ${rnd(2,5)}× ahead of competitors.`,
          ],
          highlight: `${rnd(60, 80)}% reduction in time-to-decision`,
        };

      case "quote":
        return {
          ...base,
          title: "Industry Perspective",
          body: [
            `"${topic} is not the future — it is the present. The question is no longer whether to invest, but how fast to scale."`,
          ],
          highlight: undefined,
          speaker_note: "Pause here. Let the quote resonate. Ask the audience if this reflects their experience.",
        };

      case "conclusion":
        return {
          ...base,
          title: "The Path Forward",
          body: [
            `Start small, move fast: pilot ${topic} in one high-impact area within the next 90 days.`,
            `Build the foundation: invest in data infrastructure, talent, and ${topic2} partnerships now.`,
            `Measure and scale: use real KPIs to justify and accelerate the broader ${topic3} rollout.`,
          ],
          highlight: `Act now — ${topic} leaders are pulling ahead daily`,
          speaker_note: "Close with confidence. Summarize the 3 action items. Open for Q&A.",
        };

      default:
        return {
          ...base,
          title: `${topic} Insights`,
          body: [`Key insights about ${topic} and its impact on ${topic2}.`],
        };
    }
  });

  return slides;
}
