import { X } from "lucide-react";
import logo from "@/assets/logo.png";

interface NavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavOverlay = ({ isOpen, onClose }: NavOverlayProps) => {
  if (!isOpen) return null;

  return (
    <div className="nav-overlay flex flex-col items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-8 right-8 bg-background text-foreground p-4 cursor-pointer border border-background hover:border-background"
      >
        <X size={32} strokeWidth={1} />
      </button>

      <img src={logo} alt="QuickWebStack" className="h-8 mb-16 invert" />

      <nav className="flex flex-col items-center gap-4">
        {["GENERATE", "HISTORY", "API", "DOCS"].map((item) => (
          <button
            key={item}
            className="font-display text-5xl md:text-7xl font-bold tracking-tight bg-foreground text-background border-0 cursor-pointer px-4 py-2 hover:bg-background hover:text-foreground transition-none"
            onClick={onClose}
          >
            {item}
          </button>
        ))}
      </nav>

      <p className="absolute bottom-8 font-mono text-xs tracking-widest text-background">
        QUICKWEBSTACK // AI GENERATION TERMINAL
      </p>
    </div>
  );
};

export default NavOverlay;
