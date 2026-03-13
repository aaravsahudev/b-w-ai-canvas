export const generateWebsite = (prompt: string): string => {
  const p = prompt.toLowerCase();

  // ── LANDING / HERO ──────────────────────────────────────────────────────────
  if (p.includes("landing") || p.includes("hero") || p.includes("startup") || p.includes("saas")) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Launch — The Future Is Now</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  :root{--c1:#6366f1;--c2:#8b5cf6;--dark:#0a0a0f;--light:#f8fafc}
  html{scroll-behavior:smooth}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--dark);color:var(--light);overflow-x:hidden}

  /* NAV */
  nav{position:fixed;top:0;width:100%;z-index:100;padding:1.2rem 5%;display:flex;justify-content:space-between;align-items:center;backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.06)}
  .logo{font-weight:800;font-size:1.3rem;background:linear-gradient(135deg,var(--c1),var(--c2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .nav-links{display:flex;gap:2.5rem;list-style:none}
  .nav-links a{color:rgba(255,255,255,.7);text-decoration:none;font-size:.9rem;transition:color .3s}
  .nav-links a:hover{color:#fff}
  .nav-cta{background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff;border:none;padding:.6rem 1.5rem;border-radius:8px;cursor:pointer;font-weight:600;font-size:.85rem;transition:transform .2s,box-shadow .2s}
  .nav-cta:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(99,102,241,.5)}

  /* HERO */
  .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:8rem 5% 4rem;position:relative;overflow:hidden}
  .hero::before{content:'';position:absolute;width:800px;height:800px;background:radial-gradient(circle,rgba(99,102,241,.15) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none}
  .badge{display:inline-flex;align-items:center;gap:.5rem;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);color:var(--c1);padding:.4rem 1rem;border-radius:100px;font-size:.8rem;font-weight:600;margin-bottom:2rem;animation:fadeUp .8s ease both}
  .hero h1{font-size:clamp(2.5rem,6vw,5rem);font-weight:900;line-height:1.1;letter-spacing:-0.03em;max-width:800px;animation:fadeUp .8s ease .1s both}
  .gradient-text{background:linear-gradient(135deg,var(--c1),var(--c2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .hero p{font-size:1.2rem;color:rgba(255,255,255,.6);max-width:560px;line-height:1.8;margin:1.5rem 0 3rem;animation:fadeUp .8s ease .2s both}
  .hero-btns{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;animation:fadeUp .8s ease .3s both}
  .btn-primary{background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff;border:none;padding:1rem 2.5rem;border-radius:12px;cursor:pointer;font-weight:700;font-size:1rem;transition:transform .2s,box-shadow .2s}
  .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(99,102,241,.4)}
  .btn-outline{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.2);padding:1rem 2.5rem;border-radius:12px;cursor:pointer;font-weight:600;font-size:1rem;transition:all .2s}
  .btn-outline:hover{border-color:rgba(255,255,255,.5);background:rgba(255,255,255,.05)}

  /* TRUSTED */
  .trusted{text-align:center;padding:3rem 5%;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06)}
  .trusted p{color:rgba(255,255,255,.4);font-size:.8rem;letter-spacing:.15em;text-transform:uppercase;margin-bottom:1.5rem}
  .logos{display:flex;gap:3rem;justify-content:center;align-items:center;flex-wrap:wrap}
  .logo-item{font-size:1.1rem;font-weight:800;color:rgba(255,255,255,.2);letter-spacing:-.02em}

  /* FEATURES */
  .features{padding:6rem 5%;max-width:1100px;margin:0 auto}
  .section-label{font-size:.75rem;letter-spacing:.2em;text-transform:uppercase;color:var(--c1);font-weight:700;margin-bottom:.8rem}
  .section-title{font-size:clamp(1.8rem,4vw,3rem);font-weight:800;letter-spacing:-.03em;margin-bottom:1rem}
  .section-sub{color:rgba(255,255,255,.5);font-size:1.05rem;max-width:480px;line-height:1.8}
  .feature-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem;margin-top:4rem}
  .feature-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:2rem;transition:all .3s}
  .feature-card:hover{background:rgba(99,102,241,.08);border-color:rgba(99,102,241,.3);transform:translateY(-4px)}
  .feature-icon{width:48px;height:48px;background:linear-gradient(135deg,rgba(99,102,241,.2),rgba(139,92,246,.2));border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin-bottom:1.2rem}
  .feature-card h3{font-size:1.1rem;font-weight:700;margin-bottom:.6rem}
  .feature-card p{color:rgba(255,255,255,.5);font-size:.9rem;line-height:1.7}

  /* CTA */
  .cta-section{padding:8rem 5%;text-align:center}
  .cta-box{background:linear-gradient(135deg,rgba(99,102,241,.15),rgba(139,92,246,.1));border:1px solid rgba(99,102,241,.2);border-radius:24px;padding:5rem 3rem;max-width:700px;margin:0 auto}
  .cta-box h2{font-size:clamp(2rem,4vw,3rem);font-weight:800;letter-spacing:-.03em;margin-bottom:1rem}
  .cta-box p{color:rgba(255,255,255,.6);font-size:1.1rem;margin-bottom:2.5rem;line-height:1.8}

  /* FOOTER */
  footer{padding:3rem 5%;border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
  footer .logo{font-size:1.1rem}
  footer p{color:rgba(255,255,255,.3);font-size:.85rem}

  @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
</style>
</head>
<body>
<nav>
  <div class="logo">Nexus</div>
  <ul class="nav-links">
    <li><a href="#">Product</a></li>
    <li><a href="#">Features</a></li>
    <li><a href="#">Pricing</a></li>
    <li><a href="#">Blog</a></li>
  </ul>
  <button class="nav-cta">Get Started →</button>
</nav>

<section class="hero">
  <div class="badge">✦ Now in public beta</div>
  <h1>The platform that <span class="gradient-text">scales with you</span></h1>
  <p>Ship faster, build smarter. The all-in-one workspace your team has been waiting for.</p>
  <div class="hero-btns">
    <button class="btn-primary">Start for free</button>
    <button class="btn-outline">View demo →</button>
  </div>
</section>

<div class="trusted">
  <p>Trusted by teams at</p>
  <div class="logos">
    <span class="logo-item">Stripe</span>
    <span class="logo-item">Notion</span>
    <span class="logo-item">Linear</span>
    <span class="logo-item">Vercel</span>
    <span class="logo-item">Figma</span>
  </div>
</div>

<section class="features">
  <div class="section-label">Features</div>
  <h2 class="section-title">Everything you need, nothing you don't</h2>
  <p class="section-sub">Built for modern teams who move fast and care about craft.</p>
  <div class="feature-grid">
    <div class="feature-card"><div class="feature-icon">⚡</div><h3>Blazing Fast</h3><p>Sub-50ms response times globally. Your users will never wait.</p></div>
    <div class="feature-card"><div class="feature-icon">🔒</div><h3>Enterprise Security</h3><p>SOC 2 Type II compliant. Your data stays yours, always encrypted.</p></div>
    <div class="feature-card"><div class="feature-icon">🤝</div><h3>Real-time Collaboration</h3><p>Work together seamlessly. See changes as they happen, live.</p></div>
    <div class="feature-card"><div class="feature-icon">📊</div><h3>Advanced Analytics</h3><p>Deep insights into every interaction. Make decisions with data.</p></div>
    <div class="feature-card"><div class="feature-icon">🔌</div><h3>100+ Integrations</h3><p>Connect your entire stack. Slack, GitHub, Jira, and more.</p></div>
    <div class="feature-card"><div class="feature-icon">🌍</div><h3>Global CDN</h3><p>Deployed across 200+ edge locations worldwide.</p></div>
  </div>
</section>

<section class="cta-section">
  <div class="cta-box">
    <h2>Ready to <span class="gradient-text">get started?</span></h2>
    <p>Join 50,000+ teams already building with Nexus. Free forever on our starter plan.</p>
    <button class="btn-primary">Create your account →</button>
  </div>
</section>

<footer>
  <div class="logo">Nexus</div>
  <p>© 2025 Nexus, Inc. All rights reserved.</p>
</footer>
</body>
</html>`;
  }

  // ── PORTFOLIO / PERSONAL ─────────────────────────────────────────────────────
  if (p.includes("portfolio") || p.includes("personal") || p.includes("resume") || p.includes("designer") || p.includes("developer")) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Alex Chen — Creative Developer</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  :root{--bg:#050508;--surface:#0d0d14;--border:rgba(255,255,255,.07);--accent:#a78bfa;--text:#e2e8f0;--muted:rgba(255,255,255,.4)}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);overflow-x:hidden}
  a{color:inherit;text-decoration:none}

  header{height:100vh;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:0 8%;gap:4rem;position:relative}
  header::after{content:'';position:absolute;right:0;top:0;width:45%;height:100%;background:radial-gradient(ellipse at center,rgba(167,139,250,.07) 0%,transparent 70%)}
  .intro .tag{background:rgba(167,139,250,.15);color:var(--accent);padding:.35rem .9rem;border-radius:100px;font-size:.8rem;font-weight:600;display:inline-block;margin-bottom:1.5rem}
  .intro h1{font-size:clamp(2.5rem,4.5vw,4.5rem);font-weight:900;line-height:1.1;letter-spacing:-.04em;margin-bottom:1.2rem}
  .intro h1 em{font-style:normal;color:var(--accent)}
  .intro p{color:var(--muted);font-size:1.1rem;line-height:1.8;max-width:440px;margin-bottom:2.5rem}
  .actions{display:flex;gap:1rem}
  .btn{padding:.9rem 2rem;border-radius:10px;font-weight:700;font-size:.95rem;cursor:pointer;border:none;transition:all .2s}
  .btn-fill{background:var(--accent);color:#fff}.btn-fill:hover{transform:translateY(-2px);box-shadow:0 8px 25px rgba(167,139,250,.35)}
  .btn-ghost{background:transparent;color:var(--text);border:1px solid var(--border)}.btn-ghost:hover{border-color:var(--accent);color:var(--accent)}
  .avatar-wrap{display:flex;justify-content:center}
  .avatar{width:340px;height:420px;background:linear-gradient(145deg,rgba(167,139,250,.15),rgba(139,92,246,.05));border:1px solid var(--border);border-radius:24px;display:flex;align-items:center;justify-content:center;font-size:8rem}

  nav{position:fixed;top:2rem;left:50%;transform:translateX(-50%);background:rgba(5,5,8,.8);backdrop-filter:blur(20px);border:1px solid var(--border);border-radius:100px;padding:.7rem 2rem;display:flex;gap:2.5rem;z-index:100}
  nav a{font-size:.85rem;color:var(--muted);transition:color .2s}.nav a:hover{color:#fff}

  section{padding:6rem 8%}
  .section-num{font-size:.75rem;color:var(--accent);font-weight:700;letter-spacing:.2em;margin-bottom:.8rem}
  .section-title{font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:800;letter-spacing:-.03em;margin-bottom:.8rem}
  .section-sub{color:var(--muted);font-size:1rem;line-height:1.8}

  .projects-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:1.5rem;margin-top:3.5rem}
  .project-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;transition:all .3s;cursor:pointer}
  .project-card:hover{border-color:rgba(167,139,250,.3);transform:translateY(-6px);box-shadow:0 20px 60px rgba(0,0,0,.5)}
  .project-thumb{height:200px;display:flex;align-items:center;justify-content:center;font-size:4rem}
  .p1{background:linear-gradient(135deg,#1e1b4b,#312e81)}
  .p2{background:linear-gradient(135deg,#0f172a,#1e3a5f)}
  .p3{background:linear-gradient(135deg,#1a0533,#3b0764)}
  .project-info{padding:1.5rem}
  .project-tag{font-size:.7rem;letter-spacing:.15em;color:var(--accent);font-weight:700;margin-bottom:.5rem}
  .project-info h3{font-size:1.1rem;font-weight:700;margin-bottom:.5rem}
  .project-info p{color:var(--muted);font-size:.85rem;line-height:1.6}

  .skills-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:1rem;margin-top:3rem}
  .skill{background:var(--surface);border:1px solid var(--border);padding:1.2rem;border-radius:12px;text-align:center;transition:all .2s}
  .skill:hover{border-color:var(--accent);transform:scale(1.04)}
  .skill-icon{font-size:1.8rem;margin-bottom:.6rem}
  .skill-name{font-size:.8rem;font-weight:600;color:var(--muted)}

  .contact-wrap{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:4rem;text-align:center;margin-top:3rem}
  .contact-wrap h2{font-size:2.5rem;font-weight:800;letter-spacing:-.03em;margin-bottom:1rem}
  .contact-wrap p{color:var(--muted);margin-bottom:2rem;line-height:1.8}
  .contact-email{font-size:1.5rem;font-weight:800;color:var(--accent)}

  @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  header .intro{animation:fadeUp .9s ease}
  header .avatar-wrap{animation:fadeUp .9s ease .15s both;opacity:0}
</style>
</head>
<body>
<nav>
  <a href="#">About</a><a href="#">Work</a><a href="#">Skills</a><a href="#">Contact</a>
</nav>

<header>
  <div class="intro">
    <span class="tag">✦ Available for freelance</span>
    <h1>I build things for the <em>web</em></h1>
    <p>Creative developer specializing in interactive experiences, design systems, and products people love to use.</p>
    <div class="actions">
      <button class="btn btn-fill">View my work</button>
      <button class="btn btn-ghost">Download CV</button>
    </div>
  </div>
  <div class="avatar-wrap">
    <div class="avatar">👨‍💻</div>
  </div>
</header>

<section id="work">
  <div class="section-num">01 — WORK</div>
  <h2 class="section-title">Selected projects</h2>
  <p class="section-sub">A curated collection of things I've built recently.</p>
  <div class="projects-grid">
    <div class="project-card"><div class="project-thumb p1">🛒</div><div class="project-info"><div class="project-tag">E-COMMERCE</div><h3>ShopFlow</h3><p>Next.js e-commerce with Stripe payments and real-time inventory.</p></div></div>
    <div class="project-card"><div class="project-thumb p2">📊</div><div class="project-info"><div class="project-tag">DASHBOARD</div><h3>DataPulse</h3><p>Analytics platform serving 2M monthly active users.</p></div></div>
    <div class="project-card"><div class="project-thumb p3">🤖</div><div class="project-info"><div class="project-tag">AI / ML</div><h3>Verba AI</h3><p>GPT-powered writing assistant with custom fine-tuning.</p></div></div>
  </div>
</section>

<section id="skills">
  <div class="section-num">02 — SKILLS</div>
  <h2 class="section-title">What I work with</h2>
  <div class="skills-grid">
    <div class="skill"><div class="skill-icon">⚛️</div><div class="skill-name">React</div></div>
    <div class="skill"><div class="skill-icon">🔷</div><div class="skill-name">TypeScript</div></div>
    <div class="skill"><div class="skill-icon">🟢</div><div class="skill-name">Node.js</div></div>
    <div class="skill"><div class="skill-icon">🐍</div><div class="skill-name">Python</div></div>
    <div class="skill"><div class="skill-icon">🗄️</div><div class="skill-name">PostgreSQL</div></div>
    <div class="skill"><div class="skill-icon">▲</div><div class="skill-name">Next.js</div></div>
    <div class="skill"><div class="skill-icon">🎨</div><div class="skill-name">Figma</div></div>
    <div class="skill"><div class="skill-icon">☁️</div><div class="skill-name">AWS</div></div>
  </div>
</section>

<section id="contact">
  <div class="section-num">03 — CONTACT</div>
  <div class="contact-wrap">
    <h2>Let's work together</h2>
    <p>I'm always open to interesting projects.<br>Drop me a message and I'll get back within 24 hours.</p>
    <div class="contact-email">hello@alexchen.dev</div>
  </div>
</section>
</body>
</html>`;
  }

  // ── DASHBOARD / ADMIN ────────────────────────────────────────────────────────
  if (p.includes("dashboard") || p.includes("admin") || p.includes("analytics") || p.includes("chart") || p.includes("stats")) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dashboard — Analytics</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  :root{--bg:#070710;--sidebar:#0c0c1a;--card:#111120;--border:rgba(255,255,255,.07);--accent:#6366f1;--accent2:#22c55e;--warn:#f59e0b;--danger:#ef4444;--text:#e2e8f0;--muted:rgba(255,255,255,.4)}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);display:grid;grid-template-columns:240px 1fr;min-height:100vh}

  .sidebar{background:var(--sidebar);border-right:1px solid var(--border);padding:1.5rem;display:flex;flex-direction:column;gap:.3rem}
  .sidebar-logo{font-weight:900;font-size:1.3rem;letter-spacing:-.05em;margin-bottom:2rem;padding:.5rem 0}
  .sidebar-logo span{color:var(--accent)}
  .nav-group{margin-top:1rem}
  .nav-group-title{font-size:.65rem;letter-spacing:.15em;color:var(--muted);font-weight:700;padding:.5rem .8rem;margin-bottom:.2rem}
  .nav-item{display:flex;align-items:center;gap:.8rem;padding:.7rem .8rem;border-radius:8px;font-size:.85rem;cursor:pointer;transition:all .2s;color:var(--muted)}
  .nav-item:hover,.nav-item.active{background:rgba(99,102,241,.12);color:#fff}
  .nav-item.active{color:var(--accent)}
  .nav-dot{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.6}

  .main{display:flex;flex-direction:column;overflow:hidden}
  .topbar{padding:1.2rem 2rem;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
  .topbar-title h1{font-size:1.4rem;font-weight:800;letter-spacing:-.03em}
  .topbar-title p{color:var(--muted);font-size:.8rem;margin-top:.15rem}
  .topbar-actions{display:flex;align-items:center;gap:.8rem}
  .btn-sm{padding:.5rem 1.2rem;border-radius:8px;font-size:.8rem;font-weight:600;cursor:pointer;border:none;transition:all .2s}
  .btn-primary{background:var(--accent);color:#fff}.btn-primary:hover{opacity:.85}
  .btn-ghost{background:rgba(255,255,255,.05);color:var(--text);border:1px solid var(--border)}.btn-ghost:hover{border-color:rgba(255,255,255,.2)}
  .avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700}

  .content{padding:2rem;overflow-y:auto;flex:1}

  .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.2rem;margin-bottom:2rem}
  .kpi{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:1.5rem;position:relative;overflow:hidden;transition:all .3s}
  .kpi:hover{border-color:rgba(255,255,255,.15);transform:translateY(-2px)}
  .kpi::after{content:'';position:absolute;top:0;right:0;width:80px;height:80px;border-radius:50%;background:radial-gradient(circle,var(--kpi-color,.1) 0%,transparent 70%);transform:translate(20px,-20px)}
  .kpi-label{font-size:.75rem;color:var(--muted);letter-spacing:.05em;font-weight:600;margin-bottom:.8rem}
  .kpi-value{font-size:2rem;font-weight:900;letter-spacing:-.04em;margin-bottom:.5rem}
  .kpi-change{font-size:.75rem;font-weight:600;display:inline-flex;align-items:center;gap:.3rem;padding:.2rem .6rem;border-radius:100px}
  .up{background:rgba(34,197,94,.12);color:var(--accent2)}
  .down{background:rgba(239,68,68,.12);color:var(--danger)}

  .charts{display:grid;grid-template-columns:2fr 1fr;gap:1.2rem;margin-bottom:2rem}
  .chart-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:1.5rem}
  .chart-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}
  .chart-header h3{font-size:.95rem;font-weight:700}
  .chart-header span{font-size:.75rem;color:var(--muted)}

  .bar-chart{display:flex;align-items:flex-end;gap:.6rem;height:160px}
  .bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:.5rem;height:100%}
  .bar{width:100%;background:linear-gradient(to top,var(--accent),rgba(99,102,241,.3));border-radius:4px 4px 0 0;transition:all .3s}
  .bar-wrap:hover .bar{background:linear-gradient(to top,#818cf8,rgba(129,140,248,.5))}
  .bar-label{font-size:.65rem;color:var(--muted)}

  .donut-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;height:160px;gap:.5rem}
  .donut{width:120px;height:120px;border-radius:50%;background:conic-gradient(var(--accent) 0% 42%,#22c55e 42% 68%,#f59e0b 68% 85%,#ef4444 85% 100%);display:flex;align-items:center;justify-content:center;position:relative}
  .donut-hole{width:72px;height:72px;background:var(--card);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center}
  .donut-hole span{font-size:1.1rem;font-weight:800}
  .donut-hole small{font-size:.6rem;color:var(--muted)}
  .legend{display:flex;flex-direction:column;gap:.4rem;width:100%}
  .legend-item{display:flex;align-items:center;gap:.5rem;font-size:.72rem;color:var(--muted)}
  .legend-dot{width:8px;height:8px;border-radius:2px;flex-shrink:0}

  .table-card{background:var(--card);border:1px solid var(--border);border-radius:14px;overflow:hidden}
  .table-header{padding:1.2rem 1.5rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}
  .table-header h3{font-size:.95rem;font-weight:700}
  table{width:100%;border-collapse:collapse}
  th{padding:.8rem 1.5rem;text-align:left;font-size:.7rem;color:var(--muted);letter-spacing:.1em;font-weight:700;border-bottom:1px solid var(--border)}
  td{padding:.9rem 1.5rem;font-size:.85rem;border-bottom:1px solid rgba(255,255,255,.03)}
  tr:hover td{background:rgba(255,255,255,.02)}
  .status{padding:.25rem .75rem;border-radius:100px;font-size:.7rem;font-weight:700;display:inline-block}
  .status-live{background:rgba(34,197,94,.12);color:var(--accent2)}
  .status-pending{background:rgba(245,158,11,.12);color:var(--warn)}
  .status-paused{background:rgba(239,68,68,.12);color:var(--danger)}
</style>
</head>
<body>
<aside class="sidebar">
  <div class="sidebar-logo">Dash<span>.</span></div>
  <div class="nav-group">
    <div class="nav-group-title">MAIN</div>
    <div class="nav-item active">📊 Overview</div>
    <div class="nav-item">📈 Analytics</div>
    <div class="nav-item">💰 Revenue</div>
  </div>
  <div class="nav-group">
    <div class="nav-group-title">MANAGE</div>
    <div class="nav-item">👥 Users</div>
    <div class="nav-item">🛍️ Orders</div>
    <div class="nav-item">📦 Products</div>
  </div>
  <div class="nav-group">
    <div class="nav-group-title">SYSTEM</div>
    <div class="nav-item">⚙️ Settings</div>
    <div class="nav-item">🔔 Alerts</div>
  </div>
</aside>

<div class="main">
  <div class="topbar">
    <div class="topbar-title"><h1>Overview</h1><p>Welcome back, Alex. Here's what's happening.</p></div>
    <div class="topbar-actions">
      <button class="btn-sm btn-ghost">Export</button>
      <button class="btn-sm btn-primary">+ New Report</button>
      <div class="avatar">A</div>
    </div>
  </div>

  <div class="content">
    <div class="kpi-grid">
      <div class="kpi" style="--kpi-color:rgba(99,102,241,.15)"><div class="kpi-label">TOTAL REVENUE</div><div class="kpi-value">$48,295</div><span class="kpi-change up">↑ 12.5%</span></div>
      <div class="kpi" style="--kpi-color:rgba(34,197,94,.15)"><div class="kpi-label">ACTIVE USERS</div><div class="kpi-value">8,441</div><span class="kpi-change up">↑ 8.2%</span></div>
      <div class="kpi" style="--kpi-color:rgba(245,158,11,.15)"><div class="kpi-label">ORDERS TODAY</div><div class="kpi-value">324</div><span class="kpi-change up">↑ 3.1%</span></div>
      <div class="kpi" style="--kpi-color:rgba(239,68,68,.15)"><div class="kpi-label">CHURN RATE</div><div class="kpi-value">2.4%</div><span class="kpi-change down">↓ 0.3%</span></div>
    </div>

    <div class="charts">
      <div class="chart-card">
        <div class="chart-header"><h3>Revenue Trend</h3><span>Last 7 days</span></div>
        <div class="bar-chart">
          <div class="bar-wrap"><div class="bar" style="height:55%"></div><span class="bar-label">Mon</span></div>
          <div class="bar-wrap"><div class="bar" style="height:75%"></div><span class="bar-label">Tue</span></div>
          <div class="bar-wrap"><div class="bar" style="height:60%"></div><span class="bar-label">Wed</span></div>
          <div class="bar-wrap"><div class="bar" style="height:90%"></div><span class="bar-label">Thu</span></div>
          <div class="bar-wrap"><div class="bar" style="height:70%"></div><span class="bar-label">Fri</span></div>
          <div class="bar-wrap"><div class="bar" style="height:85%"></div><span class="bar-label">Sat</span></div>
          <div class="bar-wrap"><div class="bar" style="height:100%"></div><span class="bar-label">Sun</span></div>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-header"><h3>Traffic Sources</h3><span>This month</span></div>
        <div class="donut-wrap">
          <div class="donut"><div class="donut-hole"><span>74%</span><small>organic</small></div></div>
          <div class="legend">
            <div class="legend-item"><div class="legend-dot" style="background:#6366f1"></div>Organic 42%</div>
            <div class="legend-item"><div class="legend-dot" style="background:#22c55e"></div>Social 26%</div>
            <div class="legend-item"><div class="legend-dot" style="background:#f59e0b"></div>Paid 17%</div>
            <div class="legend-item"><div class="legend-dot" style="background:#ef4444"></div>Direct 15%</div>
          </div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header"><h3>Recent Campaigns</h3><button class="btn-sm btn-ghost">View all</button></div>
      <table>
        <thead><tr><th>CAMPAIGN</th><th>STATUS</th><th>REACH</th><th>CLICKS</th><th>REVENUE</th></tr></thead>
        <tbody>
          <tr><td>Summer Sale 2025</td><td><span class="status status-live">Live</span></td><td>145K</td><td>8,920</td><td>$12,400</td></tr>
          <tr><td>Product Launch Q3</td><td><span class="status status-pending">Pending</span></td><td>—</td><td>—</td><td>—</td></tr>
          <tr><td>Retargeting Wave 4</td><td><span class="status status-live">Live</span></td><td>38K</td><td>2,145</td><td>$5,830</td></tr>
          <tr><td>Black Friday Prep</td><td><span class="status status-paused">Paused</span></td><td>210K</td><td>14,300</td><td>$31,200</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</body>
</html>`;
  }

  // ── E-COMMERCE / SHOP ────────────────────────────────────────────────────────
  if (p.includes("shop") || p.includes("store") || p.includes("ecommerce") || p.includes("product") || p.includes("buy") || p.includes("sell")) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vessel — Premium Store</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  :root{--bg:#fafaf9;--surface:#fff;--border:#e5e7eb;--text:#111;--muted:#6b7280;--accent:#111}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text)}

  nav{padding:1.2rem 5%;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);background:#fff;position:sticky;top:0;z-index:100}
  .logo{font-weight:900;font-size:1.4rem;letter-spacing:-.06em}
  .nav-center{display:flex;gap:2rem;list-style:none}
  .nav-center a{font-size:.9rem;color:var(--muted);text-decoration:none;transition:color .2s}.nav-center a:hover{color:var(--text)}
  .nav-right{display:flex;align-items:center;gap:1.2rem}
  .cart-btn{background:#111;color:#fff;border:none;padding:.6rem 1.3rem;border-radius:8px;font-size:.85rem;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:.5rem;transition:opacity .2s}.cart-btn:hover{opacity:.8}

  .hero-strip{background:#111;color:#fff;text-align:center;padding:.6rem;font-size:.8rem;letter-spacing:.05em}
  .hero-strip span{color:#d4af37}

  .hero{display:grid;grid-template-columns:1fr 1fr;min-height:80vh;overflow:hidden}
  .hero-text{padding:8rem 5% 4rem;display:flex;flex-direction:column;justify-content:center}
  .hero-label{font-size:.75rem;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);margin-bottom:1rem;font-weight:600}
  .hero h1{font-size:clamp(2.5rem,4vw,4.5rem);font-weight:900;line-height:1;letter-spacing:-.05em;margin-bottom:1.5rem}
  .hero p{color:var(--muted);font-size:1rem;line-height:1.8;max-width:420px;margin-bottom:2.5rem}
  .hero-btns{display:flex;gap:1rem}
  .btn{padding:.9rem 2rem;border-radius:10px;font-weight:700;font-size:.9rem;cursor:pointer;transition:all .2s;border:none}
  .btn-dark{background:#111;color:#fff}.btn-dark:hover{background:#333}
  .btn-light{background:transparent;color:#111;border:1.5px solid #111}.btn-light:hover{background:#111;color:#fff}
  .hero-img{background:linear-gradient(135deg,#f5f5f0,#e8e8e0);display:flex;align-items:center;justify-content:center;font-size:10rem}

  .products-section{padding:5rem 5%;max-width:1200px;margin:0 auto}
  .products-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:3rem}
  .products-header h2{font-size:2.2rem;font-weight:900;letter-spacing:-.04em}
  .filter-tabs{display:flex;gap:.5rem}
  .filter-tab{padding:.5rem 1.2rem;border-radius:100px;font-size:.8rem;font-weight:600;cursor:pointer;border:1.5px solid;transition:all .2s}
  .filter-tab.active{background:#111;color:#fff;border-color:#111}
  .filter-tab:not(.active){background:transparent;color:var(--muted);border-color:var(--border)}.filter-tab:not(.active):hover{border-color:#111;color:#111}

  .product-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:2rem}
  .product-card{cursor:pointer}
  .product-card:hover .product-img-wrap{transform:scale(1.02)}
  .product-img-wrap{background:#f5f5f0;border-radius:16px;aspect-ratio:4/5;display:flex;align-items:center;justify-content:center;font-size:5rem;overflow:hidden;transition:transform .4s ease;margin-bottom:1rem}
  .product-info{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.3rem}
  .product-name{font-weight:700;font-size:1rem}
  .product-price{font-weight:800;font-size:1rem}
  .product-sub{color:var(--muted);font-size:.85rem;margin-bottom:.8rem}
  .add-btn{width:100%;padding:.75rem;border:1.5px solid var(--border);background:transparent;border-radius:10px;font-size:.85rem;font-weight:600;cursor:pointer;transition:all .2s}.add-btn:hover{background:#111;color:#fff;border-color:#111}

  .banner{background:#111;color:#fff;padding:5rem 5%;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;margin-top:4rem}
  .banner h2{font-size:2.5rem;font-weight:900;letter-spacing:-.04em;line-height:1.1}
  .banner p{color:rgba(255,255,255,.6);line-height:1.8;margin:1rem 0 2rem}
  .banner-img{font-size:8rem;text-align:center}

  footer{padding:3rem 5%;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
  footer span{color:var(--muted);font-size:.85rem}
</style>
</head>
<body>
<div class="hero-strip">✦ Free shipping on orders over $75 — Use code <span>VESSEL25</span></div>
<nav>
  <div class="logo">Vessel</div>
  <ul class="nav-center"><li><a href="#">Shop</a></li><li><a href="#">Collections</a></li><li><a href="#">About</a></li><li><a href="#">Journal</a></li></ul>
  <div class="nav-right">
    <span style="font-size:.85rem;color:#6b7280;cursor:pointer">🔍</span>
    <span style="font-size:.85rem;color:#6b7280;cursor:pointer">👤</span>
    <button class="cart-btn">🛍️ Cart (0)</button>
  </div>
</nav>

<div class="hero">
  <div class="hero-text">
    <div class="hero-label">New collection 2025</div>
    <h1>Objects worth keeping</h1>
    <p>Handcrafted goods made to last a lifetime. Designed with intention, built with care.</p>
    <div class="hero-btns">
      <button class="btn btn-dark">Shop the collection</button>
      <button class="btn btn-light">Learn our story</button>
    </div>
  </div>
  <div class="hero-img">🏺</div>
</div>

<section class="products-section">
  <div class="products-header">
    <h2>Featured pieces</h2>
    <div class="filter-tabs">
      <div class="filter-tab active">All</div>
      <div class="filter-tab">Ceramics</div>
      <div class="filter-tab">Textiles</div>
      <div class="filter-tab">Wood</div>
    </div>
  </div>
  <div class="product-grid">
    <div class="product-card"><div class="product-img-wrap">🫙</div><div class="product-info"><span class="product-name">Stoneware Vase</span><span class="product-price">$128</span></div><div class="product-sub">Matte cream glaze</div><button class="add-btn">Add to cart</button></div>
    <div class="product-card"><div class="product-img-wrap">🪴</div><div class="product-info"><span class="product-name">Linen Throw</span><span class="product-price">$94</span></div><div class="product-sub">Stone washed, natural</div><button class="add-btn">Add to cart</button></div>
    <div class="product-card"><div class="product-img-wrap">🕯️</div><div class="product-info"><span class="product-name">Taper Candles</span><span class="product-price">$32</span></div><div class="product-sub">Set of 4, beeswax</div><button class="add-btn">Add to cart</button></div>
    <div class="product-card"><div class="product-img-wrap">🍵</div><div class="product-info"><span class="product-name">Matcha Bowl</span><span class="product-price">$78</span></div><div class="product-sub">Hand-thrown ceramic</div><button class="add-btn">Add to cart</button></div>
  </div>
</section>

<div class="banner">
  <div><h2>Crafted with purpose</h2><p>Every piece in our collection is made by independent artisans using traditional techniques passed down through generations.</p><button class="btn" style="background:#fff;color:#111;padding:.9rem 2rem;border-radius:10px;font-weight:700;cursor:pointer">Meet the makers</button></div>
  <div class="banner-img">🏔️</div>
</div>

<footer><span>© 2025 Vessel Studio</span><span>Sustainable · Handcrafted · Purposeful</span></footer>
</body>
</html>`;
  }

  // ── RESTAURANT / FOOD ────────────────────────────────────────────────────────
  if (p.includes("restaurant") || p.includes("food") || p.includes("cafe") || p.includes("menu") || p.includes("eat") || p.includes("dine")) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Osteria — Fine Dining</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  :root{--bg:#0c0a05;--gold:#c9a84c;--cream:#f5f0e8;--muted:rgba(245,240,232,.5)}
  body{font-family:Georgia,serif;background:var(--bg);color:var(--cream);overflow-x:hidden}

  nav{position:fixed;top:0;width:100%;z-index:100;padding:1.5rem 6%;display:flex;justify-content:space-between;align-items:center;background:rgba(12,10,5,.9);backdrop-filter:blur(20px);border-bottom:1px solid rgba(201,168,76,.2)}
  .logo{font-size:1.6rem;font-weight:400;letter-spacing:.1em;color:var(--gold)}
  .nav-links{display:flex;gap:2.5rem;list-style:none}
  .nav-links a{color:var(--muted);text-decoration:none;font-size:.9rem;letter-spacing:.1em;transition:color .3s}.nav-links a:hover{color:var(--cream)}
  .reserve-btn{border:1px solid var(--gold);color:var(--gold);background:transparent;padding:.6rem 1.5rem;font-family:Georgia,serif;font-size:.85rem;letter-spacing:.15em;cursor:pointer;transition:all .3s}.reserve-btn:hover{background:var(--gold);color:#0c0a05}

  .hero{height:100vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:0 5%;position:relative;overflow:hidden;background:radial-gradient(ellipse at center,rgba(201,168,76,.06) 0%,transparent 70%)}
  .hero-decor{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:600px;border:1px solid rgba(201,168,76,.08);border-radius:50%;pointer-events:none}
  .hero-decor::before{content:'';position:absolute;top:15%;left:15%;right:15%;bottom:15%;border:1px solid rgba(201,168,76,.05);border-radius:50%}
  .hero-content{position:relative}
  .hero-eyebrow{font-size:.75rem;letter-spacing:.35em;color:var(--gold);margin-bottom:2rem;font-family:'Segoe UI',sans-serif;font-weight:400}
  .hero h1{font-size:clamp(3.5rem,7vw,7rem);font-weight:400;line-height:1;letter-spacing:-.02em;margin-bottom:1.5rem}
  .hero h1 em{font-style:italic;color:var(--gold)}
  .hero p{color:var(--muted);font-size:1.05rem;max-width:440px;margin:0 auto 3rem;line-height:1.9}
  .hero-btn{display:inline-block;padding:1rem 3rem;border:1px solid var(--gold);color:var(--gold);font-family:Georgia,serif;font-size:.9rem;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;background:transparent;transition:all .3s}.hero-btn:hover{background:var(--gold);color:#0c0a05}

  .divider{display:flex;align-items:center;justify-content:center;padding:3rem 0;gap:1.5rem;color:var(--gold);font-size:.7rem;letter-spacing:.3em}
  .divider::before,.divider::after{content:'';flex:1;max-width:200px;height:1px;background:rgba(201,168,76,.2)}

  .menu-section{padding:5rem 6%}
  .section-header{text-align:center;margin-bottom:4rem}
  .section-eyebrow{font-size:.7rem;letter-spacing:.35em;color:var(--gold);margin-bottom:1rem;font-family:'Segoe UI',sans-serif}
  .section-title{font-size:clamp(2rem,4vw,3.5rem);font-weight:400;letter-spacing:-.02em}

  .menu-tabs{display:flex;justify-content:center;gap:0;margin-bottom:3rem;border:1px solid rgba(201,168,76,.2)}
  .tab{padding:.8rem 2rem;font-family:Georgia,serif;font-size:.85rem;letter-spacing:.1em;cursor:pointer;border:none;background:transparent;color:var(--muted);transition:all .2s}
  .tab.active{background:var(--gold);color:#0c0a05}

  .menu-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:0;border:1px solid rgba(201,168,76,.1)}
  .menu-item{padding:2rem;border-bottom:1px solid rgba(201,168,76,.08);border-right:1px solid rgba(201,168,76,.08);transition:background .3s}
  .menu-item:hover{background:rgba(201,168,76,.04)}
  .menu-item-header{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:.5rem}
  .menu-name{font-size:1.1rem;font-weight:400;letter-spacing:.02em}
  .menu-price{color:var(--gold);font-size:1rem;white-space:nowrap}
  .menu-desc{color:var(--muted);font-size:.85rem;line-height:1.7}
  .menu-tag{font-size:.65rem;letter-spacing:.15em;background:rgba(201,168,76,.12);color:var(--gold);padding:.2rem .6rem;margin-top:.8rem;display:inline-block}

  .ambiance{padding:6rem 6%;background:linear-gradient(180deg,rgba(201,168,76,.03) 0%,transparent 100%)}
  .ambiance-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;max-width:1100px;margin:0 auto}
  .ambiance-images{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
  .ambiance-img{aspect-ratio:1;background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.12);display:flex;align-items:center;justify-content:center;font-size:4rem;border-radius:2px}
  .ambiance-img.tall{grid-row:1/3;aspect-ratio:auto}
  .ambiance-text p{color:var(--muted);line-height:1.9;font-size:1rem;margin:1.5rem 0 2.5rem}

  .reservation{text-align:center;padding:6rem 5%;border-top:1px solid rgba(201,168,76,.1)}
  .reservation h2{font-size:clamp(2rem,4vw,3.5rem);margin-bottom:1rem;font-weight:400}
  .reservation p{color:var(--muted);margin-bottom:3rem;line-height:1.9}
  .contact-info{display:flex;justify-content:center;gap:4rem;flex-wrap:wrap}
  .contact-item .label{font-size:.65rem;letter-spacing:.3em;color:var(--gold);margin-bottom:.5rem;font-family:'Segoe UI',sans-serif}
  .contact-item .value{font-size:1rem}
</style>
</head>
<body>
<nav>
  <div class="logo">OSTERIA</div>
  <ul class="nav-links"><li><a href="#">Menu</a></li><li><a href="#">Story</a></li><li><a href="#">Events</a></li><li><a href="#">Press</a></li></ul>
  <button class="reserve-btn">RESERVATIONS</button>
</nav>

<section class="hero">
  <div class="hero-decor"></div>
  <div class="hero-content">
    <p class="hero-eyebrow">FINE DINING · EST. 2018</p>
    <h1>Where food becomes <em>memory</em></h1>
    <p>An intimate dining room serving wood-fired, seasonal Italian cuisine in the heart of the city.</p>
    <button class="hero-btn">Reserve a table</button>
  </div>
</section>

<div class="divider">✦ OUR MENU ✦</div>

<section class="menu-section">
  <div class="section-header">
    <p class="section-eyebrow">SEASONAL TASTING</p>
    <h2 class="section-title">Tonight's menu</h2>
  </div>
  <div class="menu-tabs">
    <div class="tab active">Antipasti</div>
    <div class="tab">Primi</div>
    <div class="tab">Secondi</div>
    <div class="tab">Dolci</div>
  </div>
  <div class="menu-grid">
    <div class="menu-item"><div class="menu-item-header"><span class="menu-name">Burrata & Heirloom</span><span class="menu-price">$18</span></div><p class="menu-desc">Creamy burrata, heirloom tomatoes, basil oil, Maldon sea salt</p><span class="menu-tag">VEGETARIAN</span></div>
    <div class="menu-item"><div class="menu-item-header"><span class="menu-name">Beef Carpaccio</span><span class="menu-price">$24</span></div><p class="menu-desc">Wagyu tenderloin, truffle aioli, capers, shaved Parmigiano</p></div>
    <div class="menu-item"><div class="menu-item-header"><span class="menu-name">Grilled Octopus</span><span class="menu-price">$28</span></div><p class="menu-desc">Charred tentacles, 'nduja, chickpea purée, lemon</p><span class="menu-tag">CHEF'S CHOICE</span></div>
    <div class="menu-item"><div class="menu-item-header"><span class="menu-name">Arancini Trio</span><span class="menu-price">$16</span></div><p class="menu-desc">Saffron risotto balls, mozzarella, tomato sugo</p><span class="menu-tag">VEGETARIAN</span></div>
  </div>
</section>

<section class="ambiance">
  <div class="ambiance-grid">
    <div class="ambiance-images">
      <div class="ambiance-img tall">🍝</div>
      <div class="ambiance-img">🍷</div>
      <div class="ambiance-img">🕯️</div>
    </div>
    <div class="ambiance-text">
      <p class="section-eyebrow">OUR STORY</p>
      <h2 class="section-title">A table for memory</h2>
      <p>We believe the best meals are the ones you remember decades later. Every detail — the light, the wine, the silence between courses — is considered.</p>
      <button class="reserve-btn">Discover our story</button>
    </div>
  </div>
</section>

<section class="reservation">
  <h2>Join us this evening</h2>
  <p>Reservations recommended. Walk-ins welcome when available.</p>
  <div class="contact-info">
    <div class="contact-item"><div class="label">ADDRESS</div><div class="value">12 Vine Street, Roma</div></div>
    <div class="contact-item"><div class="label">PHONE</div><div class="value">+1 (555) 089-3421</div></div>
    <div class="contact-item"><div class="label">HOURS</div><div class="value">Tue–Sun · 6pm – 11pm</div></div>
  </div>
</section>
</body>
</html>`;
  }

  // ── BLOG / MAGAZINE ──────────────────────────────────────────────────────────
  if (p.includes("blog") || p.includes("magazine") || p.includes("article") || p.includes("news") || p.includes("write")) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Meridian — Ideas worth reading</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  :root{--bg:#fafafa;--surface:#fff;--border:#e5e7eb;--text:#111;--muted:#6b7280;--accent:#2563eb}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--text)}

  nav{background:#fff;border-bottom:1px solid var(--border);padding:1rem 5%;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100}
  .logo{font-weight:900;font-size:1.4rem;letter-spacing:-.05em}
  .nav-tags{display:flex;gap:1.5rem;list-style:none}
  .nav-tags a{font-size:.85rem;color:var(--muted);text-decoration:none;transition:color .2s}.nav-tags a:hover{color:var(--text)}
  .subscribe-btn{background:var(--accent);color:#fff;border:none;padding:.55rem 1.3rem;border-radius:8px;font-size:.82rem;font-weight:700;cursor:pointer;transition:opacity .2s}.subscribe-btn:hover{opacity:.85}

  .featured{display:grid;grid-template-columns:3fr 2fr;gap:0;border-bottom:1px solid var(--border);padding:3rem 5%;max-width:1300px;margin:0 auto}
  .featured-main{padding-right:3rem;border-right:1px solid var(--border)}
  .featured-tag{background:#eff6ff;color:var(--accent);font-size:.72rem;font-weight:700;padding:.3rem .8rem;border-radius:100px;display:inline-block;margin-bottom:1rem;letter-spacing:.05em}
  .featured-main h1{font-size:clamp(2rem,3.5vw,3.2rem);font-weight:900;line-height:1.15;letter-spacing:-.04em;margin-bottom:1rem;cursor:pointer;transition:color .2s}.featured-main h1:hover{color:var(--accent)}
  .featured-excerpt{color:var(--muted);font-size:1.05rem;line-height:1.8;max-width:520px;margin-bottom:1.5rem}
  .featured-meta{display:flex;align-items:center;gap:1rem;font-size:.82rem;color:var(--muted)}
  .author-avatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent),#7c3aed);display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;color:#fff}
  .featured-image{height:300px;background:linear-gradient(135deg,#eff6ff,#dbeafe);display:flex;align-items:center;justify-content:center;font-size:6rem}

  .sidebar{padding-left:2.5rem}
  .sidebar-heading{font-size:.7rem;letter-spacing:.2em;font-weight:700;color:var(--muted);margin-bottom:1.5rem;padding-bottom:.8rem;border-bottom:1px solid var(--border)}
  .sidebar-item{padding:1.2rem 0;border-bottom:1px solid var(--border);cursor:pointer}
  .sidebar-item:last-child{border-bottom:none}
  .sidebar-tag{font-size:.7rem;color:var(--accent);font-weight:700;margin-bottom:.4rem}
  .sidebar-title{font-size:.95rem;font-weight:700;line-height:1.3;transition:color .2s}.sidebar-item:hover .sidebar-title{color:var(--accent)}
  .sidebar-meta{font-size:.75rem;color:var(--muted);margin-top:.4rem}

  .grid-section{padding:3rem 5%;max-width:1300px;margin:0 auto}
  .grid-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem}
  .grid-header h2{font-size:1.4rem;font-weight:800;letter-spacing:-.03em}
  .view-all{font-size:.82rem;color:var(--accent);cursor:pointer;font-weight:600}
  .articles{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem}
  .article-card{cursor:pointer}
  .article-card:hover .article-title{color:var(--accent)}
  .article-img{aspect-ratio:16/10;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:3.5rem;margin-bottom:1rem;overflow:hidden}
  .a1{background:linear-gradient(135deg,#fef3c7,#fde68a)}
  .a2{background:linear-gradient(135deg,#f0fdf4,#bbf7d0)}
  .a3{background:linear-gradient(135deg,#fdf2f8,#f5d0fe)}
  .article-tag{font-size:.7rem;color:var(--accent);font-weight:700;margin-bottom:.5rem;letter-spacing:.05em}
  .article-title{font-size:1.05rem;font-weight:800;line-height:1.3;margin-bottom:.5rem;letter-spacing:-.02em;transition:color .2s}
  .article-excerpt{color:var(--muted);font-size:.85rem;line-height:1.6;margin-bottom:.8rem}
  .article-meta{font-size:.75rem;color:var(--muted);display:flex;gap:.8rem}

  .newsletter{background:#111;color:#fff;padding:4rem 5%;text-align:center;margin-top:2rem}
  .newsletter h2{font-size:2rem;font-weight:900;letter-spacing:-.04em;margin-bottom:.8rem}
  .newsletter p{color:rgba(255,255,255,.6);font-size:1rem;margin-bottom:2rem;line-height:1.8}
  .email-form{display:flex;gap:.8rem;justify-content:center;max-width:460px;margin:0 auto}
  .email-input{flex:1;padding:.85rem 1.2rem;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);color:#fff;border-radius:8px;font-size:.9rem;outline:none}
  .email-input::placeholder{color:rgba(255,255,255,.4)}
  .email-submit{background:var(--accent);color:#fff;border:none;padding:.85rem 1.5rem;border-radius:8px;font-size:.9rem;font-weight:700;cursor:pointer;transition:opacity .2s;white-space:nowrap}.email-submit:hover{opacity:.85}

  footer{padding:2rem 5%;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;font-size:.82rem;color:var(--muted)}
</style>
</head>
<body>
<nav>
  <div class="logo">Meridian</div>
  <ul class="nav-tags"><li><a href="#">Design</a></li><li><a href="#">Technology</a></li><li><a href="#">Culture</a></li><li><a href="#">Science</a></li><li><a href="#">Opinion</a></li></ul>
  <button class="subscribe-btn">Subscribe</button>
</nav>

<div class="featured">
  <div class="featured-main">
    <span class="featured-tag">DESIGN</span>
    <h1>The interface is the product — why UX is now the only moat</h1>
    <p class="featured-excerpt">In a world where features are copied overnight, the experience of using software has become the primary differentiator. Here's why the best product teams think like designers first.</p>
    <div class="featured-meta">
      <div class="author-avatar">S</div>
      <span>Sarah Chen</span><span>·</span><span>8 min read</span><span>·</span><span>June 12, 2025</span>
    </div>
  </div>
  <div class="sidebar">
    <div class="sidebar-heading">TRENDING NOW</div>
    <div class="sidebar-item"><div class="sidebar-tag">TECHNOLOGY</div><div class="sidebar-title">AI is not replacing developers — it's replacing bad code</div><div class="sidebar-meta">James Park · 5 min</div></div>
    <div class="sidebar-item"><div class="sidebar-tag">CULTURE</div><div class="sidebar-title">The return of the office, and what it means for cities</div><div class="sidebar-meta">Maria Gonzalez · 7 min</div></div>
    <div class="sidebar-item"><div class="sidebar-tag">SCIENCE</div><div class="sidebar-title">A new theory of consciousness might change everything</div><div class="sidebar-meta">Dr. Liu Wei · 12 min</div></div>
  </div>
</div>

<section class="grid-section">
  <div class="grid-header"><h2>Latest stories</h2><span class="view-all">View all →</span></div>
  <div class="articles">
    <div class="article-card"><div class="article-img a1">🎨</div><div class="article-tag">DESIGN</div><div class="article-title">Why every startup should hire a writer before a designer</div><p class="article-excerpt">Words create worlds. The best products start with clarity of language.</p><div class="article-meta"><span>Anna Ko</span><span>4 min read</span></div></div>
    <div class="article-card"><div class="article-img a2">🌱</div><div class="article-tag">SUSTAINABILITY</div><div class="article-title">The companies quietly solving climate change without press releases</div><p class="article-excerpt">Doing good without the spotlight — a new model of corporate responsibility.</p><div class="article-meta"><span>Tom Archer</span><span>9 min read</span></div></div>
    <div class="article-card"><div class="article-img a3">🧠</div><div class="article-tag">TECHNOLOGY</div><div class="article-title">Building with AI: lessons from a year inside the hype cycle</div><p class="article-excerpt">What actually changes when you ship AI products, and what stays hard.</p><div class="article-meta"><span>Priya Mehta</span><span>6 min read</span></div></div>
  </div>
</section>

<div class="newsletter">
  <h2>Ideas, weekly.</h2>
  <p>Join 120,000 readers getting the best stories delivered every Thursday.</p>
  <div class="email-form"><input class="email-input" type="email" placeholder="your@email.com"><button class="email-submit">Subscribe →</button></div>
</div>

<footer><span>© 2025 Meridian Media</span><span>Privacy · Terms · Advertise</span></footer>
</body>
</html>`;
  }

  // ── PRICING ──────────────────────────────────────────────────────────────────
  if (p.includes("pricing") || p.includes("plan") || p.includes("subscription") || p.includes("tier")) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pricing — Choose your plan</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  :root{--bg:#06060f;--card:#0d0d1e;--border:rgba(255,255,255,.08);--accent:#6366f1;--text:#f1f5f9;--muted:rgba(255,255,255,.45)}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
  nav{padding:1.2rem 5%;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border)}
  .logo{font-weight:900;font-size:1.3rem}
  .nav-login{font-size:.85rem;color:var(--muted);cursor:pointer;transition:color .2s}.nav-login:hover{color:var(--text)}

  .hero{text-align:center;padding:5rem 5% 4rem}
  .hero-badge{display:inline-block;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);color:var(--accent);padding:.35rem 1rem;border-radius:100px;font-size:.78rem;font-weight:700;margin-bottom:1.5rem;letter-spacing:.05em}
  .hero h1{font-size:clamp(2.5rem,5vw,4.5rem);font-weight:900;letter-spacing:-.04em;margin-bottom:1rem;line-height:1.1}
  .hero p{color:var(--muted);font-size:1.1rem;max-width:500px;margin:0 auto 2.5rem;line-height:1.8}
  .toggle-wrap{display:inline-flex;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:100px;padding:.3rem}
  .toggle-btn{padding:.5rem 1.5rem;border-radius:100px;font-size:.85rem;font-weight:600;cursor:pointer;border:none;background:transparent;color:var(--muted);transition:all .2s}
  .toggle-btn.active{background:var(--accent);color:#fff}
  .save-badge{background:rgba(34,197,94,.15);color:#22c55e;font-size:.7rem;font-weight:700;padding:.2rem .6rem;border-radius:100px;margin-left:.5rem}

  .plans{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;max-width:1100px;margin:3rem auto;padding:0 5%}
  .plan{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:2.5rem;position:relative;transition:all .3s}
  .plan.popular{border-color:var(--accent);transform:translateY(-8px)}
  .popular-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,var(--accent),#8b5cf6);color:#fff;font-size:.72rem;font-weight:700;padding:.3rem 1rem;border-radius:100px;white-space:nowrap;letter-spacing:.05em}
  .plan-name{font-size:.8rem;font-weight:700;letter-spacing:.15em;color:var(--muted);margin-bottom:.8rem}
  .plan-price{font-size:3.5rem;font-weight:900;letter-spacing:-.06em;line-height:1;margin-bottom:.3rem}
  .plan-price sup{font-size:1.5rem;vertical-align:top;margin-top:.7rem}
  .plan-period{color:var(--muted);font-size:.85rem;margin-bottom:.5rem}
  .plan-desc{color:var(--muted);font-size:.85rem;line-height:1.6;margin-bottom:2rem;padding-bottom:2rem;border-bottom:1px solid var(--border)}
  .features-list{list-style:none;display:flex;flex-direction:column;gap:.9rem;margin-bottom:2.5rem}
  .features-list li{display:flex;align-items:center;gap:.8rem;font-size:.88rem;color:var(--muted)}
  .features-list li.included{color:var(--text)}
  .check{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.7rem;flex-shrink:0}
  .check.yes{background:rgba(34,197,94,.15);color:#22c55e}
  .check.no{background:rgba(255,255,255,.05);color:rgba(255,255,255,.2)}
  .plan-btn{width:100%;padding:1rem;border-radius:12px;font-size:.9rem;font-weight:700;cursor:pointer;transition:all .2s;border:none}
  .plan-btn-outline{background:transparent;border:1.5px solid var(--border);color:var(--text)}.plan-btn-outline:hover{border-color:var(--accent);color:var(--accent)}
  .plan-btn-fill{background:linear-gradient(135deg,var(--accent),#8b5cf6);color:#fff}.plan-btn-fill:hover{opacity:.9;transform:translateY(-1px)}

  .faq{max-width:800px;margin:3rem auto;padding:0 5% 5rem}
  .faq h2{font-size:2rem;font-weight:800;letter-spacing:-.04em;text-align:center;margin-bottom:3rem}
  .faq-item{border-bottom:1px solid var(--border);padding:1.5rem 0;cursor:pointer}
  .faq-q{display:flex;justify-content:space-between;align-items:center;font-size:.95rem;font-weight:600}
  .faq-a{color:var(--muted);font-size:.88rem;line-height:1.8;margin-top:1rem}

  .bottom-cta{background:linear-gradient(135deg,rgba(99,102,241,.12),rgba(139,92,246,.08));border:1px solid rgba(99,102,241,.15);border-radius:24px;text-align:center;padding:4rem;max-width:700px;margin:0 auto 5rem;padding-left:5%;padding-right:5%}
  .bottom-cta h2{font-size:2rem;font-weight:800;letter-spacing:-.04em;margin-bottom:.8rem}
  .bottom-cta p{color:var(--muted);margin-bottom:2rem;line-height:1.8}
</style>
</head>
<body>
<nav><div class="logo">Nexus</div><span class="nav-login">Log in →</span></nav>

<div class="hero">
  <div class="hero-badge">✦ Simple, transparent pricing</div>
  <h1>Pay for what you use,<br>nothing else</h1>
  <p>No hidden fees. Cancel anytime. Start free and scale as you grow.</p>
  <div class="toggle-wrap">
    <button class="toggle-btn active">Monthly</button>
    <button class="toggle-btn">Annual <span class="save-badge">Save 30%</span></button>
  </div>
</div>

<div class="plans">
  <div class="plan">
    <div class="plan-name">STARTER</div>
    <div class="plan-price"><sup>$</sup>0</div>
    <div class="plan-period">forever free</div>
    <p class="plan-desc">Perfect for side projects and learning. No credit card required.</p>
    <ul class="features-list">
      <li class="included"><span class="check yes">✓</span>Up to 3 projects</li>
      <li class="included"><span class="check yes">✓</span>1 GB storage</li>
      <li class="included"><span class="check yes">✓</span>Community support</li>
      <li class="included"><span class="check yes">✓</span>Basic analytics</li>
      <li><span class="check no">✕</span>Custom domains</li>
      <li><span class="check no">✕</span>Priority support</li>
      <li><span class="check no">✕</span>Team collaboration</li>
    </ul>
    <button class="plan-btn plan-btn-outline">Get started free</button>
  </div>

  <div class="plan popular">
    <div class="popular-badge">✦ MOST POPULAR</div>
    <div class="plan-name">PRO</div>
    <div class="plan-price"><sup>$</sup>29</div>
    <div class="plan-period">per month</div>
    <p class="plan-desc">Everything you need to ship professional products fast.</p>
    <ul class="features-list">
      <li class="included"><span class="check yes">✓</span>Unlimited projects</li>
      <li class="included"><span class="check yes">✓</span>50 GB storage</li>
      <li class="included"><span class="check yes">✓</span>Priority support (24h)</li>
      <li class="included"><span class="check yes">✓</span>Advanced analytics</li>
      <li class="included"><span class="check yes">✓</span>Custom domains</li>
      <li class="included"><span class="check yes">✓</span>API access</li>
      <li><span class="check no">✕</span>SSO / SAML</li>
    </ul>
    <button class="plan-btn plan-btn-fill">Start Pro trial →</button>
  </div>

  <div class="plan">
    <div class="plan-name">ENTERPRISE</div>
    <div class="plan-price" style="font-size:2.5rem">Custom</div>
    <div class="plan-period">contact for pricing</div>
    <p class="plan-desc">For large teams with advanced security and compliance needs.</p>
    <ul class="features-list">
      <li class="included"><span class="check yes">✓</span>Everything in Pro</li>
      <li class="included"><span class="check yes">✓</span>Unlimited storage</li>
      <li class="included"><span class="check yes">✓</span>Dedicated support</li>
      <li class="included"><span class="check yes">✓</span>Custom SLA</li>
      <li class="included"><span class="check yes">✓</span>SSO / SAML</li>
      <li class="included"><span class="check yes">✓</span>Audit logs</li>
      <li class="included"><span class="check yes">✓</span>On-premise option</li>
    </ul>
    <button class="plan-btn plan-btn-outline">Talk to sales</button>
  </div>
</div>

<div class="faq">
  <h2>Frequently asked</h2>
  <div class="faq-item"><div class="faq-q">Can I switch plans at any time? <span>+</span></div><div class="faq-a">Yes. Upgrade or downgrade your plan at any time. Changes take effect immediately.</div></div>
  <div class="faq-item"><div class="faq-q">Is there a free trial? <span>+</span></div><div class="faq-a">All paid plans come with a 14-day free trial. No credit card required to start.</div></div>
  <div class="faq-item"><div class="faq-q">What payment methods do you accept? <span>+</span></div><div class="faq-a">We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</div></div>
  <div class="faq-item"><div class="faq-q">Can I cancel anytime? <span>+</span></div><div class="faq-a">Absolutely. Cancel your subscription from the dashboard anytime — no questions asked.</div></div>
</div>

<div style="padding:0 5%"><div class="bottom-cta">
  <h2>Still not sure?</h2>
  <p>Talk to our team. We'll help you find the right plan for your use case — or build something custom.</p>
  <button class="plan-btn plan-btn-fill" style="max-width:240px;margin:0 auto;display:block">Book a call →</button>
</div></div>
</body>
</html>`;
  }

  // ── DEFAULT — generic beautiful website ─────────────────────────────────────
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Generated — ${prompt.slice(0, 40)}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  :root{--bg:#07070e;--c1:#6366f1;--c2:#8b5cf6;--text:#f1f5f9;--muted:rgba(241,245,249,.45)}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden}

  nav{padding:1.2rem 6%;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,.06);position:sticky;top:0;background:rgba(7,7,14,.9);backdrop-filter:blur(20px);z-index:100}
  .logo{font-weight:900;font-size:1.3rem;background:linear-gradient(135deg,var(--c1),var(--c2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .nav-right{display:flex;gap:1rem}
  .btn{padding:.6rem 1.5rem;border-radius:8px;font-size:.85rem;font-weight:700;cursor:pointer;transition:all .2s;border:none}
  .btn-ghost{background:rgba(255,255,255,.06);color:var(--text)}.btn-ghost:hover{background:rgba(255,255,255,.1)}
  .btn-accent{background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff}.btn-accent:hover{opacity:.9}

  .hero{min-height:92vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:4rem 6%;position:relative}
  .orb{position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none}
  .orb1{width:500px;height:500px;background:rgba(99,102,241,.12);top:10%;left:5%}
  .orb2{width:400px;height:400px;background:rgba(139,92,246,.1);bottom:10%;right:5%}
  .hero-content{position:relative;z-index:1}
  .pill{display:inline-flex;align-items:center;gap:.5rem;background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.25);color:var(--c1);padding:.4rem 1.1rem;border-radius:100px;font-size:.78rem;font-weight:700;letter-spacing:.05em;margin-bottom:2rem;animation:fadeUp .7s ease both}
  h1{font-size:clamp(2.8rem,6vw,6rem);font-weight:900;line-height:1.05;letter-spacing:-.05em;margin-bottom:1.5rem;animation:fadeUp .7s ease .1s both}
  .grad{background:linear-gradient(135deg,var(--c1),var(--c2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .subtitle{color:var(--muted);font-size:1.15rem;max-width:520px;line-height:1.8;margin-bottom:3rem;animation:fadeUp .7s ease .2s both}
  .ctas{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;animation:fadeUp .7s ease .3s both}
  .cta-main{background:linear-gradient(135deg,var(--c1),var(--c2));color:#fff;border:none;padding:1rem 2.5rem;border-radius:12px;font-size:1rem;font-weight:700;cursor:pointer;transition:all .2s}.cta-main:hover{transform:translateY(-3px);box-shadow:0 12px 35px rgba(99,102,241,.35)}
  .cta-sec{background:rgba(255,255,255,.06);color:var(--text);border:none;padding:1rem 2.5rem;border-radius:12px;font-size:1rem;font-weight:700;cursor:pointer;transition:all .2s}.cta-sec:hover{background:rgba(255,255,255,.1)}

  .stats{display:flex;justify-content:center;gap:4rem;padding:3rem 6%;border-top:1px solid rgba(255,255,255,.05);border-bottom:1px solid rgba(255,255,255,.05);flex-wrap:wrap}
  .stat{text-align:center}.stat-num{font-size:2.5rem;font-weight:900;letter-spacing:-.06em;background:linear-gradient(135deg,var(--c1),var(--c2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .stat-label{color:var(--muted);font-size:.8rem;margin-top:.3rem;letter-spacing:.05em}

  .cards{padding:5rem 6%;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:1200px;margin:0 auto}
  .card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:2rem;transition:all .3s}
  .card:hover{background:rgba(99,102,241,.07);border-color:rgba(99,102,241,.25);transform:translateY(-5px)}
  .card-icon{font-size:2.2rem;margin-bottom:1.2rem}
  .card h3{font-size:1.1rem;font-weight:700;margin-bottom:.6rem}
  .card p{color:var(--muted);font-size:.9rem;line-height:1.7}

  footer{padding:2.5rem 6%;border-top:1px solid rgba(255,255,255,.05);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
  footer .logo2{font-weight:900;font-size:1.1rem;background:linear-gradient(135deg,var(--c1),var(--c2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  footer p{color:var(--muted);font-size:.8rem}

  @keyframes fadeUp{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:translateY(0)}}
</style>
</head>
<body>
<nav>
  <div class="logo">Aura</div>
  <div class="nav-right">
    <button class="btn btn-ghost">Log in</button>
    <button class="btn btn-accent">Get started</button>
  </div>
</nav>
<section class="hero">
  <div class="orb orb1"></div>
  <div class="orb orb2"></div>
  <div class="hero-content">
    <div class="pill">✦ Generated for you</div>
    <h1>Build something<br><span class="grad">remarkable</span></h1>
    <p class="subtitle">Your idea, brought to life. A fully designed, ready-to-ship website — crafted in seconds by AI.</p>
    <div class="ctas">
      <button class="cta-main">Start building →</button>
      <button class="cta-sec">View demo</button>
    </div>
  </div>
</section>
<div class="stats">
  <div class="stat"><div class="stat-num">50K+</div><div class="stat-label">HAPPY USERS</div></div>
  <div class="stat"><div class="stat-num">99.9%</div><div class="stat-label">UPTIME SLA</div></div>
  <div class="stat"><div class="stat-num">4.9★</div><div class="stat-label">AVERAGE RATING</div></div>
  <div class="stat"><div class="stat-num">2M+</div><div class="stat-label">SITES GENERATED</div></div>
</div>
<div class="cards">
  <div class="card"><div class="card-icon">⚡</div><h3>Instant Generation</h3><p>From idea to live website in under 30 seconds. No waiting, no friction.</p></div>
  <div class="card"><div class="card-icon">🎨</div><h3>Beautiful by Default</h3><p>Every site is crafted with professional design principles built in.</p></div>
  <div class="card"><div class="card-icon">♾️</div><h3>Unlimited Iterations</h3><p>Refine, adjust, and perfect until it's exactly right. No extra cost.</p></div>
  <div class="card"><div class="card-icon">📱</div><h3>Fully Responsive</h3><p>Looks stunning on every device, from desktop to mobile, out of the box.</p></div>
</div>
<footer>
  <div class="logo2">Aura</div>
  <p>© 2025 · Built with QuickWebStack AI</p>
</footer>
</body>
</html>`;
};
