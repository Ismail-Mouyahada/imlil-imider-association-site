import { Wheelchair } from '@/lib/mockDatabase';
import { mockDatabase } from '@/lib/mockDatabase';
import { sanitizeString, safeParseNumber, safeParseDate, getErrorMessage } from '@/lib/utils/errorHandler';

export interface WheelchairData {
  serialNumber?: string;
  brand?: string;
  model?: string;
  type: 'MANUAL' | 'ELECTRIC' | 'SPORTS' | 'STANDARD';
  condition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'NEEDS_REPAIR';
  source: 'PURCHASE' | 'DONATION' | 'PARTNER' | 'GOVERNMENT';
  donorName?: string;
  donorContact?: string;
  purchaseDate?: string;
  receivedDate?: string;
  cost?: number;
  maintenanceNotes?: string;
  notes?: string;
}

/**
 * Validates and sanitizes wheelchair data before processing
 */
const validateAndSanitizeWheelchairData = (data: WheelchairData): WheelchairData => {
  return {
    ...data,
    serialNumber: data.serialNumber ? sanitizeString(data.serialNumber, 100) : undefined,
    brand: data.brand ? sanitizeString(data.brand, 100) : undefined,
    model: data.model ? sanitizeString(data.model, 100) : undefined,
    donorName: data.donorName ? sanitizeString(data.donorName, 100) : undefined,
    donorContact: data.donorContact ? sanitizeString(data.donorContact, 100) : undefined,
    maintenanceNotes: data.maintenanceNotes ? sanitizeString(data.maintenanceNotes, 1000) : undefined,
    notes: data.notes ? sanitizeString(data.notes, 1000) : undefined,
    cost: data.cost !== undefined ? safeParseNumber(data.cost, 0, 100000) ?? undefined : undefined,
    purchaseDate: data.purchaseDate ? safeParseDate(data.purchaseDate, new Date())?.toISOString() : undefined,
    receivedDate: data.receivedDate 
      ? safeParseDate(data.receivedDate, new Date())?.toISOString() 
      : new Date().toISOString(),
  };
};

export const createWheelchair = async (data: WheelchairData) => {
  try {
    // Validate required fields
    if (!data.type || !data.condition || !data.source) {
      return { success: false, error: 'الحقول المطلوبة مفقودة' };
    }

    const sanitizedData = validateAndSanitizeWheelchairData(data);
    
    const wheelchair = await mockDatabase.createWheelchair({
      serialNumber: sanitizedData.serialNumber,
      brand: sanitizedData.brand,
      model: sanitizedData.model,
      type: sanitizedData.type,
      condition: sanitizedData.condition,
      source: sanitizedData.source,
      donorName: sanitizedData.donorName,
      donorContact: sanitizedData.donorContact,
      purchaseDate: sanitizedData.purchaseDate,
      receivedDate: sanitizedData.receivedDate || new Date().toISOString(),
      cost: sanitizedData.cost,
      status: 'AVAILABLE',
      maintenanceNotes: sanitizedData.maintenanceNotes,
      notes: sanitizedData.notes,
    });
    
    return { success: true, data: wheelchair };
  } catch (error) {
    console.error('Error creating wheelchair:', error);
    return { success: false, error: getErrorMessage(error) };
  }
};

export const getWheelchairs = async (page = 1, limit = 10, status?: Wheelchair['status']) => {
  try {
    const result = await mockDatabase.getWheelchairs(page, limit, status);
    return {
      success: true,
      wheelchairs: result.wheelchairs,
      pagination: {
        page,
        limit,
        total: result.total,
        pages: Math.ceil(result.total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching wheelchairs:', error);
    return { success: false, error: 'Failed to fetch wheelchairs' };
  }
};

export const getWheelchairById = async (id: string) => {
  try {
    const wheelchair = await mockDatabase.getWheelchairById(id);
    if (!wheelchair) {
      return { success: false, error: 'Wheelchair not found' };
    }
    return { success: true, data: wheelchair };
  } catch (error) {
    console.error('Error fetching wheelchair:', error);
    return { success: false, error: 'Failed to fetch wheelchair' };
  }
};

export const updateWheelchair = async (id: string, data: Partial<WheelchairData>) => {
  try {
    if (!id || typeof id !== 'string') {
      return { success: false, error: 'معرف غير صحيح' };
    }

    const sanitizedData = validateAndSanitizeWheelchairData(data as WheelchairData);
    
    const wheelchair = await mockDatabase.updateWheelchair(id, sanitizedData);
    if (!wheelchair) {
      return { success: false, error: 'الكرسي المتحرك غير موجود' };
    }
    return { success: true, data: wheelchair };
  } catch (error) {
    console.error('Error updating wheelchair:', error);
    return { success: false, error: getErrorMessage(error) };
  }
};

export const deleteWheelchair = async (id: string) => {
  try {
    if (!id || typeof id !== 'string') {
      return { success: false, error: 'معرف غير صحيح' };
    }

    const success = await mockDatabase.deleteWheelchair(id);
    if (!success) {
      return { success: false, error: 'الكرسي المتحرك غير موجود' };
    }
    return { success: true };
  } catch (error) {
    console.error('Error deleting wheelchair:', error);
    return { success: false, error: getErrorMessage(error) };
  }
};

export const getWheelchairStats = async () => {
  try {
    const stats = await mockDatabase.getWheelchairStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error('Error fetching wheelchair stats:', error);
    return { success: false, error: 'Failed to fetch wheelchair stats' };
  }
};
