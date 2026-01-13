export interface Notification {
  id: string;
  userId?: string; // null pour les notifications globales
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  category: 'activity' | 'event' | 'donation' | 'contact' | 'member' | 'system' | 'announcement';
  title: string;
  message: string;
  data?: Record<string, any>; // Données supplémentaires
  actionUrl?: string;
  actionText?: string;
  isRead: boolean;
  isImportant: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  expiresAt?: string; // Date d'expiration
  createdAt: string;
  updatedAt: string;
  readAt?: string;
  createdBy?: string; // ID de l'utilisateur qui a créé la notification
}

export interface NotificationTemplate {
  id: string;
  name: string;
  category: Notification['category'];
  type: Notification['type'];
  titleTemplate: string;
  messageTemplate: string;
  actionUrlTemplate?: string;
  actionTextTemplate?: string;
  isActive: boolean;
  variables: string[]; // Variables disponibles dans les templates
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  categories: {
    activity: boolean;
    event: boolean;
    donation: boolean;
    contact: boolean;
    member: boolean;
    system: boolean;
    announcement: boolean;
  };
  priority: {
    low: boolean;
    normal: boolean;
    high: boolean;
    urgent: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm
    end: string; // HH:mm
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byCategory: Record<string, number>;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  recentActivity: {
    last24h: number;
    last7d: number;
    last30d: number;
  };
}
