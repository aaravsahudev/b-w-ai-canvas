import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Mail, MessageSquare, Briefcase, Bug } from "lucide-react";
import AnimatedLogo from "@/components/AnimatedLogo";

const topics = [
  { id: "general",    icon: MessageSquare, label: "General Inquiry" },
  { id: "sales",      icon: Briefcase,     label: "Sales & Enterprise" },
  { id: "support",    icon: Mail,          label: "Technical Support" },
  { id: "bug",        icon: Bug,           label: "Report a Bug" },
];

const Contact = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("general");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1500);
  };

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

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="mb-20">
          <div className="font-mono text-xs tracking-[0.5em] uppercase mb-4 text-muted-foreground">GET IN TOUCH</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6">CONTACT</h1>
          <p className="font-mono text-sm text-muted-foreground max-w-lg leading-relaxed">
            Have a question, want to discuss enterprise pricing, or found a bug? We read every message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border">
          {/* Form */}
          <div className="bg-background p-10 md:p-14">
            {sent ? (
              <div className="flex flex-col items-start justify-center h-full min-h-[300px]">
                <div className="w-12 h-12 border border-border flex items-center justify-center mb-6">
                  <Send size={18} className="text-muted-foreground" />
                </div>
                <div className="font-display text-3xl font-bold mb-3">MESSAGE SENT</div>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed mb-8">
                  We'll get back to you within 1 business day. Check your inbox for a confirmation.
                </p>
                <button onClick={() => { setSent(false); setForm({ name: "", email: "", message: "" }); }} className="btn-outline text-xs py-3 px-8">
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Topic selector */}
                <div>
                  <label className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground block mb-3">TOPIC</label>
                  <div className="grid grid-cols-2 gap-px bg-border">
                    {topics.map((t) => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTopic(t.id)}
                          className={`flex items-center gap-2 p-3 font-mono text-xs transition-colors ${
                            topic === t.id ? "bg-foreground text-background" : "bg-background text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Icon size={12} /> {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground block mb-2">NAME</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full bg-secondary border border-border text-foreground font-mono text-sm p-4 outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground block mb-2">EMAIL</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full bg-secondary border border-border text-foreground font-mono text-sm p-4 outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] tracking-[0.4em] text-muted-foreground block mb-2">MESSAGE</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="How can we help you?"
                    rows={5}
                    className="w-full bg-secondary border border-border text-foreground font-mono text-sm p-4 resize-none outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!form.name || !form.email || !form.message || sending}
                  className="btn-primary w-full py-4 gap-2 flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed text-sm"
                >
                  {sending ? "SENDING..." : <><Send size={14} /> SEND MESSAGE</>}
                </button>
              </form>
            )}
          </div>

          {/* Info panel */}
          <div className="bg-foreground text-background p-10 md:p-14 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[10px] tracking-[0.5em] uppercase mb-8 opacity-60">DIRECT CONTACTS</div>
              <div className="space-y-6">
                {[
                  { label: "GENERAL",    email: "hello@quickwebstack.dev" },
                  { label: "SUPPORT",    email: "support@quickwebstack.dev" },
                  { label: "SALES",      email: "sales@quickwebstack.dev" },
                  { label: "SECURITY",   email: "security@quickwebstack.dev" },
                ].map((c) => (
                  <div key={c.label}>
                    <div className="font-mono text-[9px] tracking-[0.5em] opacity-50 mb-1">{c.label}</div>
                    <div className="font-mono text-sm">{c.email}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-background/20">
              <div className="font-mono text-[10px] tracking-widest opacity-50 mb-3">RESPONSE TIME</div>
              <p className="font-mono text-xs opacity-75 leading-relaxed">
                General inquiries: 1 business day.<br />
                Enterprise & sales: within 4 hours.<br />
                Security issues: within 2 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
