import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";

const Contact = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              تواصل معنا
            </h2>
            <p className="text-lg text-muted-foreground">
              نحن هنا للإجابة على استفساراتكم والتعاون معكم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 space-y-4 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="text-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground">العنوان</h3>
                <p className="text-muted-foreground leading-relaxed">
                  دوار أيت سعيد أوداود<br />
                    إميضر<br />
                  المغرب
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 space-y-4 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
                  <Phone className="text-secondary" size={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground">الهاتف</h3>
                <p className="text-muted-foreground" dir="ltr">
                  +212 XXX XXX XXX
                </p>
              </CardContent>
            </Card>

            <Card className="border-none bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 space-y-4 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
                  <Mail className="text-accent" size={28} />
                </div>
                <h3 className="text-xl font-bold text-foreground">البريد الإلكتروني</h3>
                <p className="text-muted-foreground break-all">
                  contact@amlil-association.ma
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
