import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, Permission, UserRole, AuthContextType } from '@/types/auth';
import { authService } from '@/lib/authService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier l'utilisateur actuel au chargement
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.login(credentials);
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        return true;
      } else {
        setError(result.error || 'فشل في تسجيل الدخول');
        return false;
      }
    } catch (error) {
      setError('حدث خطأ أثناء تسجيل الدخول');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.register(data);
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        return true;
      } else {
        setError(result.error || 'فشل في إنشاء الحساب');
        return false;
      }
    } catch (error) {
      setError('حدث خطأ أثناء إنشاء الحساب');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.updateProfile(data);
      
      if (result.success) {
        // Mettre à jour l'utilisateur local
        const updatedUser = authService.getCurrentUser();
        if (updatedUser) {
          setUser(updatedUser);
        }
        return true;
      } else {
        setError(result.error || 'فشل في تحديث الملف الشخصي');
        return false;
      }
    } catch (error) {
      setError('حدث خطأ أثناء تحديث الملف الشخصي');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.changePassword(currentPassword, newPassword);
      
      if (result.success) {
        return true;
      } else {
        setError(result.error || 'فشل في تغيير كلمة المرور');
        return false;
      }
    } catch (error) {
      setError('حدث خطأ أثناء تغيير كلمة المرور');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    return authService.hasPermission(permission);
  };

  const hasRole = (role: UserRole): boolean => {
    return authService.hasRole(role);
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return authService.hasAnyRole(roles);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasPermission,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
