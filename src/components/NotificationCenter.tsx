import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Calendar, 
  Users, 
  Heart, 
  Image, 
  MessageSquare,
  Settings,
  Trash2,
  CheckCheck,
  Filter,
  Search,
  Loader2,
  RefreshCw,
  Clock,
  Star
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification } from '@/types/notification';

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'activity' | 'event' | 'donation' | 'contact' | 'member' | 'system' | 'announcement'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { 
    notifications, 
    stats, 
    loading, 
    error,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications
  } = useNotifications();
  
  const { toast } = useToast();

  // Charger les notifications au montage
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const getNotificationIcon = (type: string, category: string) => {
    if (category === 'activity') return <Users className="w-4 h-4" />;
    if (category === 'event') return <Calendar className="w-4 h-4" />;
    if (category === 'donation') return <Heart className="w-4 h-4" />;
    if (category === 'contact') return <MessageSquare className="w-4 h-4" />;
    if (category === 'member') return <Users className="w-4 h-4" />;
    if (category === 'system') return <Settings className="w-4 h-4" />;
    if (category === 'announcement') return <Star className="w-4 h-4" />;
    
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'urgent') return 'text-red-600 bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    if (priority === 'high') return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
    
    switch (type) {
      case 'success': return 'text-green-600 bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'error': return 'text-red-600 bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Badge variant="destructive" className="text-xs">عاجل</Badge>;
      case 'high': return <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">مهم</Badge>;
      case 'normal': return <Badge variant="outline" className="text-xs">عادي</Badge>;
      case 'low': return <Badge variant="outline" className="text-xs text-muted-foreground">منخفض</Badge>;
      default: return null;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `منذ ${diffInDays} يوم`;
    
    return date.toLocaleDateString('ar-MA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.category === filter;
  });

  const unreadCount = stats?.unread || 0;

  const handleMarkAsRead = async (notificationId: string) => {
    const success = await markAsRead(notificationId);
    if (success) {
      toast({
        title: "تم تمييز الإشعار كمقروء",
        description: "تم تحديث حالة الإشعار بنجاح",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    const count = await markAllAsRead();
    if (count > 0) {
      toast({
        title: "تم تمييز جميع الإشعارات كمقروءة",
        description: `تم تحديث ${count} إشعار`,
      });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    const success = await deleteNotification(notificationId);
    if (success) {
      toast({
        title: "تم حذف الإشعار",
        description: "تم حذف الإشعار بنجاح",
      });
    }
  };

  const handleDeleteAll = async () => {
    const count = await deleteAllNotifications();
    if (count > 0) {
      toast({
        title: "تم مسح جميع الإشعارات",
        description: `تم حذف ${count} إشعار`,
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadNotifications();
    setIsRefreshing(false);
    toast({
      title: "تم تحديث الإشعارات",
      description: "تم تحميل أحدث الإشعارات",
    });
  };

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            variant="destructive"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsOpen(false)}>
      <Card 
        className="absolute right-4 top-16 w-96 max-h-[80vh] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              مركز الإشعارات
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteAll}
                disabled={notifications.length === 0}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="unread">غير مقروء</TabsTrigger>
              <TabsTrigger value="activity">أنشطة</TabsTrigger>
              <TabsTrigger value="event">فعاليات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <ScrollArea className="h-96">
                <div className="space-y-2 p-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                      <p className="text-muted-foreground">جاري تحميل الإشعارات...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-red-500">
                      <AlertCircle className="w-8 h-8 mx-auto mb-4" />
                      <p>{error}</p>
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد إشعارات</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg border transition-colors hover:bg-muted/50 ${
                          !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : ''
                        } ${getNotificationColor(notification.type, notification.priority)}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full ${getNotificationColor(notification.type, notification.priority)}`}>
                            {getNotificationIcon(notification.type, notification.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              <div className="flex items-center gap-2">
                                {getPriorityBadge(notification.priority)}
                                <span className="text-xs text-muted-foreground">
                                  {getTimeAgo(notification.createdAt)}
                                </span>
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            {notification.actionText && notification.actionUrl && (
                              <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto text-xs"
                                onClick={() => {
                                  handleMarkAsRead(notification.id);
                                  window.location.href = notification.actionUrl!;
                                }}
                              >
                                {notification.actionText}
                              </Button>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="unread" className="mt-4">
              <ScrollArea className="h-96">
                <div className="space-y-2 p-4">
                  {notifications.filter(n => !n.isRead).length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد إشعارات غير مقروءة</p>
                    </div>
                  ) : (
                    notifications
                      .filter(n => !n.isRead)
                      .map((notification) => (
                        <div
                          key={notification.id}
                          className="p-3 rounded-lg border bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${getNotificationColor(notification.type, notification.priority)}`}>
                              {getNotificationIcon(notification.type, notification.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">{notification.title}</h4>
                                <div className="flex items-center gap-2">
                                  {getPriorityBadge(notification.priority)}
                                  <span className="text-xs text-muted-foreground">
                                    {getTimeAgo(notification.createdAt)}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              {notification.actionText && notification.actionUrl && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="p-0 h-auto text-xs mt-2"
                                  onClick={() => {
                                    handleMarkAsRead(notification.id);
                                    window.location.href = notification.actionUrl!;
                                  }}
                                >
                                  {notification.actionText}
                                </Button>
                              )}
                            </div>
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="h-6 w-6 p-0"
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-4">
              <ScrollArea className="h-96">
                <div className="space-y-2 p-4">
                  {notifications.filter(n => n.category === 'activity').length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد إشعارات أنشطة</p>
                    </div>
                  ) : (
                    notifications
                      .filter(n => n.category === 'activity')
                      .map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border transition-colors hover:bg-muted/50 ${
                            !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${getNotificationColor(notification.type, notification.priority)}`}>
                              {getNotificationIcon(notification.type, notification.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">{notification.title}</h4>
                                <span className="text-xs text-muted-foreground">
                                  {getTimeAgo(notification.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="event" className="mt-4">
              <ScrollArea className="h-96">
                <div className="space-y-2 p-4">
                  {notifications.filter(n => n.category === 'event').length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد إشعارات فعاليات</p>
                    </div>
                  ) : (
                    notifications
                      .filter(n => n.category === 'event')
                      .map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border transition-colors hover:bg-muted/50 ${
                            !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${getNotificationColor(notification.type, notification.priority)}`}>
                              {getNotificationIcon(notification.type, notification.category)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">{notification.title}</h4>
                                <span className="text-xs text-muted-foreground">
                                  {getTimeAgo(notification.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;