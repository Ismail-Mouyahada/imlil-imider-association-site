import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PrivacyMaskProps {
  children: React.ReactNode;
  label?: string;
  className?: string;
  maskText?: string;
  showIcon?: boolean;
  requireAuth?: boolean;
  onReveal?: () => void;
}

/**
 * Composant pour masquer les informations personnelles
 * Affiche un masque avec un bouton pour révéler le contenu
 */
const PrivacyMask: React.FC<PrivacyMaskProps> = ({
  children,
  label = "معلومات شخصية",
  className,
  maskText = "••••••••",
  showIcon = true,
  requireAuth = false,
  onReveal
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
    onReveal?.();
  };

  const handleHide = () => {
    setIsRevealed(false);
  };

  if (isRevealed) {
    return (
      <div className={cn("relative group", className)}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            {showIcon && <Shield className="w-4 h-4 text-green-600" />}
            {label} (visible)
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHide}
            className="text-muted-foreground hover:text-foreground"
          >
            <EyeOff className="w-4 h-4 ml-1" />
            Masquer
          </Button>
        </div>
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn("relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {showIcon && <Lock className="w-4 h-4 text-muted-foreground" />}
          {label}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReveal}
          className={cn(
            "transition-all duration-200",
            isHovered && "scale-105 shadow-md"
          )}
        >
          <Eye className="w-4 h-4 ml-1" />
          Afficher
        </Button>
      </div>
      
      <div className="relative">
        {/* Masque */}
        <div className="p-3 bg-muted/50 border border-dashed border-muted-foreground/30 rounded-lg">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span className="font-mono text-lg tracking-wider">
              {maskText}
            </span>
            <Lock className="w-4 h-4" />
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Cliquez sur "Afficher" pour voir les détails
          </p>
        </div>
        
        {/* Overlay avec effet de flou */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="default"
            size="sm"
            onClick={handleReveal}
            className="shadow-lg"
          >
            <Eye className="w-4 h-4 ml-1" />
            Révéler les informations
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyMask;
