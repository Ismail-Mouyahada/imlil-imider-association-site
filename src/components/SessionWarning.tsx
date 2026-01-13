import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useSessionWarnings, useSession } from '@/hooks/useSession';
import { Clock, RefreshCw } from 'lucide-react';

const SessionWarning: React.FC = () => {
  const { showWarning, warningMessage, timeRemaining } = useSessionWarnings();
  const { extendSession } = useSession();

  if (!showWarning) {
    return null;
  }

  const handleExtendSession = () => {
    extendSession();
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md" dir="rtl">
      <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
        <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <AlertDescription className="flex items-center justify-between gap-4">
          <span className="text-yellow-800 dark:text-yellow-200">
            {warningMessage}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleExtendSession}
            className="text-yellow-800 border-yellow-300 hover:bg-yellow-100 dark:text-yellow-200 dark:border-yellow-700 dark:hover:bg-yellow-800/20"
          >
            <RefreshCw className="w-4 h-4 ml-1" />
            Prolonger
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SessionWarning;
