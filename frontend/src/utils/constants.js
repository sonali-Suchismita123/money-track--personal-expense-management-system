/* =============================================
   MoneyTrack – Utility / Constants
   ============================================= */

/** Category icon options (emoji) */
export const CATEGORY_ICONS = [
  '🍔', '🛒', '🏠', '🚗', '💊', '📚', '🎬', '✈️',
  '👗', '💄', '🎮', '💪', '☕', '🎁', '🐾', '🔧',
  '💡', '📱', '🏦', '💰'
];

/** Category color options */
export const CATEGORY_COLORS = [
  '#6C63FF', '#FF6584', '#4CAF50', '#FF9800',
  '#2196F3', '#9C27B0', '#F44336', '#00BCD4',
  '#FF5722', '#8BC34A', '#607D8B', '#E91E63'
];

/** Currency options */
export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

/** Month names */
export const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

/** Short month names */
export const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/** Transaction types */
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

/** Navigation items */
export const NAV_ITEMS = [
  { path: '/dashboard',    label: 'Dashboard',    icon: '💰' },
  { path: '/transactions', label: 'Transactions', icon: '📊' },
  { path: '/categories',   label: 'Categories',   icon: '🏷️' },
  { path: '/budgets',      label: 'Budgets',      icon: '🎯' },
  { path: '/savings',      label: 'Savings',      icon: '💎' },
  { path: '/reports',      label: 'Reports',      icon: '📈' },
  { path: '/profile',      label: 'Profile',      icon: '👤' },
];

/** Recharts custom colors palette */
export const CHART_COLORS = [
  '#6C63FF', '#FF6584', '#4CAF50', '#FF9800',
  '#2196F3', '#9C27B0', '#00BCD4', '#FF5722',
];

/** Default system categories */
export const SYSTEM_CATEGORIES = [
  'Salary', 'Food & Dining', 'Transport', 'Shopping',
  'Healthcare', 'Entertainment', 'Utilities', 'Education'
];
