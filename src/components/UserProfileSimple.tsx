import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Calendar, User, Shield, Edit, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import PrivacyMask from './PrivacyMask';

const UserProfileSimple: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">جاري تحميل بيانات المستخدم...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-red-500">لم يتم العثور على بيانات المستخدم. يرجى تسجيل الدخول.</p>
          <Button asChild className="mt-4">
            <Link to="/login">تسجيل الدخول</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'destructive';
      case 'ADMIN': return 'default';
      case 'MODERATOR': return 'secondary';
      case 'MEMBER': return 'outline';
      case 'GUEST': return 'ghost';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Informations de base */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-6 h-6" />
            الملف الشخصي
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-2 border-primary">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} alt={user.fullName} />
              <AvatarFallback>{user.fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{user.fullName}</h3>
              <Badge variant={getRoleBadgeVariant(user.role)} className="mt-1 flex items-center gap-1 w-fit">
                <Shield className="w-3 h-3" />
                {user.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations personnelles masquées */}
      <PrivacyMask
        label="المعلومات الشخصية"
        maskText="••••••••••••"
        showIcon={true}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">البريد الإلكتروني</p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">تاريخ التسجيل</p>
              <p className="text-muted-foreground">{new Date(user.createdAt).toLocaleDateString('ar-MA')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">آخر تحديث</p>
              <p className="text-muted-foreground">{new Date(user.updatedAt).toLocaleDateString('ar-MA')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">الحالة</p>
              <Badge variant={user.isActive ? "default" : "destructive"}>
                {user.isActive ? 'نشط' : 'غير نشط'}
              </Badge>
            </div>
          </div>
        </div>
      </PrivacyMask>

      {/* Informations de contact masquées */}
      <PrivacyMask
        label="معلومات الاتصال"
        maskText="••••••••••••"
        showIcon={true}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">رقم الهاتف</p>
              <p className="text-muted-foreground">+212 6XX XXX XXX</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">العنوان</p>
              <p className="text-muted-foreground">قرية إمليل، إقليم تنغير، المغرب</p>
            </div>
          </div>
        </div>
      </PrivacyMask>

      {/* Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/profile/edit">
                <Edit className="w-4 h-4 ml-1" />
                تعديل الملف
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link to="/activities">
                <User className="w-4 h-4 ml-1" />
                الأنشطة
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link to="/events">
                <Calendar className="w-4 h-4 ml-1" />
                الفعاليات
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileSimple;
