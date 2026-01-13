import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Building2, 
  Eye, 
  EyeOff, 
  Loader2,
  LogIn,
  UserPlus,
  AlertCircle
} from 'lucide-react';

const loginSchema = Yup.object({
  email: Yup.string()
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .required('البريد الإلكتروني مطلوب'),
  password: Yup.string()
    .required('كلمة المرور مطلوبة'),
  rememberMe: Yup.boolean(),
});

const registerSchema = Yup.object({
  email: Yup.string()
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .required('البريد الإلكتروني مطلوب'),
  password: Yup.string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(/[A-Za-z]/, 'كلمة المرور يجب أن تحتوي على حروف')
    .matches(/[0-9]/, 'كلمة المرور يجب أن تحتوي على أرقام')
    .required('كلمة المرور مطلوبة'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور مطلوب'),
  fullName: Yup.string()
    .min(2, 'الاسم يجب أن يكون حرفين على الأقل')
    .required('الاسم الكامل مطلوب'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'رقم الهاتف يجب أن يتكون من 10 أرقام')
    .optional(),
  department: Yup.string()
    .optional(),
});

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register, isLoading, error, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (values: any) => {
    const success = await login(values);
    if (success) {
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحباً بك في جمعية إمليل',
      });
      navigate(from, { replace: true });
    }
  };

  const handleRegister = async (values: any) => {
    const success = await register(values);
    if (success) {
      toast({
        title: 'تم إنشاء الحساب بنجاح',
        description: 'مرحباً بك في جمعية إمليل',
      });
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gradient mb-2">جمعية إمليل</h1>
              <p className="text-muted-foreground">نظام إدارة الجمعية</p>
            </div>

        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  تسجيل الدخول
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  إنشاء حساب
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4 mt-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">مرحباً بعودتك</h2>
                  <p className="text-muted-foreground">سجل دخولك للوصول إلى حسابك</p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Formik
                  initialValues={{
                    email: '',
                    password: '',
                    rememberMe: false,
                  }}
                  validationSchema={loginSchema}
                  onSubmit={handleLogin}
                >
                  {({ errors, touched, values }) => (
                    <Form className="space-y-4">
                      {/* Email */}
                      <div>
                        <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4" />
                          البريد الإلكتروني
                        </Label>
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          placeholder="أدخل بريدك الإلكتروني"
                          className={errors.email && touched.email ? 'border-red-500' : ''}
                        />
                        <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Password */}
                      <div>
                        <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4" />
                          كلمة المرور
                        </Label>
                        <div className="relative">
                          <Field
                            as={Input}
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="أدخل كلمة المرور"
                            className={errors.password && touched.password ? 'border-red-500 pr-10' : 'pr-10'}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Remember Me */}
                      <div className="flex items-center space-x-2">
                        <Field
                          as={Checkbox}
                          id="rememberMe"
                          name="rememberMe"
                          checked={values.rememberMe}
                        />
                        <Label htmlFor="rememberMe" className="text-sm">
                          تذكرني
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                            جاري تسجيل الدخول...
                          </>
                        ) : (
                          <>
                            <LogIn className="w-4 h-4 ml-2" />
                            تسجيل الدخول
                          </>
                        )}
                      </Button>
                    </Form>
                  )}
                </Formik>

                {/* Demo Accounts */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-3 text-center">حسابات تجريبية</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">مدير عام:</span>
                      <span className="text-muted-foreground">superadmin@imlil.ma</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">مدير:</span>
                      <span className="text-muted-foreground">admin@imlil.ma</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">مشرف:</span>
                      <span className="text-muted-foreground">moderator@imlil.ma</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">عضو:</span>
                      <span className="text-muted-foreground">member@imlil.ma</span>
                    </div>
                    <div className="text-center text-xs text-muted-foreground mt-2">
                      كلمة المرور: [Role]123!
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4 mt-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">انضم إلينا</h2>
                  <p className="text-muted-foreground">أنشئ حسابك الجديد</p>
                </div>

                <Formik
                  initialValues={{
                    email: '',
                    password: '',
                    confirmPassword: '',
                    fullName: '',
                    phone: '',
                    department: '',
                  }}
                  validationSchema={registerSchema}
                  onSubmit={handleRegister}
                >
                  {({ errors, touched, values }) => (
                    <Form className="space-y-4">
                      {/* Full Name */}
                      <div>
                        <Label htmlFor="fullName" className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4" />
                          الاسم الكامل
                        </Label>
                        <Field
                          as={Input}
                          id="fullName"
                          name="fullName"
                          placeholder="أدخل اسمك الكامل"
                          className={errors.fullName && touched.fullName ? 'border-red-500' : ''}
                        />
                        <ErrorMessage name="fullName" component="p" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Email */}
                      <div>
                        <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4" />
                          البريد الإلكتروني
                        </Label>
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          placeholder="أدخل بريدك الإلكتروني"
                          className={errors.email && touched.email ? 'border-red-500' : ''}
                        />
                        <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Phone */}
                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                          <Phone className="w-4 h-4" />
                          رقم الهاتف (اختياري)
                        </Label>
                        <Field
                          as={Input}
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="أدخل رقم هاتفك"
                          className={errors.phone && touched.phone ? 'border-red-500' : ''}
                        />
                        <ErrorMessage name="phone" component="p" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Department */}
                      <div>
                        <Label htmlFor="department" className="flex items-center gap-2 mb-2">
                          <Building2 className="w-4 h-4" />
                          القسم (اختياري)
                        </Label>
                        <Field
                          as={Input}
                          id="department"
                          name="department"
                          placeholder="أدخل القسم"
                          className={errors.department && touched.department ? 'border-red-500' : ''}
                        />
                        <ErrorMessage name="department" component="p" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Password */}
                      <div>
                        <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4" />
                          كلمة المرور
                        </Label>
                        <div className="relative">
                          <Field
                            as={Input}
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="أدخل كلمة المرور"
                            className={errors.password && touched.password ? 'border-red-500 pr-10' : 'pr-10'}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <Label htmlFor="confirmPassword" className="flex items-center gap-2 mb-2">
                          <Lock className="w-4 h-4" />
                          تأكيد كلمة المرور
                        </Label>
                        <div className="relative">
                          <Field
                            as={Input}
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="أكد كلمة المرور"
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

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                        size="lg"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                            جاري إنشاء الحساب...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 ml-2" />
                            إنشاء الحساب
                          </>
                        )}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary">
                العودة إلى الصفحة الرئيسية
              </Link>
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
