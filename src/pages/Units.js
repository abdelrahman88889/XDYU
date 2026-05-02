import React, { useState, useEffect } from 'react';
import { addUnit, getUnits, updateUnit, deleteUnit, onUnitsChange } from '../firebaseService';

const defaultUnits = [];

function Units() {
  const [units, setUnits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newUnit, setNewUnit] = useState({
    number: '',
    type: 'شقة',
    location: '',
    area: '',
    status: 'فارغ',
    tenant: '-'
  });

  // Load from Firebase or localStorage on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);

    if (user?.isGuest) {
      const saved = localStorage.getItem('units');
      if (saved) {
        setUnits(JSON.parse(saved));
      } else {
        setUnits(defaultUnits);
        localStorage.setItem('units', JSON.stringify(defaultUnits));
      }
    } else if (user?.uid) {
      setLoading(true);
      const unsubscribe = onUnitsChange(user.uid, (data) => {
        setUnits(data);
        setLoading(false);
      });
      
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, []);

  // Save to localStorage whenever units change (for guests)
  useEffect(() => {
    if (currentUser?.isGuest) {
      localStorage.setItem('units', JSON.stringify(units));
    }
  }, [units, currentUser?.isGuest]);

  const validateForm = () => {
    const newErrors = {};
    if (!newUnit.number.trim()) newErrors.number = 'رقم الوحدة مطلوب';
    if (!newUnit.location.trim()) newErrors.location = 'الموقع مطلوب';
    if (!newUnit.area || parseInt(newUnit.area) <= 0) newErrors.area = 'المساحة يجب أن تكون أكبر من 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUnit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const unitData = {
        ...newUnit,
        area: parseInt(newUnit.area)
      };

      if (editingId) {
        if (currentUser?.uid) {
          await updateUnit(editingId, unitData);
        } else {
          setUnits(units.map(u => u.id === editingId ? { ...u, ...unitData } : u));
        }
        setEditingId(null);
      } else {
        if (currentUser?.uid) {
          await addUnit(unitData);
        } else {
          const newId = Math.max(...units.map(u => u.id || 0), 0) + 1;
          setUnits([...units, { ...unitData, id: newId }]);
        }
      }

      setNewUnit({ number: '', type: 'شقة', location: '', area: '', status: 'فارغ', tenant: '-' });
      setShowForm(false);
      setErrors({});
    } catch (err) {
      setError('خطأ: ' + err.message);
      console.error('Error adding unit:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUnit = (unit) => {
    setNewUnit(unit);
    setEditingId(unit.id);
    setShowForm(true);
    setErrors({});
  };

  const handleDeleteUnit = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الوحدة؟')) {
      setLoading(true);
      setError('');
      try {
        if (currentUser?.uid) {
          await deleteUnit(id);
        } else {
          setUnits(units.filter(u => u.id !== id));
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
    setNewUnit({ number: '', type: 'شقة', location: '', area: '', status: 'فارغ', tenant: '-' });
    setErrors({});
    setError('');
  };

  const filteredUnits = units.filter(u =>
    u.number.includes(searchTerm) || u.location.includes(searchTerm) || u.tenant.includes(searchTerm)
  );

  const occupiedCount = filteredUnits.filter(u => u.status === 'مأجور').length;
  const emptyCount = filteredUnits.filter(u => u.status === 'فارغ').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🏠 إدارة الوحدات</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ إغلاق' : '+ إضافة وحدة جديدة'}
        </button>
      </div>

      <div className="units-summary">
        <div className="summary-item">
          <span className="summary-label">إجمالي الوحدات:</span>
          <span className="summary-value">{filteredUnits.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">مأجور:</span>
          <span className="summary-value occupied">{occupiedCount}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">فارغ:</span>
          <span className="summary-value empty">{emptyCount}</span>
        </div>
      </div>

      {showForm && (
        <div className="form-container">
          <div className="form-group">
            <label>رقم الوحدة</label>
            <input
              type="text"
              value={newUnit.number}
              onChange={(e) => setNewUnit({...newUnit, number: e.target.value})}
              placeholder="أدخل الرقم"
              className={errors.number ? 'input-error' : ''}
            />
            {errors.number && <span className="error-text">{errors.number}</span>}
          </div>
          <div className="form-group">
            <label>نوع الوحدة</label>
            <input
              type="text"
              value={newUnit.type}
              onChange={(e) => setNewUnit({...newUnit, type: e.target.value})}
              placeholder="مثال: فيلا، شقة، محل تجاري"
            />
          </div>
          <div className="form-group">
            <label>الموقع</label>
            <input
              type="text"
              value={newUnit.location}
              onChange={(e) => setNewUnit({...newUnit, location: e.target.value})}
              placeholder="أدخل الموقع"
              className={errors.location ? 'input-error' : ''}
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>
          <div className="form-group">
            <label>المساحة (م²)</label>
            <input
              type="number"
              value={newUnit.area}
              onChange={(e) => setNewUnit({...newUnit, area: e.target.value})}
              placeholder="أدخل المساحة"
              className={errors.area ? 'input-error' : ''}
            />
            {errors.area && <span className="error-text">{errors.area}</span>}
          </div>
          <div className="form-actions">
            <button className="btn btn-success" onClick={handleAddUnit}>
              ✓ {editingId ? 'تحديث' : 'حفظ'}
            </button>
            <button className="btn btn-cancel" onClick={handleCancel}>
              إلغاء
            </button>
          </div>
        </div>
      )}

      <div className="search-container">
        <input
          type="text"
          placeholder="البحث عن الوحدة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>الرقم</th>
              <th>النوع</th>
              <th>الموقع</th>
              <th>المساحة</th>
              <th>الحالة</th>
              <th>المستأجر</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredUnits.map((unit) => (
              <tr key={unit.id}>
                <td>{unit.number}</td>
                <td>{unit.type}</td>
                <td>{unit.location}</td>
                <td>{unit.area} م²</td>
                <td><span className={`status-badge ${unit.status === 'مأجور' ? 'occupied' : 'empty'}`}>{unit.status}</span></td>
                <td>{unit.tenant}</td>
                <td className="actions-cell">
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEditUnit(unit)}
                  >
                    تعديل
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteUnit(unit.id)}>
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUnits.length === 0 && (
          <div className="empty-state">لا توجد بيانات</div>
        )}
      </div>
    </div>
  );
}

export default Units;