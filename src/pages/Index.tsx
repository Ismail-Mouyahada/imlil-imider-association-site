import Hero from "@/components/Hero";
import Activities from "@/components/Activities";
import About from "@/components/About";
import ImiderSection from "@/components/ImiderSection";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="bg-background">
      <Hero />
      <Activities />
      <About />
      <ImiderSection />
      <Contact />
    </div>
  );
};

export default Index;
