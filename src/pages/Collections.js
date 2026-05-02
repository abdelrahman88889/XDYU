import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { onTenantsChange, onPaymentsChange } from '../firebaseService';

function Collections() {
  const [tenants, setTenants] = useState([]);
  const [payments, setPayments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);

    if (user?.isGuest) {
      // Load from localStorage for guests
      const saved = localStorage.getItem('tenants');
      if (saved) setTenants(JSON.parse(saved));
      
      const paymentsSaved = localStorage.getItem('payments');
      if (paymentsSaved) setPayments(JSON.parse(paymentsSaved));
      
      setLoading(false);
    } else if (user?.uid) {
      // Load from Firebase for authenticated users
      const unsubscribeTenants = onTenantsChange(user.uid, setTenants);
      const unsubscribePayments = onPaymentsChange(user.uid, setPayments);
      
      setLoading(false);

      return () => {
        if (unsubscribeTenants) unsubscribeTenants();
        if (unsubscribePayments) unsubscribePayments();
      };
    }
  }, []);

  useEffect(() => {
    if (currentUser?.isGuest && payments.length > 0) {
      localStorage.setItem('payments', JSON.stringify(payments));
    }
  }, [payments, currentUser?.isGuest]);

  const getCurrentMonth = () => {
    const now = new Date();
    return now.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' });
  };

  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  const getMonthlyPayments = () => {
    const currentMonth = getCurrentMonth();
    return tenants.map(tenant => ({
      tenantId: tenant.id,
      tenantName: tenant.name,
      unit: tenant.unit,
      amount: tenant.rentValue + (tenant.rentValue * tenant.tax) / 100,
      month: currentMonth,
      rentValue: tenant.rentValue,
      tax: (tenant.rentValue * tenant.tax) / 100,
      taxPercent: tenant.tax
    }));
  };

  const getYearlyPayments = () => {
    const currentYear = getCurrentYear();
    const count = 12;
    return tenants.map(tenant => {
      const monthlyAmount = tenant.rentValue + (tenant.rentValue * tenant.tax) / 100;
      return {
        tenantId: tenant.id,
        tenantName: tenant.name,
        unit: tenant.unit,
        amount: monthlyAmount * count,
        year: currentYear,
        monthlyAmount: monthlyAmount,
        monthCount: count
      };
    });
  };

  const getMonthlyChartData = () => {
    const data = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleDateString('ar-SA', { month: 'short', year: '2-digit' });
      const monthValue = date.getMonth() + 1;
      
      const collected = payments.filter(p => {
        const pDate = new Date(p.paidDate || p.date);
        return pDate.getMonth() + 1 === monthValue && pDate.getFullYear() === date.getFullYear();
      }).reduce((sum, p) => sum + p.amount, 0);
      
      const expected = tenants.reduce((sum, t) => sum + (t.rentValue + (t.rentValue * t.tax) / 100), 0);
      
      data.push({
        month,
        تحصيل: collected,
        متوقع: expected
      });
    }
    return data;
  };

  const getYearlyChartData = () => {
    const data = [];
    for (let i = 4; i >= 0; i--) {
      const year = getCurrentYear() - i;
      const collected = payments.filter(p => {
        const pDate = new Date(p.paidDate || p.date);
        return pDate.getFullYear() === year;
      }).reduce((sum, p) => sum + p.amount, 0);
      
      const expected = tenants.reduce((sum, t) => sum + (t.rentValue + (t.rentValue * t.tax) / 100), 0) * 12;
      
      data.push({
        year: year.toString(),
        تحصيل: collected,
        متوقع: expected
      });
    }
    return data;
  };

  const monthlyPayments = getMonthlyPayments();
  const yearlyPayments = getYearlyPayments();

  const totalMonthly = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalYearly = yearlyPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalMonthlyRent = monthlyPayments.reduce((sum, p) => sum + p.rentValue, 0);
  const totalMonthlyTax = monthlyPayments.reduce((sum, p) => sum + p.tax, 0);

  const collectedMonthly = payments
    .filter(p => {
      const pDate = new Date(p.paidDate || p.date);
      const now = new Date();
      return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const collectedYearly = payments
    .filter(p => {
      const pDate = new Date(p.paidDate || p.date);
      return pDate.getFullYear() === getCurrentYear();
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const handleMarkAsPaid = (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return;
    
    const newPayment = {
      id: Date.now(),
      tenantId: tenantId,
      tenantName: tenant.name,
      unit: tenant.unit,
      amount: tenant.rentValue + (tenant.rentValue * tenant.tax) / 100,
      month: getCurrentMonth(),
      paidDate: new Date().toLocaleDateString('ar-SA'),
      date: new Date().toISOString().split('T')[0],
      status: 'مدفوع'
    };
    setPayments([...payments, newPayment]);
  };

  const handleDeletePayment = (id) => {
    if (window.confirm('هل تريد حذف هذا السجل؟')) {
      setPayments(payments.filter(p => p.id !== id));
    }
  };

  const monthlyChartData = getMonthlyChartData();
  const yearlyChartData = getYearlyChartData();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">💰 إدارة التحصيلات</h1>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <span className="stat-label">تحصيل الشهر الحالي</span>
          <span className="stat-value">{collectedMonthly.toLocaleString()} ر.س</span>
          <span className="stat-sub">من {totalMonthly.toLocaleString()} ر.س</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${(collectedMonthly/totalMonthly)*100 || 0}%`}}></div>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">تحصيل السنة الكاملة</span>
          <span className="stat-value">{collectedYearly.toLocaleString()} ر.س</span>
          <span className="stat-sub">من {totalYearly.toLocaleString()} ر.س</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${(collectedYearly/totalYearly)*100 || 0}%`}}></div>
          </div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>📊 التحصيل الشهري (آخر 12 شهر)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyChartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
              <Bar dataKey="متوقع" fill="#E0E7FF" />
              <Bar dataKey="تحصيل" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>📈 التحصيل السنوي (آخر 5 سنوات)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={yearlyChartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
              <Line type="monotone" dataKey="متوقع" stroke="#E0E7FF" strokeWidth={2} />
              <Line type="monotone" dataKey="تحصيل" stroke="#8B5CF6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h2 style={{ marginTop: '30px', marginBottom: '20px' }}>📊 تحصيل الشهر الحالي: {getCurrentMonth()}</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>المستأجر</th>
              <th>الوحدة</th>
              <th>الإيجار</th>
              <th>الضريبة ({monthlyPayments[0]?.taxPercent || 0}%)</th>
              <th>الإجمالي</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {monthlyPayments.map((payment) => {
              const isPaid = payments.some(p => p.tenantId === payment.tenantId && 
                new Date(p.paidDate || p.date).getMonth() === new Date().getMonth());
              return (
                <tr key={payment.tenantId} className={isPaid ? 'paid-row' : ''}>
                  <td>{payment.tenantName}</td>
                  <td>{payment.unit}</td>
                  <td>{payment.rentValue.toLocaleString()} ر.س</td>
                  <td>{payment.tax.toLocaleString()} ر.س</td>
                  <td><strong>{payment.amount.toLocaleString()} ر.س</strong></td>
                  <td>
                    <span className={`badge badge-${isPaid ? 'success' : 'warning'}`}>
                      {isPaid ? '✓ مدفوع' : '⏳ قيد الانتظار'}
                    </span>
                  </td>
                  <td>
                    {!isPaid && (
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => handleMarkAsPaid(payment.tenantId)}
                      >
                        ✓ تم الدفع
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginTop: '30px', marginBottom: '20px' }}>📈 تحصيل السنة الكاملة {getCurrentYear()}</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>المستأجر</th>
              <th>الوحدة</th>
              <th>المبلغ الشهري</th>
              <th>عدد الأشهر</th>
              <th>الإجمالي السنوي</th>
            </tr>
          </thead>
          <tbody>
            {yearlyPayments.map((payment) => (
              <tr key={payment.tenantId}>
                <td>{payment.tenantName}</td>
                <td>{payment.unit}</td>
                <td>{payment.monthlyAmount.toLocaleString()} ر.س</td>
                <td>{payment.monthCount}</td>
                <td><strong>{payment.amount.toLocaleString()} ر.س</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginTop: '30px', marginBottom: '20px' }}>📋 سجل المدفوعات</h2>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>المستأجر</th>
              <th>الوحدة</th>
              <th>المبلغ</th>
              <th>الشهر</th>
              <th>تاريخ الدفع</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.tenantName}</td>
                  <td>{payment.unit}</td>
                  <td>{payment.amount.toLocaleString()} ر.س</td>
                  <td>{payment.month}</td>
                  <td>{payment.paidDate}</td>
                  <td><span className="badge badge-success">{payment.status}</span></td>
                  <td>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeletePayment(payment.id)}
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  لم يتم تسجيل أي مدفوعات حتى الآن
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Collections;