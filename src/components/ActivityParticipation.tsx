import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  UserPlus, 
  CheckCircle, 
  AlertCircle,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PrivacyMask from './PrivacyMask';
import ParticipationButton from './ParticipationButton';

interface ActivityParticipationProps {
  activity: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    maxParticipants: number;
    currentParticipants: number;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    requirements?: string[];
    contactInfo?: {
      name: string;
      phone: string;
      email: string;
    };
  };
  onParticipate?: (data: ParticipationData) => void;
}

interface ParticipationData {
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  emergencyContact?: string;
  specialRequirements?: string;
}

const ActivityParticipation: React.FC<ActivityParticipationProps> = ({
  activity,
  onParticipate
}) => {
  const [isParticipating, setIsParticipating] = useState(false);
  const [participationData, setParticipationData] = useState<ParticipationData>({
    fullName: '',
    email: '',
    phone: '',
    message: '',
    emergencyContact: '',
    specialRequirements: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const isFull = activity.currentParticipants >= activity.maxParticipants;
  const canParticipate = activity.status === 'upcoming' && !isFull;

  const handleInputChange = (field: keyof ParticipationData, value: string) => {
    setParticipationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!participationData.fullName || !participationData.email || !participationData.phone) {
      toast({
        title: "خطأ في التحقق",
        description: "يرجى ملء جميع الحقول المطلوبة.",
        variant: "destructive"
      });
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(participationData.email)) {
      toast({
        title: "بريد إلكتروني غير صحيح",
        description: "يرجى إدخال عنوان بريد إلكتروني صحيح.",
        variant: "destructive"
      });
      return;
    }

    // Validation téléphone
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(participationData.phone)) {
      toast({
        title: "رقم هاتف غير صحيح",
        description: "يرجى إدخال رقم هاتف صحيح.",
        variant: "destructive"
      });
      return;
    }

    // Soumettre la participation
    onParticipate?.(participationData);
    setIsSubmitted(true);
    
    toast({
      title: "تم تسجيل المشاركة!",
      description: "تم تسجيل مشاركتك في النشاط بنجاح.",
    });
  };

  const getStatusInfo = () => {
    switch (activity.status) {
      case 'upcoming':
        return { 
          color: 'bg-blue-100 text-blue-800', 
          label: 'قادم',
          icon: Calendar
        };
      case 'ongoing':
        return { 
          color: 'bg-green-100 text-green-800', 
          label: 'جاري',
          icon: Clock
        };
      case 'completed':
        return { 
          color: 'bg-gray-100 text-gray-800', 
          label: 'مكتمل',
          icon: CheckCircle
        };
      case 'cancelled':
        return { 
          color: 'bg-red-100 text-red-800', 
          label: 'ملغي',
          icon: AlertCircle
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800', 
          label: 'غير معروف',
          icon: AlertCircle
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  if (isSubmitted) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
            تم تأكيد المشاركة!
          </h3>
          <p className="text-green-700 dark:text-green-300 mb-4">
            تم تسجيل مشاركتك في النشاط "{activity.title}" بنجاح.
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            ستحصل على بريد إلكتروني تأكيدي مع جميع التفاصيل.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-2">{activity.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(activity.date).toLocaleDateString('fr-FR')}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {activity.time}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {activity.location}
              </div>
            </div>
          </div>
          <Badge className={statusInfo.color}>
            <StatusIcon className="w-3 h-3 ml-1" />
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Description */}
        <div>
          <h4 className="font-semibold mb-2">الوصف</h4>
          <p className="text-muted-foreground">{activity.description}</p>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">المشاركون</span>
          </div>
          <div className="text-right">
            <div className="font-semibold">
              {activity.currentParticipants} / {activity.maxParticipants}
            </div>
            <div className="text-sm text-muted-foreground">
              {isFull ? 'مكتمل' : `${activity.maxParticipants - activity.currentParticipants} مكان متاح`}
            </div>
          </div>
        </div>

        {/* Exigences */}
        {activity.requirements && activity.requirements.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">المتطلبات</h4>
            <ul className="space-y-1">
              {activity.requirements.map((requirement, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  {requirement}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Informations de contact (masquées) */}
        {activity.contactInfo && (
          <PrivacyMask
            label="معلومات الاتصال"
            maskText="••••••••••••"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{activity.contactInfo.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{activity.contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{activity.contactInfo.email}</span>
              </div>
            </div>
          </PrivacyMask>
        )}

        {/* Formulaire de participation */}
        {canParticipate && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">المشاركة في هذا النشاط</h4>
              <ParticipationButton
                activityId={activity.id}
                isParticipating={isParticipating}
                canParticipate={canParticipate}
                isFull={isFull}
                status={activity.status}
                maxParticipants={activity.maxParticipants}
                currentParticipants={activity.currentParticipants}
                onParticipate={() => setIsParticipating(true)}
                onCancelParticipation={() => setIsParticipating(false)}
              />
            </div>

            {isParticipating && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">الاسم الكامل *</Label>
                    <Input
                      id="fullName"
                      value={participationData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="اسمك الكامل"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={participationData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="بريدك@الإلكتروني.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الهاتف *</Label>
                    <Input
                      id="phone"
                      value={participationData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+212 6XX XXX XXX"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact">جهة الاتصال في حالات الطوارئ</Label>
                    <Input
                      id="emergencyContact"
                      value={participationData.emergencyContact}
                      onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                      placeholder="الاسم والهاتف"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="message">رسالة (اختياري)</Label>
                  <Textarea
                    id="message"
                    value={participationData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="أخبرنا لماذا تريد المشاركة..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="specialRequirements">متطلبات خاصة</Label>
                  <Textarea
                    id="specialRequirements"
                    value={participationData.specialRequirements}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    placeholder="الحساسية، الإعاقات، الاحتياجات الخاصة..."
                    rows={2}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    <CheckCircle className="w-4 h-4 ml-1" />
                    تأكيد المشاركة
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsParticipating(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Messages selon le statut */}
        {!canParticipate && (
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            {isFull ? (
              <div className="text-orange-600">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">هذا النشاط مكتمل</p>
                <p className="text-sm">لا توجد أماكن متاحة</p>
              </div>
            ) : activity.status === 'ongoing' ? (
              <div className="text-blue-600">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">النشاط جاري</p>
                <p className="text-sm">التسجيل مغلق</p>
              </div>
            ) : activity.status === 'completed' ? (
              <div className="text-gray-600">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">النشاط مكتمل</p>
                <p className="text-sm">شكراً لمشاركتك</p>
              </div>
            ) : activity.status === 'cancelled' ? (
              <div className="text-red-600">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">النشاط ملغي</p>
                <p className="text-sm">نعتذر عن الإزعاج</p>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityParticipation;
