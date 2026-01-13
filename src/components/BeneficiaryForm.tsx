import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { beneficiarySchema } from '@/lib/validations/wheelchairSchemas';
import { Beneficiary } from '@/lib/mockDatabase';
import { BeneficiaryData } from '@/api/beneficiaries';

interface BeneficiaryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: BeneficiaryData) => Promise<boolean>;
  editingBeneficiary?: Beneficiary | null;
  loading?: boolean;
}

const BeneficiaryForm = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  editingBeneficiary,
  loading = false 
}: BeneficiaryFormProps) => {
  const initialValues: BeneficiaryData = editingBeneficiary ? {
    firstName: editingBeneficiary.firstName,
    lastName: editingBeneficiary.lastName,
    dateOfBirth: editingBeneficiary.dateOfBirth?.split('T')[0] || '',
    gender: editingBeneficiary.gender,
    phone: editingBeneficiary.phone || '',
    email: editingBeneficiary.email || '',
    address: editingBeneficiary.address || '',
    city: editingBeneficiary.city || '',
    postalCode: editingBeneficiary.postalCode || '',
    disabilityType: editingBeneficiary.disabilityType || '',
    disabilityLevel: editingBeneficiary.disabilityLevel || '',
    medicalNotes: editingBeneficiary.medicalNotes || '',
    needsAssessment: editingBeneficiary.needsAssessment || '',
  } : {
    firstName: '',
    lastName: '',
  };

  const handleSubmit = async (values: BeneficiaryData, { resetForm }: any) => {
    const success = await onSubmit(values);
    if (success) {
      resetForm();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingBeneficiary ? 'تعديل مستفيد' : 'إضافة مستفيد جديد'}</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={beneficiarySchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue, values, isSubmitting }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">الاسم *</Label>
                  <Field
                    as={Input}
                    id="firstName"
                    name="firstName"
                    placeholder="أدخل الاسم"
                    className={errors.firstName && touched.firstName ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">اللقب *</Label>
                  <Field
                    as={Input}
                    id="lastName"
                    name="lastName"
                    placeholder="أدخل اللقب"
                    className={errors.lastName && touched.lastName ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">تاريخ الميلاد</Label>
                  <Field
                    as={Input}
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    className={errors.dateOfBirth && touched.dateOfBirth ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="dateOfBirth" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">الجنس</Label>
                  <Select
                    value={values.gender || ''}
                    onValueChange={(value) => setFieldValue('gender', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الجنس" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">ذكر</SelectItem>
                      <SelectItem value="FEMALE">أنثى</SelectItem>
                      <SelectItem value="OTHER">آخر</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && touched.gender && (
                    <div className="text-red-500 text-sm">{errors.gender}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">الهاتف</Label>
                  <Field
                    as={Input}
                    id="phone"
                    name="phone"
                    placeholder="أدخل رقم الهاتف"
                    className={errors.phone && touched.phone ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Field
                    as={Input}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="أدخل البريد الإلكتروني"
                    className={errors.email && touched.email ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Field
                    as={Input}
                    id="address"
                    name="address"
                    placeholder="أدخل العنوان"
                    className={errors.address && touched.address ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">المدينة</Label>
                  <Field
                    as={Input}
                    id="city"
                    name="city"
                    placeholder="أدخل المدينة"
                    className={errors.city && touched.city ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="city" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disabilityType">نوع الإعاقة</Label>
                  <Field
                    as={Input}
                    id="disabilityType"
                    name="disabilityType"
                    placeholder="أدخل نوع الإعاقة"
                    className={errors.disabilityType && touched.disabilityType ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="disabilityType" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disabilityLevel">مستوى الإعاقة</Label>
                  <Field
                    as={Input}
                    id="disabilityLevel"
                    name="disabilityLevel"
                    placeholder="أدخل مستوى الإعاقة"
                    className={errors.disabilityLevel && touched.disabilityLevel ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="disabilityLevel" component="div" className="text-red-500 text-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalNotes">ملاحظات طبية</Label>
                <Field
                  as={Textarea}
                  id="medicalNotes"
                  name="medicalNotes"
                  rows={3}
                  placeholder="أدخل الملاحظات الطبية"
                  className={errors.medicalNotes && touched.medicalNotes ? 'border-red-500' : ''}
                />
                <ErrorMessage name="medicalNotes" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="needsAssessment">تقييم الاحتياجات</Label>
                <Field
                  as={Textarea}
                  id="needsAssessment"
                  name="needsAssessment"
                  rows={3}
                  placeholder="أدخل تقييم الاحتياجات"
                  className={errors.needsAssessment && touched.needsAssessment ? 'border-red-500' : ''}
                />
                <ErrorMessage name="needsAssessment" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting || loading}
                >
                  إلغاء
                </Button>
                <Button type="submit" disabled={isSubmitting || loading}>
                  {isSubmitting || loading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      {editingBeneficiary ? 'جاري التحديث...' : 'جاري الإضافة...'}
                    </>
                  ) : (
                    editingBeneficiary ? 'تحديث' : 'إضافة'
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default BeneficiaryForm;
