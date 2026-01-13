import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '@/lib/notificationService';
import { Notification, NotificationSettings, NotificationStats } from '@/types/notification';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id;

  // Charger les notifications de l'utilisateur
  const loadNotifications = useCallback(async (options?: {
    category?: Notification['category'];
    type?: Notification['type'];
    priority?: Notification['priority'];
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const userNotifications = notificationService.getUserNotifications(userId, options);
      setNotifications(userNotifications);
    } catch (err) {
      setError('فشل في تحميل الإشعارات');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Charger les paramètres de notification
  const loadSettings = useCallback(async () => {
    if (!userId) return;

    try {
      const userSettings = notificationService.getUserSettings(userId);
      setSettings(userSettings);
    } catch (err) {
      console.error('Error loading notification settings:', err);
    }
  }, [userId]);

  // Charger les statistiques
  const loadStats = useCallback(async () => {
    if (!userId) return;

    try {
      const notificationStats = notificationService.getNotificationStats(userId);
      setStats(notificationStats);
    } catch (err) {
      console.error('Error loading notification stats:', err);
    }
  }, [userId]);

  // Marquer une notification comme lue
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const success = notificationService.markAsRead(notificationId);
      if (success) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)
        );
        await loadStats(); // Recharger les statistiques
      }
      return success;
    } catch (err) {
      setError('فشل في تحديث الإشعار');
      console.error('Error marking notification as read:', err);
      return false;
    }
  }, [loadStats]);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    if (!userId) return;

    try {
      const count = notificationService.markAllAsRead(userId);
      if (count > 0) {
        setNotifications(prev => 
          prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
        );
        await loadStats();
      }
      return count;
    } catch (err) {
      setError('فشل في تحديث الإشعارات');
      console.error('Error marking all notifications as read:', err);
      return 0;
    }
  }, [userId, loadStats]);

  // Supprimer une notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const success = notificationService.deleteNotification(notificationId);
      if (success) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        await loadStats();
      }
      return success;
    } catch (err) {
      setError('فشل في حذف الإشعار');
      console.error('Error deleting notification:', err);
      return false;
    }
  }, [loadStats]);

  // Supprimer toutes les notifications
  const deleteAllNotifications = useCallback(async () => {
    if (!userId) return;

    try {
      const count = notificationService.deleteAllUserNotifications(userId);
      setNotifications([]);
      await loadStats();
      return count;
    } catch (err) {
      setError('فشل في حذف الإشعارات');
      console.error('Error deleting all notifications:', err);
      return 0;
    }
  }, [userId, loadStats]);

  // Mettre à jour les paramètres
  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    if (!userId) return;

    try {
      const updatedSettings = notificationService.updateUserSettings(userId, newSettings);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      setError('فشل في تحديث الإعدادات');
      console.error('Error updating notification settings:', err);
      return null;
    }
  }, [userId]);

  // Créer une notification personnalisée
  const createNotification = useCallback(async (notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newNotification = notificationService.createNotification(notification);
      if (userId && (notification.userId === userId || notification.userId === null)) {
        setNotifications(prev => [newNotification, ...prev]);
        await loadStats();
      }
      return newNotification;
    } catch (err) {
      setError('فشل في إنشاء الإشعار');
      console.error('Error creating notification:', err);
      return null;
    }
  }, [userId, loadStats]);

  // Nettoyer les notifications expirées
  const cleanupExpired = useCallback(async () => {
    try {
      const count = notificationService.cleanupExpiredNotifications();
      if (count > 0) {
        await loadNotifications();
        await loadStats();
      }
      return count;
    } catch (err) {
      console.error('Error cleaning up expired notifications:', err);
      return 0;
    }
  }, [loadNotifications, loadStats]);

  // Charger les données initiales
  useEffect(() => {
    if (userId) {
      loadNotifications();
      loadSettings();
      loadStats();
    }
  }, [userId, loadNotifications, loadSettings, loadStats]);

  // Nettoyer les notifications expirées au chargement
  useEffect(() => {
    cleanupExpired();
  }, [cleanupExpired]);

  return {
    notifications,
    stats,
    settings,
    loading,
    error,
    loadNotifications,
    loadSettings,
    loadStats,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    updateSettings,
    createNotification,
    cleanupExpired
  };
};

// Hook pour les notifications en temps réel
export const useRealtimeNotifications = () => {
  const { notifications, loadNotifications, loadStats } = useNotifications();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Simuler une connexion en temps réel
    const interval = setInterval(() => {
      loadNotifications();
      loadStats();
    }, 30000); // Vérifier toutes les 30 secondes

    setIsConnected(true);

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [loadNotifications, loadStats]);

  return {
    notifications,
    isConnected
  };
};

// Hook pour les paramètres de notification
export const useNotificationSettings = () => {
  const { settings, updateSettings, loading, error } = useNotifications();

  const toggleCategory = async (category: keyof NotificationSettings['categories']) => {
    if (!settings) return;

    const newSettings = {
      ...settings,
      categories: {
        ...settings.categories,
        [category]: !settings.categories[category]
      }
    };

    return await updateSettings(newSettings);
  };

  const togglePriority = async (priority: keyof NotificationSettings['priority']) => {
    if (!settings) return;

    const newSettings = {
      ...settings,
      priority: {
        ...settings.priority,
        [priority]: !settings.priority[priority]
      }
    };

    return await updateSettings(newSettings);
  };

  const toggleNotificationType = async (type: 'emailNotifications' | 'pushNotifications' | 'smsNotifications') => {
    if (!settings) return;

    const newSettings = {
      ...settings,
      [type]: !settings[type]
    };

    return await updateSettings(newSettings);
  };

  const updateQuietHours = async (quietHours: Partial<NotificationSettings['quietHours']>) => {
    if (!settings) return;

    const newSettings = {
      ...settings,
      quietHours: {
        ...settings.quietHours,
        ...quietHours
      }
    };

    return await updateSettings(newSettings);
  };

  return {
    settings,
    loading,
    error,
    toggleCategory,
    togglePriority,
    toggleNotificationType,
    updateQuietHours,
    updateSettings
  };
};