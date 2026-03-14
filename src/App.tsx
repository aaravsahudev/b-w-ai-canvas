import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PageTransition from "@/components/PageTransition";
import Intro from "./pages/Intro.tsx";
import Index from "./pages/Index.tsx";
import Generate from "./pages/Generate.tsx";
import Workspace from "./pages/Workspace.tsx";
import Docs from "./pages/Docs.tsx";
import About from "./pages/About.tsx";
import UpcomingUpdates from "./pages/UpcomingUpdates.tsx";
import Changelog from "./pages/Changelog.tsx";
import Tutorial from "./pages/Tutorial.tsx";
import Blog from "./pages/Blog.tsx";
import Status from "./pages/Status.tsx";
import Careers from "./pages/Careers.tsx";
import Contact from "./pages/Contact.tsx";
import Legal from "./pages/Legal.tsx";
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

const AppRoutes = () => {
  const location = useLocation();

  return (
    <PageTransition>
      <Routes location={location} key={location.pathname}>
        <Route path="/"           element={<Intro />} />
        <Route path="/home"       element={<Index />} />
        <Route path="/generate"   element={<Generate />} />
        <Route path="/workspace"  element={<Workspace />} />
        <Route path="/docs"       element={<Docs />} />
        <Route path="/about"      element={<About />} />
        <Route path="/upcoming"   element={<UpcomingUpdates />} />
        <Route path="/changelog"  element={<Changelog />} />
        <Route path="/tutorials"  element={<Tutorial />} />
        <Route path="/blog"       element={<Blog />} />
        <Route path="/status"     element={<Status />} />
        <Route path="/careers"    element={<Careers />} />
        <Route path="/contact"    element={<Contact />} />
        <Route path="/legal"      element={<Legal />} />
        <Route path="*"           element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <IntroRedirect />
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
