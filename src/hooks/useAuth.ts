import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { User, UserRole } from '@/types/auth';

/**
 * Hook personnalisé pour l'authentification
 * Fournit un accès simplifié au contexte d'authentification
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  
  return context;
};

/**
 * Hook pour vérifier si l'utilisateur est connecté
 */
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

/**
 * Hook pour obtenir l'utilisateur actuel
 */
export const useCurrentUser = (): User | null => {
  const { user } = useAuth();
  return user;
};

/**
 * Hook pour vérifier si l'utilisateur a un rôle spécifique
 */
export const useHasRole = (role: UserRole): boolean => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return false;
  }
  
  return user.role === role;
};

/**
 * Hook pour vérifier si l'utilisateur a une permission spécifique
 */
export const useHasPermission = (permissionId: string): boolean => {
  const { hasPermission } = useAuth();
  return hasPermission(permissionId);
};

/**
 * Hook pour vérifier si l'utilisateur est administrateur
 */
export const useIsAdmin = (): boolean => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return false;
  }
  
  return ['SUPER_ADMIN', 'ADMIN'].includes(user.role);
};

/**
 * Hook pour vérifier si l'utilisateur est super administrateur
 */
export const useIsSuperAdmin = (): boolean => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return false;
  }
  
  return user.role === 'SUPER_ADMIN';
};

/**
 * Hook pour vérifier si l'utilisateur est modérateur ou plus
 */
export const useIsModerator = (): boolean => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return false;
  }
  
  return ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'].includes(user.role);
};

/**
 * Hook pour vérifier si l'utilisateur est membre ou plus
 */
export const useIsMember = (): boolean => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return false;
  }
  
  return ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'MEMBER'].includes(user.role);
};

/**
 * Hook pour les actions d'authentification
 */
export const useAuthActions = () => {
  const { login, register, logout, loading } = useAuth();
  
  return {
    login,
    register,
    logout,
    loading
  };
};

/**
 * Hook pour vérifier si l'utilisateur peut accéder à une route
 */
export const useCanAccess = (requiredPermission?: string, requiredRole?: UserRole): boolean => {
  const { isAuthenticated, user, hasPermission } = useAuth();
  
  if (!isAuthenticated || !user) {
    return false;
  }
  
  // Vérifier le rôle si spécifié
  if (requiredRole && user.role !== requiredRole) {
    return false;
  }
  
  // Vérifier la permission si spécifiée
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return false;
  }
  
  return true;
};

/**
 * Hook pour obtenir les informations de l'utilisateur de manière sécurisée
 * (sans le mot de passe)
 */
export const useUserInfo = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  // Retourner les informations sans le mot de passe
  const { password, ...userInfo } = user;
  return userInfo;
};

/**
 * Hook pour vérifier si l'utilisateur est actif
 */
export const useIsUserActive = (): boolean => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return false;
  }
  
  return user.isActive;
};

/**
 * Hook pour obtenir le rôle de l'utilisateur
 */
export const useUserRole = (): UserRole | null => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return user.role;
};

/**
 * Hook pour vérifier si l'utilisateur peut gérer les utilisateurs
 */
export const useCanManageUsers = (): boolean => {
  return useHasPermission('users.manage');
};

/**
 * Hook pour vérifier si l'utilisateur peut gérer le contenu
 */
export const useCanManageContent = (): boolean => {
  return useHasPermission('content.manage');
};

/**
 * Hook pour vérifier si l'utilisateur peut accéder à l'administration
 */
export const useCanAccessAdmin = (): boolean => {
  return useHasPermission('admin.access');
};

/**
 * Hook pour vérifier si l'utilisateur peut voir les statistiques
 */
export const useCanViewStats = (): boolean => {
  return useHasPermission('stats.view');
};

/**
 * Hook pour vérifier si l'utilisateur peut gérer les paramètres
 */
export const useCanManageSettings = (): boolean => {
  return useHasPermission('settings.manage');
};
