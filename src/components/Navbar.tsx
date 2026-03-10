import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = ["Generate", "Features", "Pricing", "Docs"];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src={logo} alt="QuickWebStack" className="h-8" />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="font-mono text-xs tracking-widest uppercase text-foreground hover:text-muted-foreground transition-colors"
              >
                {link}
              </a>
            ))}
            <a href="#generate" className="btn-primary text-xs py-3 px-6">
              START GENERATING
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden bg-background text-foreground border border-foreground w-10 h-10 flex items-center justify-center cursor-pointer"
          >
            <Menu size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
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
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="font-display text-4xl font-bold mb-4 text-background hover:text-muted-foreground"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
