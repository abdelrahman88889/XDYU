// بيانات تجريبية للاختبار
// استخدم هذا الملف لتحميل بيانات اختبار شاملة

const DEMO_TENANTS = [
  {
    id: 1,
    name: 'محمد أحمد السعيد',
    idNumber: '1234567890',
    phone: '0501234567',
    nationality: 'سعودي',
    unit: 'الفيلا 1',
    unitType: 'فيلا',
    contractNumber: 'CNT-001',
    documentNumber: 'DOC-001',
    rentalStart: '2024-01-15',
    rentalEnd: '2025-01-14',
    rentValue: 3000,
    tax: 5,
    paymentType: 'شهري',
    status: 'نشط',
    paymentSchedule: [
      { date: '2024-01-15', status: 'مدفوع', paidDate: '2024-01-14' },
      { date: '2024-02-15', status: 'مدفوع', paidDate: '2024-02-15' },
      { date: '2024-03-15', status: 'مدفوع', paidDate: '2024-03-16' },
      { date: '2024-04-15', status: 'مدفوع', paidDate: '2024-04-15' },
      { date: '2024-05-15', status: 'قادم', paidDate: null },
      { date: '2024-06-15', status: 'قادم', paidDate: null },
      { date: '2024-07-15', status: 'قادم', paidDate: null },
      { date: '2024-08-15', status: 'قادم', paidDate: null },
      { date: '2024-09-15', status: 'قادم', paidDate: null },
      { date: '2024-10-15', status: 'قادم', paidDate: null },
      { date: '2024-11-15', status: 'قادم', paidDate: null },
      { date: '2024-12-15', status: 'قادم', paidDate: null }
    ]
  },
  {
    id: 2,
    name: 'علي محمد إبراهيم',
    idNumber: '1987654321',
    phone: '0509876543',
    nationality: 'سعودي',
    unit: 'الفيلا 2',
    unitType: 'فيلا',
    contractNumber: 'CNT-002',
    documentNumber: 'DOC-002',
    rentalStart: '2024-03-01',
    rentalEnd: '2025-03-01',
    rentValue: 3500,
    tax: 5,
    paymentType: 'شهري',
    status: 'نشط',
    paymentSchedule: [
      { date: '2024-03-01', status: 'مدفوع', paidDate: '2024-03-01' },
      { date: '2024-04-01', status: 'مدفوع', paidDate: '2024-04-02' },
      { date: '2024-05-01', status: 'قادم', paidDate: null },
      { date: '2024-06-01', status: 'قادم', paidDate: null },
      { date: '2024-07-01', status: 'قادم', paidDate: null },
      { date: '2024-08-01', status: 'قادم', paidDate: null },
      { date: '2024-09-01', status: 'قادم', paidDate: null },
      { date: '2024-10-01', status: 'قادم', paidDate: null },
      { date: '2024-11-01', status: 'قادم', paidDate: null },
      { date: '2024-12-01', status: 'قادم', paidDate: null },
      { date: '2025-01-01', status: 'قادم', paidDate: null },
      { date: '2025-02-01', status: 'قادم', paidDate: null }
    ]
  },
  {
    id: 3,
    name: 'سارة خالد محمود',
    idNumber: '2147483647',
    phone: '0551234567',
    nationality: 'سعودي',
    unit: 'الشقة 1',
    unitType: 'شقة',
    contractNumber: 'CNT-003',
    documentNumber: 'DOC-003',
    rentalStart: '2024-02-10',
    rentalEnd: '2025-02-10',
    rentValue: 2000,
    tax: 5,
    paymentType: 'شهري',
    status: 'نشط',
    paymentSchedule: [
      { date: '2024-02-10', status: 'مدفوع', paidDate: '2024-02-10' },
      { date: '2024-03-10', status: 'مدفوع', paidDate: '2024-03-11' },
      { date: '2024-04-10', status: 'مدفوع', paidDate: '2024-04-10' },
      { date: '2024-05-10', status: 'قادم', paidDate: null },
      { date: '2024-06-10', status: 'قادم', paidDate: null },
      { date: '2024-07-10', status: 'قادم', paidDate: null },
      { date: '2024-08-10', status: 'قادم', paidDate: null },
      { date: '2024-09-10', status: 'قادم', paidDate: null },
      { date: '2024-10-10', status: 'قادم', paidDate: null },
      { date: '2024-11-10', status: 'قادم', paidDate: null },
      { date: '2024-12-10', status: 'قادم', paidDate: null },
      { date: '2025-01-10', status: 'قادم', paidDate: null }
    ]
  },
  {
    id: 4,
    name: 'فهد عبدالرحمن السالم',
    idNumber: '1234512345',
    phone: '0556789012',
    nationality: 'سعودي',
    unit: 'الشقة 2',
    unitType: 'شقة',
    contractNumber: 'CNT-004',
    documentNumber: 'DOC-004',
    rentalStart: '2024-01-01',
    rentalEnd: '2024-12-31',
    rentValue: 2500,
    tax: 5,
    paymentType: 'شهري',
    status: 'نشط',
    paymentSchedule: [
      { date: '2024-01-01', status: 'مدفوع', paidDate: '2023-12-31' },
      { date: '2024-02-01', status: 'مدفوع', paidDate: '2024-02-01' },
      { date: '2024-03-01', status: 'مدفوع', paidDate: '2024-03-02' },
      { date: '2024-04-01', status: 'مدفوع', paidDate: '2024-04-01' },
      { date: '2024-05-01', status: 'قادم', paidDate: null },
      { date: '2024-06-01', status: 'قادم', paidDate: null },
      { date: '2024-07-01', status: 'قادم', paidDate: null },
      { date: '2024-08-01', status: 'قادم', paidDate: null },
      { date: '2024-09-01', status: 'قادم', paidDate: null },
      { date: '2024-10-01', status: 'قادم', paidDate: null },
      { date: '2024-11-01', status: 'قادم', paidDate: null },
      { date: '2024-12-01', status: 'قادم', paidDate: null }
    ]
  },
  {
    id: 5,
    name: 'نور عبدالله الزهراني',
    idNumber: '9876543210',
    phone: '0570123456',
    nationality: 'سعودي',
    unit: 'المحل 1',
    unitType: 'محل',
    contractNumber: 'CNT-005',
    documentNumber: 'DOC-005',
    rentalStart: '2024-04-01',
    rentalEnd: '2025-04-01',
    rentValue: 4500,
    tax: 10,
    paymentType: 'ربع سنوي',
    status: 'نشط',
    paymentSchedule: [
      { date: '2024-04-01', status: 'مدفوع', paidDate: '2024-04-01' },
      { date: '2024-07-01', status: 'قادم', paidDate: null },
      { date: '2024-10-01', status: 'قادم', paidDate: null },
      { date: '2025-01-01', status: 'قادم', paidDate: null }
    ]
  },
  {
    id: 6,
    name: 'ليلى أحمد عطايا',
    idNumber: '5432109876',
    phone: '0588765432',
    nationality: 'سعودي',
    unit: 'الفيلا 3',
    unitType: 'فيلا',
    contractNumber: 'CNT-006',
    documentNumber: 'DOC-006',
    rentalStart: '2024-05-15',
    rentalEnd: '2025-05-15',
    rentValue: 3800,
    tax: 5,
    paymentType: 'شهري',
    status: 'نشط',
    paymentSchedule: [
      { date: '2024-05-15', status: 'مدفوع', paidDate: '2024-05-15' },
      { date: '2024-06-15', status: 'قادم', paidDate: null },
      { date: '2024-07-15', status: 'قادم', paidDate: null },
      { date: '2024-08-15', status: 'قادم', paidDate: null },
      { date: '2024-09-15', status: 'قادم', paidDate: null },
      { date: '2024-10-15', status: 'قادم', paidDate: null },
      { date: '2024-11-15', status: 'قادم', paidDate: null },
      { date: '2024-12-15', status: 'قادم', paidDate: null },
      { date: '2025-01-15', status: 'قادم', paidDate: null },
      { date: '2025-02-15', status: 'قادم', paidDate: null },
      { date: '2025-03-15', status: 'قادم', paidDate: null },
      { date: '2025-04-15', status: 'قادم', paidDate: null }
    ]
  },
  {
    id: 7,
    name: 'خالد عمر الغامدي',
    idNumber: '3456789012',
    phone: '0502468135',
    nationality: 'سعودي',
    unit: 'الشقة 3',
    unitType: 'شقة',
    contractNumber: 'CNT-007',
    documentNumber: 'DOC-007',
    rentalStart: '2023-12-01',
    rentalEnd: '2024-12-01',
    rentValue: 1800,
    tax: 5,
    paymentType: 'شهري',
    status: 'نشط',
    paymentSchedule: [
      { date: '2023-12-01', status: 'مدفوع', paidDate: '2023-11-30' },
      { date: '2024-01-01', status: 'مدفوع', paidDate: '2024-01-01' },
      { date: '2024-02-01', status: 'مدفوع', paidDate: '2024-02-02' },
      { date: '2024-03-01', status: 'مدفوع', paidDate: '2024-03-01' },
      { date: '2024-04-01', status: 'مدفوع', paidDate: '2024-04-01' },
      { date: '2024-05-01', status: 'قادم', paidDate: null },
      { date: '2024-06-01', status: 'قادم', paidDate: null },
      { date: '2024-07-01', status: 'قادم', paidDate: null },
      { date: '2024-08-01', status: 'قادم', paidDate: null },
      { date: '2024-09-01', status: 'قادم', paidDate: null },
      { date: '2024-10-01', status: 'قادم', paidDate: null },
      { date: '2024-11-01', status: 'قادم', paidDate: null }
    ]
  },
  {
    id: 8,
    name: 'منى علي المالكي',
    idNumber: '7890123456',
    phone: '0512345679',
    nationality: 'سعودي',
    unit: 'الدوبلكس 1',
    unitType: 'دوبلكس',
    contractNumber: 'CNT-008',
    documentNumber: 'DOC-008',
    rentalStart: '2024-03-20',
    rentalEnd: '2025-03-20',
    rentValue: 5000,
    tax: 5,
    paymentType: 'نصف سنوي',
    status: 'نشط',
    paymentSchedule: [
      { date: '2024-03-20', status: 'مدفوع', paidDate: '2024-03-20' },
      { date: '2024-09-20', status: 'قادم', paidDate: null }
    ]
  }
];

const DEMO_UNITS = [
  {
    id: 1,
    number: '1',
    type: 'فيلا',
    location: 'الحي الشمالي',
    area: 450,
    rentPrice: 3000,
    status: 'مأجور',
    tenant: 'محمد أحمد السعيد'
  },
  {
    id: 2,
    number: '2',
    type: 'فيلا',
    location: 'الحي الشمالي',
    area: 480,
    rentPrice: 3500,
    status: 'مأجور',
    tenant: 'علي محمد إبراهيم'
  },
  {
    id: 3,
    number: '1',
    type: 'شقة',
    location: 'الحي الوسط',
    area: 150,
    rentPrice: 2000,
    status: 'مأجور',
    tenant: 'سارة خالد محمود'
  },
  {
    id: 4,
    number: '2',
    type: 'شقة',
    location: 'الحي الوسط',
    area: 160,
    rentPrice: 2500,
    status: 'مأجور',
    tenant: 'فهد عبدالرحمن السالم'
  },
  {
    id: 5,
    number: '3',
    type: 'شقة',
    location: 'الحي الشرقي',
    area: 140,
    rentPrice: 1800,
    status: 'مأجور',
    tenant: 'خالد عمر الغامدي'
  },
  {
    id: 6,
    number: '1',
    type: 'محل',
    location: 'الشارع الرئيسي',
    area: 100,
    rentPrice: 4500,
    status: 'مأجور',
    tenant: 'نور عبدالله الزهراني'
  },
  {
    id: 7,
    number: '3',
    type: 'فيلا',
    location: 'الحي الشمالي',
    area: 500,
    rentPrice: 3800,
    status: 'مأجور',
    tenant: 'ليلى أحمد عطايا'
  },
  {
    id: 8,
    number: '1',
    type: 'دوبلكس',
    location: 'الحي الغربي',
    area: 350,
    rentPrice: 5000,
    status: 'مأجور',
    tenant: 'منى علي المالكي'
  },
  {
    id: 9,
    number: '4',
    type: 'شقة',
    location: 'الحي الجنوبي',
    area: 155,
    rentPrice: 1950,
    status: 'فارغ',
    tenant: '-'
  },
  {
    id: 10,
    number: '4',
    type: 'فيلا',
    location: 'الحي الغربي',
    area: 480,
    rentPrice: 3600,
    status: 'فارغ',
    tenant: '-'
  }
];

// دالة لتحميل البيانات التجريبية
export function loadDemoData(userEmail) {
  if (!userEmail) return;
  
  // حفظ المستأجرين
  localStorage.setItem(`tenants_${userEmail}`, JSON.stringify(DEMO_TENANTS));
  
  // حفظ الوحدات
  localStorage.setItem(`units_${userEmail}`, JSON.stringify(DEMO_UNITS));
  
  console.log('✅ تم تحميل البيانات التجريبية بنجاح');
}

// دالة لحذف البيانات التجريبية
export function clearDemoData(userEmail) {
  if (!userEmail) return;
  
  localStorage.removeItem(`tenants_${userEmail}`);
  localStorage.removeItem(`units_${userEmail}`);
  localStorage.removeItem(`payments_${userEmail}`);
  
  console.log('✅ تم حذف البيانات التجريبية');
}

export { DEMO_TENANTS, DEMO_UNITS };
