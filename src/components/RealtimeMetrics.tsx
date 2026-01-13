import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Activity, 
  Heart, 
  Eye, 
  MessageSquare,
  Calendar,
  Image,
  Newspaper,
  Zap,
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface Metric {
  id: string;
  title: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
  format: 'number' | 'percentage' | 'currency';
  description: string;
}

const RealtimeMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    // Générer des métriques d'exemple avec des données en temps réel simulées
    const generateMetrics = (): Metric[] => [
      {
        id: '1',
        title: 'المستخدمون النشطون',
        value: Math.floor(Math.random() * 50) + 120,
        previousValue: 115,
        change: 4.3,
        changeType: 'increase',
        icon: <Users className="w-5 h-5" />,
        color: 'text-blue-600',
        format: 'number',
        description: 'المستخدمون المتصلون حالياً'
      },
      {
        id: '2',
        title: 'معدل التفاعل',
        value: Math.floor(Math.random() * 20) + 75,
        previousValue: 72,
        change: 4.2,
        changeType: 'increase',
        icon: <Activity className="w-5 h-5" />,
        color: 'text-green-600',
        format: 'percentage',
        description: 'نسبة التفاعل مع المحتوى'
      },
      {
        id: '3',
        title: 'الأنشطة المكتملة',
        value: Math.floor(Math.random() * 10) + 45,
        previousValue: 42,
        change: 7.1,
        changeType: 'increase',
        icon: <CheckCircle className="w-5 h-5" />,
        color: 'text-emerald-600',
        format: 'number',
        description: 'الأنشطة المكتملة هذا الشهر'
      },
      {
        id: '4',
        title: 'إجمالي التبرعات',
        value: Math.floor(Math.random() * 5000) + 25000,
        previousValue: 23000,
        change: 8.7,
        changeType: 'increase',
        icon: <Heart className="w-5 h-5" />,
        color: 'text-red-600',
        format: 'currency',
        description: 'إجمالي التبرعات بالدرهم'
      },
      {
        id: '5',
        title: 'مشاهدات الصفحة',
        value: Math.floor(Math.random() * 1000) + 5000,
        previousValue: 4800,
        change: 4.2,
        changeType: 'increase',
        icon: <Eye className="w-5 h-5" />,
        color: 'text-purple-600',
        format: 'number',
        description: 'مشاهدات الصفحة اليوم'
      },
      {
        id: '6',
        title: 'الرسائل الجديدة',
        value: Math.floor(Math.random() * 20) + 15,
        previousValue: 12,
        change: 25.0,
        changeType: 'increase',
        icon: <MessageSquare className="w-5 h-5" />,
        color: 'text-orange-600',
        format: 'number',
        description: 'الرسائل الجديدة اليوم'
      },
      {
        id: '7',
        title: 'الفعاليات القادمة',
        value: Math.floor(Math.random() * 5) + 8,
        previousValue: 10,
        change: -20.0,
        changeType: 'decrease',
        icon: <Calendar className="w-5 h-5" />,
        color: 'text-blue-600',
        format: 'number',
        description: 'الفعاليات المجدولة'
      },
      {
        id: '8',
        title: 'الصور المضافة',
        value: Math.floor(Math.random() * 15) + 25,
        previousValue: 20,
        change: 25.0,
        changeType: 'increase',
        icon: <Image className="w-5 h-5" />,
        color: 'text-yellow-600',
        format: 'number',
        description: 'الصور المضافة هذا الأسبوع'
      }
    ];

    setMetrics(generateMetrics());

    // Mettre à jour les métriques toutes les 5 secondes
    const interval = setInterval(() => {
      setMetrics(generateMetrics());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return `${value.toLocaleString()} درهم`;
      case 'percentage':
        return `${value}%`;
      default:
        return value.toLocaleString();
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">المقاييس المباشرة</h2>
          <p className="text-muted-foreground">
            إحصائيات فورية لأداء الجمعية
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-400'} animate-pulse`} />
          <span className="text-sm text-muted-foreground">
            {isLive ? 'مباشر' : 'غير متصل'}
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-muted ${metric.color}`}>
                  {metric.icon}
                </div>
                <Badge 
                  variant={metric.changeType === 'increase' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {getChangeIcon(metric.changeType)}
                  <span className="mr-1">
                    {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                  </span>
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-2xl font-bold">{formatValue(metric.value, metric.format)}</p>
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">منذ آخر تحديث</span>
                    <span className={getChangeColor(metric.changeType)}>
                      {formatValue(metric.previousValue, metric.format)}
                    </span>
                  </div>
                  <Progress 
                    value={(metric.value / (metric.value + metric.previousValue)) * 100} 
                    className="h-1"
                  />
                </div>
                
                <p className="text-xs text-muted-foreground mt-2">
                  {metric.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">الأهداف المحققة</h3>
                <p className="text-2xl font-bold text-green-600">85%</p>
                <p className="text-sm text-muted-foreground">
                  من الأهداف الشهرية
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">التقييم العام</h3>
                <p className="text-2xl font-bold text-blue-600">4.8/5</p>
                <p className="text-sm text-muted-foreground">
                  تقييم الأعضاء
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">معدل النمو</h3>
                <p className="text-2xl font-bold text-purple-600">+12%</p>
                <p className="text-sm text-muted-foreground">
                  مقارنة بالشهر الماضي
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            الجدول الزمني للنشاط
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { time: 'الآن', action: 'تم تسجيل عضو جديد', user: 'أحمد محمد', type: 'success' },
              { time: '2 دقيقة', action: 'تم إضافة نشاط جديد', user: 'فاطمة الزهراء', type: 'info' },
              { time: '5 دقائق', action: 'تم استلام تبرع', user: 'محمد علي', type: 'success' },
              { time: '10 دقائق', action: 'تم تحديث الفعالية', user: 'سارة أحمد', type: 'info' },
              { time: '15 دقيقة', action: 'تم إضافة صورة جديدة', user: 'علي حسن', type: 'info' },
              { time: '20 دقيقة', action: 'تم إرسال رسالة', user: 'نور الدين', type: 'info' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">
                    بواسطة {activity.user}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealtimeMetrics;
