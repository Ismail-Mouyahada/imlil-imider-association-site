import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { User, UserRole, ROLE_PERMISSIONS } from '@/types/auth';
import { authService } from '@/lib/authService';

const UserManagement: React.FC = () => {
  const { user: currentUser, hasPermission } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Formulaire pour créer/modifier un utilisateur
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    role: 'MEMBER' as UserRole,
    department: '',
    isActive: true,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const loadUsers = () => {
    const allUsers = authService.getAllUsers();
    setUsers(allUsers);
  };

  const filterUsers = () => {
    let filtered = users;

    // Filtrer par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrer par rôle
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleCreateUser = async () => {
    if (!hasPermission('users.create')) {
      toast({
        title: 'غير مصرح',
        description: 'ليس لديك صلاحية لإنشاء المستخدمين',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const newUser = authService.createUser(formData);
      if (newUser) {
        loadUsers();
        resetForm();
        setIsDialogOpen(false);
        toast({
          title: 'تم إنشاء المستخدم',
          description: `تم إنشاء المستخدم ${newUser.fullName} بنجاح`,
        });
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في إنشاء المستخدم',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !hasPermission('users.update')) {
      toast({
        title: 'غير مصرح',
        description: 'ليس لديك صلاحية لتعديل المستخدمين',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const success = authService.updateUser(editingUser.id, formData);
      if (success) {
        loadUsers();
        resetForm();
        setIsDialogOpen(false);
        toast({
          title: 'تم تحديث المستخدم',
          description: `تم تحديث المستخدم ${editingUser.fullName} بنجاح`,
        });
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'فشل في تحديث المستخدم',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!hasPermission('users.delete')) {
      toast({
        title: 'غير مصرح',
        description: 'ليس لديك صلاحية لحذف المستخدمين',
        variant: 'destructive',
      });
      return;
    }

    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (user.id === currentUser?.id) {
      toast({
        title: 'خطأ',
        description: 'لا يمكنك حذف حسابك الخاص',
        variant: 'destructive',
      });
      return;
    }

    if (window.confirm(`هل أنت متأكد من حذف المستخدم ${user.fullName}؟`)) {
      const success = authService.deleteUser(userId);
      if (success) {
        loadUsers();
        toast({
          title: 'تم حذف المستخدم',
          description: `تم حذف المستخدم ${user.fullName} بنجاح`,
        });
      }
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    if (!hasPermission('users.update')) {
      toast({
        title: 'غير مصرح',
        description: 'ليس لديك صلاحية لتعديل المستخدمين',
        variant: 'destructive',
      });
      return;
    }

    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (user.id === currentUser?.id) {
      toast({
        title: 'خطأ',
        description: 'لا يمكنك تعديل حالة حسابك الخاص',
        variant: 'destructive',
      });
      return;
    }

    const success = authService.updateUser(userId, { isActive: !user.isActive });
    if (success) {
      loadUsers();
      toast({
        title: 'تم تحديث حالة المستخدم',
        description: `تم ${user.isActive ? 'إلغاء تفعيل' : 'تفعيل'} المستخدم ${user.fullName}`,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      fullName: '',
      phone: '',
      role: 'MEMBER',
      department: '',
      isActive: true,
    });
    setEditingUser(null);
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      fullName: user.fullName,
      phone: user.phone || '',
      role: user.role,
      department: user.department || '',
      isActive: user.isActive,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colors: Record<UserRole, string> = {
      SUPER_ADMIN: 'bg-red-100 text-red-800',
      ADMIN: 'bg-orange-100 text-orange-800',
      MODERATOR: 'bg-blue-100 text-blue-800',
      MEMBER: 'bg-green-100 text-green-800',
      GUEST: 'bg-gray-100 text-gray-800',
    };
    return colors[role];
  };

  const getRoleName = (role: UserRole) => {
    const names: Record<UserRole, string> = {
      SUPER_ADMIN: 'مدير عام',
      ADMIN: 'مدير',
      MODERATOR: 'مشرف',
      MEMBER: 'عضو',
      GUEST: 'زائر',
    };
    return names[role];
  };

  if (!hasPermission('users.read')) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              ليس لديك صلاحية لعرض المستخدمين
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            إدارة المستخدمين
          </h2>
          <p className="text-muted-foreground">
            إدارة المستخدمين والأدوار والصلاحيات
          </p>
        </div>
        {hasPermission('users.create') && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة مستخدم
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">الاسم الكامل</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="أدخل الاسم الكامل"
                  />
                </div>
                <div>
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="أدخل البريد الإلكتروني"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="أدخل رقم الهاتف"
                  />
                </div>
                <div>
                  <Label htmlFor="role">الدور</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEMBER">عضو</SelectItem>
                      <SelectItem value="MODERATOR">مشرف</SelectItem>
                      <SelectItem value="ADMIN">مدير</SelectItem>
                      <SelectItem value="SUPER_ADMIN">مدير عام</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">القسم</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="أدخل القسم"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">نشط</Label>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    إلغاء
                  </Button>
                  <Button
                    onClick={editingUser ? handleUpdateUser : handleCreateUser}
                    disabled={loading}
                  >
                    {loading ? 'جاري الحفظ...' : editingUser ? 'تحديث' : 'إنشاء'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">البحث</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="search"
                  placeholder="البحث بالاسم أو البريد الإلكتروني..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="roleFilter">الدور</Label>
              <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole | 'ALL')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">جميع الأدوار</SelectItem>
                  <SelectItem value="SUPER_ADMIN">مدير عام</SelectItem>
                  <SelectItem value="ADMIN">مدير</SelectItem>
                  <SelectItem value="MODERATOR">مشرف</SelectItem>
                  <SelectItem value="MEMBER">عضو</SelectItem>
                  <SelectItem value="GUEST">زائر</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            المستخدمون ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المستخدم</TableHead>
                <TableHead>الدور</TableHead>
                <TableHead>القسم</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>آخر دخول</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {getRoleName(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.department && (
                      <div className="flex items-center gap-1 text-sm">
                        <Building2 className="w-3 h-3" />
                        {user.department}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.isActive ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <UserCheck className="w-3 h-3 ml-1" />
                          نشط
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-red-100 text-red-800">
                          <UserX className="w-3 h-3 ml-1" />
                          غير نشط
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? (
                      <div className="text-sm text-muted-foreground">
                        {new Date(user.lastLogin).toLocaleDateString('ar-MA')}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">لم يسجل دخول</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {hasPermission('users.update') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {hasPermission('users.update') && user.id !== currentUser?.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.id)}
                        >
                          {user.isActive ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                      {hasPermission('users.delete') && user.id !== currentUser?.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default UserManagement;
