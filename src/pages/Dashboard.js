import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { onTenantsChange, onPaymentsChange, onUnitsChange, onExpensesChange } from '../firebaseService';

function Dashboard() {
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [units, setUnits] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // الحصول على المستخدم الحالي
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);

    // إذا كان ضيف، استخدم localStorage
    if (user?.isGuest) {
      const allTenants = JSON.parse(localStorage.getItem('tenants')) || [];
      setTenants(allTenants);

      const userPayments = JSON.parse(localStorage.getItem('payments')) || [];
      setPayments(userPayments);

      const userUnits = JSON.parse(localStorage.getItem('units')) || [];
      setUnits(userUnits);

      const userExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
      setExpenses(userExpenses);
    } else if (user?.uid) {
      // استخدم Firebase للمستخدمين المسجلين
      const unsubscribeTenants = onTenantsChange(user.uid, setTenants);
      const unsubscribePayments = onPaymentsChange(user.uid, setPayments);
      const unsubscribeUnits = onUnitsChange(user.uid, setUnits);
      const unsubscribeExpenses = onExpensesChange(user.uid, setExpenses);

      // Cleanup function
      return () => {
        if (unsubscribeTenants) unsubscribeTenants();
        if (unsubscribePayments) unsubscribePayments();
        if (unsubscribeUnits) unsubscribeUnits();
        if (unsubscribeExpenses) unsubscribeExpenses();
      };
    }
  }, []);

  // الإحصائيات المحسوبة من البيانات الفعلية
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.status === 'نشط').length;
  const totalRent = tenants.reduce((sum, t) => sum + t.rentValue, 0);
  
  // حساب المبلغ المحصل من جدول الدفعات الفعلي
  const totalCollected = tenants.reduce((sum, t) => {
    const paidPayments = t.paymentSchedule?.filter(p => p.status === 'مدفوع').length || 0;
    return sum + (paidPayments * t.rentValue);
  }, 0);

  // حساب المبلغ المتوقع من الدفعات غير المدفوعة
  const totalPending = tenants.reduce((sum, t) => {
    const unpaidPayments = t.paymentSchedule?.filter(p => p.status !== 'مدفوع').length || 0;
    return sum + (unpaidPayments * t.rentValue);
  }, 0);

  const occupancyRate = units.length > 0 
    ? Math.round((totalTenants / units.length) * 100) 
    : 0;

  // حساب المصروفات
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyExpenses = expenses.filter(exp => {
    const today = new Date();
    const expDate = new Date(exp.date);
    return expDate.getMonth() === today.getMonth() && expDate.getFullYear() === today.getFullYear();
  }).reduce((sum, exp) => sum + exp.amount, 0);

  const expensesByCategory = [
    { name: 'صيانة', amount: expenses.filter(e => e.category === 'صيانة').reduce((sum, e) => sum + e.amount, 0) },
    { name: 'إصلاحات', amount: expenses.filter(e => e.category === 'إصلاحات').reduce((sum, e) => sum + e.amount, 0) },
    { name: 'نظافة', amount: expenses.filter(e => e.category === 'نظافة').reduce((sum, e) => sum + e.amount, 0) },
    { name: 'فواتير', amount: expenses.filter(e => e.category === 'فواتير').reduce((sum, e) => sum + e.amount, 0) },
    { name: 'تأمين', amount: expenses.filter(e => e.category === 'تأمين').reduce((sum, e) => sum + e.amount, 0) },
    { name: 'أخرى', amount: expenses.filter(e => e.category === 'أخرى').reduce((sum, e) => sum + e.amount, 0) }
  ].filter(cat => cat.amount > 0);

  const overduePayments = tenants.reduce((sum, t) => {
    const today = new Date().toISOString().split('T')[0];
    return sum + (t.paymentSchedule?.filter(p => p.date < today && p.status !== 'مدفوع').length || 0);
  }, 0);

  // البيانات للرسم البياني الشهري
  const monthlyChartData = [
    { month: 'يناير', متوقع: totalRent, محصل: totalCollected * 0.8 },
    { month: 'فبراير', متوقع: totalRent, محصل: totalCollected * 0.9 },
    { month: 'مارس', متوقع: totalRent, محصل: totalCollected },
    { month: 'أبريل', متوقع: totalRent, محصل: totalCollected * 0.7 },
    { month: 'مايو', متوقع: totalRent, محصل: totalCollected * 0.85 },
    { month: 'يونيو', متوقع: totalRent, محصل: totalCollected * 0.95 },
  ];

  // بيانات الرسم البياني الدائري
  const pieData = [
    { name: 'مدفوع', value: totalCollected, fill: '#3B82F6' },
    { name: 'متوقع', value: totalPending, fill: '#FFA500' },
  ];

  const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="page-title">📊 لوحة التحكم الرئيسية</h1>
        {currentUser && !currentUser.isGuest && (
          <p className="user-info">مرحباً بك، <strong>{currentUser.email}</strong></p>
        )}
        {currentUser?.isGuest && (
          <p className="user-info">أنت تتصفح كضيف</p>
        )}
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>عدد المستأجرين</h3>
            <p className="stat-number">{totalTenants}</p>
            <small>{activeTenants} نشط</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>المستأجرين النشطين</h3>
            <p className="stat-number">{activeTenants}</p>
            <small>{totalTenants - activeTenants} غير نشط</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>الإيجار الشهري الكلي</h3>
            <p className="stat-number">{totalRent.toLocaleString()} ر.س</p>
            <small>إجمالي العقود</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>المبلغ المحصل</h3>
            <p className="stat-number">{totalCollected.toLocaleString()} ر.س</p>
            <small>✓ مدفوع</small>
          </div>
        </div>

        <div className="stat-card alert">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>المبلغ المتوقع</h3>
            <p className="stat-number">{totalPending.toLocaleString()} ر.س</p>
            <small>قيد الانتظار</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>معدل التحصيل</h3>
            <p className="stat-number">{((totalCollected / (totalCollected + totalPending)) * 100 || 0).toFixed(1)}%</p>
            <small>النسبة المئوية</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <div className="stat-content">
            <h3>معدل الإشغال</h3>
            <p className="stat-number">{occupancyRate}%</p>
            <small>من الوحدات</small>
          </div>
        </div>

        <div className="stat-card alert">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>دفعات متأخرة</h3>
            <p className="stat-number">{overduePayments}</p>
            <small>تحتاج متابعة</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <h3>إجمالي المصروفات</h3>
            <p className="stat-number">{totalExpenses.toLocaleString()} ر.س</p>
            <small>جميع المصروفات</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>مصروفات هذا الشهر</h3>
            <p className="stat-number">{monthlyExpenses.toLocaleString()} ر.س</p>
            <small>للشهر الحالي</small>
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-section">
          <h2>📊 التحصيل الشهري</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyChartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
              <Bar dataKey="متوقع" fill="#E0E7FF" />
              <Bar dataKey="محصل" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-section">
          <h2>💵 نسبة التحصيل</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {expensesByCategory.length > 0 && (
          <div className="chart-section">
            <h2>💸 المصروفات حسب الفئات</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expensesByCategory} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString()} />
                <Bar dataKey="amount" fill="#EC4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="info-section">
        <h2>📋 ملخص العمليات</h2>
        <div className="recent-activities">
          <div className="activity-item">
            <span className="activity-badge">📊</span>
            <p><strong>إجمالي المستأجرين:</strong> {totalTenants} مستأجر</p>
            <small>من بينهم {activeTenants} نشط</small>
          </div>
          <div className="activity-item">
            <span className="activity-badge warning">⚠️</span>
            <p><strong>دفعات متأخرة:</strong> {overduePayments} دفعة</p>
            <small>تحتاج متابعة فورية</small>
          </div>
          <div className="activity-item">
            <span className="activity-badge success">✅</span>
            <p><strong>معدل التحصيل:</strong> {((totalCollected / (totalCollected + totalPending)) * 100 || 0).toFixed(1)}%</p>
            <small>من الإجمالي المتوقع</small>
          </div>
          <div className="activity-item">
            <span className="activity-badge">💰</span>
            <p><strong>المبلغ المحصل:</strong> {totalCollected.toLocaleString()} ر.س</p>
            <small>منذ بداية الموسم</small>
          </div>
        </div>
      </div>

      <div className="dashboard-tips">
        <h3>💡 نصائح مفيدة:</h3>
        <ul>
          <li>✓ تابع الدفعات المتأخرة بانتظام</li>
          <li>✓ حدّث بيانات المستأجرين بشكل دوري</li>
          <li>✓ استخدم جدول الدفعات لتسجيل الدفعات الجديدة</li>
          <li>✓ راقب معدل التحصيل شهرياً</li>
          <li>✓ احفظ نسخة احتياطية من البيانات</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;