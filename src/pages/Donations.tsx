import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import DonationForm from "@/components/DonationForm";
import DonationTracker from "@/components/DonationTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Search, 
  TrendingUp, 
  Users, 
  Target,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";
import { useDonations } from "@/hooks/useDonations";

const Donations = () => {
  const [activeTab, setActiveTab] = useState("donate");
  const { donations, stats, loading } = useDonations();

  // Données par défaut si pas de stats
  const defaultStats = {
    totalDonations: 0,
    totalAmount: 0,
    confirmedDonations: 0,
    pendingDonations: 0,
    averageDonation: 0,
  };

  const currentStats = stats || defaultStats;
  const currentGoal = 200000;
  const goalProgress = currentStats.totalAmount > 0 ? (currentStats.totalAmount / currentGoal) * 100 : 0;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return { color: 'bg-green-100 text-green-800', label: 'مؤكد' };
      case 'PROCESSED':
        return { color: 'bg-blue-100 text-blue-800', label: 'معالج' };
      case 'PENDING':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'في الانتظار' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: 'غير معروف' };
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4 text-gradient">التبرعات</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            تبرعك يساعدنا في تحقيق أهدافنا التنموية وخدمة المجتمع المحلي
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{currentStats.totalAmount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">إجمالي التبرعات (درهم)</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{currentStats.totalDonations}</div>
              <div className="text-sm text-muted-foreground">عدد المتبرعين</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{goalProgress.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">تقدم الهدف</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">{currentStats.confirmedDonations}</div>
              <div className="text-sm text-muted-foreground">تبرعات مؤكدة</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{currentStats.averageDonation.toFixed(0)}</div>
              <div className="text-sm text-muted-foreground">متوسط التبرع</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold">{currentStats.pendingDonations}</div>
              <div className="text-sm text-muted-foreground">في الانتظار</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              تقدم الهدف السنوي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>الهدف: {currentGoal.toLocaleString()} درهم</span>
                <span>المحقق: {currentStats.totalAmount.toLocaleString()} درهم</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${goalProgress}%` }}
                ></div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                متبقي: {(currentGoal - currentStats.totalAmount).toLocaleString()} درهم
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="donate" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              تبرع الآن
            </TabsTrigger>
            <TabsTrigger value="track" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              تتبع التبرع
            </TabsTrigger>
          </TabsList>

          <TabsContent value="donate" className="space-y-6">
            <DonationForm />
          </TabsContent>

          <TabsContent value="track" className="space-y-6">
            <DonationTracker />
          </TabsContent>
        </Tabs>

        {/* Recent Donations */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              التبرعات الأخيرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {donations.length > 0 ? (
                donations.slice(0, 5).map((donation) => {
                  const statusInfo = getStatusInfo(donation.status);
                  return (
                    <div key={donation.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Heart className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">{donation.isAnonymous ? 'مجهول' : donation.donorName}</h4>
                          <p className="text-sm text-muted-foreground">{donation.notes || 'تبرع عام'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{donation.amount} {donation.currency}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(donation.createdAt).toLocaleDateString('ar-MA')}
                        </div>
                      </div>
                      <Badge className={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد تبرعات بعد</p>
                  <p className="text-sm">كن أول من يتبرع!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-8 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-2xl font-bold mb-2">شارك في بناء مستقبل أفضل</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              تبرعك، مهما كان صغيراً، يمكن أن يحدث فرقاً كبيراً في حياة أفراد المجتمع. 
              انضم إلينا في رحلة التنمية المستدامة.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setActiveTab("donate")}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                تبرع الآن
              </button>
              <button 
                onClick={() => setActiveTab("track")}
                className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                تتبع تبرعك
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Donations;
