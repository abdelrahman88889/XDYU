import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tenants from './pages/Tenants';
import Units from './pages/Units';
import Collections from './pages/Collections';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // التحقق من وجود مستخدم مسجل دخول
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveNav('dashboard');
    else if (path === '/tenants') setActiveNav('tenants');
    else if (path === '/units') setActiveNav('units');
    else if (path === '/collections') setActiveNav('collections');
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  const handleLoadDemo = () => {
    if (!currentUser?.email || currentUser?.isGuest) {
      alert('يرجى تسجيل الدخول أولاً (ليس ضيفاً)');
      return;
    }

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
        paymentSchedule: Array.from({ length: 12 }, (_, i) => ({
          date: new Date(2024, i, 15).toISOString().split('T')[0],
          status: i < 4 ? 'مدفوع' : 'قادم',
          paidDate: i < 4 ? new Date(2024, i, 14 + Math.random() * 2).toISOString().split('T')[0] : null
        }))
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
        paymentSchedule: Array.from({ length: 12 }, (_, i) => ({
          date: new Date(2024, i + 2, 1).toISOString().split('T')[0],
          status: i < 2 ? 'مدفوع' : 'قادم',
          paidDate: i < 2 ? new Date(2024, i + 2, 1 + Math.random() * 2).toISOString().split('T')[0] : null
        }))
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
        paymentSchedule: Array.from({ length: 12 }, (_, i) => ({
          date: new Date(2024, i + 1, 10).toISOString().split('T')[0],
          status: i < 3 ? 'مدفوع' : 'قادم',
          paidDate: i < 3 ? new Date(2024, i + 1, 10 + Math.random() * 2).toISOString().split('T')[0] : null
        }))
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
        paymentSchedule: Array.from({ length: 12 }, (_, i) => ({
          date: new Date(2024, i, 1).toISOString().split('T')[0],
          status: i < 5 ? 'مدفوع' : 'قادم',
          paidDate: i < 5 ? new Date(2024, i, 1 + Math.random() * 2).toISOString().split('T')[0] : null
        }))
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
        paymentSchedule: Array.from({ length: 12 }, (_, i) => ({
          date: new Date(2024, i + 4, 15).toISOString().split('T')[0],
          status: i < 1 ? 'مدفوع' : 'قادم',
          paidDate: i < 1 ? new Date(2024, i + 4, 15).toISOString().split('T')[0] : null
        }))
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
        paymentSchedule: Array.from({ length: 12 }, (_, i) => ({
          date: new Date(2023, 11 + i, 1).toISOString().split('T')[0],
          status: i < 5 ? 'مدفوع' : 'قادم',
          paidDate: i < 5 ? new Date(2023, 11 + i, 1 + Math.random() * 2).toISOString().split('T')[0] : null
        }))
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

    localStorage.setItem(`tenants_${currentUser.email}`, JSON.stringify(DEMO_TENANTS));
    alert('✅ تم تحميل 8 مستأجرين تجريبيين بنجاح! حمّل الصفحة لترى البيانات');
    window.location.reload();
  };

  if (isLoading) {
    return <div className="loading">جاري التحميل...</div>;
  }

  if (!currentUser) {
    return (
      <div className="App" dir="rtl">
        <Login onLogin={setCurrentUser} />
      </div>
    );
  }

  return (
    <div className="App" dir="rtl">
      <nav className="navbar">
        <div className="nav-header">
          <h1 className="app-title">🏢 تطبيق إدارة العقارات</h1>
        </div>
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${activeNav === 'dashboard' ? 'active' : ''}`}
          >
            📊 لوحة التحكم
          </Link>
          <Link 
            to="/tenants" 
            className={`nav-link ${activeNav === 'tenants' ? 'active' : ''}`}
          >
            👥 المستأجرين
          </Link>
          <Link 
            to="/units" 
            className={`nav-link ${activeNav === 'units' ? 'active' : ''}`}
          >
            🏠 الوحدات
          </Link>
          <Link 
            to="/collections" 
            className={`nav-link ${activeNav === 'collections' ? 'active' : ''}`}
          >
            💰 التحصيل
          </Link>
          <button className="btn-logout" onClick={handleLoadDemo} title="تحميل بيانات تجريبية">
            📊 بيانات تجريبية
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            🚪 تسجيل الخروج
          </button>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tenants" element={<Tenants />} />
          <Route path="/units" element={<Units />} />
          <Route path="/collections" element={<Collections />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
