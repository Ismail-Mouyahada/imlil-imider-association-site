import React, { useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Provider pour la gestion des thèmes
 * Applique automatiquement le thème au document
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Appliquer le thème au document
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

  return <>{children}</>;
};

export default ThemeProvider;
