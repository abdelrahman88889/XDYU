import React, { useState, useEffect } from 'react';

const calculatePaymentSchedule = (startDate, endDate, paymentType) => {
  const schedule = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  let current = new Date(start);
  
  let interval = 1;
  if (paymentType === 'ربع سنوي') interval = 3;
  if (paymentType === 'نصف سنوي') interval = 6;
  if (paymentType === 'سنوي') interval = 12;

  let count = 0;
  while (current <= end && count < (interval === 1 ? 12 : interval === 3 ? 4 : interval === 6 ? 2 : 1)) {
    schedule.push({
      date: new Date(current).toISOString().split('T')[0],
      status: 'قادم',
      paidDate: null
    });
    current.setMonth(current.getMonth() + interval);
    count++;
  }
  return schedule;
};

const initialTenants = [
  {
    id: 1,
    name: 'محمد أحمد السعيد',
    idNumber: '1234567890',
    phone: '0501234567',
    nationality: 'سعودي',
    unit: 'الوحدة 1',
    unitType: 'فيلا',
    contractNumber: 'CNT-001',
    documentNumber: 'DOC-001',
    rentalStart: '2024-01-15',
    rentalEnd: '2025-01-14',
    rentValue: 3000,
    tax: 5,
    paymentType: 'شهري',
    status: 'نشط',
    paymentSchedule: calculatePaymentSchedule('2024-01-15', '2025-01-14', 'شهري')
  }
];

function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedTenant, setExpandedTenant] = useState(null);
  const [editingPaymentIndex, setEditingPaymentIndex] = useState(null);
  const [newTenant, setNewTenant] = useState({
    name: '',
    idNumber: '',
    phone: '',
    nationality: 'سعودي',
    unit: '',
    unitType: 'فيلا',
    contractNumber: '',
    documentNumber: '',
    rentalStart: '',
    rentalEnd: '',
    rentValue: '',
    tax: '5',
    paymentType: 'شهري',
    status: 'نشط'
  });

  useEffect(() => {
    // الحصول على المستخدم الحالي
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (user?.isGuest) {
      // ضيف يستخدم البيانات العامة
      const saved = localStorage.getItem('tenants');
      if (saved) {
        setTenants(JSON.parse(saved));
      } else {
        setTenants(initialTenants);
        localStorage.setItem('tenants', JSON.stringify(initialTenants));
      }
    } else if (user?.email) {
      // مستخدم مسجل - استخدم بيانات خاصة به
      const key = `tenants_${user.email}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setTenants(JSON.parse(saved));
      } else {
        setTenants(initialTenants);
        localStorage.setItem(key, JSON.stringify(initialTenants));
      }
    }
  }, []);

  useEffect(() => {
    if (tenants.length > 0) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      const key = user?.isGuest ? 'tenants' : `tenants_${user?.email}`;
      localStorage.setItem(key, JSON.stringify(tenants));
    }
  }, [tenants]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTenant(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTenant = (e) => {
    e.preventDefault();
    if (!newTenant.name || !newTenant.idNumber || !newTenant.phone || !newTenant.unit || 
        !newTenant.rentValue || !newTenant.contractNumber || !newTenant.documentNumber) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (editingId) {
      setTenants(tenants.map(t =>
        t.id === editingId
          ? { 
              ...t, 
              ...newTenant, 
              rentValue: parseInt(newTenant.rentValue), 
              tax: parseInt(newTenant.tax),
              paymentSchedule: calculatePaymentSchedule(newTenant.rentalStart, newTenant.rentalEnd, newTenant.paymentType)
            }
          : t
      ));
      setEditingId(null);
    } else {
      setTenants([...tenants, {
        ...newTenant,
        id: Date.now(),
        rentValue: parseInt(newTenant.rentValue),
        tax: parseInt(newTenant.tax),
        paymentSchedule: calculatePaymentSchedule(newTenant.rentalStart, newTenant.rentalEnd, newTenant.paymentType)
      }]);
    }

    setNewTenant({
      name: '',
      idNumber: '',
      phone: '',
      nationality: 'سعودي',
      unit: '',
      unitType: 'فيلا',
      contractNumber: '',
      documentNumber: '',
      rentalStart: '',
      rentalEnd: '',
      rentValue: '',
      tax: '5',
      paymentType: 'شهري',
      status: 'نشط'
    });
    setShowForm(false);
  };

  const handleEditTenant = (tenant) => {
    setEditingId(tenant.id);
    setNewTenant(tenant);
    setShowForm(true);
  };

  const handleDeleteTenant = (id) => {
    if (window.confirm('هل تريد حذف هذا المستأجر؟')) {
      setTenants(tenants.filter(t => t.id !== id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setNewTenant({
      name: '',
      idNumber: '',
      phone: '',
      nationality: 'سعودي',
      unit: '',
      unitType: 'فيلا',
      contractNumber: '',
      documentNumber: '',
      rentalStart: '',
      rentalEnd: '',
      rentValue: '',
      tax: '5',
      paymentType: 'شهري',
      status: 'نشط'
    });
  };

  const getPaymentStatus = (tenant) => {
    if (!tenant.paymentSchedule) return { overdue: 0, upcoming: 0 };
    const today = new Date().toISOString().split('T')[0];
    const overdue = tenant.paymentSchedule.filter(p => p.date < today && p.status !== 'مدفوع').length;
    const upcoming = tenant.paymentSchedule.filter(p => p.date >= today).length;
    return { overdue, upcoming };
  };

  const updatePaymentDate = (tenantId, paymentIndex, newDate) => {
    setTenants(tenants.map(t =>
      t.id === tenantId
        ? {
            ...t,
            paymentSchedule: t.paymentSchedule.map((p, idx) =>
              idx === paymentIndex ? { ...p, date: newDate } : p
            )
          }
        : t
    ));
    setEditingPaymentIndex(null);
  };

  const markPaymentAsPaid = (tenantId, paymentIndex) => {
    setTenants(tenants.map(t =>
      t.id === tenantId
        ? {
            ...t,
            paymentSchedule: t.paymentSchedule.map((p, idx) =>
              idx === paymentIndex 
                ? { ...p, status: 'مدفوع', paidDate: new Date().toISOString().split('T')[0] } 
                : p
            )
          }
        : t
    ));
  };

  const updatePaidDate = (tenantId, paymentIndex, newDate) => {
    setTenants(tenants.map(t =>
      t.id === tenantId
        ? {
            ...t,
            paymentSchedule: t.paymentSchedule.map((p, idx) =>
              idx === paymentIndex 
                ? { ...p, paidDate: newDate } 
                : p
            )
          }
        : t
    ));
  };

  const monthlyRate = tenants.reduce((sum, t) => sum + t.rentValue, 0);
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.status === 'نشط').length;
  const overdueCount = tenants.reduce((sum, t) => sum + getPaymentStatus(t).overdue, 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">👥 إدارة المستأجرين</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ إغلاق' : '+ إضافة مستأجر جديد'}
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <span className="stat-label">إجمالي المستأجرين</span>
          <span className="stat-value">{totalTenants}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">المستأجرين النشطين</span>
          <span className="stat-value">{activeTenants}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">الإيجار الشهري الكلي</span>
          <span className="stat-value">{monthlyRate.toLocaleString()} ر.س</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">دفعات متأخرة</span>
          <span className="stat-value alert">{overdueCount}</span>
        </div>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'تعديل المستأجر' : 'إضافة مستأجر جديد'}</h3>
          <form onSubmit={handleAddTenant}>
            <div className="form-row">
              <div className="form-group">
                <label>اسم المستأجر *</label>
                <input
                  type="text"
                  name="name"
                  value={newTenant.name}
                  onChange={handleInputChange}
                  placeholder="أدخل الاسم الكامل"
                  required
                />
              </div>
              <div className="form-group">
                <label>رقم الهوية *</label>
                <input
                  type="text"
                  name="idNumber"
                  value={newTenant.idNumber}
                  onChange={handleInputChange}
                  placeholder="1234567890"
                  required
                />
              </div>
              <div className="form-group">
                <label>رقم الجوال *</label>
                <input
                  type="tel"
                  name="phone"
                  value={newTenant.phone}
                  onChange={handleInputChange}
                  placeholder="0501234567"
                  required
                />
              </div>
              <div className="form-group">
                <label>الجنسية</label>
                <input
                  type="text"
                  name="nationality"
                  value={newTenant.nationality}
                  onChange={handleInputChange}
                  placeholder="الجنسية"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>رقم الوحدة *</label>
                <input
                  type="text"
                  name="unit"
                  value={newTenant.unit}
                  onChange={handleInputChange}
                  placeholder="مثال: الوحدة 1"
                  required
                />
              </div>
              <div className="form-group">
                <label>نوع الوحدة *</label>
                <select name="unitType" value={newTenant.unitType} onChange={handleInputChange} required>
                  <option value="فيلا">فيلا</option>
                  <option value="شقة">شقة</option>
                  <option value="محل تجاري">محل تجاري</option>
                  <option value="مكتب">مكتب</option>
                </select>
              </div>
              <div className="form-group">
                <label>نوع الدفع *</label>
                <select name="paymentType" value={newTenant.paymentType} onChange={handleInputChange} required>
                  <option value="شهري">شهري</option>
                  <option value="ربع سنوي">ربع سنوي</option>
                  <option value="نصف سنوي">نصف سنوي</option>
                  <option value="سنوي">سنوي</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>رقم العقد *</label>
                <input
                  type="text"
                  name="contractNumber"
                  value={newTenant.contractNumber}
                  onChange={handleInputChange}
                  placeholder="CNT-001"
                  required
                />
              </div>
              <div className="form-group">
                <label>رقم السند *</label>
                <input
                  type="text"
                  name="documentNumber"
                  value={newTenant.documentNumber}
                  onChange={handleInputChange}
                  placeholder="DOC-001"
                  required
                />
              </div>
              <div className="form-group">
                <label>قيمة الإيجار (ر.س) *</label>
                <input
                  type="number"
                  name="rentValue"
                  value={newTenant.rentValue}
                  onChange={handleInputChange}
                  placeholder="3000"
                  required
                />
              </div>
              <div className="form-group">
                <label>الضريبة (%)</label>
                <input
                  type="number"
                  name="tax"
                  value={newTenant.tax}
                  onChange={handleInputChange}
                  placeholder="5"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>تاريخ البداية *</label>
                <input
                  type="date"
                  name="rentalStart"
                  value={newTenant.rentalStart}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>تاريخ النهاية *</label>
                <input
                  type="date"
                  name="rentalEnd"
                  value={newTenant.rentalEnd}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>الحالة</label>
                <select name="status" value={newTenant.status} onChange={handleInputChange}>
                  <option value="نشط">نشط</option>
                  <option value="معلق">معلق</option>
                  <option value="منتهي">منتهي</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId ? '✓ تحديث المستأجر' : '✓ إضافة المستأجر'}
              </button>
              <button type="button" className="btn btn-cancel" onClick={handleCancel}>
                ✕ إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الهوية</th>
              <th>الجوال</th>
              <th>الوحدة</th>
              <th>نوع الدفع</th>
              <th>الإيجار</th>
              <th>عدد الدفعات</th>
              <th>متأخر</th>
              <th>قادم</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => {
              const payStatus = getPaymentStatus(tenant);
              const paymentCount = tenant.paymentSchedule?.length || 0;
              return (
                <React.Fragment key={tenant.id}>
                  <tr className={tenant.status === 'نشط' ? 'active-row' : ''}>
                    <td>{tenant.name}</td>
                    <td>{tenant.idNumber}</td>
                    <td>{tenant.phone}</td>
                    <td>{tenant.unit}</td>
                    <td>{tenant.paymentType}</td>
                    <td>{tenant.rentValue} ر.س</td>
                    <td className="center"><strong>{paymentCount}</strong></td>
                    <td className="center">
                      {payStatus.overdue > 0 && <span className="badge badge-danger">{payStatus.overdue}</span>}
                    </td>
                    <td className="center">
                      {payStatus.upcoming > 0 && <span className="badge badge-warning">{payStatus.upcoming}</span>}
                    </td>
                    <td><span className={`badge badge-${tenant.status === 'نشط' ? 'success' : tenant.status === 'معلق' ? 'warning' : 'danger'}`}>{tenant.status}</span></td>
                    <td className="actions-cell">
                      <button className="btn btn-sm btn-info" onClick={() => setExpandedTenant(expandedTenant === tenant.id ? null : tenant.id)}>
                        📅 الدفعات
                      </button>
                      <button className="btn btn-sm btn-primary" onClick={() => handleEditTenant(tenant)}>تعديل</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTenant(tenant.id)}>حذف</button>
                    </td>
                  </tr>
                  {expandedTenant === tenant.id && (
                    <tr className="expand-row">
                      <td colSpan="11">
                        <div className="payment-schedule">
                          <h4>📋 جدول الدفعات ({tenant.name})</h4>
                          <table className="schedule-table">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>تاريخ الدفعة</th>
                                <th>المبلغ</th>
                                <th>الحالة</th>
                                <th>تاريخ الدفع الفعلي</th>
                                <th>الإجراءات</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tenant.paymentSchedule?.map((payment, idx) => {
                                const today = new Date().toISOString().split('T')[0];
                                const isOverdue = payment.date < today && payment.status !== 'مدفوع';
                                return (
                                  <tr key={idx} className={isOverdue ? 'overdue-row' : payment.status === 'مدفوع' ? 'paid-row' : ''}>
                                    <td>{idx + 1}</td>
                                    <td>
                                      {editingPaymentIndex === idx ? (
                                        <input
                                          type="date"
                                          value={payment.date}
                                          onChange={(e) => updatePaymentDate(tenant.id, idx, e.target.value)}
                                          onBlur={() => setEditingPaymentIndex(null)}
                                          autoFocus
                                        />
                                      ) : (
                                        <span onClick={() => setEditingPaymentIndex(idx)} className="editable">
                                          {new Date(payment.date).toLocaleDateString('ar-SA')}
                                        </span>
                                      )}
                                    </td>
                                    <td>{tenant.rentValue} ر.س</td>
                                    <td>
                                      <span className={`badge badge-${payment.status === 'مدفوع' ? 'success' : isOverdue ? 'danger' : 'warning'}`}>
                                        {payment.status}
                                        {isOverdue && ' ⚠️'}
                                      </span>
                                    </td>
                                    <td>
                                      {payment.status === 'مدفوع' ? (
                                        <div className="paid-date-edit">
                                          <input
                                            type="date"
                                            value={payment.paidDate}
                                            onChange={(e) => updatePaidDate(tenant.id, idx, e.target.value)}
                                            className="paid-date-input"
                                          />
                                        </div>
                                      ) : (
                                        <span>-</span>
                                      )}
                                    </td>
                                    <td>
                                      {payment.status !== 'مدفوع' && (
                                        <button 
                                          className="btn btn-sm btn-success"
                                          onClick={() => markPaymentAsPaid(tenant.id, idx)}
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
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tenants;
