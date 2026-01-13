import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

/**
 * Hook pour la gestion du thème
 * Gère le mode sombre/clair et le thème système
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Récupérer le thème depuis localStorage ou utiliser 'system' par défaut
    const stored = localStorage.getItem('theme') as Theme;
    return stored || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  });

  // Mettre à jour le thème résolu quand le thème change
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const updateResolvedTheme = () => {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      };
      
      updateResolvedTheme();
      mediaQuery.addEventListener('change', updateResolvedTheme);
      
      return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
    } else {
      setResolvedTheme(theme);
    }
  }, [theme]);

  // Appliquer le thème au document
  useEffect(() => {
    const root = document.documentElement;
    
    // Supprimer les classes de thème existantes
    root.classList.remove('light', 'dark');
    
    // Ajouter la classe du thème résolu
    root.classList.add(resolvedTheme);
    
    // Mettre à jour l'attribut data-theme
    root.setAttribute('data-theme', resolvedTheme);
    
    // Mettre à jour le meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#0f172a' : '#ffffff');
    }
  }, [resolvedTheme]);

  // Sauvegarder le thème dans localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setThemeValue = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  const isDark = resolvedTheme === 'dark';
  const isLight = resolvedTheme === 'light';
  const isSystem = theme === 'system';

  return {
    theme,
    setTheme: setThemeValue,
    resolvedTheme,
    isDark,
    isLight,
    isSystem,
    toggleTheme
  };
};

/**
 * Hook pour vérifier si le thème système est sombre
 */
export const useSystemTheme = () => {
  const [isSystemDark, setIsSystemDark] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemTheme = () => {
      setIsSystemDark(mediaQuery.matches);
    };
    
    mediaQuery.addEventListener('change', updateSystemTheme);
    
    return () => mediaQuery.removeEventListener('change', updateSystemTheme);
  }, []);

  return isSystemDark;
};

/**
 * Hook pour obtenir les couleurs du thème actuel
 */
export const useThemeColors = () => {
  const { resolvedTheme } = useTheme();
  
  const colors = {
    light: {
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      primary: 'hsl(222.2 47.4% 11.2%)',
      primaryForeground: 'hsl(210 40% 98%)',
      secondary: 'hsl(210 40% 96%)',
      secondaryForeground: 'hsl(222.2 47.4% 11.2%)',
      muted: 'hsl(210 40% 96%)',
      mutedForeground: 'hsl(215.4 16.3% 46.9%)',
      accent: 'hsl(210 40% 96%)',
      accentForeground: 'hsl(222.2 47.4% 11.2%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      destructiveForeground: 'hsl(210 40% 98%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      input: 'hsl(214.3 31.8% 91.4%)',
      ring: 'hsl(222.2 47.4% 11.2%)',
    },
    dark: {
      background: 'hsl(222.2 84% 4.9%)',
      foreground: 'hsl(210 40% 98%)',
      primary: 'hsl(210 40% 98%)',
      primaryForeground: 'hsl(222.2 47.4% 11.2%)',
      secondary: 'hsl(217.2 32.6% 17.5%)',
      secondaryForeground: 'hsl(210 40% 98%)',
      muted: 'hsl(217.2 32.6% 17.5%)',
      mutedForeground: 'hsl(215 20.2% 65.1%)',
      accent: 'hsl(217.2 32.6% 17.5%)',
      accentForeground: 'hsl(210 40% 98%)',
      destructive: 'hsl(0 62.8% 30.6%)',
      destructiveForeground: 'hsl(210 40% 98%)',
      border: 'hsl(217.2 32.6% 17.5%)',
      input: 'hsl(217.2 32.6% 17.5%)',
      ring: 'hsl(212.7 26.8% 83.9%)',
    }
  };

  return colors[resolvedTheme];
};

/**
 * Hook pour les classes CSS du thème
 */
export const useThemeClasses = () => {
  const { resolvedTheme } = useTheme();
  
  return {
    root: `theme-${resolvedTheme}`,
    background: resolvedTheme === 'dark' ? 'bg-slate-900' : 'bg-white',
    foreground: resolvedTheme === 'dark' ? 'text-slate-50' : 'text-slate-900',
    card: resolvedTheme === 'dark' ? 'bg-slate-800' : 'bg-white',
    border: resolvedTheme === 'dark' ? 'border-slate-700' : 'border-slate-200',
    muted: resolvedTheme === 'dark' ? 'text-slate-400' : 'text-slate-600',
  };
};