import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, Permission } from '@/types/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Lock } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  fallbackPath?: string;
  showAccessDenied?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredRoles,
  requiredPermission,
  requiredPermissions,
  fallbackPath = '/login',
  showAccessDenied = true,
}) => {
  const { isAuthenticated, user, isLoading, hasRole, hasAnyRole, hasPermission } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Vérifier le rôle requis
  if (requiredRole && !hasRole(requiredRole)) {
    if (showAccessDenied) {
      return <AccessDeniedPage reason="role" requiredRole={requiredRole} />;
    }
    return <Navigate to={fallbackPath} replace />;
  }

  // Vérifier les rôles requis (au moins un)
  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    if (showAccessDenied) {
      return <AccessDeniedPage reason="roles" requiredRoles={requiredRoles} />;
    }
    return <Navigate to={fallbackPath} replace />;
  }

  // Vérifier la permission requise
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (showAccessDenied) {
      return <AccessDeniedPage reason="permission" requiredPermission={requiredPermission} />;
    }
    return <Navigate to={fallbackPath} replace />;
  }

  // Vérifier les permissions requises (toutes)
  if (requiredPermissions && !requiredPermissions.every(permission => hasPermission(permission))) {
    if (showAccessDenied) {
      return <AccessDeniedPage reason="permissions" requiredPermissions={requiredPermissions} />;
    }
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

interface AccessDeniedPageProps {
  reason: 'role' | 'roles' | 'permission' | 'permissions';
  requiredRole?: UserRole;
  requiredRoles?: UserRole[];
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
}

const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  reason,
  requiredRole,
  requiredRoles,
  requiredPermission,
  requiredPermissions,
}) => {
  const { user } = useAuth();

  const getRoleName = (role: UserRole): string => {
    const roleNames: Record<UserRole, string> = {
      SUPER_ADMIN: 'مدير عام',
      ADMIN: 'مدير',
      MODERATOR: 'مشرف',
      MEMBER: 'عضو',
      GUEST: 'زائر',
    };
    return roleNames[role];
  };

  const getPermissionName = (permission: Permission): string => {
    const permissionNames: Record<Permission, string> = {
      'users.create': 'إنشاء المستخدمين',
      'users.read': 'عرض المستخدمين',
      'users.update': 'تعديل المستخدمين',
      'users.delete': 'حذف المستخدمين',
      'contacts.create': 'إنشاء جهات الاتصال',
      'contacts.read': 'عرض جهات الاتصال',
      'contacts.update': 'تعديل جهات الاتصال',
      'contacts.delete': 'حذف جهات الاتصال',
      'donations.create': 'إنشاء التبرعات',
      'donations.read': 'عرض التبرعات',
      'donations.update': 'تعديل التبرعات',
      'donations.delete': 'حذف التبرعات',
      'activities.create': 'إنشاء الأنشطة',
      'activities.read': 'عرض الأنشطة',
      'activities.update': 'تعديل الأنشطة',
      'activities.delete': 'حذف الأنشطة',
      'events.create': 'إنشاء الفعاليات',
      'events.read': 'عرض الفعاليات',
      'events.update': 'تعديل الفعاليات',
      'events.delete': 'حذف الفعاليات',
      'news.create': 'إنشاء الأخبار',
      'news.read': 'عرض الأخبار',
      'news.update': 'تعديل الأخبار',
      'news.delete': 'حذف الأخبار',
      'gallery.create': 'إنشاء المعرض',
      'gallery.read': 'عرض المعرض',
      'gallery.update': 'تعديل المعرض',
      'gallery.delete': 'حذف المعرض',
      'admin.access': 'الوصول للإدارة',
      'reports.view': 'عرض التقارير',
      'settings.manage': 'إدارة الإعدادات',
    };
    return permissionNames[permission] || permission;
  };

  const getRequiredAccess = () => {
    switch (reason) {
      case 'role':
        return `دور "${getRoleName(requiredRole!)}"`;
      case 'roles':
        return `أحد الأدوار: ${requiredRoles!.map(getRoleName).join(', ')}`;
      case 'permission':
        return `إذن "${getPermissionName(requiredPermission!)}"`;
      case 'permissions':
        return `الأذونات: ${requiredPermissions!.map(getPermissionName).join(', ')}`;
      default:
        return 'الوصول المطلوب';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">غير مصرح بالوصول</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              عذراً، ليس لديك الصلاحية للوصول إلى هذه الصفحة.
            </p>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium">الوصول المطلوب:</p>
              <p className="text-sm text-muted-foreground">{getRequiredAccess()}</p>
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm font-medium">دورك الحالي:</p>
              <p className="text-sm text-muted-foreground">{getRoleName(user?.role || 'GUEST')}</p>
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button asChild variant="outline">
              <a href="/">العودة للرئيسية</a>
            </Button>
            <Button asChild>
              <a href="/admin">لوحة الإدارة</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProtectedRoute;
