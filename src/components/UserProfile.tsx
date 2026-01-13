import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Shield, 
  Calendar,
  Save,
  Key,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const profileSchema = Yup.object({
  fullName: Yup.string()
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .required('الاسم الكامل مطلوب'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'رقم الهاتف يجب أن يتكون من 10 أرقام')
    .optional(),
  department: Yup.string()
    .optional(),
});

const passwordSchema = Yup.object({
  currentPassword: Yup.string()
    .required('كلمة المرور الحالية مطلوبة'),
  newPassword: Yup.string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(/[A-Za-z]/, 'كلمة المرور يجب أن تحتوي على حروف')
    .matches(/[0-9]/, 'كلمة المرور يجب أن تحتوي على أرقام')
    .required('كلمة المرور الجديدة مطلوبة'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور مطلوب'),
});

const UserProfile: React.FC = () => {
  const { user, updateProfile, changePassword, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          لم يتم العثور على معلومات المستخدم
        </AlertDescription>
      </Alert>
    );
  }

  const getRoleName = (role: string) => {
    const roleNames: Record<string, string> = {
      SUPER_ADMIN: 'مدير عام',
      ADMIN: 'مدير',
      MODERATOR: 'مشرف',
      MEMBER: 'عضو',
      GUEST: 'زائر',
    };
    return roleNames[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      SUPER_ADMIN: 'bg-red-100 text-red-800',
      ADMIN: 'bg-orange-100 text-orange-800',
      MODERATOR: 'bg-blue-100 text-blue-800',
      MEMBER: 'bg-green-100 text-green-800',
      GUEST: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const handleProfileUpdate = async (values: any) => {
    const success = await updateProfile(values);
    if (success) {
      toast({
        title: 'تم تحديث الملف الشخصي',
        description: 'تم حفظ التغييرات بنجاح',
      });
    }
  };

  const handlePasswordChange = async (values: any) => {
    const success = await changePassword(values.currentPassword, values.newPassword);
    if (success) {
      toast({
        title: 'تم تغيير كلمة المرور',
        description: 'تم تغيير كلمة المرور بنجاح',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">الملف الشخصي</h1>
        <p className="text-muted-foreground">
          إدارة معلوماتك الشخصية وإعدادات الحساب
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            الملف الشخصي
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            الأمان
          </TabsTrigger>
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
            <CardContent>
              <Formik
                initialValues={{
                  fullName: user.fullName,
                  phone: user.phone || '',
                  department: user.department || '',
                }}
                validationSchema={profileSchema}
                onSubmit={handleProfileUpdate}
              >
                {({ errors, touched }) => (
                  <Form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">الاسم الكامل</Label>
                        <Field
                          as={Input}
                          id="fullName"
                          name="fullName"
                          className={errors.fullName && touched.fullName ? 'border-red-500' : ''}
                        />
                        <ErrorMessage name="fullName" component="p" className="text-red-500 text-sm mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="phone">رقم الهاتف</Label>
                        <Field
                          as={Input}
                          id="phone"
                          name="phone"
                          type="tel"
                          className={errors.phone && touched.phone ? 'border-red-500' : ''}
                        />
                        <ErrorMessage name="phone" component="p" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="department">القسم</Label>
                      <Field
                        as={Input}
                        id="department"
                        name="department"
                        className={errors.department && touched.department ? 'border-red-500' : ''}
                      />
                      <ErrorMessage name="department" component="p" className="text-red-500 text-sm mt-1" />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          حفظ التغييرات
                        </>
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                معلومات الحساب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">البريد الإلكتروني</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">الدور</p>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {getRoleName(user.role)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">تاريخ الإنشاء</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('ar-MA')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">الحالة</p>
                    <Badge variant={user.isActive ? 'default' : 'secondary'}>
                      {user.isActive ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </div>
                </div>
              </div>
              {user.lastLogin && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">آخر دخول</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.lastLogin).toLocaleDateString('ar-MA')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                تغيير كلمة المرور
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={{
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                }}
                validationSchema={passwordSchema}
                onSubmit={handlePasswordChange}
              >
                {({ errors, touched }) => (
                  <Form className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          className={errors.currentPassword && touched.currentPassword ? 'border-red-500 pr-10' : 'pr-10'}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <ErrorMessage name="currentPassword" component="p" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          className={errors.newPassword && touched.newPassword ? 'border-red-500 pr-10' : 'pr-10'}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <ErrorMessage name="newPassword" component="p" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">تأكيد كلمة المرور الجديدة</Label>
                      <div className="relative">
                        <Field
                          as={Input}
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          className={errors.confirmPassword && touched.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <ErrorMessage name="confirmPassword" component="p" className="text-red-500 text-sm mt-1" />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          جاري التحديث...
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4 ml-2" />
                          تغيير كلمة المرور
                        </>
                      )}
                    </Button>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
