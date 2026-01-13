import { Notification, NotificationTemplate, NotificationSettings, NotificationStats } from '@/types/notification';
import { User } from '@/types/auth';

class NotificationService {
  private notifications: Notification[] = [];
  private templates: NotificationTemplate[] = [];
  private settings: Map<string, NotificationSettings> = new Map();

  constructor() {
    this.loadData();
    this.initializeTemplates();
  }

  private loadData() {
    try {
      // Charger les notifications
      const storedNotifications = localStorage.getItem('notifications');
      if (storedNotifications) {
        this.notifications = JSON.parse(storedNotifications);
      }

      // Charger les templates
      const storedTemplates = localStorage.getItem('notification_templates');
      if (storedTemplates) {
        this.templates = JSON.parse(storedTemplates);
      }

      // Charger les paramètres
      const storedSettings = localStorage.getItem('notification_settings');
      if (storedSettings) {
        const settingsArray = JSON.parse(storedSettings);
        settingsArray.forEach((setting: NotificationSettings) => {
          this.settings.set(setting.userId, setting);
        });
      }
    } catch (error) {
      console.error('Error loading notification data:', error);
    }
  }

  private saveData() {
    try {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
      localStorage.setItem('notification_templates', JSON.stringify(this.templates));
      localStorage.setItem('notification_settings', JSON.stringify(Array.from(this.settings.values())));
    } catch (error) {
      console.error('Error saving notification data:', error);
    }
  }

  private initializeTemplates() {
    if (this.templates.length === 0) {
      this.templates = [
        {
          id: 'activity_created',
          name: 'نشاط جديد',
          category: 'activity',
          type: 'info',
          titleTemplate: 'تم إنشاء نشاط جديد: {activityTitle}',
          messageTemplate: 'تم إنشاء نشاط جديد "{activityTitle}" في {activityDate}. {description}',
          actionUrlTemplate: '/activities/{activityId}',
          actionTextTemplate: 'عرض النشاط',
          isActive: true,
          variables: ['activityTitle', 'activityDate', 'description', 'activityId'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'event_created',
          name: 'فعالية جديدة',
          category: 'event',
          type: 'info',
          titleTemplate: 'فعالية جديدة: {eventTitle}',
          messageTemplate: 'تم إضافة فعالية جديدة "{eventTitle}" في {eventDate} في {location}.',
          actionUrlTemplate: '/events/{eventId}',
          actionTextTemplate: 'عرض الفعالية',
          isActive: true,
          variables: ['eventTitle', 'eventDate', 'location', 'eventId'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'donation_received',
          name: 'تبرع جديد',
          category: 'donation',
          type: 'success',
          titleTemplate: 'تم استلام تبرع جديد',
          messageTemplate: 'تم استلام تبرع بقيمة {amount} {currency} من {donorName}.',
          actionUrlTemplate: '/donations/{donationId}',
          actionTextTemplate: 'عرض التبرع',
          isActive: true,
          variables: ['amount', 'currency', 'donorName', 'donationId'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'member_registered',
          name: 'عضو جديد',
          category: 'member',
          type: 'info',
          titleTemplate: 'عضو جديد انضم للجمعية',
          messageTemplate: 'انضم {memberName} كعضو جديد في الجمعية.',
          actionUrlTemplate: '/members/{memberId}',
          actionTextTemplate: 'عرض العضو',
          isActive: true,
          variables: ['memberName', 'memberId'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'contact_message',
          name: 'رسالة جديدة',
          category: 'contact',
          type: 'info',
          titleTemplate: 'رسالة جديدة من {senderName}',
          messageTemplate: 'رسالة جديدة من {senderName} حول "{subject}".',
          actionUrlTemplate: '/admin/contacts/{contactId}',
          actionTextTemplate: 'عرض الرسالة',
          isActive: true,
          variables: ['senderName', 'subject', 'contactId'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'system_maintenance',
          name: 'صيانة النظام',
          category: 'system',
          type: 'warning',
          titleTemplate: 'صيانة مجدولة للنظام',
          messageTemplate: 'سيتم إجراء صيانة للنظام في {maintenanceDate}. قد يكون هناك انقطاع في الخدمة.',
          actionUrlTemplate: '/maintenance',
          actionTextTemplate: 'تفاصيل الصيانة',
          isActive: true,
          variables: ['maintenanceDate'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'announcement',
          name: 'إعلان عام',
          category: 'announcement',
          type: 'info',
          titleTemplate: '{announcementTitle}',
          messageTemplate: '{announcementMessage}',
          actionUrlTemplate: '/announcements/{announcementId}',
          actionTextTemplate: 'عرض الإعلان',
          isActive: true,
          variables: ['announcementTitle', 'announcementMessage', 'announcementId'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.saveData();
    }
  }

  // Créer une notification
  createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.notifications.push(newNotification);
    this.saveData();
    return newNotification;
  }

  // Créer une notification à partir d'un template
  createNotificationFromTemplate(
    templateId: string,
    userId: string | null,
    variables: Record<string, any>,
    options?: {
      priority?: Notification['priority'];
      isImportant?: boolean;
      expiresAt?: string;
    }
  ): Notification | null {
    const template = this.templates.find(t => t.id === templateId && t.isActive);
    if (!template) return null;

    const title = this.processTemplate(template.titleTemplate, variables);
    const message = this.processTemplate(template.messageTemplate, variables);
    const actionUrl = template.actionUrlTemplate ? this.processTemplate(template.actionUrlTemplate, variables) : undefined;
    const actionText = template.actionTextTemplate ? this.processTemplate(template.actionTextTemplate, variables) : undefined;

    return this.createNotification({
      userId,
      type: template.type,
      category: template.category,
      title,
      message,
      actionUrl,
      actionText,
      data: variables,
      isRead: false,
      isImportant: options?.isImportant || false,
      priority: options?.priority || 'normal',
      expiresAt: options?.expiresAt,
      createdBy: 'system'
    });
  }

  private processTemplate(template: string, variables: Record<string, any>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return variables[key] || match;
    });
  }

  // Obtenir les notifications d'un utilisateur
  getUserNotifications(userId: string, options?: {
    category?: Notification['category'];
    type?: Notification['type'];
    priority?: Notification['priority'];
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
  }): Notification[] {
    let filtered = this.notifications.filter(n => 
      n.userId === userId || n.userId === null // Notifications globales
    );

    if (options?.category) {
      filtered = filtered.filter(n => n.category === options.category);
    }

    if (options?.type) {
      filtered = filtered.filter(n => n.type === options.type);
    }

    if (options?.priority) {
      filtered = filtered.filter(n => n.priority === options.priority);
    }

    if (options?.unreadOnly) {
      filtered = filtered.filter(n => !n.isRead);
    }

    // Filtrer les notifications expirées
    filtered = filtered.filter(n => !n.expiresAt || new Date(n.expiresAt) > new Date());

    // Trier par priorité et date
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
      const aPriority = priorityOrder[a.priority] || 0;
      const bPriority = priorityOrder[b.priority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (options?.offset) {
      filtered = filtered.slice(options.offset);
    }

    if (options?.limit) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  // Marquer une notification comme lue
  markAsRead(notificationId: string): boolean {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      notification.isRead = true;
      notification.readAt = new Date().toISOString();
      notification.updatedAt = new Date().toISOString();
      this.saveData();
      return true;
    }
    return false;
  }

  // Marquer toutes les notifications comme lues
  markAllAsRead(userId: string): number {
    const userNotifications = this.notifications.filter(n => 
      (n.userId === userId || n.userId === null) && !n.isRead
    );
    
    const now = new Date().toISOString();
    userNotifications.forEach(notification => {
      notification.isRead = true;
      notification.readAt = now;
      notification.updatedAt = now;
    });

    this.saveData();
    return userNotifications.length;
  }

  // Supprimer une notification
  deleteNotification(notificationId: string): boolean {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.notifications.splice(index, 1);
      this.saveData();
      return true;
    }
    return false;
  }

  // Supprimer toutes les notifications d'un utilisateur
  deleteAllUserNotifications(userId: string): number {
    const initialLength = this.notifications.length;
    this.notifications = this.notifications.filter(n => n.userId !== userId);
    this.saveData();
    return initialLength - this.notifications.length;
  }

  // Obtenir les statistiques des notifications
  getNotificationStats(userId?: string): NotificationStats {
    let notifications = this.notifications;
    
    if (userId) {
      notifications = notifications.filter(n => n.userId === userId || n.userId === null);
    }

    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const byCategory: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const byPriority: Record<string, number> = {};

    notifications.forEach(notification => {
      byCategory[notification.category] = (byCategory[notification.category] || 0) + 1;
      byType[notification.type] = (byType[notification.type] || 0) + 1;
      byPriority[notification.priority] = (byPriority[notification.priority] || 0) + 1;
    });

    return {
      total: notifications.length,
      unread: notifications.filter(n => !n.isRead).length,
      byCategory,
      byType,
      byPriority,
      recentActivity: {
        last24h: notifications.filter(n => new Date(n.createdAt) >= last24h).length,
        last7d: notifications.filter(n => new Date(n.createdAt) >= last7d).length,
        last30d: notifications.filter(n => new Date(n.createdAt) >= last30d).length
      }
    };
  }

  // Gérer les paramètres de notification
  getUserSettings(userId: string): NotificationSettings {
    return this.settings.get(userId) || this.getDefaultSettings(userId);
  }

  updateUserSettings(userId: string, settings: Partial<NotificationSettings>): NotificationSettings {
    const currentSettings = this.getUserSettings(userId);
    const updatedSettings: NotificationSettings = {
      ...currentSettings,
      ...settings,
      userId,
      updatedAt: new Date().toISOString()
    };

    this.settings.set(userId, updatedSettings);
    this.saveData();
    return updatedSettings;
  }

  private getDefaultSettings(userId: string): NotificationSettings {
    return {
      userId,
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      categories: {
        activity: true,
        event: true,
        donation: true,
        contact: true,
        member: true,
        system: true,
        announcement: true
      },
      priority: {
        low: true,
        normal: true,
        high: true,
        urgent: true
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
        timezone: 'Africa/Casablanca'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // Nettoyer les notifications expirées
  cleanupExpiredNotifications(): number {
    const now = new Date();
    const initialLength = this.notifications.length;
    
    this.notifications = this.notifications.filter(n => 
      !n.expiresAt || new Date(n.expiresAt) > now
    );
    
    this.saveData();
    return initialLength - this.notifications.length;
  }

  // Générer un ID unique
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Événements automatiques
  onActivityCreated(activity: any) {
    this.createNotificationFromTemplate('activity_created', null, {
      activityTitle: activity.title,
      activityDate: activity.date,
      description: activity.description,
      activityId: activity.id
    });
  }

  onEventCreated(event: any) {
    this.createNotificationFromTemplate('event_created', null, {
      eventTitle: event.title,
      eventDate: event.date,
      location: event.location,
      eventId: event.id
    });
  }

  onDonationReceived(donation: any) {
    this.createNotificationFromTemplate('donation_received', null, {
      amount: donation.amount,
      currency: donation.currency || 'MAD',
      donorName: donation.donorName,
      donationId: donation.id
    });
  }

  onMemberRegistered(member: any) {
    this.createNotificationFromTemplate('member_registered', null, {
      memberName: member.fullName,
      memberId: member.id
    });
  }

  onContactMessage(contact: any) {
    this.createNotificationFromTemplate('contact_message', null, {
      senderName: contact.name,
      subject: contact.subject,
      contactId: contact.id
    });
  }

  onSystemMaintenance(maintenanceDate: string) {
    this.createNotificationFromTemplate('system_maintenance', null, {
      maintenanceDate
    }, {
      priority: 'high',
      isImportant: true
    });
  }

  createAnnouncement(title: string, message: string, announcementId: string, options?: {
    priority?: Notification['priority'];
    isImportant?: boolean;
    expiresAt?: string;
  }) {
    this.createNotificationFromTemplate('announcement', null, {
      announcementTitle: title,
      announcementMessage: message,
      announcementId
    }, options);
  }
}

export const notificationService = new NotificationService();
