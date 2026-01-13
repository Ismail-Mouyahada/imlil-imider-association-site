import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme, useThemeColors, useThemeClasses } from '@/hooks/useTheme';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';

const ThemeTest: React.FC = () => {
  const { theme, setTheme, resolvedTheme, isDark, isLight, isSystem, toggleTheme } = useTheme();
  const colors = useThemeColors();
  const classes = useThemeClasses();

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Test des Thèmes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contrôles du thème */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Contrôles du Thème</h3>
            <div className="flex gap-2">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
                className="flex items-center gap-2"
              >
                <Sun className="w-4 h-4" />
                Clair
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
                className="flex items-center gap-2"
              >
                <Moon className="w-4 h-4" />
                Sombre
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => setTheme('system')}
                className="flex items-center gap-2"
              >
                <Monitor className="w-4 h-4" />
                Système
              </Button>
              <Button
                variant="outline"
                onClick={toggleTheme}
                className="flex items-center gap-2"
              >
                Basculer
              </Button>
            </div>
          </div>

          {/* État actuel */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">État Actuel</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Badge variant="outline">
                Thème: {theme}
              </Badge>
              <Badge variant="outline">
                Résolu: {resolvedTheme}
              </Badge>
              <Badge variant={isDark ? "default" : "outline"}>
                Sombre: {isDark ? 'Oui' : 'Non'}
              </Badge>
              <Badge variant={isLight ? "default" : "outline"}>
                Clair: {isLight ? 'Oui' : 'Non'}
              </Badge>
            </div>
            {isSystem && (
              <Badge variant="secondary">
                Utilise le thème système
              </Badge>
            )}
          </div>

          {/* Classes CSS */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Classes CSS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <code className="bg-muted px-2 py-1 rounded">{classes.root}</code>
                <p className="text-muted-foreground">Classe racine</p>
              </div>
              <div>
                <code className="bg-muted px-2 py-1 rounded">{classes.background}</code>
                <p className="text-muted-foreground">Arrière-plan</p>
              </div>
              <div>
                <code className="bg-muted px-2 py-1 rounded">{classes.foreground}</code>
                <p className="text-muted-foreground">Premier plan</p>
              </div>
              <div>
                <code className="bg-muted px-2 py-1 rounded">{classes.card}</code>
                <p className="text-muted-foreground">Carte</p>
              </div>
            </div>
          </div>

          {/* Couleurs */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Couleurs</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="space-y-1">
                <div 
                  className="w-full h-8 rounded border"
                  style={{ backgroundColor: colors.background }}
                ></div>
                <p className="text-xs text-muted-foreground">Background</p>
              </div>
              <div className="space-y-1">
                <div 
                  className="w-full h-8 rounded border"
                  style={{ backgroundColor: colors.foreground }}
                ></div>
                <p className="text-xs text-muted-foreground">Foreground</p>
              </div>
              <div className="space-y-1">
                <div 
                  className="w-full h-8 rounded border"
                  style={{ backgroundColor: colors.primary }}
                ></div>
                <p className="text-xs text-muted-foreground">Primary</p>
              </div>
              <div className="space-y-1">
                <div 
                  className="w-full h-8 rounded border"
                  style={{ backgroundColor: colors.secondary }}
                ></div>
                <p className="text-xs text-muted-foreground">Secondary</p>
              </div>
            </div>
          </div>

          {/* Test des composants */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Test des Composants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Carte de Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Ceci est un exemple de carte avec le thème actuel.
                  </p>
                  <div className="mt-4 space-x-2">
                    <Button size="sm">Bouton</Button>
                    <Button size="sm" variant="outline">Outline</Button>
                    <Button size="sm" variant="secondary">Secondary</Button>
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-2">
                <Badge>Badge par défaut</Badge>
                <Badge variant="secondary">Badge secondaire</Badge>
                <Badge variant="outline">Badge outline</Badge>
                <Badge variant="destructive">Badge destructif</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeTest;
