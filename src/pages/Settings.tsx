import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/hooks/useTheme';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database, 
  Download, 
  Upload, 
  Trash2, 
  Save, 
  Eye, 
  EyeOff,
  Moon,
  Sun,
  Monitor,
  Languages,
  Volume2,
  VolumeX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Key,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    // Profile Settings
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || '',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    activityUpdates: true,
    donationUpdates: true,
    newsUpdates: true,
    
    // Privacy Settings
    profileVisibility: 'public',
    showEmail: true,
    showPhone: false,
    showAddress: false,
    allowMessages: true,
    
    // Appearance Settings
    language: 'ar',
    fontSize: 'medium',
    colorScheme: 'auto',
    animations: true,
    reducedMotion: false,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginAlerts: true,
    passwordExpiry: 90,
    
    // Data Settings
    dataRetention: 365,
    autoBackup: true,
    backupFrequency: 'weekly',
    exportFormat: 'json'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Check for changes
    const hasUnsavedChanges = Object.keys(settings).some(key => {
      const currentValue = settings[key as keyof typeof settings];
      const originalValue = getOriginalValue(key);
      return currentValue !== originalValue;
    });
    setHasChanges(hasUnsavedChanges);
  }, [settings]);

  const getOriginalValue = (key: string) => {
    switch (key) {
      case 'fullName': return user?.fullName || '';
      case 'email': return user?.email || '';
      case 'phone': return user?.phone || '';
      case 'address': return user?.address || '';
      case 'bio': return user?.bio || '';
      default: return settings[key as keyof typeof settings];
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update user profile
      if (user) {
        await updateUser({
          ...user,
          fullName: settings.fullName,
          email: settings.email,
          phone: settings.phone,
          address: settings.address,
          bio: settings.bio
        });
      }
      
      // Save other settings to localStorage
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم تحديث إعداداتك بنجاح",
      });
      
      setHasChanges(false);
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSettings({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      bio: user?.bio || '',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      eventReminders: true,
      activityUpdates: true,
      donationUpdates: true,
      newsUpdates: true,
      profileVisibility: 'public',
      showEmail: true,
      showPhone: false,
      showAddress: false,
      allowMessages: true,
      language: 'ar',
      fontSize: 'medium',
      colorScheme: 'auto',
      animations: true,
      reducedMotion: false,
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginAlerts: true,
      passwordExpiry: 90,
      dataRetention: 365,
      autoBackup: true,
      backupFrequency: 'weekly',
      exportFormat: 'json'
    });
    
    toast({
      title: "تم إعادة التعيين",
      description: "تم إعادة الإعدادات إلى القيم الافتراضية",
    });
  };

  const handleExportData = () => {
    const data = {
      user: user,
      settings: settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `imlil-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "تم التصدير",
      description: "تم تصدير إعداداتك بنجاح",
    });
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.settings) {
          setSettings(data.settings);
          toast({
            title: "تم الاستيراد",
            description: "تم استيراد الإعدادات بنجاح",
          });
        }
      } catch (error) {
        toast({
          title: "خطأ في الاستيراد",
          description: "ملف غير صالح",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">الإعدادات</h1>
              <p className="text-muted-foreground">
                إدارة إعداداتك وتفضيلاتك الشخصية
              </p>
            </div>
            <div className="flex items-center gap-4">
              {hasChanges && (
                <Badge variant="outline" className="text-orange-600 border-orange-600">
                  <AlertTriangle className="w-3 h-3 ml-1" />
                  تغييرات غير محفوظة
                </Badge>
              )}
              <Button onClick={handleSave} disabled={!hasChanges || isLoading}>
                <Save className="w-4 h-4 ml-2" />
                {isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
            <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
            <TabsTrigger value="privacy">الخصوصية</TabsTrigger>
            <TabsTrigger value="appearance">المظهر</TabsTrigger>
            <TabsTrigger value="security">الأمان</TabsTrigger>
            <TabsTrigger value="data">البيانات</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  المعلومات الشخصية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">الاسم الكامل</Label>
                    <Input
                      id="fullName"
                      value={settings.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">العنوان</Label>
                    <Input
                      id="address"
                      value={settings.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">نبذة شخصية</Label>
                  <Textarea
                    id="bio"
                    value={settings.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                    placeholder="اكتب نبذة عن نفسك..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  إعدادات الإشعارات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات البريد الإلكتروني</Label>
                      <p className="text-sm text-muted-foreground">
                        تلقي إشعارات عبر البريد الإلكتروني
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>الإشعارات الفورية</Label>
                      <p className="text-sm text-muted-foreground">
                        تلقي إشعارات فورية في المتصفح
                      </p>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => handleInputChange('pushNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>إشعارات الرسائل النصية</Label>
                      <p className="text-sm text-muted-foreground">
                        تلقي إشعارات عبر الرسائل النصية
                      </p>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => handleInputChange('smsNotifications', checked)}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">أنواع الإشعارات</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تذكيرات الفعاليات</Label>
                        <p className="text-sm text-muted-foreground">
                          تذكير بالفعاليات القادمة
                        </p>
                      </div>
                      <Switch
                        checked={settings.eventReminders}
                        onCheckedChange={(checked) => handleInputChange('eventReminders', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تحديثات الأنشطة</Label>
                        <p className="text-sm text-muted-foreground">
                          إشعارات حول الأنشطة الجديدة
                        </p>
                      </div>
                      <Switch
                        checked={settings.activityUpdates}
                        onCheckedChange={(checked) => handleInputChange('activityUpdates', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تحديثات التبرعات</Label>
                        <p className="text-sm text-muted-foreground">
                          إشعارات حول التبرعات
                        </p>
                      </div>
                      <Switch
                        checked={settings.donationUpdates}
                        onCheckedChange={(checked) => handleInputChange('donationUpdates', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>تحديثات الأخبار</Label>
                        <p className="text-sm text-muted-foreground">
                          إشعارات حول الأخبار الجديدة
                        </p>
                      </div>
                      <Switch
                        checked={settings.newsUpdates}
                        onCheckedChange={(checked) => handleInputChange('newsUpdates', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  إعدادات الخصوصية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>رؤية الملف الشخصي</Label>
                    <Select
                      value={settings.profileVisibility}
                      onValueChange={(value) => handleInputChange('profileVisibility', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">عام</SelectItem>
                        <SelectItem value="members">الأعضاء فقط</SelectItem>
                        <SelectItem value="private">خاص</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">المعلومات المرئية</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>إظهار البريد الإلكتروني</Label>
                        <Switch
                          checked={settings.showEmail}
                          onCheckedChange={(checked) => handleInputChange('showEmail', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>إظهار رقم الهاتف</Label>
                        <Switch
                          checked={settings.showPhone}
                          onCheckedChange={(checked) => handleInputChange('showPhone', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>إظهار العنوان</Label>
                        <Switch
                          checked={settings.showAddress}
                          onCheckedChange={(checked) => handleInputChange('showAddress', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>السماح بالرسائل</Label>
                        <Switch
                          checked={settings.allowMessages}
                          onCheckedChange={(checked) => handleInputChange('allowMessages', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  إعدادات المظهر
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>اللغة</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) => handleInputChange('language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>حجم الخط</Label>
                    <Select
                      value={settings.fontSize}
                      onValueChange={(value) => handleInputChange('fontSize', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">صغير</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="large">كبير</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>المظهر</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant={theme === 'light' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme('light')}
                      >
                        <Sun className="w-4 h-4 ml-1" />
                        فاتح
                      </Button>
                      <Button
                        variant={theme === 'dark' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme('dark')}
                      >
                        <Moon className="w-4 h-4 ml-1" />
                        داكن
                      </Button>
                      <Button
                        variant={theme === 'system' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setTheme('system')}
                      >
                        <Monitor className="w-4 h-4 ml-1" />
                        تلقائي
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>الرسوم المتحركة</Label>
                      <Switch
                        checked={settings.animations}
                        onCheckedChange={(checked) => handleInputChange('animations', checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>تقليل الحركة</Label>
                      <Switch
                        checked={settings.reducedMotion}
                        onCheckedChange={(checked) => handleInputChange('reducedMotion', checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  إعدادات الأمان
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>المصادقة الثنائية</Label>
                      <p className="text-sm text-muted-foreground">
                        إضافة طبقة أمان إضافية لحسابك
                      </p>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleInputChange('twoFactorAuth', checked)}
                    />
                  </div>
                  
                  <div>
                    <Label>مهلة الجلسة (دقيقة)</Label>
                    <Select
                      value={settings.sessionTimeout.toString()}
                      onValueChange={(value) => handleInputChange('sessionTimeout', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 دقيقة</SelectItem>
                        <SelectItem value="30">30 دقيقة</SelectItem>
                        <SelectItem value="60">ساعة واحدة</SelectItem>
                        <SelectItem value="120">ساعتان</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>تنبيهات تسجيل الدخول</Label>
                      <p className="text-sm text-muted-foreground">
                        إشعار عند تسجيل الدخول من جهاز جديد
                      </p>
                    </div>
                    <Switch
                      checked={settings.loginAlerts}
                      onCheckedChange={(checked) => handleInputChange('loginAlerts', checked)}
                    />
                  </div>
                  
                  <div>
                    <Label>انتهاء صلاحية كلمة المرور (يوم)</Label>
                    <Select
                      value={settings.passwordExpiry.toString()}
                      onValueChange={(value) => handleInputChange('passwordExpiry', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 يوم</SelectItem>
                        <SelectItem value="60">60 يوم</SelectItem>
                        <SelectItem value="90">90 يوم</SelectItem>
                        <SelectItem value="180">180 يوم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  إدارة البيانات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>احتفاظ البيانات (يوم)</Label>
                    <Select
                      value={settings.dataRetention.toString()}
                      onValueChange={(value) => handleInputChange('dataRetention', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 يوم</SelectItem>
                        <SelectItem value="90">90 يوم</SelectItem>
                        <SelectItem value="180">180 يوم</SelectItem>
                        <SelectItem value="365">سنة واحدة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>النسخ الاحتياطي التلقائي</Label>
                      <p className="text-sm text-muted-foreground">
                        إنشاء نسخ احتياطية تلقائية لبياناتك
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) => handleInputChange('autoBackup', checked)}
                    />
                  </div>
                  
                  <div>
                    <Label>تكرار النسخ الاحتياطي</Label>
                    <Select
                      value={settings.backupFrequency}
                      onValueChange={(value) => handleInputChange('backupFrequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">يومي</SelectItem>
                        <SelectItem value="weekly">أسبوعي</SelectItem>
                        <SelectItem value="monthly">شهري</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>تنسيق التصدير</Label>
                    <Select
                      value={settings.exportFormat}
                      onValueChange={(value) => handleInputChange('exportFormat', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">إجراءات البيانات</h4>
                  <div className="flex gap-4">
                    <Button onClick={handleExportData} variant="outline">
                      <Download className="w-4 h-4 ml-2" />
                      تصدير البيانات
                    </Button>
                    <Button variant="outline" asChild>
                      <label>
                        <Upload className="w-4 h-4 ml-2" />
                        استيراد البيانات
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportData}
                          className="hidden"
                        />
                      </label>
                    </Button>
                    <Button onClick={handleReset} variant="destructive">
                      <Trash2 className="w-4 h-4 ml-2" />
                      إعادة التعيين
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
