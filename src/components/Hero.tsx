import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  const scrollToActivities = () => {
    document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="دوار أيت سعيد أوداود" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
            جمعية إمليل
            <span className="block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              للتنمية والتعاون
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            دوار أيت سعيد أوداود -   إميضر
          </p>
          
          <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto">
            نعمل معاً من أجل تنمية مستدامة وشاملة لمجتمعنا المحلي
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-primary hover:bg-primary-glow transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={scrollToActivities}
            >
              اكتشف أنشطتنا
            </Button>
            <Link to="/register">
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 py-6 border-2 transition-all duration-300"
              >
                انضم إلينا
              </Button>
            </Link>
          </div>

          <div className="pt-8 animate-bounce">
            <ArrowDown className="mx-auto text-primary" size={32} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
