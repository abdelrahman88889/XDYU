import React, { useState, useEffect } from 'react';
import { addExpense, getExpenses, updateExpense, deleteExpense, onExpensesChange, onUnitsChange } from '../firebaseService';

const defaultExpenseCategories = [
  { id: 1, name: 'صيانة' },
  { id: 2, name: 'إصلاحات' },
  { id: 3, name: 'نظافة' },
  { id: 4, name: 'فواتير' },
  { id: 5, name: 'تأمين' },
  { id: 6, name: 'أخرى' }
];

function Expenses() {
  const [units, setUnits] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterUnit, setFilterUnit] = useState('الكل');
  const [errors, setErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newExpense, setNewExpense] = useState({
    unitId: '',
    unitName: '',
    category: 'صيانة',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);

    if (user?.isGuest) {
      // Load from localStorage for guests
      const saved = localStorage.getItem('units');
      if (saved) {
        setUnits(JSON.parse(saved));
      }
      const savedExp = localStorage.getItem('expenses');
      if (savedExp) {
        setExpenses(JSON.parse(savedExp));
      }
    } else if (user?.uid) {
      // Load from Firebase for authenticated users
      setLoading(true);
      const unsubscribeUnits = onUnitsChange(user.uid, setUnits);
      const unsubscribeExpenses = onExpensesChange(user.uid, (data) => {
        setExpenses(data);
        setLoading(false);
      });

      return () => {
        if (unsubscribeUnits) unsubscribeUnits();
        if (unsubscribeExpenses) unsubscribeExpenses();
      };
    }
  }, []);

  useEffect(() => {
    if (currentUser?.isGuest && expenses.length > 0) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses, currentUser?.isGuest]);

  const validateForm = () => {
    const newErrors = {};
    if (!newExpense.unitId) newErrors.unitId = 'اختر الوحدة';
    if (!newExpense.amount || parseInt(newExpense.amount) <= 0) newErrors.amount = 'المبلغ يجب أن يكون أكبر من 0';
    if (!newExpense.category) newErrors.category = 'اختر الفئة';
    if (!newExpense.date) newErrors.date = 'التاريخ مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'unitId') {
      const selectedUnit = units.find(u => u.id === parseInt(value));
      setNewExpense(prev => ({
        ...prev,
        unitId: value,
        unitName: selectedUnit ? selectedUnit.number : ''
      }));
    } else {
      setNewExpense(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const expenseData = {
        ...newExpense,
        unitId: parseInt(newExpense.unitId),
        amount: parseInt(newExpense.amount)
      };

      if (editingId) {
        if (currentUser?.uid) {
          await updateExpense(editingId, expenseData);
        } else {
          setExpenses(expenses.map(exp =>
            exp.id === editingId ? { ...exp, ...expenseData } : exp
          ));
        }
        setEditingId(null);
      } else {
        if (currentUser?.uid) {
          await addExpense(currentUser.uid, expenseData);
        } else {
          setExpenses([...expenses, {
            ...expenseData,
            id: Date.now()
          }]);
        }
      }

      setNewExpense({
        unitId: '',
        unitName: '',
        category: 'صيانة',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setShowForm(false);
      setErrors({});
    } catch (err) {
      setError('خطأ: ' + err.message);
      console.error('Error adding expense:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditExpense = (expense) => {
    setNewExpense(expense);
    setEditingId(expense.id);
    setShowForm(true);
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('هل تريد حذف هذه المصروفة؟')) {
      setLoading(true);
      setError('');
      try {
        if (currentUser?.uid) {
          await deleteExpense(id);
        } else {
          setExpenses(expenses.filter(exp => exp.id !== id));
        }
      } catch (err) {
        setError('خطأ في الحذف: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setNewExpense({
      unitId: '',
      unitName: '',
      category: 'صيانة',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setErrors({});
    setError('');
  };

  // الإحصائيات
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyExpenses = expenses.filter(exp => {
    const today = new Date();
    const expDate = new Date(exp.date);
    return expDate.getMonth() === today.getMonth() && expDate.getFullYear() === today.getFullYear();
  }).reduce((sum, exp) => sum + exp.amount, 0);

  const expensesByCategory = defaultExpenseCategories.map(cat => ({
    name: cat.name,
    amount: expenses.filter(exp => exp.category === cat.name).reduce((sum, exp) => sum + exp.amount, 0),
    count: expenses.filter(exp => exp.category === cat.name).length
  }));

  const expensesByUnit = units.map(unit => ({
    id: unit.id,
    number: unit.number,
    amount: expenses.filter(exp => exp.unitId === unit.id).reduce((sum, exp) => sum + exp.amount, 0),
    count: expenses.filter(exp => exp.unitId === unit.id).length
  })).filter(u => u.amount > 0);

  const filteredExpenses = filterUnit === 'الكل' 
    ? expenses 
    : expenses.filter(exp => exp.unitId === parseInt(filterUnit));

  const sortedExpenses = [...filteredExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">💸 إدارة المصروفات</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ إغلاق' : '+ إضافة مصروف جديد'}
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <span className="stat-label">إجمالي المصروفات</span>
          <span className="stat-value">{totalExpenses.toLocaleString()} ر.س</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">مصروفات هذا الشهر</span>
          <span className="stat-value">{monthlyExpenses.toLocaleString()} ر.س</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">عدد المصروفات</span>
          <span className="stat-value">{expenses.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">عدد الوحدات التي بها مصروفات</span>
          <span className="stat-value">{expensesByUnit.length}</span>
        </div>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'تعديل المصروف' : 'إضافة مصروف جديد'}</h3>
          <form onSubmit={handleAddExpense}>
            <div className="form-row">
              <div className="form-group">
                <label>الوحدة *</label>
                <select
                  name="unitId"
                  value={newExpense.unitId}
                  onChange={handleInputChange}
                  className={errors.unitId ? 'input-error' : ''}
                  required
                >
                  <option value="">-- اختر الوحدة --</option>
                  {units.map(unit => (
                    <option key={unit.id} value={unit.id}>
                      الوحدة {unit.number} - {unit.type}
                    </option>
                  ))}
                </select>
                {errors.unitId && <span className="error-text">{errors.unitId}</span>}
              </div>
              <div className="form-group">
                <label>فئة المصروف *</label>
                <select
                  name="category"
                  value={newExpense.category}
                  onChange={handleInputChange}
                  className={errors.category ? 'input-error' : ''}
                  required
                >
                  {defaultExpenseCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                {errors.category && <span className="error-text">{errors.category}</span>}
              </div>
              <div className="form-group">
                <label>المبلغ (ر.س) *</label>
                <input
                  type="number"
                  name="amount"
                  value={newExpense.amount}
                  onChange={handleInputChange}
                  placeholder="0"
                  className={errors.amount ? 'input-error' : ''}
                  required
                />
                {errors.amount && <span className="error-text">{errors.amount}</span>}
              </div>
              <div className="form-group">
                <label>التاريخ *</label>
                <input
                  type="date"
                  name="date"
                  value={newExpense.date}
                  onChange={handleInputChange}
                  className={errors.date ? 'input-error' : ''}
                  required
                />
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>الوصف</label>
                <input
                  type="text"
                  name="description"
                  value={newExpense.description}
                  onChange={handleInputChange}
                  placeholder="وصف المصروف"
                />
              </div>
              <div className="form-group">
                <label>ملاحظات إضافية</label>
                <textarea
                  name="notes"
                  value={newExpense.notes}
                  onChange={handleInputChange}
                  placeholder="ملاحظات إضافية..."
                  rows="2"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success">
                {editingId ? '✓ تحديث المصروف' : '✓ إضافة المصروف'}
              </button>
              <button type="button" className="btn btn-cancel" onClick={handleCancel}>
                ✕ إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="filter-container">
        <label>فلتر حسب الوحدة:</label>
        <select value={filterUnit} onChange={(e) => setFilterUnit(e.target.value)}>
          <option value="الكل">الكل</option>
          {units.map(unit => (
            <option key={unit.id} value={unit.id}>
              الوحدة {unit.number}
            </option>
          ))}
        </select>
      </div>

      {expensesByUnit.length > 0 && (
        <div className="expenses-summary-section">
          <h3>📊 ملخص المصروفات حسب الوحدات</h3>
          <div className="summary-grid">
            {expensesByUnit.map(unit => (
              <div key={unit.id} className="summary-item">
                <div className="summary-header">
                  <span className="unit-name">الوحدة {unit.number}</span>
                  <span className="count-badge">{unit.count}</span>
                </div>
                <div className="summary-amount">{unit.amount.toLocaleString()} ر.س</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {expensesByCategory.some(cat => cat.amount > 0) && (
        <div className="expenses-category-section">
          <h3>📈 المصروفات حسب الفئات</h3>
          <div className="category-grid">
            {expensesByCategory.filter(cat => cat.amount > 0).map((cat, idx) => (
              <div key={idx} className="category-item">
                <div className="category-name">{cat.name}</div>
                <div className="category-amount">{cat.amount.toLocaleString()} ر.س</div>
                <div className="category-count">({cat.count} مصروف)</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>الوحدة</th>
              <th>الفئة</th>
              <th>المبلغ</th>
              <th>الوصف</th>
              <th>التاريخ</th>
              <th>الملاحظات</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.length > 0 ? sortedExpenses.map((expense) => (
              <tr key={expense.id}>
                <td><strong>الوحدة {expense.unitName}</strong></td>
                <td>
                  <span className="badge badge-info">{expense.category}</span>
                </td>
                <td className="amount"><strong>{expense.amount.toLocaleString()} ر.س</strong></td>
                <td>{expense.description}</td>
                <td>{new Date(expense.date).toLocaleDateString('ar-SA')}</td>
                <td>{expense.notes}</td>
                <td className="actions-cell">
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEditExpense(expense)}
                  >
                    تعديل
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteExpense(expense.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="empty-row">لا توجد مصروفات</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Expenses;
