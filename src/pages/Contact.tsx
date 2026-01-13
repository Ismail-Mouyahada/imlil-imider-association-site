import Navbar from "@/components/Navbar";
import ContactForm from "@/components/ContactForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users,
  MessageSquare,
  Heart,
  Building2
} from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 text-gradient">تواصل معنا</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            نحن هنا لمساعدتك والإجابة على استفساراتك. تواصل معنا بأي طريقة تفضلها
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  معلومات الاتصال
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">العنوان</h4>
                    <p className="text-sm text-muted-foreground">
                      دوار أيت سعيد أوداود<br />
                        إميضر، إقليم الرشيدية<br />
                      المملكة المغربية
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">الهاتف</h4>
                    <p className="text-sm text-muted-foreground">
                      +212 6XX XXX XXX<br />
                      +212 5XX XXX XXX
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">البريد الإلكتروني</h4>
                    <p className="text-sm text-muted-foreground">
                      contact@imlil-association.ma<br />
                      info@imlil-association.ma
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">ساعات العمل</h4>
                    <p className="text-sm text-muted-foreground">
                      الأحد - الخميس: 9:00 - 17:00<br />
                      الجمعة: 9:00 - 12:00<br />
                      السبت: مغلق
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  فريق العمل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium">الرئيس</h4>
                  <p className="text-sm text-muted-foreground">أحمد بن محمد</p>
                  <p className="text-xs text-muted-foreground">ahmed.benmohamed@imlil-association.ma</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium">نائب الرئيس</h4>
                  <p className="text-sm text-muted-foreground">فاطمة الزهراء</p>
                  <p className="text-xs text-muted-foreground">fatima.zahra@imlil-association.ma</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium">الأمين</h4>
                  <p className="text-sm text-muted-foreground">محمد العياشي</p>
                  <p className="text-xs text-muted-foreground">mohamed.ayachi@imlil-association.ma</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                استفسارات شائعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">كيف يمكنني الانضمام للجمعية؟</h4>
                <p className="text-sm text-muted-foreground">
                  يمكنك ملء نموذج العضوية من خلال صفحة "انضم إلينا" أو التواصل معنا مباشرة.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">ما هي طرق التبرع المتاحة؟</h4>
                <p className="text-sm text-muted-foreground">
                  نقبل التبرعات عبر التحويل البنكي، الدفع النقدي، الشيكات، والدفع الإلكتروني.
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">كيف يمكنني تتبع تبرعي؟</h4>
                <p className="text-sm text-muted-foreground">
                  يمكنك تتبع تبرعك باستخدام الرقم المرجعي الذي ستحصل عليه عند التبرع.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                تبرع الآن
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                تبرعك يساعدنا في تحقيق أهدافنا التنموية وخدمة المجتمع المحلي.
              </p>
              <div className="space-y-2">
                <h4 className="font-medium">طرق التبرع:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• التحويل البنكي المباشر</li>
                  <li>• التبرع النقدي في مقر الجمعية</li>
                  <li>• الشيكات المصرفية</li>
                  <li>• الدفع الإلكتروني الآمن</li>
                </ul>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800">معلومات الحساب البنكي</h4>
                <p className="text-sm text-green-700 font-mono">
                  IBAN: MA64 123 12345678901234567890<br />
                  البنك: Banque Populaire
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
