import React from 'react';
import Navbar from '@/components/Navbar';
import ImiderGallery from '@/components/ImiderGallery';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getImiderImagesStats } from '@/data/imiderImages';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Users, 
  Star,
  Mountain,
  Home,
  TreePine
} from 'lucide-react';

const ImiderGalleryPage: React.FC = () => {
  const stats = getImiderImagesStats();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Camera className="w-4 h-4" />
            معرض صور قرية  إميضر
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gradient">
            اكتشف جمال قرية  إميضر
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            مجموعة مميزة من الصور التي تظهر جمال قرية  إميضر وطبيعتها الخلابة، 
            من الجبال الشامخة إلى الحياة اليومية في القرية
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardContent className="p-4 text-center">
              <Camera className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">صورة</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold">{stats.featured}</div>
              <div className="text-sm text-muted-foreground">مميزة</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Mountain className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{Object.keys(stats.categories).length}</div>
              <div className="text-sm text-muted-foreground">فئة</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">2020-2024</div>
              <div className="text-sm text-muted-foreground">فترة التصوير</div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Overview */}
        <Card className="mb-12">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">فئات الصور</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mountain className="w-8 h-8 text-blue-600" />
                </div>
                <div className="font-semibold">المناظر الطبيعية</div>
                <div className="text-sm text-muted-foreground">{stats.categories.paysage || 0} صورة</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Home className="w-8 h-8 text-green-600" />
                </div>
                <div className="font-semibold">القرية</div>
                <div className="text-sm text-muted-foreground">{stats.categories.village || 0} صورة</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mountain className="w-8 h-8 text-gray-600" />
                </div>
                <div className="font-semibold">الجبال</div>
                <div className="text-sm text-muted-foreground">{stats.categories.montagne || 0} صورة</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TreePine className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="font-semibold">الطبيعة</div>
                <div className="text-sm text-muted-foreground">{stats.categories.nature || 0} صورة</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Home className="w-8 h-8 text-orange-600" />
                </div>
                <div className="font-semibold">العمارة</div>
                <div className="text-sm text-muted-foreground">{stats.categories.architecture || 0} صورة</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <div className="font-semibold">الحياة اليومية</div>
                <div className="text-sm text-muted-foreground">{stats.categories.vie_quotidienne || 0} صورة</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* About Imider */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">عن قرية  إميضر</h2>
                <p className="text-muted-foreground mb-4">
                   إميضر هي قرية أمازيغية تقع في منطقة جبلية خلابة في جنوب شرق المغرب، 
                  وتشتهر بجمالها الطبيعي وتراثها الثقافي الغني. القرية محاطة بالجبال الشامخة 
                  والوديان الخضراء، مما يجعلها وجهة مثالية لعشاق الطبيعة والثقافة.
                </p>
                <p className="text-muted-foreground mb-6">
                  هذه المجموعة من الصور تقدم لمحة عن الحياة اليومية في القرية، 
                  من المناظر الطبيعية الخلابة إلى العمارة التقليدية والحياة المجتمعية.
                </p>
                <div className="flex flex-wrap gap-2">
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
              </div>
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-semibold">معرض صور  إميضر</p>
                    <p className="text-sm opacity-80">{stats.total} صورة</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gallery Component */}
        <ImiderGallery />
      </div>
    </div>
  );
};

export default ImiderGalleryPage;
