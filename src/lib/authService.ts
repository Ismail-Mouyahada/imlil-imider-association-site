import { User, LoginCredentials, RegisterData, UserRole, Permission, ROLE_PERMISSIONS, SAMPLE_ACCOUNTS, DEFAULT_PASSWORDS } from '@/types/auth';

class AuthService {
  private users: User[] = [];
  private currentUser: User | null = null;

  constructor() {
    this.loadUsers();
    this.loadCurrentUser();
  }

  private loadUsers() {
    try {
      const stored = localStorage.getItem('auth_users');
      if (stored) {
        this.users = JSON.parse(stored);
      } else {
        // Initialiser avec les comptes d'exemple
        this.users = [...SAMPLE_ACCOUNTS];
        this.saveUsers();
      }
    } catch (error) {
      console.error('Error loading users:', error);
      this.users = [...SAMPLE_ACCOUNTS];
    }
  }

  private saveUsers() {
    try {
      localStorage.setItem('auth_users', JSON.stringify(this.users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  private loadCurrentUser() {
    try {
      const stored = localStorage.getItem('auth_current_user');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
      this.currentUser = null;
    }
  }

  private saveCurrentUser(user: User | null) {
    try {
      if (user) {
        localStorage.setItem('auth_current_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('auth_current_user');
      }
      this.currentUser = user;
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  }

  // Authentification
  async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const user = this.users.find(u => 
        u.email === credentials.email && 
        u.isActive &&
        this.verifyPassword(credentials.email, credentials.password)
      );

      if (!user) {
        return { success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
      }

      // Mettre à jour la dernière connexion
      user.lastLogin = new Date().toISOString();
      user.updatedAt = new Date().toISOString();
      this.saveUsers();

      this.saveCurrentUser(user);
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' };
    }
  }

  async register(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = this.users.find(u => u.email === data.email);
      if (existingUser) {
        return { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' };
      }

      // Vérifier les mots de passe
      if (data.password !== data.confirmPassword) {
        return { success: false, error: 'كلمات المرور غير متطابقة' };
      }

      // Valider le mot de passe
      if (!this.validatePassword(data.password)) {
        return { success: false, error: 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل وتشمل أرقام وحروف' };
      }

      // Créer le nouvel utilisateur
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        role: 'MEMBER', // Nouveau membre par défaut
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        department: data.department,
        permissions: ROLE_PERMISSIONS.MEMBER
      };

      this.users.push(newUser);
      this.saveUsers();

      // Enregistrer le mot de passe
      this.savePassword(data.email, data.password);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'حدث خطأ أثناء إنشاء الحساب' };
    }
  }

  logout(): void {
    this.saveCurrentUser(null);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Gestion des mots de passe (simulation)
  private verifyPassword(email: string, password: string): boolean {
    const storedPassword = localStorage.getItem(`auth_password_${email}`);
    return storedPassword === password || DEFAULT_PASSWORDS[email] === password;
  }

  private savePassword(email: string, password: string): void {
    localStorage.setItem(`auth_password_${email}`, password);
  }

  private validatePassword(password: string): boolean {
    // Au moins 8 caractères, au moins une lettre et un chiffre
    return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  }

  // Gestion des utilisateurs (pour l'admin)
  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | null {
    return this.users.find(u => u.id === id) || null;
  }

  updateUser(id: string, updates: Partial<User>): boolean {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return false;

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveUsers();

    // Mettre à jour l'utilisateur actuel si c'est lui
    if (this.currentUser?.id === id) {
      this.saveCurrentUser(this.users[userIndex]);
    }

    return true;
  }

  deleteUser(id: string): boolean {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return false;

    // Ne pas permettre la suppression de l'utilisateur actuel
    if (this.currentUser?.id === id) {
      return false;
    }

    this.users.splice(userIndex, 1);
    this.saveUsers();
    return true;
  }

  createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'permissions'>): User | null {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      permissions: ROLE_PERMISSIONS[userData.role]
    };

    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  // Vérification des permissions
  hasPermission(permission: Permission): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.permissions.includes(permission);
  }

  hasRole(role: UserRole): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.role === role;
  }

  hasAnyRole(roles: UserRole[]): boolean {
    if (!this.currentUser) return false;
    return roles.includes(this.currentUser.role);
  }

  // Changement de mot de passe
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (!this.currentUser) {
      return { success: false, error: 'غير مسجل الدخول' };
    }

    if (!this.verifyPassword(this.currentUser.email, currentPassword)) {
      return { success: false, error: 'كلمة المرور الحالية غير صحيحة' };
    }

    if (!this.validatePassword(newPassword)) {
      return { success: false, error: 'كلمة المرور الجديدة يجب أن تحتوي على 8 أحرف على الأقل وتشمل أرقام وحروف' };
    }

    this.savePassword(this.currentUser.email, newPassword);
    return { success: true };
  }

  // Mise à jour du profil
  async updateProfile(updates: Partial<User>): Promise<{ success: boolean; error?: string }> {
    if (!this.currentUser) {
      return { success: false, error: 'غير مسجل الدخول' };
    }

    const success = this.updateUser(this.currentUser.id, updates);
    return { success, error: success ? undefined : 'فشل في تحديث الملف الشخصي' };
  }
}

export const authService = new AuthService();
