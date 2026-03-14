import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

type Tab = "terms" | "privacy" | "cookies" | "acceptable";

const tabs: { id: Tab; label: string }[] = [
  { id: "terms",      label: "TERMS OF SERVICE" },
  { id: "privacy",    label: "PRIVACY POLICY" },
  { id: "cookies",    label: "COOKIE POLICY" },
  { id: "acceptable", label: "ACCEPTABLE USE" },
];

const content: Record<Tab, { updated: string; sections: { title: string; body: string }[] }> = {
  terms: {
    updated: "March 1, 2026",
    sections: [
      { title: "1. Acceptance of Terms", body: "By accessing or using the QuickWebStack platform, API, or any related services (\"Services\"), you agree to be bound by these Terms of Service. If you do not agree, do not use our Services." },
      { title: "2. Use of Services", body: "You may use our Services for lawful purposes only. You are responsible for all content you generate and for complying with all applicable laws and regulations in your jurisdiction." },
      { title: "3. Account Registration", body: "To access certain features, you must register for an account. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account." },
      { title: "4. API Usage & Rate Limits", body: "API usage is subject to rate limits as specified in your plan. Exceeding rate limits may result in temporary suspension of access. Commercial use requires a paid plan." },
      { title: "5. Intellectual Property", body: "Output generated via our Services is owned by you, subject to our content policies. QuickWebStack retains all rights to the platform, models, and underlying technology." },
      { title: "6. Limitation of Liability", body: "To the maximum extent permitted by law, QuickWebStack shall not be liable for indirect, incidental, or consequential damages arising from use or inability to use our Services." },
      { title: "7. Termination", body: "We may suspend or terminate your access at any time for violation of these Terms or for any reason with reasonable notice. You may terminate your account at any time." },
      { title: "8. Changes to Terms", body: "We may update these Terms at any time. Material changes will be notified via email or in-app notice. Continued use after notice constitutes acceptance." },
    ],
  },
  privacy: {
    updated: "March 1, 2026",
    sections: [
      { title: "1. Information We Collect", body: "We collect information you provide (name, email, payment info), usage data (prompts, outputs, API calls), and technical data (IP address, browser, device type) to operate and improve our Services." },
      { title: "2. How We Use Your Information", body: "We use your data to provide the Services, improve model quality (with your consent), send transactional communications, and comply with legal obligations. We do not sell your personal data." },
      { title: "3. Data Retention", body: "API request logs are retained for 30 days. Account data is retained until you delete your account plus 90 days. You may request deletion at any time via privacy@quickwebstack.dev." },
      { title: "4. Third-Party Services", body: "We use trusted third parties for payments (Stripe), analytics (privacy-preserving only), and infrastructure (AWS, GCP). All partners are contractually bound to data protection standards." },
      { title: "5. Security", body: "We use AES-256 encryption at rest, TLS 1.3 in transit, and SOC-2 Type II compliant infrastructure. Penetration testing is conducted quarterly by independent firms." },
      { title: "6. Your Rights", body: "Depending on your location, you may have rights to access, correct, delete, or export your data. Contact privacy@quickwebstack.dev to exercise these rights. We respond within 30 days." },
    ],
  },
  cookies: {
    updated: "February 15, 2026",
    sections: [
      { title: "1. What Are Cookies", body: "Cookies are small text files placed on your device by websites. We use cookies to operate our Services, remember your preferences, and analyze usage patterns." },
      { title: "2. Essential Cookies", body: "These are required for the platform to function — authentication sessions, security tokens, and load balancing. They cannot be disabled without breaking core functionality." },
      { title: "3. Analytics Cookies", body: "We use privacy-preserving analytics to understand how the platform is used. No personally identifiable information is shared with analytics providers. You may opt out in your account settings." },
      { title: "4. Preference Cookies", body: "These remember your settings such as theme, language, and default model selection. They expire after 1 year." },
      { title: "5. Managing Cookies", body: "You can manage cookie preferences through your browser settings or our in-app cookie preferences panel. Note that disabling essential cookies will impair platform functionality." },
    ],
  },
  acceptable: {
    updated: "March 1, 2026",
    sections: [
      { title: "1. Prohibited Content", body: "You may not use our Services to generate: illegal content, CSAM, non-consensual intimate imagery, malware, content designed to deceive voters, or content that violates third-party rights." },
      { title: "2. Prohibited Uses", body: "You may not use our Services to: impersonate individuals without consent, generate spam at scale, conduct social engineering attacks, train competing AI models without permission, or circumvent safety filters." },
      { title: "3. Security Research", body: "Security researchers may probe our systems for vulnerabilities under our responsible disclosure program. Contact security@quickwebstack.dev before conducting any testing." },
      { title: "4. Enforcement", body: "Violations may result in immediate account termination without refund. We may report illegal activity to law enforcement. We reserve the right to reject any use case at our discretion." },
      { title: "5. Reporting Violations", body: "Report violations of this policy to abuse@quickwebstack.dev. Include as much detail as possible. We investigate all reports within 48 hours." },
    ],
  },
};

const Legal = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("terms");
  const doc = content[activeTab];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => navigate("/home")}>
            <AnimatedLogo size={26} />
          </div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={13} /> Back
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-24">
        <div className="mb-16">
          <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">LEGAL</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">LEGAL</h1>
        </div>

        {/* Tab bar */}
        <div className="flex overflow-x-auto border-b border-border mb-12 gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-mono text-[10px] tracking-[0.3em] whitespace-nowrap px-6 py-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Document */}
        <div>
          <div className="font-mono text-[10px] text-muted-foreground mb-10 tracking-widest">
            LAST UPDATED: {doc.updated.toUpperCase()}
          </div>
          <div className="space-y-10">
            {doc.sections.map((s) => (
              <div key={s.title}>
                <h3 className="font-display text-lg font-bold mb-3 tracking-tight">{s.title}</h3>
                <p className="font-mono text-xs text-muted-foreground leading-loose">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 pt-10 border-t border-border font-mono text-xs text-muted-foreground">
            Questions about our legal documents? Contact{" "}
            <span className="text-foreground">legal@quickwebstack.dev</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;
