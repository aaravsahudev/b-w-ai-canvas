import { Check, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "FREE",
    price: "$0",
    period: "/month",
    tag: "GET STARTED",
    desc: "For individuals exploring AI generation.",
    features: [
      "100 generations / day",
      "3 AI models",
      "Text & code generation",
      "Standard latency",
      "Community support",
      "Public API (rate-limited)",
    ],
    cta: "START FREE",
    highlight: false,
  },
  {
    name: "PRO",
    price: "$29",
    period: "/month",
    tag: "MOST POPULAR",
    desc: "For creators and developers who need power.",
    features: [
      "Unlimited generations",
      "50+ AI models",
      "Text, image, code & audio",
      "Sub-50ms latency",
      "Priority support",
      "Full API access",
      "Custom fine-tuning",
      "Usage analytics",
    ],
    cta: "GO PRO",
    highlight: true,
  },
  {
    name: "ENTERPRISE",
    price: "Custom",
    period: "",
    tag: "SCALE UP",
    desc: "For teams and organizations at scale.",
    features: [
      "Everything in Pro",
      "Custom AI model training",
      "Dedicated GPU clusters",
      "99.99% SLA uptime",
      "Dedicated account manager",
      "SSO & SAML",
      "Audit logs & compliance",
      "On-premise deployment",
    ],
    cta: "CONTACT SALES",
    highlight: false,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-32 px-6 border-t border-border">
      <style>{`
        @keyframes pricingGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
          50%       { box-shadow: 0 0 40px 4px rgba(255,255,255,0.06); }
        }
        .pricing-highlight { animation: pricingGlow 3s ease-in-out infinite; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-20 gap-6">
          <div>
            <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">
              PRICING
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
              SIMPLE,
              <br />
              TRANSPARENT
            </h2>
          </div>
          <p className="font-mono text-xs text-muted-foreground max-w-sm leading-relaxed">
            No hidden fees. No confusing tiers. Choose the plan that fits your workflow and scale as you grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col p-8 md:p-10 relative ${
                plan.highlight
                  ? "bg-foreground text-background pricing-highlight"
                  : "bg-background text-foreground"
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className={`font-mono text-[10px] tracking-[0.5em] uppercase mb-2 ${
                    plan.highlight ? "text-background opacity-60" : "text-muted-foreground"
                  }`}>
                    {plan.tag}
                  </div>
                  <div className="font-display text-2xl font-bold tracking-tight">{plan.name}</div>
                </div>
                {plan.highlight && (
                  <div className="border border-background p-1">
                    <Zap size={14} />
                  </div>
                )}
              </div>

              <div className="mb-6">
                <span className="font-display text-5xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className={`font-mono text-xs ml-1 ${
                    plan.highlight ? "opacity-60" : "text-muted-foreground"
                  }`}>
                    {plan.period}
                  </span>
                )}
              </div>

              <p className={`font-mono text-xs leading-relaxed mb-8 pb-8 border-b ${
                plan.highlight ? "border-background/20 opacity-75" : "border-border text-muted-foreground"
              }`}>
                {plan.desc}
              </p>

              <ul className="flex flex-col gap-3 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check
                      size={12}
                      strokeWidth={2.5}
                      className={`mt-0.5 shrink-0 ${plan.highlight ? "opacity-100" : "text-foreground"}`}
                    />
                    <span className={`font-mono text-xs leading-relaxed ${
                      plan.highlight ? "opacity-85" : "text-muted-foreground"
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => plan.name === "ENTERPRISE" ? null : navigate("/generate")}
                className={`w-full flex items-center justify-center gap-2 font-mono text-xs tracking-widest uppercase py-4 px-6 transition-all duration-150 ${
                  plan.highlight
                    ? "bg-background text-foreground hover:bg-background/90"
                    : "bg-foreground text-background hover:bg-foreground/90"
                }`}
              >
                {plan.cta} <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center font-mono text-xs text-muted-foreground tracking-widest">
          ALL PLANS INCLUDE · 99.9% UPTIME SLA · AES-256 ENCRYPTION · GDPR COMPLIANT
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
