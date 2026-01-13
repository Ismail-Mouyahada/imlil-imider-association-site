import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { wheelchairSchema } from '@/lib/validations/wheelchairSchemas';
import { Wheelchair } from '@/lib/mockDatabase';
import { WheelchairData } from '@/api/wheelchairs';

interface WheelchairFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: WheelchairData) => Promise<boolean>;
  editingWheelchair?: Wheelchair | null;
  loading?: boolean;
}

const WheelchairForm = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  editingWheelchair,
  loading = false 
}: WheelchairFormProps) => {
  const initialValues: WheelchairData = editingWheelchair ? {
    serialNumber: editingWheelchair.serialNumber || '',
    brand: editingWheelchair.brand || '',
    model: editingWheelchair.model || '',
    type: editingWheelchair.type,
    condition: editingWheelchair.condition,
    source: editingWheelchair.source,
    donorName: editingWheelchair.donorName || '',
    donorContact: editingWheelchair.donorContact || '',
    purchaseDate: editingWheelchair.purchaseDate?.split('T')[0] || '',
    receivedDate: editingWheelchair.receivedDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    cost: editingWheelchair.cost || undefined,
    maintenanceNotes: editingWheelchair.maintenanceNotes || '',
    notes: editingWheelchair.notes || '',
  } : {
    type: 'STANDARD',
    condition: 'EXCELLENT',
    source: 'DONATION',
    receivedDate: new Date().toISOString().split('T')[0],
  };

  const handleSubmit = async (values: WheelchairData, { resetForm }: any) => {
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
          <DialogTitle>{editingWheelchair ? 'تعديل كرسي متحرك' : 'إضافة كرسي متحرك جديد'}</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={wheelchairSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, setFieldValue, values, isSubmitting }) => (
            <Form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">الرقم التسلسلي</Label>
                  <Field
                    as={Input}
                    id="serialNumber"
                    name="serialNumber"
                    placeholder="أدخل الرقم التسلسلي"
                    className={errors.serialNumber && touched.serialNumber ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="serialNumber" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">العلامة التجارية</Label>
                  <Field
                    as={Input}
                    id="brand"
                    name="brand"
                    placeholder="أدخل العلامة التجارية"
                    className={errors.brand && touched.brand ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="brand" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">النوع *</Label>
                  <Select
                    value={values.type}
                    onValueChange={(value) => setFieldValue('type', value)}
                  >
                    <SelectTrigger className={errors.type && touched.type ? 'border-red-500' : ''}>
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MANUAL">يدوي</SelectItem>
                      <SelectItem value="ELECTRIC">كهربائي</SelectItem>
                      <SelectItem value="SPORTS">رياضي</SelectItem>
                      <SelectItem value="STANDARD">قياسي</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && touched.type && (
                    <div className="text-red-500 text-sm">{errors.type}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">الحالة *</Label>
                  <Select
                    value={values.condition}
                    onValueChange={(value) => setFieldValue('condition', value)}
                  >
                    <SelectTrigger className={errors.condition && touched.condition ? 'border-red-500' : ''}>
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EXCELLENT">ممتاز</SelectItem>
                      <SelectItem value="GOOD">جيد</SelectItem>
                      <SelectItem value="FAIR">متوسط</SelectItem>
                      <SelectItem value="NEEDS_REPAIR">يحتاج إصلاح</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.condition && touched.condition && (
                    <div className="text-red-500 text-sm">{errors.condition}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source">المصدر *</Label>
                  <Select
                    value={values.source}
                    onValueChange={(value) => setFieldValue('source', value)}
                  >
                    <SelectTrigger className={errors.source && touched.source ? 'border-red-500' : ''}>
                      <SelectValue placeholder="اختر المصدر" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PURCHASE">شراء</SelectItem>
                      <SelectItem value="DONATION">تبرع</SelectItem>
                      <SelectItem value="PARTNER">شريك</SelectItem>
                      <SelectItem value="GOVERNMENT">حكومي</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.source && touched.source && (
                    <div className="text-red-500 text-sm">{errors.source}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="donorName">اسم المتبرع</Label>
                  <Field
                    as={Input}
                    id="donorName"
                    name="donorName"
                    placeholder="أدخل اسم المتبرع"
                    className={errors.donorName && touched.donorName ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="donorName" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receivedDate">تاريخ الاستلام *</Label>
                  <Field
                    as={Input}
                    type="date"
                    id="receivedDate"
                    name="receivedDate"
                    className={errors.receivedDate && touched.receivedDate ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="receivedDate" component="div" className="text-red-500 text-sm" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">التكلفة (درهم)</Label>
                  <Field
                    as={Input}
                    type="number"
                    id="cost"
                    name="cost"
                    placeholder="0"
                    min="0"
                    max="100000"
                    className={errors.cost && touched.cost ? 'border-red-500' : ''}
                  />
                  <ErrorMessage name="cost" component="div" className="text-red-500 text-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Field
                  as={Textarea}
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="أدخل ملاحظات إضافية"
                  className={errors.notes && touched.notes ? 'border-red-500' : ''}
                />
                <ErrorMessage name="notes" component="div" className="text-red-500 text-sm" />
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
                      {editingWheelchair ? 'جاري التحديث...' : 'جاري الإضافة...'}
                    </>
                  ) : (
                    editingWheelchair ? 'تحديث' : 'إضافة'
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

export default WheelchairForm;
