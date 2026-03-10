import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <img src={logo} alt="QuickWebStack" className="h-5 mb-6" />
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              Next-generation AI platform for creators, developers, and power users.
            </p>
          </div>

          {[
            {
              title: "PRODUCT",
              links: ["Generate", "API Access", "Pricing", "Changelog"],
            },
            {
              title: "RESOURCES",
              links: ["Documentation", "Tutorials", "Blog", "Status"],
            },
            {
              title: "COMPANY",
              links: ["About", "Careers", "Contact", "Legal"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-xs tracking-widest mb-6">{col.title}</h4>
              <div className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
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
