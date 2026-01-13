export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  department?: string;
  permissions: Permission[];
}

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR' | 'MEMBER' | 'GUEST';

export type Permission = 
  | 'users.create'
  | 'users.read'
  | 'users.update'
  | 'users.delete'
  | 'contacts.create'
  | 'contacts.read'
  | 'contacts.update'
  | 'contacts.delete'
  | 'donations.create'
  | 'donations.read'
  | 'donations.update'
  | 'donations.delete'
  | 'activities.create'
  | 'activities.read'
  | 'activities.update'
  | 'activities.delete'
  | 'events.create'
  | 'events.read'
  | 'events.update'
  | 'events.delete'
  | 'news.create'
  | 'news.read'
  | 'news.update'
  | 'news.delete'
  | 'gallery.create'
  | 'gallery.read'
  | 'gallery.update'
  | 'gallery.delete'
  | 'admin.access'
  | 'reports.view'
  | 'settings.manage';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone?: string;
  department?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

// Rôles et permissions par défaut
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    'users.create', 'users.read', 'users.update', 'users.delete',
    'contacts.create', 'contacts.read', 'contacts.update', 'contacts.delete',
    'donations.create', 'donations.read', 'donations.update', 'donations.delete',
    'activities.create', 'activities.read', 'activities.update', 'activities.delete',
    'events.create', 'events.read', 'events.update', 'events.delete',
    'news.create', 'news.read', 'news.update', 'news.delete',
    'gallery.create', 'gallery.read', 'gallery.update', 'gallery.delete',
    'admin.access', 'reports.view', 'settings.manage'
  ],
  ADMIN: [
    'users.create', 'users.read', 'users.update',
    'contacts.create', 'contacts.read', 'contacts.update', 'contacts.delete',
    'donations.create', 'donations.read', 'donations.update', 'donations.delete',
    'activities.create', 'activities.read', 'activities.update', 'activities.delete',
    'events.create', 'events.read', 'events.update', 'events.delete',
    'news.create', 'news.read', 'news.update', 'news.delete',
    'gallery.create', 'gallery.read', 'gallery.update', 'gallery.delete',
    'admin.access', 'reports.view'
  ],
  MODERATOR: [
    'contacts.read', 'contacts.update',
    'donations.read', 'donations.update',
    'activities.create', 'activities.read', 'activities.update',
    'events.create', 'events.read', 'events.update',
    'news.create', 'news.read', 'news.update',
    'gallery.create', 'gallery.read', 'gallery.update',
    'reports.view'
  ],
  MEMBER: [
    'contacts.create', 'contacts.read',
    'donations.create', 'donations.read',
    'activities.read',
    'events.read',
    'news.read',
    'gallery.read'
  ],
  GUEST: [
    'activities.read',
    'events.read',
    'news.read',
    'gallery.read'
  ]
};

// Comptes d'exemple
export const SAMPLE_ACCOUNTS: User[] = [
  {
    id: 'user_1',
    email: 'superadmin@imlil.ma',
    fullName: 'المدير العام',
    phone: '0661234567',
    role: 'SUPER_ADMIN',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    department: 'الإدارة',
    permissions: ROLE_PERMISSIONS.SUPER_ADMIN
  },
  {
    id: 'user_2',
    email: 'admin@imlil.ma',
    fullName: 'أحمد محمد',
    phone: '0661234568',
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    department: 'الإدارة',
    permissions: ROLE_PERMISSIONS.ADMIN
  },
  {
    id: 'user_3',
    email: 'moderator@imlil.ma',
    fullName: 'فاطمة الزهراء',
    phone: '0661234569',
    role: 'MODERATOR',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    department: 'التنظيم',
    permissions: ROLE_PERMISSIONS.MODERATOR
  },
  {
    id: 'user_4',
    email: 'member@imlil.ma',
    fullName: 'محمد الحسن',
    phone: '0661234570',
    role: 'MEMBER',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    department: 'الأعضاء',
    permissions: ROLE_PERMISSIONS.MEMBER
  },
  {
    id: 'user_5',
    email: 'guest@imlil.ma',
    fullName: 'زائر',
    role: 'GUEST',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    permissions: ROLE_PERMISSIONS.GUEST
  }
];

// Mots de passe par défaut (en production, utiliser des mots de passe sécurisés)
export const DEFAULT_PASSWORDS: Record<string, string> = {
  'superadmin@imlil.ma': 'SuperAdmin123!',
  'admin@imlil.ma': 'Admin123!',
  'moderator@imlil.ma': 'Moderator123!',
  'member@imlil.ma': 'Member123!',
  'guest@imlil.ma': 'Guest123!'
};
