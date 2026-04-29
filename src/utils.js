// Utility functions for the real estate app

// Format currency for display
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '0 ر.س';
  return `${amount.toLocaleString('ar-SA')} ر.س`;
};

// Format date in Arabic
export const formatDateArabic = (date) => {
  if (!date) return '-';
  const options = { year: 'numeric', month: 'long', day: 'numeric', locale: 'ar-SA' };
  return new Date(date).toLocaleDateString('ar-SA', options);
};

// Validate phone number
export const validatePhone = (phone) => {
  const phoneRegex = /^(\+966|0)?[5][0-9]{8}$/;
  return phoneRegex.test(phone);
};

// Validate email
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Calculate occupancy rate
export const calculateOccupancyRate = (occupied, total) => {
  if (total === 0) return 0;
  return Math.round((occupied / total) * 100);
};

// Calculate monthly payment schedule
export const calculateMonthlyPayments = (startDate, endDate, rentValue, tax = 0, paymentType = 'monthly') => {
  if (!startDate || !endDate) return [];
  
  const payments = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let current = new Date(start);
  
  while (current <= end) {
    const nextMonth = new Date(current.getFullYear(), current.getMonth() + 1, current.getDate());
    const dueDate = new Date(current.getFullYear(), current.getMonth(), current.getDate());
    
    const amount = rentValue;
    const taxAmount = Math.round((amount * tax) / 100);
    const totalAmount = amount + taxAmount;
    
    payments.push({
      month: dueDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      rentAmount: amount,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      status: 'قيد الانتظار',
      paymentDate: null
    });
    
    current = nextMonth;
    if (current > end) break;
  }
  
  return payments;
};

// Get month name in Arabic
export const getArabicMonthName = (date) => {
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const d = new Date(date);
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
};

// Get status badge color
export const getStatusColor = (status) => {
  const statusMap = {
    'مأجور': '#48dbfb',
    'فارغ': '#f5576c',
    'مدفوع': '#48dbfb',
    'متأخر': '#ffa502',
    'قيد الانتظار': '#667eea',
    'نشط': '#48dbfb',
    'غير نشط': '#f5576c'
  };
  return statusMap[status] || '#667eea';
};

// Sort array by key
export const sortByKey = (array, key, ascending = true) => {
  return [...array].sort((a, b) => {
    if (ascending) {
      return a[key] > b[key] ? 1 : -1;
    } else {
      return a[key] < b[key] ? 1 : -1;
    }
  });
};

// Search in array
export const searchInArray = (array, searchTerm, searchKeys) => {
  if (!searchTerm) return array;
  return array.filter(item =>
    searchKeys.some(key =>
      item[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
};

// Generate ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Local storage helper
export const storageManager = {
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (e) {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }
};

// Export default utilities object
export default {
  formatCurrency,
  formatDateArabic,
  validatePhone,
  validateEmail,
  calculateOccupancyRate,
  getStatusColor,
  sortByKey,
  searchInArray,
  generateId,
  storageManager
};
