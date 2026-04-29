import React, { useState, useEffect } from 'react';

const defaultUnits = [
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
    type: 'شقة',
    location: 'الحي الوسط',
    area: 150,
    rentPrice: 1500,
    status: 'فارغ',
    tenant: '-'
  }
];

function Units() {
  const [units, setUnits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState({});
  const [newUnit, setNewUnit] = useState({
    number: '',
    type: 'شقة',
    location: '',
    area: '',
    rentPrice: '',
    status: 'فارغ',
    tenant: '-'
  });

  // Load from local storage on mount
  useEffect(() => {
    // الحصول على المستخدم الحالي
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (user?.isGuest) {
      const saved = localStorage.getItem('units');
      if (saved) {
        setUnits(JSON.parse(saved));
      } else {
        setUnits(defaultUnits);
        localStorage.setItem('units', JSON.stringify(defaultUnits));
      }
    } else if (user?.email) {
      const key = `units_${user.email}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setUnits(JSON.parse(saved));
      } else {
        setUnits(defaultUnits);
        localStorage.setItem(key, JSON.stringify(defaultUnits));
      }
    }
  }, []);

  // Save to local storage whenever units change
  useEffect(() => {
    if (units.length > 0) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      const key = user?.isGuest ? 'units' : `units_${user?.email}`;
      localStorage.setItem(key, JSON.stringify(units));
    }
  }, [units]);

  const validateForm = () => {
    const newErrors = {};
    if (!newUnit.number.trim()) newErrors.number = 'رقم الوحدة مطلوب';
    if (!newUnit.location.trim()) newErrors.location = 'الموقع مطلوب';
    if (!newUnit.area || parseInt(newUnit.area) <= 0) newErrors.area = 'المساحة يجب أن تكون أكبر من 0';
    if (!newUnit.rentPrice || parseInt(newUnit.rentPrice) <= 0) newErrors.rentPrice = 'سعر الإيجار يجب أن يكون أكبر من 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUnit = () => {
    if (!validateForm()) return;

    if (editingId) {
      setUnits(units.map(u => u.id === editingId ? { ...newUnit, id: editingId, area: parseInt(newUnit.area), rentPrice: parseInt(newUnit.rentPrice) } : u));
      setEditingId(null);
    } else {
      const newId = Math.max(...units.map(u => u.id), 0) + 1;
      setUnits([...units, { ...newUnit, id: newId, area: parseInt(newUnit.area), rentPrice: parseInt(newUnit.rentPrice) }]);
    }

    setNewUnit({ number: '', type: 'شقة', location: '', area: '', rentPrice: '', status: 'فارغ', tenant: '-' });
    setShowForm(false);
    setErrors({});
  };

  const handleEditUnit = (unit) => {
    setNewUnit(unit);
    setEditingId(unit.id);
    setShowForm(true);
    setErrors({});
  };

  const handleDeleteUnit = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الوحدة؟')) {
      setUnits(units.filter(u => u.id !== id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setNewUnit({ number: '', type: 'شقة', location: '', area: '', rentPrice: '', status: 'فارغ', tenant: '-' });
    setErrors({});
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
            <select value={newUnit.type} onChange={(e) => setNewUnit({...newUnit, type: e.target.value})}>
              <option>شقة</option>
              <option>فيلا</option>
              <option>محل تجاري</option>
            </select>
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
          <div className="form-group">
            <label>سعر الإيجار (ر.س)</label>
            <input
              type="number"
              value={newUnit.rentPrice}
              onChange={(e) => setNewUnit({...newUnit, rentPrice: e.target.value})}
              placeholder="أدخل السعر"
              className={errors.rentPrice ? 'input-error' : ''}
            />
            {errors.rentPrice && <span className="error-text">{errors.rentPrice}</span>}
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
              <th>السعر</th>
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
                <td>{unit.rentPrice} ر.س</td>
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