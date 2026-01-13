import React, { useEffect } from 'react';

interface RTLProviderProps {
  children: React.ReactNode;
}

const RTLProvider: React.FC<RTLProviderProps> = ({ children }) => {
  useEffect(() => {
    // Définir la direction RTL sur le document
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'ar');
    
    // Ajouter des classes CSS pour l'orientation RTL
    document.body.classList.add('rtl');
    
    // Ajouter des styles RTL spécifiques
    const style = document.createElement('style');
    style.textContent = `
      /* RTL Support */
      .rtl {
        direction: rtl;
        text-align: right;
      }
      
      /* RTL Flips for specific elements */
      .rtl-flip {
        transform: scaleX(-1);
      }
      
      /* RTL spacing adjustments */
      .rtl .space-x-2 > :not([hidden]) ~ :not([hidden]) {
        --tw-space-x-reverse: 1;
        margin-right: calc(0.5rem * var(--tw-space-x-reverse));
        margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
      }
      
      .rtl .space-x-4 > :not([hidden]) ~ :not([hidden]) {
        --tw-space-x-reverse: 1;
        margin-right: calc(1rem * var(--tw-space-x-reverse));
        margin-left: calc(1rem * calc(1 - var(--tw-space-x-reverse)));
      }
      
      /* RTL form elements */
      .rtl input[type="text"],
      .rtl input[type="email"],
      .rtl input[type="password"],
      .rtl textarea {
        text-align: right;
      }
      
      /* RTL navigation */
      .rtl nav {
        direction: rtl;
      }
      
      /* RTL cards */
      .rtl .card {
        text-align: right;
      }
    `;
    document.head.appendChild(style);
    
    // Nettoyer lors du démontage
    return () => {
      document.documentElement.removeAttribute('dir');
      document.documentElement.removeAttribute('lang');
      document.body.classList.remove('rtl');
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return <>{children}</>;
};

export default RTLProvider;
