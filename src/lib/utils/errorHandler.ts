/**
 * Centralized error handling utility
 * Follows DRY principle for consistent error handling across the application
 */

export class AppError extends Error {
  code?: string;
  details?: unknown;

  constructor(message: string, code?: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Safely extracts error message from various error types
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'حدث خطأ غير متوقع';
};

/**
 * Validates and sanitizes string input
 */
export const sanitizeString = (input: string, maxLength: number = 1000): string => {
  if (typeof input !== 'string') {
    return '';
  }
  // Remove potentially dangerous characters
  let sanitized = input.trim().replace(/[<>]/g, '');
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  return sanitized;
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9+\-\s()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8;
};

/**
 * Safe number parsing with validation
 */
export const safeParseNumber = (value: unknown, min?: number, max?: number): number | null => {
  if (typeof value === 'number') {
    if (min !== undefined && value < min) return null;
    if (max !== undefined && value > max) return null;
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) return null;
    if (min !== undefined && parsed < min) return null;
    if (max !== undefined && parsed > max) return null;
    return parsed;
  }
  return null;
};

/**
 * Safe date parsing with validation
 */
export const safeParseDate = (value: unknown, maxDate?: Date): Date | null => {
  if (value instanceof Date) {
    if (maxDate && value > maxDate) return null;
    return value;
  }
  if (typeof value === 'string') {
    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) return null;
    if (maxDate && parsed > maxDate) return null;
    return parsed;
  }
  return null;
};
