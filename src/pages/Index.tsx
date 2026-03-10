import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import FeaturesSection from "@/components/FeaturesSection";
import GenerateSection from "@/components/GenerateSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <MarqueeBanner />
      <FeaturesSection />
      <GenerateSection />
      <HowItWorks />
      <MarqueeBanner />
      <Footer />
    </div>
  );
};

export default Index;
