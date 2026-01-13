import * as Yup from 'yup';

export const wheelchairSchema = Yup.object({
  serialNumber: Yup.string()
    .max(100, 'الرقم التسلسلي يجب أن يكون أقل من 100 حرف')
    .optional(),
  brand: Yup.string()
    .max(100, 'العلامة التجارية يجب أن تكون أقل من 100 حرف')
    .optional(),
  model: Yup.string()
    .max(100, 'النموذج يجب أن يكون أقل من 100 حرف')
    .optional(),
  type: Yup.string()
    .oneOf(['MANUAL', 'ELECTRIC', 'SPORTS', 'STANDARD'], 'نوع غير صحيح')
    .required('النوع مطلوب'),
  condition: Yup.string()
    .oneOf(['EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_REPAIR'], 'حالة غير صحيحة')
    .required('الحالة مطلوبة'),
  source: Yup.string()
    .oneOf(['PURCHASE', 'DONATION', 'PARTNER', 'GOVERNMENT'], 'مصدر غير صحيح')
    .required('المصدر مطلوب'),
  donorName: Yup.string()
    .max(100, 'اسم المتبرع يجب أن يكون أقل من 100 حرف')
    .optional(),
  donorContact: Yup.string()
    .max(100, 'جهة الاتصال يجب أن تكون أقل من 100 حرف')
    .optional(),
  purchaseDate: Yup.date()
    .max(new Date(), 'تاريخ الشراء لا يمكن أن يكون في المستقبل')
    .optional(),
  receivedDate: Yup.date()
    .max(new Date(), 'تاريخ الاستلام لا يمكن أن يكون في المستقبل')
    .required('تاريخ الاستلام مطلوب'),
  cost: Yup.number()
    .min(0, 'التكلفة يجب أن تكون أكبر من أو تساوي 0')
    .max(100000, 'التكلفة يجب أن تكون أقل من 100,000 درهم')
    .optional(),
  maintenanceNotes: Yup.string()
    .max(1000, 'ملاحظات الصيانة يجب أن تكون أقل من 1000 حرف')
    .optional(),
  notes: Yup.string()
    .max(1000, 'الملاحظات يجب أن تكون أقل من 1000 حرف')
    .optional(),
});

export const beneficiarySchema = Yup.object({
  firstName: Yup.string()
    .required('الاسم مطلوب')
    .min(2, 'الاسم يجب أن يكون على الأقل حرفين')
    .max(50, 'الاسم يجب أن يكون أقل من 50 حرف')
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/, 'الاسم يجب أن يحتوي على أحرف فقط'),
  lastName: Yup.string()
    .required('اللقب مطلوب')
    .min(2, 'اللقب يجب أن يكون على الأقل حرفين')
    .max(50, 'اللقب يجب أن يكون أقل من 50 حرف')
    .matches(/^[\u0600-\u06FFa-zA-Z\s]+$/, 'اللقب يجب أن يحتوي على أحرف فقط'),
  dateOfBirth: Yup.date()
    .max(new Date(), 'تاريخ الميلاد لا يمكن أن يكون في المستقبل')
    .optional(),
  gender: Yup.string()
    .oneOf(['MALE', 'FEMALE', 'OTHER'], 'جنس غير صحيح')
    .optional(),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]+$/, 'رقم الهاتف غير صحيح')
    .min(8, 'رقم الهاتف يجب أن يكون على الأقل 8 أرقام')
    .max(20, 'رقم الهاتف يجب أن يكون أقل من 20 حرف')
    .optional(),
  email: Yup.string()
    .email('البريد الإلكتروني غير صحيح')
    .max(100, 'البريد الإلكتروني يجب أن يكون أقل من 100 حرف')
    .optional(),
  address: Yup.string()
    .max(200, 'العنوان يجب أن يكون أقل من 200 حرف')
    .optional(),
  city: Yup.string()
    .max(100, 'المدينة يجب أن تكون أقل من 100 حرف')
    .optional(),
  postalCode: Yup.string()
    .max(20, 'الرمز البريدي يجب أن يكون أقل من 20 حرف')
    .optional(),
  disabilityType: Yup.string()
    .max(100, 'نوع الإعاقة يجب أن يكون أقل من 100 حرف')
    .optional(),
  disabilityLevel: Yup.string()
    .max(100, 'مستوى الإعاقة يجب أن يكون أقل من 100 حرف')
    .optional(),
  medicalNotes: Yup.string()
    .max(1000, 'الملاحظات الطبية يجب أن تكون أقل من 1000 حرف')
    .optional(),
  needsAssessment: Yup.string()
    .max(1000, 'تقييم الاحتياجات يجب أن يكون أقل من 1000 حرف')
    .optional(),
});

export const assignWheelchairSchema = Yup.object({
  wheelchairId: Yup.string()
    .required('يجب اختيار كرسي متحرك'),
});

export const deliverWheelchairSchema = Yup.object({
  deliveryDate: Yup.date()
    .required('تاريخ التسليم مطلوب')
    .max(new Date(), 'تاريخ التسليم لا يمكن أن يكون في المستقبل'),
  deliveryLocation: Yup.string()
    .required('مكان التسليم مطلوب')
    .min(3, 'مكان التسليم يجب أن يكون على الأقل 3 أحرف')
    .max(200, 'مكان التسليم يجب أن يكون أقل من 200 حرف'),
  ceremonyDate: Yup.date()
    .max(new Date(), 'تاريخ الحفل لا يمكن أن يكون في المستقبل')
    .optional(),
});

export const followUpSchema = Yup.object({
  followUpDate: Yup.date()
    .required('تاريخ المتابعة مطلوب')
    .max(new Date(), 'تاريخ المتابعة لا يمكن أن يكون في المستقبل'),
  followUpNotes: Yup.string()
    .required('ملاحظات المتابعة مطلوبة')
    .min(10, 'ملاحظات المتابعة يجب أن تكون على الأقل 10 أحرف')
    .max(1000, 'ملاحظات المتابعة يجب أن تكون أقل من 1000 حرف'),
  satisfactionRating: Yup.number()
    .required('تقييم الرضا مطلوب')
    .min(1, 'التقييم يجب أن يكون على الأقل 1')
    .max(5, 'التقييم يجب أن يكون على الأكثر 5')
    .integer('التقييم يجب أن يكون رقماً صحيحاً'),
  feedback: Yup.string()
    .max(1000, 'ملاحظات المستفيد يجب أن تكون أقل من 1000 حرف')
    .optional(),
});
