import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Intro from "./pages/Intro.tsx";
import Index from "./pages/Index.tsx";
import Generate from "./pages/Generate.tsx";
import Workspace from "./pages/Workspace.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const IntroRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") {
      sessionStorage.setItem("introReturnPath", location.pathname + location.search);
      navigate("/", { replace: true });
    }
  }, []);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <IntroRedirect />
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/home" element={<Index />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
