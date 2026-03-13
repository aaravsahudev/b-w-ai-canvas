import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedLogo from "@/components/AnimatedLogo";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { label: "Features", href: "#features" },
    { label: "Generate", href: "#generate" },
    { label: "Pricing", href: "#pricing" },
    { label: "Docs", href: "#docs" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/home" className="flex items-center">
            <AnimatedLogo size={28} />
          </a>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => navigate("/generate")}
              className="btn-primary text-xs py-3 px-6"
            >
              OPEN APP
            </button>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden bg-background text-foreground border border-foreground w-10 h-10 flex items-center justify-center cursor-pointer"
          >
            <Menu size={18} />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-foreground text-background flex flex-col items-center justify-center">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 bg-foreground text-background border border-background w-10 h-10 flex items-center justify-center cursor-pointer"
          >
            <X size={18} />
          </button>
          {links.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-4xl font-bold mb-4 text-background hover:text-muted-foreground"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/generate");
            }}
            className="mt-8 bg-background text-foreground font-mono text-sm uppercase tracking-widest px-10 py-4 border-0 cursor-pointer"
          >
            OPEN APP
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
