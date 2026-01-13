import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search, 
  Filter,
  Eye,
  User,
  CheckCircle,
  Clock as ClockIcon,
  AlertCircle,
  Star,
  TrendingUp,
  Heart,
  Sparkles,
  ArrowRight,
  Grid3X3,
  List,
  SortAsc
} from "lucide-react";
import ActivityParticipation from "@/components/ActivityParticipation";
import PrivacyMask from "@/components/PrivacyMask";
import { Link } from "react-router-dom";

const ActivitiesList = () => {
  const { activities } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'participants'>('date');

  const categories = [
    "الأنشطة الاجتماعية",
    "التربية والتعليم", 
    "الثقافة والتراث",
    "الرياضة والشباب",
    "التنمية الاقتصادية",
    "البنية التحتية",
    "التحسيس والمواطنة"
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge variant="secondary" className="flex items-center gap-1"><ClockIcon className="w-3 h-3" />مخطط</Badge>;
      case 'ongoing':
        return <Badge variant="default" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />جاري</Badge>;
      case 'completed':
        return <Badge variant="outline" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" />مكتمل</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="w-3 h-3" />ملغي</Badge>;
      default:
        return <Badge variant="secondary">غير محدد</Badge>;
    }
  };

  const handleParticipation = (activityId: string, data: any) => {
    console.log('Participation data:', { activityId, data });
    // Ici vous pouvez ajouter la logique pour sauvegarder la participation
    // Par exemple, envoyer à une API ou sauvegarder dans le contexte
  };

  const filteredActivities = activities
    .filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || activity.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || activity.status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'participants':
          return (b.participants || 0) - (a.participants || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="bg-background">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-emerald-900/20 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">أنشطة متنوعة ومفيدة</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent animate-fade-in">
              الأنشطة
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in">
              اكتشف جميع أنشطتنا وبرامجنا التنموية المتنوعة التي تساهم في بناء مجتمع أفضل
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground animate-fade-in">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{activities.length} نشاط</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>مواعيد مرنة</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>مشاركة مجتمعية</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Filters */}
        <div className="mb-12">
          <Card className="p-6 shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <div className="space-y-6">
              {/* Search and View Controls */}
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="البحث في الأنشطة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 h-12 text-lg"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="flex items-center gap-2"
                  >
                    <Grid3X3 className="w-4 h-4" />
                    شبكة
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="flex items-center gap-2"
                  >
                    <List className="w-4 h-4" />
                    قائمة
                  </Button>
                </div>
              </div>

              {/* Filters Row */}
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48 h-12">
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الفئات</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48 h-12">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع الحالات</SelectItem>
                    <SelectItem value="planned">مخطط</SelectItem>
                    <SelectItem value="ongoing">جاري</SelectItem>
                    <SelectItem value="completed">مكتمل</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: 'date' | 'title' | 'participants') => setSortBy(value)}>
                  <SelectTrigger className="w-full md:w-48 h-12">
                    <SelectValue placeholder="ترتيب حسب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">التاريخ</SelectItem>
                    <SelectItem value="title">العنوان</SelectItem>
                    <SelectItem value="participants">المشاركين</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters Display */}
              {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all') && (
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      البحث: {searchTerm}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                    </Badge>
                  )}
                  {categoryFilter !== 'all' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      الفئة: {categoryFilter}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setCategoryFilter('all')} />
                    </Badge>
                  )}
                  {statusFilter !== 'all' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      الحالة: {statusFilter}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setStatusFilter('all')} />
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Activities Display */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              الأنشطة المتاحة
              <Badge variant="secondary" className="text-sm">
                {filteredActivities.length}
              </Badge>
            </h2>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((activity, index) => {
                const activityData = {
                  id: activity.id,
                  title: activity.title,
                  description: activity.description,
                  date: activity.date,
                  time: activity.time || "09:00",
                  location: activity.location,
                  maxParticipants: activity.maxParticipants || 50,
                  currentParticipants: activity.participants || 0,
                  status: activity.status === 'planned' ? 'upcoming' : 
                         activity.status === 'ongoing' ? 'ongoing' :
                         activity.status === 'completed' ? 'completed' : 'cancelled',
                  requirements: activity.requirements ? [activity.requirements] : [],
                  contactInfo: {
                    name: activity.organizer || "جمعية إمليل",
                    phone: "+212 6XX XXX XXX",
                    email: "contact@imlil-association.ma"
                  }
                };

                return (
                  <div 
                    key={activity.id} 
                    className="group hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ActivityParticipation
                      activity={activityData}
                      onParticipate={(data) => handleParticipation(activity.id, data)}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredActivities.map((activity, index) => {
                const activityData = {
                  id: activity.id,
                  title: activity.title,
                  description: activity.description,
                  date: activity.date,
                  time: activity.time || "09:00",
                  location: activity.location,
                  maxParticipants: activity.maxParticipants || 50,
                  currentParticipants: activity.participants || 0,
                  status: activity.status === 'planned' ? 'upcoming' : 
                         activity.status === 'ongoing' ? 'ongoing' :
                         activity.status === 'completed' ? 'completed' : 'cancelled',
                  requirements: activity.requirements ? [activity.requirements] : [],
                  contactInfo: {
                    name: activity.organizer || "جمعية إمليل",
                    phone: "+212 6XX XXX XXX",
                    email: "contact@imlil-association.ma"
                  }
                };

                return (
                  <div 
                    key={activity.id} 
                    className="group hover:shadow-lg transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ActivityParticipation
                      activity={activityData}
                      onParticipate={(data) => handleParticipation(activity.id, data)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* No Results */}
        {filteredActivities.length === 0 && (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-muted/50 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {activities.length === 0 
                  ? "لا توجد أنشطة مسجلة حالياً" 
                  : "لم يتم العثور على أنشطة"
                }
              </h3>
              <p className="text-muted-foreground mb-6">
                {activities.length === 0 
                  ? "سيتم إضافة أنشطة جديدة قريباً" 
                  : "جرب تغيير معايير البحث أو إزالة بعض الفلاتر"
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/">
                  <Button className="w-full sm:w-auto">
                    <ArrowRight className="w-4 h-4 ml-2" />
                    العودة إلى الرئيسية
                  </Button>
                </Link>
                {activities.length > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('all');
                      setStatusFilter('all');
                    }}
                    className="w-full sm:w-auto"
                  >
                    <X className="w-4 h-4 ml-2" />
                    إزالة جميع الفلاتر
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Statistics Section */}
        {filteredActivities.length > 0 && (
          <div className="mt-12">
            <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <h3 className="text-lg font-semibold mb-4 text-center">إحصائيات الأنشطة</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {activities.filter(a => a.status === 'planned').length}
                  </div>
                  <div className="text-sm text-muted-foreground">مخطط</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {activities.filter(a => a.status === 'ongoing').length}
                  </div>
                  <div className="text-sm text-muted-foreground">جاري</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">
                    {activities.filter(a => a.status === 'completed').length}
                  </div>
                  <div className="text-sm text-muted-foreground">مكتمل</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {activities.reduce((sum, a) => sum + (a.participants || 0), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">مشارك</div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesList;