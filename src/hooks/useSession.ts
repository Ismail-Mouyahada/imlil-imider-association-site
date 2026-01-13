import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { User } from '@/types/auth';

interface SessionInfo {
  user: User | null;
  isAuthenticated: boolean;
  sessionStart: Date | null;
  lastActivity: Date | null;
  isExpired: boolean;
  timeRemaining: number | null;
}

/**
 * Hook pour la gestion des sessions utilisateur
 */
export const useSession = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [sessionInfo, setSessionInfo] = useState<SessionInfo>({
    user: null,
    isAuthenticated: false,
    sessionStart: null,
    lastActivity: null,
    isExpired: false,
    timeRemaining: null
  });

  // Durée de session en millisecondes (24 heures par défaut)
  const SESSION_DURATION = 24 * 60 * 60 * 1000;
  
  // Durée d'inactivité avant expiration (2 heures par défaut)
  const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000;

  // Mettre à jour l'activité de l'utilisateur
  const updateActivity = useCallback(() => {
    const now = new Date();
    setSessionInfo(prev => ({
      ...prev,
      lastActivity: now
    }));
    
    // Sauvegarder dans localStorage
    localStorage.setItem('lastActivity', now.toISOString());
  }, []);

  // Vérifier si la session a expiré
  const checkSessionExpiry = useCallback(() => {
    const lastActivityStr = localStorage.getItem('lastActivity');
    if (!lastActivityStr) return false;

    const lastActivity = new Date(lastActivityStr);
    const now = new Date();
    const timeSinceActivity = now.getTime() - lastActivity.getTime();

    return timeSinceActivity > INACTIVITY_TIMEOUT;
  }, [INACTIVITY_TIMEOUT]);

  // Calculer le temps restant avant expiration
  const calculateTimeRemaining = useCallback(() => {
    const lastActivityStr = localStorage.getItem('lastActivity');
    if (!lastActivityStr) return null;

    const lastActivity = new Date(lastActivityStr);
    const now = new Date();
    const timeSinceActivity = now.getTime() - lastActivity.getTime();
    const timeRemaining = INACTIVITY_TIMEOUT - timeSinceActivity;

    return Math.max(0, timeRemaining);
  }, [INACTIVITY_TIMEOUT]);

  // Initialiser la session
  useEffect(() => {
    if (isAuthenticated && user) {
      const now = new Date();
      const sessionStart = localStorage.getItem('sessionStart');
      
      setSessionInfo({
        user,
        isAuthenticated: true,
        sessionStart: sessionStart ? new Date(sessionStart) : now,
        lastActivity: now,
        isExpired: false,
        timeRemaining: INACTIVITY_TIMEOUT
      });

      // Sauvegarder le début de session
      if (!sessionStart) {
        localStorage.setItem('sessionStart', now.toISOString());
      }
      
      // Sauvegarder l'activité
      localStorage.setItem('lastActivity', now.toISOString());
    } else {
      setSessionInfo({
        user: null,
        isAuthenticated: false,
        sessionStart: null,
        lastActivity: null,
        isExpired: false,
        timeRemaining: null
      });
    }
  }, [isAuthenticated, user, INACTIVITY_TIMEOUT]);

  // Vérifier l'expiration de la session
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkInterval = setInterval(() => {
      const isExpired = checkSessionExpiry();
      const timeRemaining = calculateTimeRemaining();

      setSessionInfo(prev => ({
        ...prev,
        isExpired,
        timeRemaining
      }));

      if (isExpired) {
        logout();
      }
    }, 60000); // Vérifier toutes les minutes

    return () => clearInterval(checkInterval);
  }, [isAuthenticated, checkSessionExpiry, calculateTimeRemaining, logout]);

  // Écouter les événements d'activité
  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [isAuthenticated, updateActivity]);

  // Prolonger la session
  const extendSession = useCallback(() => {
    updateActivity();
  }, [updateActivity]);

  // Forcer la déconnexion
  const forceLogout = useCallback(() => {
    logout();
  }, [logout]);

  // Obtenir les informations de session
  const getSessionInfo = useCallback(() => {
    return sessionInfo;
  }, [sessionInfo]);

  // Vérifier si la session est valide
  const isSessionValid = useCallback(() => {
    return isAuthenticated && !sessionInfo.isExpired;
  }, [isAuthenticated, sessionInfo.isExpired]);

  // Obtenir le temps de session écoulé
  const getSessionDuration = useCallback(() => {
    if (!sessionInfo.sessionStart) return 0;
    
    const now = new Date();
    return now.getTime() - sessionInfo.sessionStart.getTime();
  }, [sessionInfo.sessionStart]);

  // Obtenir le temps d'inactivité
  const getInactivityTime = useCallback(() => {
    if (!sessionInfo.lastActivity) return 0;
    
    const now = new Date();
    return now.getTime() - sessionInfo.lastActivity.getTime();
  }, [sessionInfo.lastActivity]);

  // Formater le temps restant
  const formatTimeRemaining = useCallback((milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }, []);

  return {
    sessionInfo,
    extendSession,
    forceLogout,
    getSessionInfo,
    isSessionValid,
    getSessionDuration,
    getInactivityTime,
    formatTimeRemaining,
    updateActivity
  };
};

/**
 * Hook pour les avertissements de session
 */
export const useSessionWarnings = () => {
  const { sessionInfo, formatTimeRemaining } = useSession();
  const [showWarning, setShowWarning] = useState(false);

  // Afficher un avertissement 5 minutes avant expiration
  const WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    if (sessionInfo.timeRemaining !== null) {
      const shouldShowWarning = sessionInfo.timeRemaining <= WARNING_THRESHOLD && sessionInfo.timeRemaining > 0;
      setShowWarning(shouldShowWarning);
    }
  }, [sessionInfo.timeRemaining, WARNING_THRESHOLD]);

  const getWarningMessage = () => {
    if (!sessionInfo.timeRemaining) return '';
    
    const timeRemaining = formatTimeRemaining(sessionInfo.timeRemaining);
    return `Votre session expirera dans ${timeRemaining}. Cliquez pour prolonger.`;
  };

  return {
    showWarning,
    warningMessage: getWarningMessage(),
    timeRemaining: sessionInfo.timeRemaining
  };
};
