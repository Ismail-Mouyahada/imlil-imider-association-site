import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  CreditCard, 
  Building2, 
  User, 
  Mail, 
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useDonations } from '@/hooks/useDonations';

const donationSchema = Yup.object({
  donorName: Yup.string()
    .required('الاسم مطلوب')
    .min(2, 'الاسم يجب أن يكون على الأقل حرفين')
    .max(50, 'الاسم يجب أن يكون أقل من 50 حرف'),
  donorEmail: Yup.string()
    .email('البريد الإلكتروني غير صحيح')
    .required('البريد الإلكتروني مطلوب'),
  donorPhone: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, 'رقم الهاتف غير صحيح')
    .optional(),
  amount: Yup.number()
    .required('المبلغ مطلوب')
    .min(10, 'الحد الأدنى للتبرع هو 10 دراهم')
    .max(100000, 'الحد الأقصى للتبرع هو 100,000 درهم'),
  paymentMethod: Yup.string()
    .required('طريقة الدفع مطلوبة'),
  notes: Yup.string()
    .max(500, 'الملاحظات يجب أن تكون أقل من 500 حرف')
    .optional(),
  isAnonymous: Yup.boolean(),
});

const DonationForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [donationId, setDonationId] = useState('');
  const [showBankDetails, setShowBankDetails] = useState(false);
  const { submitDonation, loading } = useDonations();

  const initialValues = {
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    amount: '',
    paymentMethod: '',
    notes: '',
    isAnonymous: false,
  };

  const bankDetails = {
    bankName: 'Banque Populaire',
    accountNumber: '12345678901234567890',
    iban: 'MA64 123 12345678901234567890',
    swift: 'BPMAMAMC',
    accountHolder: 'جمعية إمليل للتنمية والتعاون',
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    const result = await submitDonation(values);
    
    if (result.success) {
      setDonationId(result.donation.id);
      setIsSubmitted(true);
      resetForm();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Toast notification will be handled by the hook
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h3 className="text-2xl font-bold mb-2 text-green-800">تم تسجيل التبرع بنجاح!</h3>
            <p className="text-muted-foreground mb-6">
              شكراً لتبرعك الكريم. يمكنك تتبع حالة تبرعك باستخدام الرقم المرجعي.
            </p>
            <div className="bg-muted p-4 rounded-lg mb-6">
              <p className="font-medium mb-2">الرقم المرجعي للتبرع:</p>
              <p className="text-2xl font-bold text-primary">{donationId}</p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setIsSubmitted(false)}>
                تبرع آخر
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/donations'}>
                تتبع التبرعات
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            تبرع لجمعية إمليل
          </CardTitle>
          <p className="text-center text-muted-foreground">
            تبرعك يساعدنا في تحقيق أهدافنا التنموية وخدمة المجتمع
          </p>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={donationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue, values }) => (
              <Form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="donorName" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      الاسم الكامل *
                    </Label>
                    <Field
                      as={Input}
                      id="donorName"
                      name="donorName"
                      placeholder="أدخل اسمك الكامل"
                      className={errors.donorName && touched.donorName ? 'border-red-500' : ''}
                    />
                    <ErrorMessage name="donorName" component="div" className="text-red-500 text-sm" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donorEmail" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      البريد الإلكتروني *
                    </Label>
                    <Field
                      as={Input}
                      id="donorEmail"
                      name="donorEmail"
                      type="email"
                      placeholder="مثال@البريد.com"
                      className={errors.donorEmail && touched.donorEmail ? 'border-red-500' : ''}
                    />
                    <ErrorMessage name="donorEmail" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donorPhone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    رقم الهاتف (اختياري)
                  </Label>
                  <Field
                    as={Input}
                    id="donorPhone"
                    name="donorPhone"
                    type="tel"
                    placeholder="+212 6XX XXX XXX"
                    className={errors.donorPhone && touched.donorPhone ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="donorPhone" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">المبلغ (درهم) *</Label>
                    <Field
                      as={Input}
                      id="amount"
                      name="amount"
                      type="number"
                      placeholder="100"
                      min="10"
                      max="100000"
                      className={errors.amount && touched.amount ? 'border-red-500' : ''}
                    />
                    <ErrorMessage name="amount" component="div" className="text-red-500 text-sm" />
                    <p className="text-sm text-muted-foreground">
                      الحد الأدنى: 10 درهم - الحد الأقصى: 100,000 درهم
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">طريقة الدفع *</Label>
                    <Select onValueChange={(value) => setFieldValue('paymentMethod', value)}>
                      <SelectTrigger className={errors.paymentMethod && touched.paymentMethod ? 'border-red-500' : ''}>
                        <SelectValue placeholder="اختر طريقة الدفع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BANK_TRANSFER">تحويل بنكي</SelectItem>
                        <SelectItem value="CASH">نقداً</SelectItem>
                        <SelectItem value="CHECK">شيك</SelectItem>
                        <SelectItem value="ONLINE">دفع إلكتروني</SelectItem>
                        <SelectItem value="OTHER">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                    <ErrorMessage name="paymentMethod" component="div" className="text-red-500 text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">ملاحظات (اختياري)</Label>
                  <Field
                    as={Textarea}
                    id="notes"
                    name="notes"
                    placeholder="أي ملاحظات إضافية..."
                    rows={3}
                    className={errors.notes && touched.notes ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="notes" component="div" className="text-red-500 text-sm" />
                  <p className="text-sm text-muted-foreground">
                    {values.notes.length}/500 حرف
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Field as={Checkbox} id="isAnonymous" name="isAnonymous" />
                  <Label htmlFor="isAnonymous" className="text-sm">
                    تبرع مجهول (لن نذكر اسمك في قائمة المتبرعين)
                  </Label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري التسجيل...
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 ml-2" />
                      تأكيد التبرع
                    </>
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>

      {/* Bank Details Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                تفاصيل الحساب البنكي
              </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBankDetails(!showBankDetails)}
            >
              {showBankDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showBankDetails ? 'إخفاء' : 'عرض'}
            </Button>
          </CardTitle>
        </CardHeader>
        {showBankDetails && (
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم البنك</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="flex-1">{bankDetails.bankName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(bankDetails.bankName)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>رقم الحساب</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="flex-1 font-mono">{bankDetails.accountNumber}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(bankDetails.accountNumber)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>IBAN</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="flex-1 font-mono">{bankDetails.iban}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(bankDetails.iban)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>SWIFT</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="flex-1 font-mono">{bankDetails.swift}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(bankDetails.swift)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">تعليمات مهمة</h4>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• استخدم الرقم المرجعي في وصف التحويل</li>
                    <li>• احتفظ بإيصال التحويل للمتابعة</li>
                    <li>• سيتم تأكيد التبرع خلال 24-48 ساعة</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default DonationForm;
