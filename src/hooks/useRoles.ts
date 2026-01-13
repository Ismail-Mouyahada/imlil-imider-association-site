import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { UserRole } from '@/types/auth';

/**
 * Hook pour la gestion des rôles
 * Fournit des fonctions utilitaires pour vérifier les rôles
 */
export const useRoles = () => {
  const { user, isAuthenticated } = useAuth();

  // Hiérarchie des rôles (du plus élevé au plus bas)
  const roleHierarchy = useMemo(() => ({
    SUPER_ADMIN: 5,
    ADMIN: 4,
    MODERATOR: 3,
    MEMBER: 2,
    GUEST: 1
  }), []);

  // Obtenir le niveau du rôle de l'utilisateur actuel
  const getUserRoleLevel = (): number => {
    if (!isAuthenticated || !user) {
      return roleHierarchy.GUEST;
    }
    return roleHierarchy[user.role] || roleHierarchy.GUEST;
  };

  // Vérifier si l'utilisateur a un rôle spécifique
  const hasRole = (role: UserRole): boolean => {
    if (!isAuthenticated || !user) {
      return role === 'GUEST';
    }
    return user.role === role;
  };

  // Vérifier si l'utilisateur a un des rôles spécifiés
  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!isAuthenticated || !user) {
      return roles.includes('GUEST');
    }
    return roles.includes(user.role);
  };

  // Vérifier si l'utilisateur a un niveau de rôle minimum
  const hasMinimumRole = (requiredRole: UserRole): boolean => {
    const userLevel = getUserRoleLevel();
    const requiredLevel = roleHierarchy[requiredRole];
    return userLevel >= requiredLevel;
  };

  // Vérifier si l'utilisateur est super administrateur
  const isSuperAdmin = (): boolean => {
    return hasRole('SUPER_ADMIN');
  };

  // Vérifier si l'utilisateur est administrateur (inclut SUPER_ADMIN)
  const isAdmin = (): boolean => {
    return hasAnyRole(['SUPER_ADMIN', 'ADMIN']);
  };

  // Vérifier si l'utilisateur est modérateur ou plus
  const isModerator = (): boolean => {
    return hasAnyRole(['SUPER_ADMIN', 'ADMIN', 'MODERATOR']);
  };

  // Vérifier si l'utilisateur est membre ou plus
  const isMember = (): boolean => {
    return hasAnyRole(['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'MEMBER']);
  };

  // Vérifier si l'utilisateur est invité
  const isGuest = (): boolean => {
    return hasRole('GUEST');
  };

  // Obtenir le rôle de l'utilisateur
  const getUserRole = (): UserRole | null => {
    if (!isAuthenticated || !user) {
      return 'GUEST';
    }
    return user.role;
  };

  // Obtenir le nom d'affichage du rôle
  const getRoleDisplayName = (role?: UserRole): string => {
    const roleToCheck = role || getUserRole();
    
    const displayNames = {
      SUPER_ADMIN: 'Super Administrateur',
      ADMIN: 'Administrateur',
      MODERATOR: 'Modérateur',
      MEMBER: 'Membre',
      GUEST: 'Invité'
    };
    
    return displayNames[roleToCheck || 'GUEST'] || 'Inconnu';
  };

  // Obtenir la description du rôle
  const getRoleDescription = (role?: UserRole): string => {
    const roleToCheck = role || getUserRole();
    
    const descriptions = {
      SUPER_ADMIN: 'Accès complet au système avec tous les privilèges',
      ADMIN: 'Gestion complète des utilisateurs et du contenu',
      MODERATOR: 'Modération du contenu et gestion des utilisateurs de base',
      MEMBER: 'Accès aux fonctionnalités membres',
      GUEST: 'Accès en lecture seule'
    };
    
    return descriptions[roleToCheck || 'GUEST'] || 'Rôle non défini';
  };

  // Obtenir la couleur du rôle
  const getRoleColor = (role?: UserRole): string => {
    const roleToCheck = role || getUserRole();
    
    const colors = {
      SUPER_ADMIN: 'text-red-600 bg-red-100',
      ADMIN: 'text-blue-600 bg-blue-100',
      MODERATOR: 'text-green-600 bg-green-100',
      MEMBER: 'text-purple-600 bg-purple-100',
      GUEST: 'text-gray-600 bg-gray-100'
    };
    
    return colors[roleToCheck || 'GUEST'] || 'text-gray-600 bg-gray-100';
  };

  // Obtenir l'icône du rôle
  const getRoleIcon = (role?: UserRole): string => {
    const roleToCheck = role || getUserRole();
    
    const icons = {
      SUPER_ADMIN: '👑',
      ADMIN: '⚙️',
      MODERATOR: '🛡️',
      MEMBER: '👤',
      GUEST: '👋'
    };
    
    return icons[roleToCheck || 'GUEST'] || '❓';
  };

  // Vérifier si l'utilisateur peut gérer un autre utilisateur
  const canManageUser = (targetUserRole: UserRole): boolean => {
    const userLevel = getUserRoleLevel();
    const targetLevel = roleHierarchy[targetUserRole];
    
    // Un utilisateur ne peut gérer que des utilisateurs de niveau inférieur
    return userLevel > targetLevel;
  };

  // Obtenir tous les rôles disponibles
  const getAllRoles = (): UserRole[] => {
    return ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'MEMBER', 'GUEST'];
  };

  // Obtenir les rôles que l'utilisateur peut assigner
  const getAssignableRoles = (): UserRole[] => {
    const userLevel = getUserRoleLevel();
    
    return getAllRoles().filter(role => {
      const roleLevel = roleHierarchy[role];
      return userLevel > roleLevel;
    });
  };

  // Vérifier si un rôle peut être assigné
  const canAssignRole = (role: UserRole): boolean => {
    return getAssignableRoles().includes(role);
  };

  // Obtenir les statistiques des rôles
  const getRoleStats = () => {
    return {
      totalRoles: getAllRoles().length,
      userRole: getUserRole(),
      userRoleLevel: getUserRoleLevel(),
      canManageUsers: isModerator(),
      canAccessAdmin: isAdmin(),
      assignableRoles: getAssignableRoles().length
    };
  };

  return {
    getUserRoleLevel,
    hasRole,
    hasAnyRole,
    hasMinimumRole,
    isSuperAdmin,
    isAdmin,
    isModerator,
    isMember,
    isGuest,
    getUserRole,
    getRoleDisplayName,
    getRoleDescription,
    getRoleColor,
    getRoleIcon,
    canManageUser,
    getAllRoles,
    getAssignableRoles,
    canAssignRole,
    getRoleStats
  };
};

/**
 * Hook pour les informations de rôle de l'utilisateur actuel
 */
export const useUserRole = () => {
  const { 
    getUserRole, 
    getRoleDisplayName, 
    getRoleDescription, 
    getRoleColor, 
    getRoleIcon,
    isAdmin,
    isModerator,
    isMember,
    isGuest
  } = useRoles();
  
  const role = getUserRole();
  
  return {
    role,
    displayName: getRoleDisplayName(role),
    description: getRoleDescription(role),
    color: getRoleColor(role),
    icon: getRoleIcon(role),
    isAdmin: isAdmin(),
    isModerator: isModerator(),
    isMember: isMember(),
    isGuest: isGuest()
  };
};
