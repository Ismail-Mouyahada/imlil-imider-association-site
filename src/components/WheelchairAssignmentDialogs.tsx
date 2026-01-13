import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { assignWheelchairSchema, deliverWheelchairSchema, followUpSchema } from '@/lib/validations/wheelchairSchemas';
import { Beneficiary } from '@/lib/mockDatabase';
import { Wheelchair } from '@/lib/mockDatabase';

interface AssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  beneficiary: Beneficiary | null;
  availableWheelchairs: Wheelchair[];
  onSubmit: (wheelchairId: string) => Promise<boolean>;
  loading?: boolean;
}

export const AssignDialog = ({ open, onOpenChange, beneficiary, availableWheelchairs, onSubmit, loading }: AssignDialogProps) => {
  if (!beneficiary) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إسناد كرسي متحرك</DialogTitle>
          <DialogDescription>
            إسناد كرسي متحرك إلى {beneficiary.firstName} {beneficiary.lastName}
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={{ wheelchairId: '' }}
          validationSchema={assignWheelchairSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const success = await onSubmit(values.wheelchairId);
            if (success) {
              onOpenChange(false);
            }
            setSubmitting(false);
          }}
        >
          {({ errors, touched, setFieldValue, values, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Label>اختر كرسي متحرك *</Label>
                <Select
                  value={values.wheelchairId}
                  onValueChange={(value) => setFieldValue('wheelchairId', value)}
                >
                  <SelectTrigger className={errors.wheelchairId && touched.wheelchairId ? 'border-red-500' : ''}>
                    <SelectValue placeholder="اختر كرسي متحرك" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWheelchairs.map((wc) => (
                      <SelectItem key={wc.id} value={wc.id}>
                        {wc.serialNumber || wc.brand || 'كرسي متحرك'} - {wc.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.wheelchairId && touched.wheelchairId && (
                  <div className="text-red-500 text-sm mt-1">{errors.wheelchairId}</div>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting || loading}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={isSubmitting || loading || !values.wheelchairId}>
                  {isSubmitting || loading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري الإسناد...
                    </>
                  ) : (
                    'إسناد'
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

interface DeliverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  beneficiary: Beneficiary | null;
  onSubmit: (deliveryDate: string, deliveryLocation: string, ceremonyDate?: string) => Promise<boolean>;
  loading?: boolean;
}

export const DeliverDialog = ({ open, onOpenChange, beneficiary, onSubmit, loading }: DeliverDialogProps) => {
  if (!beneficiary) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تسجيل تسليم الكرسي المتحرك</DialogTitle>
          <DialogDescription>
            تسجيل تسليم الكرسي المتحرك إلى {beneficiary.firstName} {beneficiary.lastName}
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={{
            deliveryDate: new Date().toISOString().split('T')[0],
            deliveryLocation: '',
            ceremonyDate: '',
          }}
          validationSchema={deliverWheelchairSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const success = await onSubmit(
              values.deliveryDate,
              values.deliveryLocation,
              values.ceremonyDate || undefined
            );
            if (success) {
              onOpenChange(false);
            }
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Label htmlFor="deliveryDate">تاريخ التسليم *</Label>
                <Field
                  as={Input}
                  type="date"
                  id="deliveryDate"
                  name="deliveryDate"
                  className={errors.deliveryDate && touched.deliveryDate ? 'border-red-500' : ''}
                />
                <ErrorMessage name="deliveryDate" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <Label htmlFor="deliveryLocation">مكان التسليم *</Label>
                <Field
                  as={Input}
                  id="deliveryLocation"
                  name="deliveryLocation"
                  placeholder="أدخل مكان التسليم"
                  className={errors.deliveryLocation && touched.deliveryLocation ? 'border-red-500' : ''}
                />
                <ErrorMessage name="deliveryLocation" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <Label htmlFor="ceremonyDate">تاريخ الحفل الرمزي (اختياري)</Label>
                <Field
                  as={Input}
                  type="date"
                  id="ceremonyDate"
                  name="ceremonyDate"
                  className={errors.ceremonyDate && touched.ceremonyDate ? 'border-red-500' : ''}
                />
                <ErrorMessage name="ceremonyDate" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting || loading}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={isSubmitting || loading}>
                  {isSubmitting || loading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري التسجيل...
                    </>
                  ) : (
                    'تسجيل التسليم'
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

interface FollowUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  beneficiary: Beneficiary | null;
  onSubmit: (followUpDate: string, followUpNotes: string, satisfactionRating?: number, feedback?: string) => Promise<boolean>;
  loading?: boolean;
}

export const FollowUpDialog = ({ open, onOpenChange, beneficiary, onSubmit, loading }: FollowUpDialogProps) => {
  if (!beneficiary) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة متابعة</DialogTitle>
          <DialogDescription>
            متابعة حالة {beneficiary.firstName} {beneficiary.lastName}
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={{
            followUpDate: new Date().toISOString().split('T')[0],
            followUpNotes: '',
            satisfactionRating: 5,
            feedback: '',
          }}
          validationSchema={followUpSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const success = await onSubmit(
              values.followUpDate,
              values.followUpNotes,
              values.satisfactionRating,
              values.feedback || undefined
            );
            if (success) {
              onOpenChange(false);
            }
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Label htmlFor="followUpDate">تاريخ المتابعة *</Label>
                <Field
                  as={Input}
                  type="date"
                  id="followUpDate"
                  name="followUpDate"
                  className={errors.followUpDate && touched.followUpDate ? 'border-red-500' : ''}
                />
                <ErrorMessage name="followUpDate" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <Label htmlFor="followUpNotes">ملاحظات المتابعة *</Label>
                <Field
                  as={Textarea}
                  id="followUpNotes"
                  name="followUpNotes"
                  rows={3}
                  placeholder="أدخل ملاحظات المتابعة"
                  className={errors.followUpNotes && touched.followUpNotes ? 'border-red-500' : ''}
                />
                <ErrorMessage name="followUpNotes" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <Label htmlFor="satisfactionRating">تقييم الرضا (1-5) *</Label>
                <Field
                  as={Input}
                  type="number"
                  id="satisfactionRating"
                  name="satisfactionRating"
                  min="1"
                  max="5"
                  className={errors.satisfactionRating && touched.satisfactionRating ? 'border-red-500' : ''}
                />
                <ErrorMessage name="satisfactionRating" component="div" className="text-red-500 text-sm" />
              </div>
              <div>
                <Label htmlFor="feedback">ملاحظات المستفيد</Label>
                <Field
                  as={Textarea}
                  id="feedback"
                  name="feedback"
                  rows={3}
                  placeholder="أدخل ملاحظات المستفيد"
                  className={errors.feedback && touched.feedback ? 'border-red-500' : ''}
                />
                <ErrorMessage name="feedback" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting || loading}>
                  إلغاء
                </Button>
                <Button type="submit" disabled={isSubmitting || loading}>
                  {isSubmitting || loading ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : (
                    'إضافة متابعة'
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
