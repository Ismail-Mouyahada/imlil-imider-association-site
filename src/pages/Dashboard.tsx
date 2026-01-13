import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import Navbar from '@/components/Navbar';
import RealtimeMetrics from '@/components/RealtimeMetrics';
import NotificationSettings from '@/components/NotificationSettings';
import { 
  Calendar, 
  Users, 
  Image, 
  Newspaper, 
  TrendingUp,
  Activity,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Target,
  Award,
  Heart,
  MessageSquare,
  Camera,
  MapPin,
  Phone,
  Mail,
  User,
  Settings,
  Bell,
  Download,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { members, activities, events, news, gallery, contacts, donations } = useApp();
  const [stats, setStats] = useState({
    totalMembers: 0,
    upcomingEvents: 0,
    recentActivities: 0,
    galleryImages: 0,
    recentNews: 0,
    totalDonations: 0,
    pendingContacts: 0
  });

  useEffect(() => {
    // Vérifier que les données sont chargées
    if (!events || !activities || !news || !donations || !contacts) {
      return;
    }

    const upcomingEvents = events.filter(event => 
      new Date(event.date) > new Date() && event.status === 'upcoming'
    ).length;

    const recentActivities = activities.filter(activity => 
      new Date(activity.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;

    const recentNews = news.filter(article => 
      new Date(article.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;

    const totalDonations = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
    const pendingContacts = contacts.filter(contact => contact.status === 'PENDING').length;

    setStats({
      totalMembers: members?.length || 0,
      upcomingEvents,
      recentActivities,
      galleryImages: gallery?.length || 0,
      recentNews,
      totalDonations,
      pendingContacts
    });
  }, [members, activities, events, news, gallery, contacts, donations]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'صباح الخير';
    if (hour < 18) return 'مساء الخير';
    return 'مساء الخير';
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      'SUPER_ADMIN': { color: 'bg-red-500', text: 'مدير عام' },
      'ADMIN': { color: 'bg-purple-500', text: 'مدير' },
      'MODERATOR': { color: 'bg-blue-500', text: 'مشرف' },
      'MEMBER': { color: 'bg-green-500', text: 'عضو' },
      'GUEST': { color: 'bg-gray-500', text: 'زائر' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig['GUEST'];
    return (
      <Badge className={`${config.color} text-white`}>
        {config.text}
      </Badge>
    );
  };

  const recentActivities = activities
    .filter(activity => new Date(activity.startDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    .slice(0, 5);

  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date() && event.status === 'upcoming')
    .slice(0, 5);

  const recentNews = news
    .filter(article => new Date(article.publishedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">
                {getGreeting()}، {user?.fullName || 'عضو عزيز'}
              </h1>
              <p className="text-muted-foreground">
                مرحباً بك في لوحة التحكم الخاصة بك
              </p>
            </div>
            <div className="flex items-center gap-4">
              {getRoleBadge(user?.role || 'GUEST')}
              <Button asChild>
                <Link to="/profile">
                  <User className="w-4 h-4 ml-2" />
                  الملف الشخصي
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي الأعضاء</p>
                  <p className="text-2xl font-bold">{stats.totalMembers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الفعاليات القادمة</p>
                  <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الأنشطة الأخيرة</p>
                  <p className="text-2xl font-bold">{stats.recentActivities}</p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي التبرعات</p>
                  <p className="text-2xl font-bold">{stats.totalDonations.toLocaleString()} درهم</p>
                </div>
                <Heart className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="metrics">المقاييس</TabsTrigger>
          <TabsTrigger value="activities">الأنشطة</TabsTrigger>
          <TabsTrigger value="events">الفعاليات</TabsTrigger>
          <TabsTrigger value="news">الأخبار</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
        </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    الأنشطة الأخيرة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Activity className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(activity.startDate).toLocaleDateString('ar-MA')}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {activity.status === 'upcoming' ? 'قادم' : 'مكتمل'}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        لا توجد أنشطة حديثة
                      </p>
                    )}
                  </div>
                  <Button asChild className="w-full mt-4">
                    <Link to="/activities">
                      عرض جميع الأنشطة
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    الفعاليات القادمة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event) => (
                        <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(event.date).toLocaleDateString('ar-MA')} - {event.time}
                            </p>
                          </div>
                          <Badge className="bg-green-500 text-white">
                            قادم
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        لا توجد فعاليات قادمة
                      </p>
                    )}
                  </div>
                  <Button asChild className="w-full mt-4">
                    <Link to="/events">
                      عرض جميع الفعاليات
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  الإجراءات السريعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button asChild variant="outline" className="h-20 flex-col gap-2">
                    <Link to="/activities">
                      <Activity className="w-6 h-6" />
                      الأنشطة
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col gap-2">
                    <Link to="/events">
                      <Calendar className="w-6 h-6" />
                      الفعاليات
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col gap-2">
                    <Link to="/gallery">
                      <Image className="w-6 h-6" />
                      المعرض
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-20 flex-col gap-2">
                    <Link to="/contact">
                      <MessageSquare className="w-6 h-6" />
                      اتصل بنا
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <RealtimeMetrics />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities && activities.length > 0 ? activities.slice(0, 6).map((activity) => (
                <Card key={activity.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Activity className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{activity.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.startDate).toLocaleDateString('ar-MA')}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant={activity.status === 'upcoming' ? 'default' : 'secondary'}>
                        {activity.status === 'upcoming' ? 'قادم' : 'مكتمل'}
                      </Badge>
                      <Button asChild size="sm">
                        <Link to={`/activities#${activity.id}`}>
                          عرض التفاصيل
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد أنشطة متاحة</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events && events.length > 0 ? events.slice(0, 6).map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('ar-MA')} - {event.time}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                        {event.status === 'upcoming' ? 'قادم' : 'مكتمل'}
                      </Badge>
                      <Button asChild size="sm">
                        <Link to={`/events#${event.id}`}>
                          عرض التفاصيل
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد فعاليات متاحة</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news && news.length > 0 ? news.slice(0, 6).map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <Newspaper className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(article.publishedAt).toLocaleDateString('ar-MA')}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {article.category}
                      </Badge>
                      <Button asChild size="sm">
                        <Link to={`/news#${article.id}`}>
                          قراءة المزيد
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد أخبار متاحة</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
