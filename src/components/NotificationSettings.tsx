import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Bell, 
  BellOff, 
  CheckCircle, 
  XCircle, 
  Settings,
  Smartphone,
  Mail,
  MessageSquare,
  Clock,
  Save,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useNotificationSettings } from '@/hooks/useNotifications';
import { useToast } from '@/hooks/use-toast';

const NotificationSettings: React.FC = () => {
  const { 
    settings, 
    loading, 
    error,
    toggleCategory,
    togglePriority,
    toggleNotificationType,
    updateQuietHours,
    updateSettings
  } = useNotificationSettings();
  
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      await updateSettings(settings);
      toast({
        title: "تم حفظ الإعدادات",
        description: "تم تحديث إعدادات الإشعارات بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "فشل في حفظ إعدادات الإشعارات",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuietHoursChange = async (field: string, value: any) => {
    if (!settings) return;
    
    const newQuietHours = {
      ...settings.quietHours,
      [field]: value
    };
    
    await updateQuietHours(newQuietHours);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>جاري تحميل الإعدادات...</span>
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

  if (!settings) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <BellOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>لا توجد إعدادات متاحة</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            إعدادات الإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Types de notifications */}
          <div>
            <h3 className="text-lg font-semibold mb-4">أنواع الإشعارات</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <div>
                    <Label htmlFor="email-notifications">الإشعارات عبر البريد الإلكتروني</Label>
                    <p className="text-sm text-muted-foreground">تلقي إشعارات عبر البريد الإلكتروني</p>
                  </div>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={() => toggleNotificationType('emailNotifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-green-500" />
                  <div>
                    <Label htmlFor="push-notifications">الإشعارات الفورية</Label>
                    <p className="text-sm text-muted-foreground">تلقي إشعارات فورية في المتصفح</p>
                  </div>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={() => toggleNotificationType('pushNotifications')}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-purple-500" />
                  <div>
                    <Label htmlFor="sms-notifications">الإشعارات عبر الرسائل النصية</Label>
                    <p className="text-sm text-muted-foreground">تلقي إشعارات عبر الرسائل النصية</p>
                  </div>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={() => toggleNotificationType('smsNotifications')}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* فئات الإشعارات */}
          <div>
            <h3 className="text-lg font-semibold mb-4">فئات الإشعارات</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(settings.categories).map(([category, enabled]) => (
                <div key={category} className="flex items-center justify-between">
                  <Label htmlFor={`category-${category}`}>
                    {category === 'activity' && 'الأنشطة'}
                    {category === 'event' && 'الفعاليات'}
                    {category === 'donation' && 'التبرعات'}
                    {category === 'contact' && 'جهات الاتصال'}
                    {category === 'member' && 'الأعضاء'}
                    {category === 'system' && 'النظام'}
                    {category === 'announcement' && 'الإعلانات'}
                  </Label>
                  <Switch
                    id={`category-${category}`}
                    checked={enabled}
                    onCheckedChange={() => toggleCategory(category as keyof typeof settings.categories)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* أولويات الإشعارات */}
          <div>
            <h3 className="text-lg font-semibold mb-4">أولويات الإشعارات</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(settings.priority).map(([priority, enabled]) => (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`priority-${priority}`}>
                      {priority === 'urgent' && 'عاجل'}
                      {priority === 'high' && 'مهم'}
                      {priority === 'normal' && 'عادي'}
                      {priority === 'low' && 'منخفض'}
                    </Label>
                    {priority === 'urgent' && <Badge variant="destructive" className="text-xs">عاجل</Badge>}
                    {priority === 'high' && <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">مهم</Badge>}
                  </div>
                  <Switch
                    id={`priority-${priority}`}
                    checked={enabled}
                    onCheckedChange={() => togglePriority(priority as keyof typeof settings.priority)}
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* ساعات الهدوء */}
          <div>
            <h3 className="text-lg font-semibold mb-4">ساعات الهدوء</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <div>
                    <Label htmlFor="quiet-hours-enabled">تفعيل ساعات الهدوء</Label>
                    <p className="text-sm text-muted-foreground">عدم إرسال إشعارات خلال ساعات معينة</p>
                  </div>
                </div>
                <Switch
                  id="quiet-hours-enabled"
                  checked={settings.quietHours.enabled}
                  onCheckedChange={(checked) => handleQuietHoursChange('enabled', checked)}
                />
              </div>

              {settings.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quiet-start">وقت البداية</Label>
                    <Input
                      id="quiet-start"
                      type="time"
                      value={settings.quietHours.start}
                      onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quiet-end">وقت النهاية</Label>
                    <Input
                      id="quiet-end"
                      type="time"
                      value={settings.quietHours.end}
                      onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* أزرار الإجراءات */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4 ml-2" />
              إعادة تحميل
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 ml-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 ml-2" />
              )}
              حفظ الإعدادات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;