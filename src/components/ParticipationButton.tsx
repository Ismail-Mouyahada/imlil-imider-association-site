import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  CheckCircle, 
  Clock, 
  Users, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ParticipationButtonProps {
  activityId: string;
  isParticipating?: boolean;
  canParticipate?: boolean;
  isFull?: boolean;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  maxParticipants?: number;
  currentParticipants?: number;
  onParticipate?: (activityId: string) => void;
  onCancelParticipation?: (activityId: string) => void;
  className?: string;
}

const ParticipationButton: React.FC<ParticipationButtonProps> = ({
  activityId,
  isParticipating = false,
  canParticipate = true,
  isFull = false,
  status = 'upcoming',
  maxParticipants = 50,
  currentParticipants = 0,
  onParticipate,
  onCancelParticipation,
  className
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    
    try {
      if (isParticipating) {
        await onCancelParticipation?.(activityId);
        toast({
          title: "تم إلغاء المشاركة",
          description: "تم إلغاء مشاركتك في هذا النشاط بنجاح.",
        });
      } else {
        await onParticipate?.(activityId);
        toast({
          title: "تم تسجيل المشاركة",
          description: "تم تسجيل مشاركتك في هذا النشاط بنجاح.",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 className="w-4 h-4 ml-1 animate-spin" />
          جاري المعالجة...
        </>
      );
    }

    if (isParticipating) {
      return (
        <>
          <CheckCircle className="w-4 h-4 ml-1" />
          مشارك
        </>
      );
    }

    if (isFull) {
      return (
        <>
          <Users className="w-4 h-4 ml-1" />
          مكتمل
        </>
      );
    }

    if (status === 'ongoing') {
      return (
        <>
          <Clock className="w-4 h-4 ml-1" />
          جاري
        </>
      );
    }

    if (status === 'completed') {
      return (
        <>
          <CheckCircle className="w-4 h-4 ml-1" />
          منتهي
        </>
      );
    }

    if (status === 'cancelled') {
      return (
        <>
          <AlertCircle className="w-4 h-4 ml-1" />
          ملغي
        </>
      );
    }

    return (
      <>
        <UserPlus className="w-4 h-4 ml-1" />
        المشاركة
      </>
    );
  };

  const getButtonVariant = () => {
    if (isParticipating) return "default";
    if (isFull || status === 'completed' || status === 'cancelled') return "outline";
    if (status === 'ongoing') return "secondary";
    return "default";
  };

  const getButtonDisabled = () => {
    return isLoading || 
           (status !== 'upcoming' && !isParticipating) || 
           (isFull && !isParticipating);
  };

  const getParticipantsInfo = () => {
    if (maxParticipants && currentParticipants !== undefined) {
      const remaining = maxParticipants - currentParticipants;
      return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>
            {currentParticipants}/{maxParticipants}
            {remaining > 0 && ` (${remaining} متبقي)`}
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Button
        onClick={handleClick}
        disabled={getButtonDisabled()}
        variant={getButtonVariant()}
        className="w-full"
        size="sm"
      >
        {getButtonContent()}
      </Button>
      
      {getParticipantsInfo()}
      
      {isFull && !isParticipating && (
        <Badge variant="destructive" className="w-full justify-center text-xs">
          <AlertCircle className="w-3 h-3 ml-1" />
          لا توجد أماكن متاحة
        </Badge>
      )}
      
      {status === 'ongoing' && !isParticipating && (
        <Badge variant="secondary" className="w-full justify-center text-xs">
          <Clock className="w-3 h-3 ml-1" />
          النشاط جاري - التسجيل مغلق
        </Badge>
      )}
      
      {status === 'completed' && (
        <Badge variant="outline" className="w-full justify-center text-xs">
          <CheckCircle className="w-3 h-3 ml-1" />
          النشاط منتهي
        </Badge>
      )}
      
      {status === 'cancelled' && (
        <Badge variant="destructive" className="w-full justify-center text-xs">
          <AlertCircle className="w-3 h-3 ml-1" />
          النشاط ملغي
        </Badge>
      )}
    </div>
  );
};

export default ParticipationButton;
