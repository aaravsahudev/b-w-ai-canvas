import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "DESCRIBE",
    description:
      "Type your prompt — a sentence, a paragraph, or a detailed brief. Tell the AI exactly what you need.",
  },
  {
    step: "02",
    title: "SELECT MODEL",
    description:
      "Choose from 50+ specialized AI models optimized for text, images, code, audio, or multi-modal output.",
  },
  {
    step: "03",
    title: "GENERATE",
    description:
      "Hit generate and watch results stream in real-time. Iterate, refine, and export in any format.",
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section className="py-32 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">
            WORKFLOW
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
            THREE STEPS.
            <br />
            ZERO FRICTION.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border mb-16">
          {steps.map((s) => (
            <div key={s.step} className="bg-background p-10 md:p-12">
              <div className="font-display text-7xl md:text-8xl font-bold mb-8 text-muted-foreground leading-none">
                {s.step}
              </div>
              <h3 className="font-display text-xl font-bold mb-4 tracking-tight">
                {s.title}
              </h3>
              <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="border border-border p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-display text-2xl md:text-4xl font-bold tracking-tight mb-3">
              READY TO CREATE?
            </h3>
            <p className="font-mono text-xs text-muted-foreground">
              Start generating for free. No credit card required.
            </p>
          </div>
          <button
            onClick={() => navigate("/generate")}
            className="btn-primary text-sm py-5 px-12 gap-3 shrink-0"
          >
            OPEN WORKSPACE <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
