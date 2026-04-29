// Application Configuration
export const APP_CONFIG = {
  // App Info
  appName: 'تطبيق إدارة العقارات',
  appVersion: '1.0.0',
  appDescription: 'تطبيق متقدم لإدارة العقارات والمستأجرين والتحصيل',

  // Colors
  colors: {
    primary: '#667eea',
    primaryDark: '#764ba2',
    secondary: '#f5576c',
    success: '#48dbfb',
    warning: '#ffa502',
    danger: '#f5576c',
    light: '#f8f9fa',
    dark: '#333333',
    border: '#e0e0e0'
  },

  // Status translations
  statuses: {
    units: {
      occupied: 'مأجور',
      empty: 'فارغ',
      maintenance: 'تحت الصيانة'
    },
    tenants: {
      active: 'نشط',
      inactive: 'غير نشط',
      blacklist: 'قائمة سوداء'
    },
    collections: {
      pending: 'قيد الانتظار',
      paid: 'مدفوع',
      overdue: 'متأخر',
      partial: 'جزئي'
    }
  },

  // Unit types
  unitTypes: [
    { value: 'flat', label: 'شقة' },
    { value: 'villa', label: 'فيلا' },
    { value: 'commercial', label: 'محل تجاري' },
    { value: 'office', label: 'مكتب' }
  ],

  // Rental periods
  rentalPeriods: [
    { value: 1, label: 'شهر واحد' },
    { value: 3, label: '3 شهور' },
    { value: 6, label: '6 شهور' },
    { value: 12, label: 'سنة واحدة' }
  ],

  // Months in Arabic
  months: [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ],

  // Validation rules
  validation: {
    phone: {
      pattern: /^(\+966|0)?[5][0-9]{8}$/,
      message: 'رقم الهاتف غير صحيح'
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'البريد الإلكتروني غير صحيح'
    },
    minTextLength: 2,
    maxTextLength: 100,
    minAmount: 0,
    maxAmount: 1000000
  },

  // Features
  features: {
    autoBackup: true,
    exportData: true,
    importData: true,
    printReports: true,
    notifications: true,
    multiLanguage: true
  },

  // Storage keys
  storageKeys: {
    units: 'real_estate_units',
    tenants: 'real_estate_tenants',
    collections: 'real_estate_collections',
    settings: 'real_estate_settings',
    backup: 'real_estate_backup'
  }
};

// Feature flags
export const FEATURE_FLAGS = {
  enableAnalytics: true,
  enableNotifications: true,
  enableExport: true,
  enableAdvancedSearch: true,
  enableReports: true,
  maintenanceMode: false
};

// Default values
export const DEFAULT_VALUES = {
  pagination: {
    pageSize: 10,
    maxPages: 100
  },
  filters: {
    sortBy: 'id',
    sortOrder: 'asc',
    searchDelay: 300
  },
  ui: {
    animationDuration: 300,
    toastDuration: 3000,
    confirmationRequired: true
  }
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'هذا الحقل مطلوب',
  INVALID_EMAIL: 'البريد الإلكتروني غير صحيح',
  INVALID_PHONE: 'رقم الهاتف غير صحيح',
  INVALID_AMOUNT: 'المبلغ غير صحيح',
  DUPLICATE_ENTRY: 'هذا الإدخال موجود بالفعل',
  OPERATION_FAILED: 'فشلت العملية، يرجى المحاولة مجدداً',
  NO_DATA: 'لا توجد بيانات للعرض',
  INVALID_DATE: 'التاريخ غير صحيح',
  INVALID_FILE: 'صيغة الملف غير صحيحة'
};

// Success messages
export const SUCCESS_MESSAGES = {
  SAVED: 'تم الحفظ بنجاح',
  UPDATED: 'تم التحديث بنجاح',
  DELETED: 'تم الحذف بنجاح',
  OPERATION_SUCCESS: 'تمت العملية بنجاح',
  EXPORTED: 'تم التصدير بنجاح',
  IMPORTED: 'تم الاستيراد بنجاح'
};

export default APP_CONFIG;
