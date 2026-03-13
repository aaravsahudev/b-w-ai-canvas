import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Intro from "./pages/Intro.tsx";
import Index from "./pages/Index.tsx";
import Generate from "./pages/Generate.tsx";
import Workspace from "./pages/Workspace.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Step 1: Intro loading animation → auto-navigates to /home */}
          <Route path="/" element={<Intro />} />
          {/* Step 2: Main marketing website */}
          <Route path="/home" element={<Index />} />
          {/* Step 3: AI generator workspace */}
          <Route path="/generate" element={<Generate />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
