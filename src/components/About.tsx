import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Award } from "lucide-react";

const About = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              من نحن
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              جمعية إمليل للتنمية والتعاون هي منظمة مجتمع مدني تعمل على تنمية دوار أيت سعيد أوداود ب  إميضر
              والمناطق المجاورة من خلال مجموعة متنوعة من المبادرات التنموية والاجتماعية
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none bg-gradient-to-br from-primary/10 to-primary/5 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 space-y-4 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground">رسالتنا</h3>
                <p className="text-muted-foreground">
                  تمكين المجتمع المحلي من خلال التنمية المستدامة والشاملة
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-gradient-to-br from-secondary/10 to-secondary/5 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 space-y-4 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
                  <Eye className="text-secondary" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground">رؤيتنا</h3>
                <p className="text-muted-foreground">
                  مجتمع متطور ومزدهر يتمتع بالكرامة والعدالة الاجتماعية
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-gradient-to-br from-accent/10 to-accent/5 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 space-y-4 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                  <Award className="text-accent" size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground">قيمنا</h3>
                <p className="text-muted-foreground">
                  التعاون، الشفافية، المسؤولية، والالتزام بخدمة المجتمع
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
