import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, User, Settings, LogOut, Sun, Moon, Monitor, LogIn, UserPlus, Layout, Shield, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/useTheme";
import { usePWA } from "@/hooks/usePWA";
import GlobalSearch from "./GlobalSearch";
import NotificationCenter from "./NotificationCenter";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { members } = useApp();
  const { user, isAuthenticated, logout, hasPermission } = useAuth();
  const { theme, setTheme } = useTheme();
  const { isInstallable, installApp } = usePWA();

  const navItems = [
    { path: "/", label: "الرئيسية" },
    { path: "/activities", label: "الأنشطة" },
    { path: "/events", label: "الفعاليات" },
    { path: "/gallery", label: "معرض الصور" },
    { path: "/imider-gallery", label: "صور  إميضر" },
    { path: "/news", label: "الأخبار" },
    { path: "/contact", label: "اتصل بنا" },
    { path: "/donations", label: "التبرعات" },
    { path: "/wheelchairs", label: "كراسي متحركة" },
  ];

  const userNavItems = [
    { path: "/dashboard", label: "لوحة التحكم", icon: "Layout" },
    { path: "/profile", label: "الملف الشخصي", icon: "User" },
    { path: "/settings", label: "الإعدادات", icon: "Settings" },
  ];

  const adminNavItems = [
    { path: "/admin", label: "الإدارة", icon: "Shield" },
    { path: "/users", label: "إدارة المستخدمين", icon: "Users" },
    { path: "/statistics", label: "الإحصائيات", icon: "BarChart3" },
  ];

  const isAdmin = hasPermission('admin.access');

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      // Installation successful
    }
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-primary hover:text-primary/80 transition-colors">
            جمعية إمليل
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Global Search */}
            <GlobalSearch />
            
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  {theme === 'light' ? <Sun className="w-4 h-4" /> : 
                   theme === 'dark' ? <Moon className="w-4 h-4" /> : 
                   <Monitor className="w-4 h-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="w-4 h-4 ml-2" />
                  فاتح
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="w-4 h-4 ml-2" />
                  داكن
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Monitor className="w-4 h-4 ml-2" />
                  النظام
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Install App Button */}
            {isInstallable && (
              <Button size="sm" variant="outline" onClick={handleInstall}>
                تثبيت التطبيق
              </Button>
            )}
            
            {/* Notifications */}
            {isAuthenticated && <NotificationCenter />}
            
                {/* Authentication Buttons */}
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {user?.fullName}
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium">{user?.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                        <p className="text-xs text-muted-foreground">{user?.role}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard" className="flex items-center gap-2">
                          <Layout className="w-4 h-4" />
                          لوحة التحكم
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          الملف الشخصي
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          الإعدادات
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to="/admin" className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              الإدارة
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/users" className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              إدارة المستخدمين
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to="/statistics" className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4" />
                              الإحصائيات
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                        <LogOut className="w-4 h-4" />
                        تسجيل الخروج
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <LogIn className="w-4 h-4" />
                        تسجيل الدخول
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <UserPlus className="w-4 h-4 ml-1" />
                        انضم إلينا
                      </Button>
                    </Link>
                  </div>
                )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>

            {/* Mobile Navigation */}
            {isOpen && (
              <div className="md:hidden py-4 animate-fade-in border-t border-border">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block py-3 text-sm font-medium transition-colors hover:text-primary ${
                      location.pathname === item.path
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-border space-y-2">
                  {isAuthenticated ? (
                    <>
                      <div className="px-3 py-2 bg-muted rounded-lg">
                        <p className="text-sm font-medium">{user?.fullName}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full" size="sm">
                            <Settings className="w-4 h-4 ml-2" />
                            الإدارة
                          </Button>
                        </Link>
                      )}
                      <Button 
                        variant="destructive" 
                        className="w-full" 
                        size="sm"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 ml-2" />
                        تسجيل الخروج
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full" size="sm">
                          <LogIn className="w-4 h-4 ml-2" />
                          تسجيل الدخول
                        </Button>
                      </Link>
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full" size="sm">
                          <UserPlus className="w-4 h-4 ml-2" />
                          انضم إلينا
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
      </div>
    </nav>
  );
};

export default Navbar;
