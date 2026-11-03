import { MONTHS, MONTHS_SHORT } from './constants';

/**
 * Format a number as currency string.
 * @param {number} amount
 * @param {string} currency - 'INR' | 'USD' | 'EUR' | 'GBP' etc.
 * @returns {string} e.g. "₹1,234.56"
 */
export function formatCurrency(amount, currency = 'INR') {
  if (amount === null || amount === undefined || isNaN(amount)) return '–';
  const num = parseFloat(amount);
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${num.toFixed(2)}`;
  }
}

/**
 * Format a date string as "01 Nov 2026"
 * @param {string|Date} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '–';
  try {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format month/year as "November 2026"
 * @param {number} month - 1-indexed
 * @param {number} year
 * @returns {string}
 */
export function formatMonth(month, year) {
  if (!month || !year) return '';
  return `${MONTHS[month - 1]} ${year}`;
}

/**
 * Get initials from a full name.
 * @param {string} name
 * @returns {string} e.g. "JD"
 */
export function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Capitalize first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Get month name from 1-indexed month number.
 * @param {number} month
 * @returns {string}
 */
export function getMonthName(month) {
  if (month < 1 || month > 12) return '';
  return MONTHS[month - 1];
}

/**
 * Get short month name from 1-indexed month number.
 * @param {number} month
 * @returns {string}
 */
export function getMonthShort(month) {
  if (month < 1 || month > 12) return '';
  return MONTHS_SHORT[month - 1];
}

/**
 * Truncate text to a given length, appending '...'
 * @param {string} text
 * @param {number} length
 * @returns {string}
 */
export function truncateText(text, length = 40) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Calculate days remaining from today to a deadline.
 * @param {string|Date} deadline
 * @returns {number} positive = future, negative = past
 */
export function daysRemaining(deadline) {
  if (!deadline) return 0;
  const end = new Date(deadline);
  const now = new Date();
  const diff = end - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Get a percentage value clamped between 0 and 100.
 * @param {number} value
 * @param {number} total
 * @returns {number}
 */
export function getPercentage(value, total) {
  if (!total || total === 0) return 0;
  return Math.min(100, Math.max(0, (value / total) * 100));
}

/**
 * Format a number with commas (no currency symbol).
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(parseFloat(num));
}

/**
 * Convert transactions array to CSV string and trigger download.
 * @param {Array} data
 * @param {string} filename
 */
export function exportToCSV(data, filename = 'export.csv') {
  if (!data || data.length === 0) return;
  const keys = Object.keys(data[0]);
  const csvHeader = keys.join(',');
  const csvRows = data.map(row =>
    keys.map(k => {
      const val = row[k] ?? '';
      return typeof val === 'string' && val.includes(',')
        ? `"${val}"`
        : val;
    }).join(',')
  );
  const csvContent = [csvHeader, ...csvRows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
