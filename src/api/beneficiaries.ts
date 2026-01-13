import { Beneficiary } from '@/lib/mockDatabase';
import { mockDatabase } from '@/lib/mockDatabase';
import { sanitizeString, safeParseDate, isValidEmail, isValidPhone, getErrorMessage } from '@/lib/utils/errorHandler';

export interface BeneficiaryData {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  disabilityType?: string;
  disabilityLevel?: string;
  medicalNotes?: string;
  needsAssessment?: string;
}

/**
 * Validates and sanitizes beneficiary data before processing
 */
const validateAndSanitizeBeneficiaryData = (data: BeneficiaryData): BeneficiaryData => {
  // Validate required fields
  if (!data.firstName || !data.lastName) {
    throw new Error('الاسم واللقب مطلوبان');
  }

  // Validate email if provided
  if (data.email && !isValidEmail(data.email)) {
    throw new Error('البريد الإلكتروني غير صحيح');
  }

  // Validate phone if provided
  if (data.phone && !isValidPhone(data.phone)) {
    throw new Error('رقم الهاتف غير صحيح');
  }

  return {
    firstName: sanitizeString(data.firstName, 50),
    lastName: sanitizeString(data.lastName, 50),
    dateOfBirth: data.dateOfBirth 
      ? safeParseDate(data.dateOfBirth, new Date())?.toISOString() 
      : undefined,
    gender: data.gender,
    phone: data.phone ? sanitizeString(data.phone, 20) : undefined,
    email: data.email ? sanitizeString(data.email, 100) : undefined,
    address: data.address ? sanitizeString(data.address, 200) : undefined,
    city: data.city ? sanitizeString(data.city, 100) : undefined,
    postalCode: data.postalCode ? sanitizeString(data.postalCode, 20) : undefined,
    disabilityType: data.disabilityType ? sanitizeString(data.disabilityType, 100) : undefined,
    disabilityLevel: data.disabilityLevel ? sanitizeString(data.disabilityLevel, 100) : undefined,
    medicalNotes: data.medicalNotes ? sanitizeString(data.medicalNotes, 1000) : undefined,
    needsAssessment: data.needsAssessment ? sanitizeString(data.needsAssessment, 1000) : undefined,
  };
};

export const createBeneficiary = async (data: BeneficiaryData) => {
  try {
    const sanitizedData = validateAndSanitizeBeneficiaryData(data);
    
    const beneficiary = await mockDatabase.createBeneficiary({
      ...sanitizedData,
      applicationDate: new Date().toISOString(),
      status: 'PENDING',
      isActive: true,
    });
    
    return { success: true, data: beneficiary };
  } catch (error) {
    console.error('Error creating beneficiary:', error);
    return { success: false, error: getErrorMessage(error) };
  }
};

export const getBeneficiaries = async (page = 1, limit = 10, status?: Beneficiary['status']) => {
  try {
    const result = await mockDatabase.getBeneficiaries(page, limit, status);
    return {
      success: true,
      beneficiaries: result.beneficiaries,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching beneficiaries:', error);
    return { success: false, error: 'Failed to fetch beneficiaries' };
  }
};

export const getBeneficiaryById = async (id: string) => {
  try {
    const beneficiary = await mockDatabase.getBeneficiaryById(id);
    if (!beneficiary) {
      return { success: false, error: 'Beneficiary not found' };
    }
    return { success: true, data: beneficiary };
  } catch (error) {
    console.error('Error fetching beneficiary:', error);
    return { success: false, error: 'Failed to fetch beneficiary' };
  }
};

export const updateBeneficiary = async (id: string, data: Partial<BeneficiaryData & { status?: Beneficiary['status'] }>) => {
  try {
    if (!id || typeof id !== 'string') {
      return { success: false, error: 'معرف غير صحيح' };
    }

    // Only sanitize if we have data to sanitize
    const sanitizedData = data.firstName || data.lastName 
      ? validateAndSanitizeBeneficiaryData(data as BeneficiaryData)
      : { ...data };

    const beneficiary = await mockDatabase.updateBeneficiary(id, sanitizedData);
    if (!beneficiary) {
      return { success: false, error: 'المستفيد غير موجود' };
    }
    return { success: true, data: beneficiary };
  } catch (error) {
    console.error('Error updating beneficiary:', error);
    return { success: false, error: getErrorMessage(error) };
  }
};

export const deleteBeneficiary = async (id: string) => {
  try {
    const success = await mockDatabase.deleteBeneficiary(id);
    if (!success) {
      return { success: false, error: 'Beneficiary not found' };
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting beneficiary:', error);
    return { success: false, error: 'Failed to delete beneficiary' };
  }
};

export const assignWheelchair = async (beneficiaryId: string, wheelchairId: string, assignedBy?: string) => {
  try {
    if (!beneficiaryId || typeof beneficiaryId !== 'string') {
      return { success: false, error: 'معرف المستفيد غير صحيح' };
    }
    if (!wheelchairId || typeof wheelchairId !== 'string') {
      return { success: false, error: 'معرف الكرسي المتحرك غير صحيح' };
    }

    const result = await mockDatabase.assignWheelchair(
      beneficiaryId, 
      wheelchairId, 
      assignedBy ? sanitizeString(assignedBy, 100) : undefined
    );
    if (!result.beneficiary || !result.wheelchair) {
      return { success: false, error: 'فشل في إسناد الكرسي المتحرك. تحقق من توفر الكرسي.' };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error('Error assigning wheelchair:', error);
    return { success: false, error: getErrorMessage(error) };
  }
};

export const deliverWheelchair = async (
  beneficiaryId: string,
  deliveryDate: string,
  deliveryLocation: string,
  ceremonyDate?: string
) => {
  try {
    if (!beneficiaryId || typeof beneficiaryId !== 'string') {
      return { success: false, error: 'معرف المستفيد غير صحيح' };
    }
    if (!deliveryDate || !deliveryLocation) {
      return { success: false, error: 'تاريخ ومكان التسليم مطلوبان' };
    }

    const parsedDeliveryDate = safeParseDate(deliveryDate, new Date());
    if (!parsedDeliveryDate) {
      return { success: false, error: 'تاريخ التسليم غير صحيح' };
    }

    const parsedCeremonyDate = ceremonyDate ? safeParseDate(ceremonyDate, new Date()) : undefined;

    const beneficiary = await mockDatabase.getBeneficiaryById(beneficiaryId);
    if (!beneficiary) {
      return { success: false, error: 'المستفيد غير موجود' };
    }
    
    const updated = await mockDatabase.updateBeneficiary(beneficiaryId, {
      status: 'DELIVERED',
      deliveryDate: parsedDeliveryDate.toISOString(),
      deliveryLocation: sanitizeString(deliveryLocation, 200),
      ceremonyDate: parsedCeremonyDate?.toISOString(),
    });
    
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error delivering wheelchair:', error);
    return { success: false, error: getErrorMessage(error) };
  }
};

export const addFollowUp = async (
  beneficiaryId: string,
  followUpDate: string,
  followUpNotes: string,
  satisfactionRating?: number,
  feedback?: string
) => {
  try {
    if (!beneficiaryId || typeof beneficiaryId !== 'string') {
      return { success: false, error: 'معرف المستفيد غير صحيح' };
    }
    if (!followUpDate || !followUpNotes) {
      return { success: false, error: 'تاريخ وملاحظات المتابعة مطلوبان' };
    }

    const parsedFollowUpDate = safeParseDate(followUpDate, new Date());
    if (!parsedFollowUpDate) {
      return { success: false, error: 'تاريخ المتابعة غير صحيح' };
    }

    const validatedRating = satisfactionRating !== undefined 
      ? safeParseNumber(satisfactionRating, 1, 5) 
      : undefined;

    if (satisfactionRating !== undefined && !validatedRating) {
      return { success: false, error: 'تقييم الرضا يجب أن يكون بين 1 و 5' };
    }

    const updated = await mockDatabase.updateBeneficiary(beneficiaryId, {
      status: 'FOLLOW_UP',
      followUpDate: parsedFollowUpDate.toISOString(),
      followUpNotes: sanitizeString(followUpNotes, 1000),
      satisfactionRating: validatedRating,
      feedback: feedback ? sanitizeString(feedback, 1000) : undefined,
    });
    
    if (!updated) {
      return { success: false, error: 'المستفيد غير موجود' };
    }
    
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error adding follow-up:', error);
    return { success: false, error: getErrorMessage(error) };
  }
};

export const getBeneficiaryStats = async () => {
  try {
    const stats = await mockDatabase.getBeneficiaryStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error('Error fetching beneficiary stats:', error);
    return { success: false, error: 'Failed to fetch beneficiary stats' };
  }
};
