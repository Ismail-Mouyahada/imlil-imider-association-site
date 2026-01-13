import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Users, 
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import PrivacyMask from './PrivacyMask';

interface AdminPrivacySettingsProps {
  onSettingsChange?: (settings: PrivacySettings) => void;
}

interface PrivacySettings {
  hidePersonalInfo: boolean;
  hideContactInfo: boolean;
  hideUserDetails: boolean;
  requireAuthForDetails: boolean;
  showParticipationCount: boolean;
  hideOrganizerInfo: boolean;
}

const AdminPrivacySettings: React.FC<AdminPrivacySettingsProps> = ({
  onSettingsChange
}) => {
  const [settings, setSettings] = useState<PrivacySettings>({
    hidePersonalInfo: true,
    hideContactInfo: true,
    hideUserDetails: false,
    requireAuthForDetails: true,
    showParticipationCount: true,
    hideOrganizerInfo: false
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleSettingChange = (key: keyof PrivacySettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              إعدادات الخصوصية
            </CardTitle>
            <Button
              variant="outline"
              onClick={togglePreviewMode}
              className="flex items-center gap-2"
            >
              {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPreviewMode ? 'إخفاء المعاينة' : 'معاينة الإعدادات'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            قم بتكوين إعدادات الخصوصية لحماية المعلومات الشخصية للمستخدمين
          </p>
        </CardContent>
      </Card>

      {/* Paramètres de confidentialité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            إعدادات الخصوصية العامة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="hidePersonalInfo" className="text-base font-medium">
                  إخفاء المعلومات الشخصية
                </Label>
                <p className="text-sm text-muted-foreground">
                  إخفاء الأسماء والعناوين والتفاصيل الشخصية
                </p>
              </div>
              <Switch
                id="hidePersonalInfo"
                checked={settings.hidePersonalInfo}
                onCheckedChange={(checked) => handleSettingChange('hidePersonalInfo', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="hideContactInfo" className="text-base font-medium">
                  إخفاء معلومات الاتصال
                </Label>
                <p className="text-sm text-muted-foreground">
                  إخفاء أرقام الهواتف والعناوين الإلكترونية
                </p>
              </div>
              <Switch
                id="hideContactInfo"
                checked={settings.hideContactInfo}
                onCheckedChange={(checked) => handleSettingChange('hideContactInfo', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="requireAuthForDetails" className="text-base font-medium">
                  طلب تسجيل الدخول للتفاصيل
                </Label>
                <p className="text-sm text-muted-foreground">
                  إجبار المستخدمين على تسجيل الدخول لرؤية التفاصيل
                </p>
              </div>
              <Switch
                id="requireAuthForDetails"
                checked={settings.requireAuthForDetails}
                onCheckedChange={(checked) => handleSettingChange('requireAuthForDetails', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="showParticipationCount" className="text-base font-medium">
                  إظهار عدد المشاركين
                </Label>
                <p className="text-sm text-muted-foreground">
                  إظهار عدد المشاركين في الأنشطة
                </p>
              </div>
              <Switch
                id="showParticipationCount"
                checked={settings.showParticipationCount}
                onCheckedChange={(checked) => handleSettingChange('showParticipationCount', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Paramètres spécifiques aux activités */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            إعدادات الأنشطة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="hideUserDetails" className="text-base font-medium">
                  إخفاء تفاصيل المستخدمين
                </Label>
                <p className="text-sm text-muted-foreground">
                  إخفاء أسماء وأدوار المستخدمين في قوائم المشاركين
                </p>
              </div>
              <Switch
                id="hideUserDetails"
                checked={settings.hideUserDetails}
                onCheckedChange={(checked) => handleSettingChange('hideUserDetails', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="hideOrganizerInfo" className="text-base font-medium">
                  إخفاء معلومات المنظم
                </Label>
                <p className="text-sm text-muted-foreground">
                  إخفاء معلومات منظمي الأنشطة
                </p>
              </div>
              <Switch
                id="hideOrganizerInfo"
                checked={settings.hideOrganizerInfo}
                onCheckedChange={(checked) => handleSettingChange('hideOrganizerInfo', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aperçu des paramètres */}
      {isPreviewMode && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Eye className="w-5 h-5" />
              معاينة الإعدادات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {settings.hidePersonalInfo ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm">المعلومات الشخصية</span>
              </div>
              
              <div className="flex items-center gap-2">
                {settings.hideContactInfo ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm">معلومات الاتصال</span>
              </div>
              
              <div className="flex items-center gap-2">
                {settings.requireAuthForDetails ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-sm">تسجيل الدخول مطلوب</span>
              </div>
            </div>

            {/* Exemple de masquage */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">مثال على التطبيق:</h4>
              <PrivacyMask
                label="معلومات المستخدم"
                maskText="••••••••••••"
                showIcon={true}
              >
                <div className="space-y-2">
                  <p><strong>الاسم:</strong> أحمد محمد</p>
                  <p><strong>البريد الإلكتروني:</strong> ahmed@example.com</p>
                  <p><strong>الهاتف:</strong> +212 6XX XXX XXX</p>
                </div>
              </PrivacyMask>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-3">
            <Button>
              <CheckCircle className="w-4 h-4 ml-1" />
              حفظ الإعدادات
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 ml-1" />
              إعادة تعيين
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPrivacySettings;
