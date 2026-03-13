import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeBanner from "@/components/MarqueeBanner";
import FeaturesSection from "@/components/FeaturesSection";
import AIPowerSection from "@/components/AIPowerSection";
import GenerateSection from "@/components/GenerateSection";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <MarqueeBanner />
      <FeaturesSection />
      <AIPowerSection />
      <GenerateSection />
      <HowItWorks />
      <PricingSection />
      <MarqueeBanner />
      <Footer />
    </div>
  );
};

export default Index;
