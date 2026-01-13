import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Bell, 
  BellOff, 
  TrendingUp, 
  Users, 
  Calendar, 
  Heart, 
  MessageSquare,
  Settings,
  Star,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationStats as NotificationStatsType } from '@/types/notification';

const NotificationStats: React.FC = () => {
  const { stats, loadStats, loading, error } = useNotifications();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadStats();
    setIsRefreshing(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'activity': return <Users className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'donation': return <Heart className="w-4 h-4" />;
      case 'contact': return <MessageSquare className="w-4 h-4" />;
      case 'member': return <Users className="w-4 h-4" />;
      case 'system': return <Settings className="w-4 h-4" />;
      case 'announcement': return <Star className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'activity': return 'الأنشطة';
      case 'event': return 'الفعاليات';
      case 'donation': return 'التبرعات';
      case 'contact': return 'جهات الاتصال';
      case 'member': return 'الأعضاء';
      case 'system': return 'النظام';
      case 'announcement': return 'الإعلانات';
      default: return category;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'info': return 'معلومات';
      case 'success': return 'نجاح';
      case 'warning': return 'تحذير';
      case 'error': return 'خطأ';
      case 'system': return 'نظام';
      default: return type;
    }
  };

  const getPriorityName = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'عاجل';
      case 'high': return 'مهم';
      case 'normal': return 'عادي';
      case 'low': return 'منخفض';
      default: return priority;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>جاري تحميل الإحصائيات...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center text-red-500">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <BellOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد إحصائيات متاحة</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalNotifications = stats.total;
  const unreadPercentage = totalNotifications > 0 ? (stats.unread / totalNotifications) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">إحصائيات الإشعارات</h2>
          <p className="text-muted-foreground">نظرة شاملة على نظام الإشعارات</p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 ml-2" />
          )}
          تحديث
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الإشعارات</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">غير مقروء</p>
                <p className="text-2xl font-bold text-orange-500">{stats.unread}</p>
              </div>
              <BellOff className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">مقروء</p>
                <p className="text-2xl font-bold text-green-500">{stats.total - stats.unread}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">معدل القراءة</p>
                <p className="text-2xl font-bold text-blue-500">{Math.round(100 - unreadPercentage)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>معدل القراءة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>مقروء</span>
              <span>{Math.round(100 - unreadPercentage)}%</span>
            </div>
            <Progress value={100 - unreadPercentage} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{stats.total - stats.unread} من {stats.total}</span>
              <span>غير مقروء: {stats.unread}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>الإشعارات حسب الفئة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span className="text-sm font-medium">{getCategoryName(category)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{count}</Badge>
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${totalNotifications > 0 ? (count / totalNotifications) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الإشعارات حسب النوع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      type === 'success' ? 'bg-green-500' :
                      type === 'warning' ? 'bg-yellow-500' :
                      type === 'error' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`} />
                    <span className="text-sm font-medium">{getTypeName(type)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{count}</Badge>
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          type === 'success' ? 'bg-green-500' :
                          type === 'warning' ? 'bg-yellow-500' :
                          type === 'error' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${totalNotifications > 0 ? (count / totalNotifications) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priorities */}
      <Card>
        <CardHeader>
          <CardTitle>الإشعارات حسب الأولوية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.byPriority).map(([priority, count]) => (
              <div key={priority} className="text-center">
                <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  priority === 'urgent' ? 'bg-red-100 text-red-600' :
                  priority === 'high' ? 'bg-orange-100 text-orange-600' :
                  priority === 'normal' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  <Bell className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">{getPriorityName(priority)}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>النشاط الأخير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">آخر 24 ساعة</p>
              <p className="text-2xl font-bold text-blue-500">{stats.recentActivity.last24h}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">آخر 7 أيام</p>
              <p className="text-2xl font-bold text-green-500">{stats.recentActivity.last7d}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">آخر 30 يوم</p>
              <p className="text-2xl font-bold text-purple-500">{stats.recentActivity.last30d}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationStats;
