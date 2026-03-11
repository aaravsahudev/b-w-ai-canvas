import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Code, Copy, Download, Eye, FileText } from "lucide-react";
import logo from "@/assets/logo.png";

interface ProjectData {
  id: string;
  title: string;
  code: string;
  language: "html" | "react" | "vue" | "nextjs";
  prompt: string;
}

const OpenApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    const projectData = (location.state as ProjectData) || JSON.parse(localStorage.getItem("lastProject") || "null");
    if (projectData) {
      setProject(projectData);
      localStorage.setItem("lastProject", JSON.stringify(projectData));
    } else {
      navigate("/generate");
    }
  }, [location, navigate]);

  const getIframeContent = () => {
    if (!project) return "";
    if (project.language === "html") {
      return project.code;
    }
    // For other languages, show a message
    return `<!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif;
          background: #0f0f0f; color: white; display: flex; align-items: center;
          justify-content: center; min-height: 100vh;
        }
        .container { text-align: center; max-width: 600px; padding: 20px; }
        h2 { color: #667eea; margin-bottom: 1rem; }
        pre { background: #1a1a1a; padding: 1.5rem; border-radius: 8px; overflow-x: auto; text-align: left; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>${project.language.toUpperCase()} Code Generated</h2>
        <p>Your ${project.language} component is ready to use!</p>
        <pre>${project.code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
      </div>
    </body>
    </html>`;
  };

  if (!project) {
    return null;
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between shrink-0 bg-background">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/generate")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="flex items-center gap-2">
            <img src={logo} alt="QWS" className="h-5" />
            <span className="font-mono text-sm tracking-wide">QUICKWEBSTACK</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="font-mono text-xs text-muted-foreground">
            <span className="bg-secondary px-3 py-1.5 rounded">
              {project.language.toUpperCase()}
            </span>
          </div>
          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-2 px-4 py-2 border border-border hover:border-foreground text-sm font-mono transition-colors"
          >
            {showCode ? <Eye size={14} /> : <Code size={14} />}
            {showCode ? "PREVIEW" : "CODE"}
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Preview/Code Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!showCode ? (
            // Live Preview
            <div className="flex-1 overflow-hidden bg-background">
              <iframe
                key={iframeKey}
                srcDoc={getIframeContent()}
                className="w-full h-full border-0"
                title="Website Preview"
                sandbox="allow-scripts"
              />
            </div>
          ) : (
            // Code View
            <div className="flex-1 overflow-auto bg-background">
              <pre className="font-mono text-sm p-6 text-foreground whitespace-pre-wrap break-words">
                {project.code}
              </pre>
            </div>
          )}
        </div>

        {/* Right Sidebar - Info & Actions */}
        <div className="w-80 border-l border-border bg-background flex flex-col overflow-hidden">
          {/* Project Info */}
          <div className="p-6 border-b border-border flex-shrink-0">
            <h2 className="font-bold text-lg mb-2">{project.title}</h2>
            <p className="font-mono text-xs text-muted-foreground mb-4 line-clamp-3">
              {project.prompt}
            </p>
            <div className="flex items-center gap-2 text-xs">
              <FileText size={12} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                {project.code.length} characters
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-b border-border space-y-3 flex-shrink-0">
            <button
              onClick={() => {
                navigator.clipboard.writeText(project.code);
                alert("Code copied to clipboard!");
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-foreground text-background hover:opacity-90 transition-opacity font-mono text-xs tracking-wide"
            >
              <Copy size={14} /> COPY CODE
            </button>
            <button
              onClick={() => {
                const element = document.createElement("a");
                element.setAttribute(
                  "href",
                  "data:text/plain;charset=utf-8," + encodeURIComponent(project.code)
                );
                element.setAttribute(
                  "download",
                  `website.${project.language === "html" ? "html" : "jsx"}`
                );
                element.style.display = "none";
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-border hover:bg-secondary transition-colors font-mono text-xs tracking-wide"
            >
              <Download size={14} /> EXPORT
            </button>
          </div>

          {/* Language Info */}
          <div className="p-6 flex-1 overflow-auto">
            <h3 className="font-mono text-xs tracking-widest mb-4 text-muted-foreground">
              LANGUAGE DETAILS
            </h3>
            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="text-muted-foreground mb-1">Type</div>
                <div className="text-foreground">{project.language.toUpperCase()}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Generated</div>
                <div className="text-foreground">Just now</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Status</div>
                <div className="text-green-500">Ready</div>
              </div>
            </div>
          </div>

          {/* Regenerate Button */}
          <div className="p-6 border-t border-border flex-shrink-0">
            <button
              onClick={() => navigate("/generate")}
              className="w-full px-4 py-2.5 bg-secondary hover:bg-secondary/80 transition-colors font-mono text-xs tracking-wide"
            >
              GENERATE NEW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenApp;
