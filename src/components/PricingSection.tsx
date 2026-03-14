import {
  Zap, ArrowRight,
  Sparkles, Crown, Building2,
  Gauge, Bot, FileCode, Headphones, BarChart3,
  Rocket, Layers, Clock, LifeBuoy, Globe, Sliders,
  Server, ShieldCheck, Users, Lock, ScrollText, HardDrive,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "FREE",
    price: "$0",
    period: "/month",
    tag: "GET STARTED",
    desc: "For individuals exploring AI generation.",
    icon: Sparkles,
    features: [
      { icon: Gauge,     text: "100 generations / day" },
      { icon: Bot,       text: "3 AI models" },
      { icon: FileCode,  text: "Text & code generation" },
      { icon: Clock,     text: "Standard latency" },
      { icon: LifeBuoy,  text: "Community support" },
      { icon: Globe,     text: "Public API (rate-limited)" },
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
    icon: Crown,
    features: [
      { icon: Rocket,    text: "Unlimited generations" },
      { icon: Layers,    text: "50+ AI models" },
      { icon: FileCode,  text: "Text, image, code & audio" },
      { icon: Zap,       text: "Sub-50ms latency" },
      { icon: LifeBuoy,  text: "Priority support" },
      { icon: Globe,     text: "Full API access" },
      { icon: Sliders,   text: "Custom fine-tuning" },
      { icon: BarChart3, text: "Usage analytics" },
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
    icon: Building2,
    features: [
      { icon: Crown,       text: "Everything in Pro" },
      { icon: Bot,         text: "Custom AI model training" },
      { icon: Server,      text: "Dedicated GPU clusters" },
      { icon: ShieldCheck, text: "99.99% SLA uptime" },
      { icon: Users,       text: "Dedicated account manager" },
      { icon: Lock,        text: "SSO & SAML" },
      { icon: ScrollText,  text: "Audit logs & compliance" },
      { icon: HardDrive,   text: "On-premise deployment" },
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
          {plans.map((plan) => {
            const PlanIcon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`flex flex-col p-8 md:p-10 relative ${
                  plan.highlight
                    ? "bg-foreground text-background pricing-highlight"
                    : "bg-background text-foreground"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 border ${
                      plan.highlight ? "border-background/30" : "border-border"
                    }`}>
                      <PlanIcon size={16} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className={`font-mono text-[10px] tracking-[0.5em] uppercase mb-1 ${
                        plan.highlight ? "text-background opacity-60" : "text-muted-foreground"
                      }`}>
                        {plan.tag}
                      </div>
                      <div className="font-display text-2xl font-bold tracking-tight">{plan.name}</div>
                    </div>
                  </div>
                  {plan.highlight && (
                    <div className="border border-background p-1">
                      <Zap size={14} />
                    </div>
                  )}
                </div>

                {/* Price */}
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

                {/* Description */}
                <p className={`font-mono text-xs leading-relaxed mb-8 pb-8 border-b ${
                  plan.highlight ? "border-background/20 opacity-75" : "border-border text-muted-foreground"
                }`}>
                  {plan.desc}
                </p>

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-10 flex-1">
                  {plan.features.map((feature) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <li key={feature.text} className="flex items-start gap-3">
                        <FeatureIcon
                          size={12}
                          strokeWidth={2}
                          className={`mt-0.5 shrink-0 ${
                            plan.highlight ? "opacity-80" : "text-foreground"
                          }`}
                        />
                        <span className={`font-mono text-xs leading-relaxed ${
                          plan.highlight ? "opacity-85" : "text-muted-foreground"
                        }`}>
                          {feature.text}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                {/* CTA */}
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
            );
          })}
        </div>

        <div className="mt-10 text-center font-mono text-xs text-muted-foreground tracking-widest">
          ALL PLANS INCLUDE · 99.9% UPTIME SLA · AES-256 ENCRYPTION · GDPR COMPLIANT
        </div>
      </div>
    </section>
  );
};

export default PricingSection;