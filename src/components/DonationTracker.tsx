import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  XCircle,
  AlertCircle,
  Loader2,
  Eye,
  Download
} from 'lucide-react';
import { useDonations } from '@/hooks/useDonations';

const trackingSchema = Yup.object({
  donationId: Yup.string()
    .required('الرقم المرجعي مطلوب')
    .matches(/^DON-\d+$/, 'الرقم المرجعي غير صحيح'),
});

const DonationTracker = () => {
  const [donation, setDonation] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const { trackDonation, loading } = useDonations();

  const initialValues = {
    donationId: '',
  };

  const handleSearch = async (values: any) => {
    setNotFound(false);
    setDonation(null);
    
    const result = await trackDonation(values.donationId);
    
    if (result.success) {
      setDonation(result.donation);
    } else {
      setNotFound(true);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          icon: <Clock className="w-4 h-4" />,
          label: 'في الانتظار',
          color: 'bg-yellow-100 text-yellow-800',
          description: 'تم تسجيل التبرع وجاري مراجعته'
        };
      case 'CONFIRMED':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'مؤكد',
          color: 'bg-green-100 text-green-800',
          description: 'تم تأكيد التبرع بنجاح'
        };
      case 'PROCESSED':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'معالج',
          color: 'bg-blue-100 text-blue-800',
          description: 'تم معالجة التبرع واستخدامه في المشاريع'
        };
      case 'FAILED':
        return {
          icon: <XCircle className="w-4 h-4" />,
          label: 'فشل',
          color: 'bg-red-100 text-red-800',
          description: 'فشل في معالجة التبرع'
        };
      case 'REFUNDED':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          label: 'مسترد',
          color: 'bg-gray-100 text-gray-800',
          description: 'تم استرداد التبرع'
        };
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          label: 'غير معروف',
          color: 'bg-gray-100 text-gray-800',
          description: 'حالة غير معروفة'
        };
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'BANK_TRANSFER': return 'تحويل بنكي';
      case 'CASH': return 'نقداً';
      case 'CHECK': return 'شيك';
      case 'ONLINE': return 'دفع إلكتروني';
      case 'OTHER': return 'أخرى';
      default: return method;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-MA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Search className="w-6 h-6" />
            تتبع التبرع
          </CardTitle>
          <p className="text-center text-muted-foreground">
            أدخل الرقم المرجعي للتبرع لتتبع حالته
          </p>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={trackingSchema}
            onSubmit={handleSearch}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="donationId">الرقم المرجعي للتبرع</Label>
                  <div className="flex gap-2">
                    <Field
                      as={Input}
                      id="donationId"
                      name="donationId"
                      placeholder="DON-1705312200000"
                      className={errors.donationId && touched.donationId ? 'border-red-500' : ''}
                    />
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="px-6"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {errors.donationId && touched.donationId && (
                    <p className="text-red-500 text-sm">{errors.donationId}</p>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      {/* Donation Details */}
      {donation && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>تفاصيل التبرع</span>
              <Badge className={getStatusInfo(donation.status).color}>
                {getStatusInfo(donation.status).icon}
                <span className="mr-1">{getStatusInfo(donation.status).label}</span>
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">الرقم المرجعي</Label>
                <p className="p-2 bg-muted rounded font-mono">{donation.id}</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">المبلغ</Label>
                <p className="p-2 bg-muted rounded font-bold text-lg">
                  {donation.amount} {donation.currency}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">المتبرع</Label>
                <p className="p-2 bg-muted rounded">
                  {donation.isAnonymous ? 'مجهول' : donation.donorName}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">طريقة الدفع</Label>
                <p className="p-2 bg-muted rounded">
                  {getPaymentMethodLabel(donation.paymentMethod)}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">تاريخ التبرع</Label>
                <p className="p-2 bg-muted rounded">
                  {formatDate(donation.createdAt)}
                </p>
              </div>
              
              {donation.processedAt && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">تاريخ المعالجة</Label>
                  <p className="p-2 bg-muted rounded">
                    {formatDate(donation.processedAt)}
                  </p>
                </div>
              )}
            </div>
            
            {donation.notes && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">ملاحظات</Label>
                <p className="p-2 bg-muted rounded">{donation.notes}</p>
              </div>
            )}
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">حالة التبرع</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {getStatusInfo(donation.status).description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 ml-1" />
                تحميل الإيصال
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 ml-1" />
                عرض التفاصيل
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Not Found */}
      {notFound && (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-bold mb-2 text-red-800">لم يتم العثور على التبرع</h3>
            <p className="text-muted-foreground mb-4">
              الرقم المرجعي المدخل غير صحيح أو غير موجود
            </p>
            <Button onClick={() => {
              setNotFound(false);
              setDonation(null);
            }}>
              البحث مرة أخرى
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DonationTracker;
