import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Calendar, 
  Image, 
  Newspaper, 
  Heart,
  Activity,
  MapPin,
  Clock,
  Target,
  Award,
  Download,
  RefreshCw,
  Filter,
  Eye,
  Star,
  MessageSquare,
  Phone,
  Mail,
  Building2,
  UserCheck,
  UserX,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const Statistics: React.FC = () => {
  const { user } = useAuth();
  const { members, activities, events, news, gallery, contacts, donations } = useApp();
  const [timeRange, setTimeRange] = useState('all');
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalActivities: 0,
    totalEvents: 0,
    totalNews: 0,
    totalGalleryImages: 0,
    totalContacts: 0,
    totalDonations: 0,
    averageDonation: 0,
    completionRate: 0,
    engagementRate: 0
  });

  useEffect(() => {
    calculateStats();
  }, [timeRange, members, activities, events, news, gallery, contacts, donations]);

  const calculateStats = () => {
    // Vérifier que toutes les données sont chargées
    if (!members || !activities || !events || !news || !gallery || !contacts || !donations) {
      return;
    }

    const now = new Date();
    let filteredData = {
      members: members,
      activities: activities,
      events: events,
      news: news,
      gallery: gallery,
      contacts: contacts,
      donations: donations
    };

    // Filtrer par période
    if (timeRange !== 'all') {
      const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : timeRange === 'year' ? 365 : 0;
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      
      filteredData = {
        members: members.filter(member => new Date(member.createdAt) >= cutoffDate),
        activities: activities.filter(activity => new Date(activity.startDate) >= cutoffDate),
        events: events.filter(event => new Date(event.date) >= cutoffDate),
        news: news.filter(article => new Date(article.publishedAt) >= cutoffDate),
        gallery: gallery.filter(image => new Date(image.date) >= cutoffDate),
        contacts: contacts.filter(contact => new Date(contact.createdAt) >= cutoffDate),
        donations: donations.filter(donation => new Date(donation.createdAt) >= cutoffDate)
      };
    }

    const totalDonations = filteredData.donations?.reduce((sum, donation) => sum + (donation.amount || 0), 0) || 0;
    const averageDonation = filteredData.donations.length > 0 ? totalDonations / filteredData.donations.length : 0;
    
    const completedActivities = filteredData.activities.filter(activity => activity.status === 'completed').length;
    const completionRate = filteredData.activities.length > 0 ? (completedActivities / filteredData.activities.length) * 100 : 0;
    
    const totalInteractions = filteredData.contacts.length + filteredData.donations.length;
    const engagementRate = filteredData.members.length > 0 ? (totalInteractions / filteredData.members.length) * 100 : 0;

    setStats({
      totalMembers: filteredData.members.length,
      totalActivities: filteredData.activities.length,
      totalEvents: filteredData.events.length,
      totalNews: filteredData.news.length,
      totalGalleryImages: filteredData.gallery.length,
      totalContacts: filteredData.contacts.length,
      totalDonations: totalDonations,
      averageDonation: averageDonation,
      completionRate: completionRate,
      engagementRate: engagementRate
    });
  };

  const getTimeRangeLabel = () => {
    const labels = {
      'all': 'جميع الأوقات',
      'week': 'آخر أسبوع',
      'month': 'آخر شهر',
      'year': 'آخر سنة'
    };
    return labels[timeRange as keyof typeof labels] || 'جميع الأوقات';
  };

  const getActivityStatusStats = () => {
    if (!activities || activities.length === 0) {
      return [
        { label: 'قادمة', count: 0, color: 'bg-blue-500' },
        { label: 'جارية', count: 0, color: 'bg-yellow-500' },
        { label: 'مكتملة', count: 0, color: 'bg-green-500' },
        { label: 'ملغية', count: 0, color: 'bg-red-500' }
      ];
    }

    const statusCounts = activities.reduce((acc, activity) => {
      acc[activity.status] = (acc[activity.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { label: 'قادمة', count: statusCounts.upcoming || 0, color: 'bg-blue-500' },
      { label: 'جارية', count: statusCounts.ongoing || 0, color: 'bg-yellow-500' },
      { label: 'مكتملة', count: statusCounts.completed || 0, color: 'bg-green-500' },
      { label: 'ملغية', count: statusCounts.cancelled || 0, color: 'bg-red-500' }
    ];
  };

  const getEventStatusStats = () => {
    if (!events || events.length === 0) {
      return [
        { label: 'قادمة', count: 0, color: 'bg-blue-500' },
        { label: 'جارية', count: 0, color: 'bg-yellow-500' },
        { label: 'مكتملة', count: 0, color: 'bg-green-500' }
      ];
    }

    const statusCounts = events.reduce((acc, event) => {
      acc[event.status] = (acc[event.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { label: 'قادمة', count: statusCounts.upcoming || 0, color: 'bg-blue-500' },
      { label: 'جارية', count: statusCounts.ongoing || 0, color: 'bg-yellow-500' },
      { label: 'مكتملة', count: statusCounts.completed || 0, color: 'bg-green-500' }
    ];
  };

  const getDonationStats = () => {
    if (!donations || donations.length === 0) {
      return [
        { label: 'معلقة', count: 0, color: 'bg-yellow-500' },
        { label: 'مؤكدة', count: 0, color: 'bg-blue-500' },
        { label: 'معالجة', count: 0, color: 'bg-green-500' },
        { label: 'فاشلة', count: 0, color: 'bg-red-500' }
      ];
    }

    const statusCounts = donations.reduce((acc, donation) => {
      acc[donation.status] = (acc[donation.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { label: 'معلقة', count: statusCounts.PENDING || 0, color: 'bg-yellow-500' },
      { label: 'مؤكدة', count: statusCounts.CONFIRMED || 0, color: 'bg-blue-500' },
      { label: 'معالجة', count: statusCounts.PROCESSED || 0, color: 'bg-green-500' },
      { label: 'فاشلة', count: statusCounts.FAILED || 0, color: 'bg-red-500' }
    ];
  };

  const getContactStats = () => {
    if (!contacts || contacts.length === 0) {
      return [
        { label: 'معلقة', count: 0, color: 'bg-yellow-500' },
        { label: 'مرد عليها', count: 0, color: 'bg-green-500' },
        { label: 'مغلقة', count: 0, color: 'bg-gray-500' }
      ];
    }

    const statusCounts = contacts.reduce((acc, contact) => {
      acc[contact.status] = (acc[contact.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { label: 'معلقة', count: statusCounts.PENDING || 0, color: 'bg-yellow-500' },
      { label: 'مرد عليها', count: statusCounts.RESPONDED || 0, color: 'bg-green-500' },
      { label: 'مغلقة', count: statusCounts.CLOSED || 0, color: 'bg-gray-500' }
    ];
  };

  const getTopCategories = () => {
    if (!activities || activities.length === 0) {
      return [];
    }

    const categoryCounts = activities.reduce((acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
  };

  const getMonthlyStats = () => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toLocaleDateString('ar-MA', { month: 'short', year: 'numeric' });
    }).reverse();

    return months.map(month => ({
      month,
      activities: Math.floor(Math.random() * 10) + 1,
      events: Math.floor(Math.random() * 5) + 1,
      donations: Math.floor(Math.random() * 1000) + 500
    }));
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">الإحصائيات والتقارير</h1>
              <p className="text-muted-foreground">
                تحليل شامل لأداء الجمعية وأنشطتها
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="اختر الفترة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأوقات</SelectItem>
                  <SelectItem value="week">آخر أسبوع</SelectItem>
                  <SelectItem value="month">آخر شهر</SelectItem>
                  <SelectItem value="year">آخر سنة</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={calculateStats} variant="outline">
                <RefreshCw className="w-4 h-4 ml-2" />
                تحديث
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي الأعضاء</p>
                  <p className="text-2xl font-bold">{stats.totalMembers}</p>
                  <p className="text-xs text-muted-foreground">{getTimeRangeLabel()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الأنشطة</p>
                  <p className="text-2xl font-bold">{stats.totalActivities}</p>
                  <p className="text-xs text-muted-foreground">{getTimeRangeLabel()}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">الفعاليات</p>
                  <p className="text-2xl font-bold">{stats.totalEvents}</p>
                  <p className="text-xs text-muted-foreground">{getTimeRangeLabel()}</p>
                </div>
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">إجمالي التبرعات</p>
                  <p className="text-2xl font-bold">{stats.totalDonations.toLocaleString()} درهم</p>
                  <p className="text-xs text-muted-foreground">{getTimeRangeLabel()}</p>
                </div>
                <Heart className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="activities">الأنشطة</TabsTrigger>
            <TabsTrigger value="events">الفعاليات</TabsTrigger>
            <TabsTrigger value="donations">التبرعات</TabsTrigger>
            <TabsTrigger value="contacts">الاتصالات</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    مؤشرات الأداء
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">معدل إكمال الأنشطة</span>
                      <span className="text-sm text-muted-foreground">{stats.completionRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={stats.completionRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">معدل التفاعل</span>
                      <span className="text-sm text-muted-foreground">{stats.engagementRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={stats.engagementRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">متوسط التبرع</span>
                      <span className="text-sm text-muted-foreground">{stats.averageDonation.toFixed(0)} درهم</span>
                    </div>
                    <Progress value={(stats.averageDonation / 1000) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Top Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    أكثر الفئات نشاطاً
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getTopCategories().map(({ category, count }, index) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-blue-500' : 
                            index === 1 ? 'bg-green-500' : 
                            index === 2 ? 'bg-yellow-500' : 
                            index === 3 ? 'bg-purple-500' : 'bg-gray-500'
                          }`} />
                          <span className="text-sm font-medium">{category}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  الاتجاهات الشهرية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getMonthlyStats().slice(-6).map(({ month, activities, events, donations }) => (
                    <div key={month} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium w-20">{month}</span>
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{activities}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">{events}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-600" />
                          <span className="text-sm">{donations.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>حالة الأنشطة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getActivityStatusStats().map(({ label, count, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${color}`} />
                          <span className="text-sm font-medium">{label}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>إحصائيات الأنشطة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">إجمالي الأنشطة</span>
                      <span className="text-lg font-bold">{stats.totalActivities}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">معدل الإكمال</span>
                      <span className="text-lg font-bold">{stats.completionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">الأنشطة النشطة</span>
                      <span className="text-lg font-bold">
                        {activities?.filter(a => a.status === 'ongoing').length || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>حالة الفعاليات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getEventStatusStats().map(({ label, count, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${color}`} />
                          <span className="text-sm font-medium">{label}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>إحصائيات الفعاليات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">إجمالي الفعاليات</span>
                      <span className="text-lg font-bold">{stats.totalEvents}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">الفعاليات القادمة</span>
                      <span className="text-lg font-bold">
                        {events?.filter(e => e.status === 'upcoming').length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">الفعاليات المكتملة</span>
                      <span className="text-lg font-bold">
                        {events?.filter(e => e.status === 'completed').length || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Donations Tab */}
          <TabsContent value="donations" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>حالة التبرعات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getDonationStats().map(({ label, count, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${color}`} />
                          <span className="text-sm font-medium">{label}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>إحصائيات التبرعات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">إجمالي التبرعات</span>
                      <span className="text-lg font-bold">{stats.totalDonations.toLocaleString()} درهم</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">متوسط التبرع</span>
                      <span className="text-lg font-bold">{stats.averageDonation.toFixed(0)} درهم</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">عدد التبرعات</span>
                      <span className="text-lg font-bold">{donations?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>حالة الاتصالات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getContactStats().map(({ label, count, color }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${color}`} />
                          <span className="text-sm font-medium">{label}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>إحصائيات الاتصالات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">إجمالي الاتصالات</span>
                      <span className="text-lg font-bold">{stats.totalContacts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">معلقة</span>
                      <span className="text-lg font-bold">
                        {contacts?.filter(c => c.status === 'PENDING').length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">مرد عليها</span>
                      <span className="text-lg font-bold">
                        {contacts?.filter(c => c.status === 'RESPONDED').length || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Statistics;
