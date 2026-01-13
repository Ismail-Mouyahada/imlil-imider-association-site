import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  Phone, 
  User, 
  MessageSquare, 
  Send,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';

const contactSchema = Yup.object({
  name: Yup.string()
    .required('الاسم مطلوب')
    .min(2, 'الاسم يجب أن يكون على الأقل حرفين')
    .max(50, 'الاسم يجب أن يكون أقل من 50 حرف'),
  email: Yup.string()
    .email('البريد الإلكتروني غير صحيح')
    .required('البريد الإلكتروني مطلوب'),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, 'رقم الهاتف غير صحيح')
    .optional(),
  subject: Yup.string()
    .required('الموضوع مطلوب')
    .min(5, 'الموضوع يجب أن يكون على الأقل 5 أحرف')
    .max(100, 'الموضوع يجب أن يكون أقل من 100 حرف'),
  message: Yup.string()
    .required('الرسالة مطلوب')
    .min(10, 'الرسالة يجب أن تكون على الأقل 10 أحرف')
    .max(1000, 'الرسالة يجب أن تكون أقل من 1000 حرف'),
});

const ContactForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { submitContact, loading } = useContacts();

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    const success = await submitContact(values);
    
    if (success) {
      setIsSubmitted(true);
      resetForm();
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
          <h3 className="text-2xl font-bold mb-2 text-green-800">تم الإرسال بنجاح!</h3>
          <p className="text-muted-foreground mb-6">
            شكراً لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.
          </p>
          <Button onClick={() => setIsSubmitted(false)}>
            إرسال رسالة أخرى
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
          <MessageSquare className="w-6 h-6" />
          تواصل معنا
        </CardTitle>
        <p className="text-center text-muted-foreground">
          نحن هنا لمساعدتك. أرسل لنا رسالتك وسنرد عليك في أقرب وقت ممكن.
        </p>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={contactSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    الاسم الكامل *
                  </Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    placeholder="أدخل اسمك الكامل"
                    className={errors.name && touched.name ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    البريد الإلكتروني *
                  </Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="مثال@البريد.com"
                    className={errors.email && touched.email ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  رقم الهاتف (اختياري)
                </Label>
                <Field
                  as={Input}
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+212 6XX XXX XXX"
                  className={errors.phone && touched.phone ? 'border-red-500' : ''}
                />
                <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">الموضوع *</Label>
                <Select onValueChange={(value) => setFieldValue('subject', value)}>
                  <SelectTrigger className={errors.subject && touched.subject ? 'border-red-500' : ''}>
                    <SelectValue placeholder="اختر موضوع الرسالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">استفسار عام</SelectItem>
                    <SelectItem value="membership">العضوية</SelectItem>
                    <SelectItem value="donation">التبرعات</SelectItem>
                    <SelectItem value="activities">الأنشطة</SelectItem>
                    <SelectItem value="events">الفعاليات</SelectItem>
                    <SelectItem value="volunteer">التطوع</SelectItem>
                    <SelectItem value="partnership">الشراكة</SelectItem>
                    <SelectItem value="other">أخرى</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage name="subject" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">الرسالة *</Label>
                <Field
                  as={Textarea}
                  id="message"
                  name="message"
                  placeholder="اكتب رسالتك هنا..."
                  rows={6}
                  className={errors.message && touched.message ? 'border-red-500' : ''}
                />
                <ErrorMessage name="message" component="div" className="text-red-500 text-sm" />
                <p className="text-sm text-muted-foreground">
                  {values.message.length}/1000 حرف
                </p>
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
                    جاري الإرسال...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 ml-2" />
                    إرسال الرسالة
                  </>
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
