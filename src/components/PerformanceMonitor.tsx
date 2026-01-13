import { usePerformance } from '@/hooks/usePerformance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Clock, 
  Zap, 
  Eye, 
  MousePointer, 
  Layout,
  HardDrive,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const PerformanceMonitor = () => {
  const { metrics, isSupported, getPerformanceScore, formatTime, formatBytes } = usePerformance();
  const performanceScore = getPerformanceScore();

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">غير مدعوم</h3>
          <p className="text-muted-foreground">
            متصفحك لا يدعم مراقبة الأداء. يرجى استخدام متصفح حديث.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <h3 className="text-lg font-semibold mb-2">جاري القياس...</h3>
          <p className="text-muted-foreground">
            يتم قياس أداء التطبيق حالياً
          </p>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    if (score >= 50) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">مراقبة الأداء</h2>
        <p className="text-muted-foreground">إحصائيات أداء التطبيق</p>
      </div>

      {/* Overall Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            النتيجة الإجمالية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBgColor(performanceScore.score)}`}>
              <span className={`text-3xl font-bold ${getScoreColor(performanceScore.score)}`}>
                {performanceScore.score}
              </span>
            </div>
            <div>
              <Badge 
                variant={performanceScore.score >= 70 ? 'default' : 'destructive'}
                className="text-lg px-4 py-2"
              >
                {performanceScore.label}
              </Badge>
            </div>
            <Progress value={performanceScore.score} className="w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">First Contentful Paint</h3>
                <p className="text-2xl font-bold">{formatTime(metrics.firstContentfulPaint)}</p>
                <p className="text-sm text-muted-foreground">
                  {metrics.firstContentfulPaint < 1500 ? 'جيد' : 'يحتاج تحسين'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Largest Contentful Paint</h3>
                <p className="text-2xl font-bold">{formatTime(metrics.largestContentfulPaint)}</p>
                <p className="text-sm text-muted-foreground">
                  {metrics.largestContentfulPaint < 2500 ? 'جيد' : 'يحتاج تحسين'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MousePointer className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">First Input Delay</h3>
                <p className="text-2xl font-bold">{formatTime(metrics.firstInputDelay)}</p>
                <p className="text-sm text-muted-foreground">
                  {metrics.firstInputDelay < 100 ? 'جيد' : 'يحتاج تحسين'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Layout className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Cumulative Layout Shift</h3>
                <p className="text-2xl font-bold">{metrics.cumulativeLayoutShift.toFixed(3)}</p>
                <p className="text-sm text-muted-foreground">
                  {metrics.cumulativeLayoutShift < 0.1 ? 'جيد' : 'يحتاج تحسين'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold">Load Time</h3>
                <p className="text-2xl font-bold">{formatTime(metrics.loadTime)}</p>
                <p className="text-sm text-muted-foreground">
                  {metrics.loadTime < 3000 ? 'جيد' : 'يحتاج تحسين'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {metrics.memoryUsage && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <HardDrive className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Memory Usage</h3>
                  <p className="text-2xl font-bold">{formatBytes(metrics.memoryUsage)}</p>
                  <p className="text-sm text-muted-foreground">استخدام الذاكرة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Performance Tips */}
      <Card>
        <CardHeader>
          <CardTitle>نصائح لتحسين الأداء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.loadTime > 3000 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">وقت التحميل بطيء</h4>
                  <p className="text-sm text-yellow-700">
                    جرب تحسين الصور أو تقليل حجم الملفات
                  </p>
                </div>
              </div>
            )}
            
            {metrics.firstContentfulPaint > 1500 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">First Contentful Paint بطيء</h4>
                  <p className="text-sm text-blue-700">
                    جرب تحسين CSS أو تقليل JavaScript غير الضروري
                  </p>
                </div>
              </div>
            )}
            
            {metrics.cumulativeLayoutShift > 0.1 && (
              <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-800">تغيير التخطيط مفرط</h4>
                  <p className="text-sm text-purple-700">
                    تأكد من تحديد أبعاد الصور والخطوط مسبقاً
                  </p>
                </div>
              </div>
            )}
            
            {performanceScore.score >= 90 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">أداء ممتاز!</h4>
                  <p className="text-sm text-green-700">
                    التطبيق يعمل بأداء ممتاز. استمر في الحفاظ على هذا المستوى
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitor;
