import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  MapPin, 
  Star, 
  ArrowLeft,
  Mountain,
  Home,
  TreePine,
  Users
} from 'lucide-react';
import { getImiderImageUrl, getFeaturedImiderImages } from '@/data/imiderImages';

const ImiderSection: React.FC = () => {
  const featuredImages = getFeaturedImiderImages().slice(0, 6);

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground">
            <Camera className="w-4 h-4 ml-1" />
            معرض صور  إميضر
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            اكتشف جمال قرية  إميضر
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            مجموعة مميزة من الصور التي تظهر جمال قرية  إميضر وطبيعتها الخلابة، 
            من الجبال الشامخة إلى الحياة اليومية في القرية
          </p>
        </div>

        {/* Featured Images Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {featuredImages.map((image, index) => (
            <Card key={image.id} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={getImiderImageUrl(image.filename)}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Badge className="absolute top-2 right-2 bg-yellow-500 text-white text-xs dark:bg-yellow-600 dark:text-yellow-100">
                  <Star className="w-3 h-3 ml-1" />
                  مميزة
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* About Imider */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">عن قرية  إميضر</h3>
            <p className="text-muted-foreground mb-6">
               إميضر هي قرية أمازيغية تقع في منطقة جبلية خلابة في جنوب شرق المغرب، 
              وتشتهر بجمالها الطبيعي وتراثها الثقافي الغني. القرية محاطة بالجبال الشامخة 
              والوديان الخضراء، مما يجعلها وجهة مثالية لعشاق الطبيعة والثقافة.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline" className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                إقليم تنغير، المغرب
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Mountain className="w-3 h-3" />
                منطقة جبلية
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                مجتمع أمازيغي
              </Badge>
            </div>
            <Button asChild size="lg">
              <Link to="/imider-gallery" className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                استكشف المعرض الكامل
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Card className="p-4 text-center">
                  <Mountain className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">89</div>
                  <div className="text-sm text-muted-foreground">صورة</div>
                </Card>
                <Card className="p-4 text-center">
                  <Home className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">6</div>
                  <div className="text-sm text-muted-foreground">فئات</div>
                </Card>
              </div>
              <div className="space-y-4 mt-8">
                <Card className="p-4 text-center">
                  <TreePine className="w-8 h-8 mx-auto mb-2 text-emerald-600 dark:text-emerald-400" />
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">2020</div>
                  <div className="text-sm text-muted-foreground">بداية التصوير</div>
                </Card>
                <Card className="p-4 text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600 dark:text-yellow-400" />
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">10</div>
                  <div className="text-sm text-muted-foreground">صور مميزة</div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white dark:from-green-600 dark:to-blue-600">
          <CardContent className="p-8 text-center">
            <Camera className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h3 className="text-2xl font-bold mb-2">شاركنا ذكرياتك من  إميضر</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              هل لديك صور جميلة من قرية  إميضر؟ شاركها معنا لنضيفها إلى معرضنا
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link to="/contact">
                  <Camera className="w-5 h-5 ml-2" />
                  شارك صورك
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-green-600 dark:border-white/80 dark:hover:bg-white/90">
                <Link to="/imider-gallery">
                  <ArrowLeft className="w-5 h-5 ml-2" />
                  استكشف المعرض
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ImiderSection;
