const steps = [
  {
    step: "01",
    title: "INPUT",
    description: "Enter your prompt in the terminal. Text, code, image descriptions — anything goes.",
  },
  {
    step: "02",
    title: "PROCESS",
    description: "Our distributed GPU cluster processes your request through advanced neural networks in real-time.",
  },
  {
    step: "03",
    title: "GENERATE",
    description: "Receive high-quality AI-generated output in milliseconds. Download, iterate, or refine.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-32 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">
            WORKFLOW
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
            HOW IT WORKS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {steps.map((step) => (
            <div key={step.step} className="bg-background p-10">
              <div className="font-display text-7xl font-bold mb-6 text-muted-foreground">
                {step.step}
              </div>
              <h3 className="font-display text-2xl font-bold mb-4 tracking-tight">
                {step.title}
              </h3>
              <p className="font-mono text-xs leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
