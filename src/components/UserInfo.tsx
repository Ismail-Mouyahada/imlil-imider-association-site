import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  useCurrentUser, 
  useIsAuthenticated, 
  useUserRole, 
  useIsAdmin, 
  useIsModerator,
  useCanAccessAdmin,
  useCanManageUsers,
  useCanViewStats
} from '@/hooks/useAuth';
import { useSession } from '@/hooks/useSession';
import { User, Shield, Clock, Activity } from 'lucide-react';

const UserInfo: React.FC = () => {
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();
  const userRole = useUserRole();
  const isAdmin = useIsAdmin();
  const isModerator = useIsModerator();
  const canAccessAdmin = useCanAccessAdmin();
  const canManageUsers = useCanManageUsers();
  const canViewStats = useCanViewStats();
  const { getSessionDuration, formatTimeRemaining } = useSession();

  if (!isAuthenticated || !user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Non connecté</p>
        </CardContent>
      </Card>
    );
  }

  const sessionDuration = getSessionDuration();
  const sessionTime = formatTimeRemaining(sessionDuration);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Informations Utilisateur
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informations de base */}
        <div className="space-y-2">
          <h3 className="font-semibold">Informations de base</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Nom:</span>
              <span className="ml-2 font-medium">{user.fullName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <span className="ml-2 font-medium">{user.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Rôle:</span>
              <Badge className="ml-2" variant={userRole?.isAdmin ? "default" : "outline"}>
                <Shield className="w-3 h-3 ml-1" />
                {userRole?.displayName}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">Statut:</span>
              <Badge 
                className="ml-2" 
                variant={user.isActive ? "default" : "destructive"}
              >
                {user.isActive ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="space-y-2">
          <h3 className="font-semibold">Permissions</h3>
          <div className="flex flex-wrap gap-2">
            {canAccessAdmin && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Admin
              </Badge>
            )}
            {canManageUsers && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <User className="w-3 h-3" />
                Gestion Utilisateurs
              </Badge>
            )}
            {canViewStats && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Statistiques
              </Badge>
            )}
            {isModerator && (
              <Badge variant="outline">
                Modérateur
              </Badge>
            )}
          </div>
        </div>

        {/* Session */}
        <div className="space-y-2">
          <h3 className="font-semibold">Session</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Durée de session: {sessionTime}</span>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="space-y-2">
          <h3 className="font-semibold">Actions rapides</h3>
          <div className="flex flex-wrap gap-2">
            {canAccessAdmin && (
              <Button size="sm" variant="outline" asChild>
                <a href="/admin">
                  <Shield className="w-4 h-4 ml-1" />
                  Administration
                </a>
              </Button>
            )}
            <Button size="sm" variant="outline" asChild>
              <a href="/profile">
                <User className="w-4 h-4 ml-1" />
                Profil
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
