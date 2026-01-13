import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  BookOpen, 
  Palette, 
  Trophy, 
  TrendingUp, 
  Building, 
  Users 
} from "lucide-react";

const activities = [
  {
    icon: Heart,
    title: "الأنشطة الاجتماعية",
    description: "تقديم المساعدات الغذائية والملابس، تنظيم قوافل طبية، ودعم الفئات الهشة",
    color: "from-red-500 to-pink-500"
  },
  {
    icon: BookOpen,
    title: "التربية والتعليم",
    description: "دروس الدعم والتقوية، محاربة الأمية، وتشجيع التمدرس",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Palette,
    title: "الثقافة والتراث",
    description: "تنظيم أنشطة ثقافية وفنية والحفاظ على التراث الأمازيغي",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Trophy,
    title: "الرياضة والشباب",
    description: "تنظيم دوريات رياضية ودعم المبادرات الشبابية",
    color: "from-orange-500 to-yellow-500"
  },
  {
    icon: TrendingUp,
    title: "التنمية الاقتصادية",
    description: "تشجيع المشاريع الصغيرة والتكوين المهني",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Building,
    title: "البنية التحتية",
    description: "المساهمة في مشاريع الماء والطرق والإنارة",
    color: "from-gray-600 to-gray-800"
  },
  {
    icon: Users,
    title: "التحسيس والمواطنة",
    description: "حملات توعوية حول البيئة والصحة وقيم المواطنة",
    color: "from-teal-500 to-cyan-500"
  }
];

const Activities = () => {
  return (
    <section id="activities" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            أنشطتنا
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نعمل في مجالات متعددة لخدمة مجتمعنا وتحقيق التنمية الشاملة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 border-none bg-card/80 backdrop-blur-sm hover:-translate-y-2"
            >
              <CardContent className="p-6 space-y-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activity.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <activity.icon className="text-white dark:text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  {activity.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {activity.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;
