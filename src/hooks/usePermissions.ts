import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { UserRole } from '@/types/auth';

/**
 * Hook pour la gestion des permissions
 * Fournit des fonctions utilitaires pour vérifier les permissions
 */
export const usePermissions = () => {
  const { user, hasPermission, isAuthenticated } = useAuth();

  // Permissions par rôle
  const rolePermissions = useMemo(() => ({
    SUPER_ADMIN: [
      'admin.access',
      'users.manage',
      'users.create',
      'users.edit',
      'users.delete',
      'content.manage',
      'content.create',
      'content.edit',
      'content.delete',
      'settings.manage',
      'stats.view',
      'stats.export',
      'system.manage',
      'logs.view',
      'backup.manage'
    ],
    ADMIN: [
      'admin.access',
      'users.manage',
      'users.create',
      'users.edit',
      'users.delete',
      'content.manage',
      'content.create',
      'content.edit',
      'content.delete',
      'settings.manage',
      'stats.view',
      'stats.export',
      'logs.view'
    ],
    MODERATOR: [
      'content.manage',
      'content.create',
      'content.edit',
      'content.delete',
      'users.view',
      'stats.view'
    ],
    MEMBER: [
      'profile.edit',
      'content.view',
      'activities.view',
      'events.view',
      'news.view',
      'gallery.view'
    ],
    GUEST: [
      'content.view',
      'activities.view',
      'events.view',
      'news.view',
      'gallery.view'
    ]
  }), []);

  // Obtenir les permissions de l'utilisateur actuel
  const userPermissions = useMemo(() => {
    if (!isAuthenticated || !user) {
      return rolePermissions.GUEST;
    }
    return rolePermissions[user.role] || rolePermissions.GUEST;
  }, [user, isAuthenticated, rolePermissions]);

  // Vérifier si l'utilisateur a une permission spécifique
  const hasPermissionCheck = (permission: string): boolean => {
    if (!isAuthenticated) {
      return rolePermissions.GUEST.includes(permission);
    }
    return hasPermission(permission);
  };

  // Vérifier si l'utilisateur a toutes les permissions requises
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermissionCheck(permission));
  };

  // Vérifier si l'utilisateur a au moins une des permissions
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermissionCheck(permission));
  };

  // Vérifier si l'utilisateur peut gérer les utilisateurs
  const canManageUsers = (): boolean => {
    return hasPermissionCheck('users.manage');
  };

  // Vérifier si l'utilisateur peut créer des utilisateurs
  const canCreateUsers = (): boolean => {
    return hasPermissionCheck('users.create');
  };

  // Vérifier si l'utilisateur peut éditer des utilisateurs
  const canEditUsers = (): boolean => {
    return hasPermissionCheck('users.edit');
  };

  // Vérifier si l'utilisateur peut supprimer des utilisateurs
  const canDeleteUsers = (): boolean => {
    return hasPermissionCheck('users.delete');
  };

  // Vérifier si l'utilisateur peut gérer le contenu
  const canManageContent = (): boolean => {
    return hasPermissionCheck('content.manage');
  };

  // Vérifier si l'utilisateur peut créer du contenu
  const canCreateContent = (): boolean => {
    return hasPermissionCheck('content.create');
  };

  // Vérifier si l'utilisateur peut éditer du contenu
  const canEditContent = (): boolean => {
    return hasPermissionCheck('content.edit');
  };

  // Vérifier si l'utilisateur peut supprimer du contenu
  const canDeleteContent = (): boolean => {
    return hasPermissionCheck('content.delete');
  };

  // Vérifier si l'utilisateur peut accéder à l'administration
  const canAccessAdmin = (): boolean => {
    return hasPermissionCheck('admin.access');
  };

  // Vérifier si l'utilisateur peut voir les statistiques
  const canViewStats = (): boolean => {
    return hasPermissionCheck('stats.view');
  };

  // Vérifier si l'utilisateur peut exporter les statistiques
  const canExportStats = (): boolean => {
    return hasPermissionCheck('stats.export');
  };

  // Vérifier si l'utilisateur peut gérer les paramètres
  const canManageSettings = (): boolean => {
    return hasPermissionCheck('settings.manage');
  };

  // Vérifier si l'utilisateur peut voir les logs
  const canViewLogs = (): boolean => {
    return hasPermissionCheck('logs.view');
  };

  // Vérifier si l'utilisateur peut gérer le système
  const canManageSystem = (): boolean => {
    return hasPermissionCheck('system.manage');
  };

  // Vérifier si l'utilisateur peut gérer les sauvegardes
  const canManageBackups = (): boolean => {
    return hasPermissionCheck('backup.manage');
  };

  // Obtenir le niveau d'accès de l'utilisateur
  const getAccessLevel = (): number => {
    if (!isAuthenticated || !user) return 0;
    
    const levels = {
      GUEST: 0,
      MEMBER: 1,
      MODERATOR: 2,
      ADMIN: 3,
      SUPER_ADMIN: 4
    };
    
    return levels[user.role] || 0;
  };

  // Vérifier si l'utilisateur a un niveau d'accès minimum
  const hasMinimumAccess = (requiredLevel: number): boolean => {
    return getAccessLevel() >= requiredLevel;
  };

  // Vérifier si l'utilisateur peut effectuer une action sur un autre utilisateur
  const canActOnUser = (targetUserRole: UserRole): boolean => {
    if (!isAuthenticated || !user) return false;
    
    const currentLevel = getAccessLevel();
    const targetLevel = {
      GUEST: 0,
      MEMBER: 1,
      MODERATOR: 2,
      ADMIN: 3,
      SUPER_ADMIN: 4
    }[targetUserRole] || 0;
    
    // Un utilisateur ne peut agir que sur des utilisateurs de niveau inférieur
    return currentLevel > targetLevel;
  };

  return {
    userPermissions,
    hasPermission: hasPermissionCheck,
    hasAllPermissions,
    hasAnyPermission,
    canManageUsers,
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    canManageContent,
    canCreateContent,
    canEditContent,
    canDeleteContent,
    canAccessAdmin,
    canViewStats,
    canExportStats,
    canManageSettings,
    canViewLogs,
    canManageSystem,
    canManageBackups,
    getAccessLevel,
    hasMinimumAccess,
    canActOnUser
  };
};

/**
 * Hook pour vérifier les permissions de contenu
 */
export const useContentPermissions = () => {
  const { canManageContent, canCreateContent, canEditContent, canDeleteContent } = usePermissions();
  
  return {
    canManage: canManageContent,
    canCreate: canCreateContent,
    canEdit: canEditContent,
    canDelete: canDeleteContent
  };
};

/**
 * Hook pour vérifier les permissions d'administration
 */
export const useAdminPermissions = () => {
  const { 
    canAccessAdmin, 
    canManageUsers, 
    canViewStats, 
    canManageSettings,
    canViewLogs,
    canManageSystem
  } = usePermissions();
  
  return {
    canAccess: canAccessAdmin,
    canManageUsers,
    canViewStats,
    canManageSettings,
    canViewLogs,
    canManageSystem
  };
};

/**
 * Hook pour vérifier les permissions utilisateur
 */
export const useUserPermissions = () => {
  const { 
    canManageUsers, 
    canCreateUsers, 
    canEditUsers, 
    canDeleteUsers,
    canActOnUser
  } = usePermissions();
  
  return {
    canManage: canManageUsers,
    canCreate: canCreateUsers,
    canEdit: canEditUsers,
    canDelete: canDeleteUsers,
    canActOn: canActOnUser
  };
};
