import { useNavigate } from "react-router-dom";
import AnimatedLogo from "@/components/AnimatedLogo";

const Footer = () => {
  const navigate = useNavigate();

  const cols = [
    {
      title: "PRODUCT",
      links: [
        { label: "Generate", action: () => navigate("/generate") },
        { label: "API Access", action: () => navigate("/docs") },
        { label: "Pricing", action: () => document.querySelector("#pricing")?.scrollIntoView({ behavior: "smooth" }) },
        { label: "Changelog", action: () => navigate("/docs") },
      ],
    },
    {
      title: "RESOURCES",
      links: [
        { label: "Documentation", action: () => navigate("/docs") },
        { label: "Tutorials", action: () => navigate("/docs") },
        { label: "Blog", action: () => navigate("/about") },
        { label: "Status", action: () => window.open("https://status.quickwebstack.dev", "_blank") },
      ],
    },
    {
      title: "COMPANY",
      links: [
        { label: "About", action: () => navigate("/about") },
        { label: "Careers", action: () => navigate("/about") },
        { label: "Contact", action: () => navigate("/about") },
        { label: "Legal", action: () => navigate("/about") },
      ],
    },
  ];

  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <div className="mb-6 cursor-pointer" onClick={() => navigate("/home")}>
              <AnimatedLogo size={26} />
            </div>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              Next-generation AI platform for creators, developers, and power users.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-xs tracking-widest mb-6">{col.title}</h4>
              <div className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <button
                    key={link.label}
                    onClick={link.action}
                    className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors text-left"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-mono text-xs text-muted-foreground">
            © 2026 QUICKWEBSTACK. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6">
            {["TWITTER", "GITHUB", "DISCORD"].map((social) => (
              <a
                key={social}
                href="#"
                className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors tracking-widest"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
