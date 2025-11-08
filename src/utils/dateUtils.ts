/**
 * Date Utilities
 * Helper functions for date formatting and manipulation
 */

import { format, parseISO, isValid, isPast, isFuture, differenceInYears } from 'date-fns';

/**
 * Format date to display format (e.g., "Jan 15, 2024")
 */
export function formatDate(date: string | Date, dateFormat = 'MMM dd, yyyy'): string {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, dateFormat);
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format date and time
 */
export function formatDateTime(date: string | Date, dateFormat = 'MMM dd, yyyy HH:mm'): string {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, dateFormat);
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format time only
 */
export function formatTime(date: string | Date, timeFormat = 'HH:mm'): string {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return format(parsedDate, timeFormat);
  } catch {
    return 'Invalid time';
  }
}

/**
 * Check if date is in the past
 */
export function isDateInPast(date: string | Date): boolean {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isPast(parsedDate);
  } catch {
    return false;
  }
}

/**
 * Check if date is in the future
 */
export function isDateInFuture(date: string | Date): boolean {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isFuture(parsedDate);
  } catch {
    return false;
  }
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: string | Date): number {
  try {
    const dob = typeof dateOfBirth === 'string' ? parseISO(dateOfBirth) : dateOfBirth;
    return differenceInYears(new Date(), dob);
  } catch {
    return 0;
  }
}

/**
 * Validate date string
 */
export function isValidDate(date: string | Date): boolean {
  try {
    const parsedDate = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsedDate);
  } catch {
    return false;
  }
}

/**
 * Get current date in ISO format
 */
export function getCurrentDate(): string {
  return new Date().toISOString();
}

/**
 * Get current date as Date object
 */
export function getTodayDate(): Date {
  return new Date();
}

