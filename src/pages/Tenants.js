import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { addTenant, getTenants, updateTenant, deleteTenant, onTenantsChange } from '../firebaseService';

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

function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedTenant, setExpandedTenant] = useState(null);
  const [editingPaymentIndex, setEditingPaymentIndex] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    status: 'نشط',
    electricityMeter: ''
  });

  // Load data on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    setCurrentUser(user);

    if (user?.isGuest) {
      // Load from localStorage for guests
      const saved = localStorage.getItem('tenants');
      if (saved) {
        setTenants(JSON.parse(saved));
      }
    } else if (user?.uid) {
      // Load from Firebase for authenticated users
      setLoading(true);
      const unsubscribe = onTenantsChange(user.uid, (data) => {
        setTenants(data);
        setLoading(false);
      });
      
      // Cleanup function
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, []);

  // Save to localStorage whenever tenants change (for guests)
  useEffect(() => {
    if (currentUser?.isGuest) {
      localStorage.setItem('tenants', JSON.stringify(tenants));
    }
  }, [tenants, currentUser?.isGuest]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTenant(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTenant = async (e) => {
    e.preventDefault();
    if (!newTenant.name || !newTenant.idNumber || !newTenant.phone || !newTenant.unit || 
        !newTenant.rentValue || !newTenant.contractNumber || !newTenant.documentNumber) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const tenantData = {
        ...newTenant,
        rentValue: parseInt(newTenant.rentValue),
        tax: parseInt(newTenant.tax),
        paymentSchedule: calculatePaymentSchedule(newTenant.rentalStart, newTenant.rentalEnd, newTenant.paymentType)
      };

      if (editingId) {
        // Update existing tenant
        if (currentUser?.uid) {
          await updateTenant(editingId, tenantData);
        } else {
          setTenants(tenants.map(t =>
            t.id === editingId ? { ...t, ...tenantData } : t
          ));
        }
        setEditingId(null);
      } else {
        // Add new tenant
        if (currentUser?.uid) {
          await addTenant(currentUser.uid, tenantData);
        } else {
          setTenants([...tenants, {
            ...tenantData,
            id: Date.now()
          }]);
        }
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
        status: 'نشط',
        electricityMeter: ''
      });
      setShowForm(false);
    } catch (err) {
      setError('حدث خطأ: ' + err.message);
      console.error('Error adding tenant:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTenant = (tenant) => {
    setEditingId(tenant.id);
    setNewTenant(tenant);
    setShowForm(true);
  };

  const handleDeleteTenant = async (id) => {
    if (window.confirm('هل تريد حذف هذا المستأجر؟')) {
      setLoading(true);
      setError('');
      try {
        if (currentUser?.uid) {
          await deleteTenant(id);
        } else {
          setTenants(tenants.filter(t => t.id !== id));
        }
      } catch (err) {
        setError('خطأ في حذف المستأجر: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setError('');
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
      status: 'نشط',
      electricityMeter: ''
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

  const exportPaymentsToPDF = async () => {
    // Create a temporary container for the report
    const reportContainer = document.createElement('div');
    reportContainer.style.position = 'absolute';
    reportContainer.style.left = '-9999px';
    reportContainer.style.width = '1000px';
    reportContainer.style.backgroundColor = 'white';
    reportContainer.style.padding = '20px';
    reportContainer.style.fontFamily = 'Arial, sans-serif';
    reportContainer.style.direction = 'rtl';
    
    let html = `
      <h1 style="text-align: center; color: #333; margin-bottom: 10px;">تقرير الدفعات المستحقة</h1>
      <p style="text-align: center; color: #666; margin-bottom: 20px;">التاريخ: ${new Date().toLocaleDateString('ar-SA')}</p>
      <hr style="margin: 20px 0; border: 1px solid #ddd;">
    `;
    
    tenants.forEach((tenant, tenantIndex) => {
      html += `
        <div style="margin-bottom: 30px; page-break-inside: avoid;">
          <h2 style="color: #8B5CF6; font-size: 16px; margin-bottom: 10px;">المستأجر ${tenantIndex + 1}: ${tenant.name}</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 12px;">
            <tr>
              <td style="border: 1px solid #ddd; padding: 5px; background: #f5f5f5;"><strong>الهوية:</strong></td>
              <td style="border: 1px solid #ddd; padding: 5px;">${tenant.idNumber}</td>
              <td style="border: 1px solid #ddd; padding: 5px; background: #f5f5f5;"><strong>الجوال:</strong></td>
              <td style="border: 1px solid #ddd; padding: 5px;">${tenant.phone}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 5px; background: #f5f5f5;"><strong>الوحدة:</strong></td>
              <td style="border: 1px solid #ddd; padding: 5px;">${tenant.unit}</td>
              <td style="border: 1px solid #ddd; padding: 5px; background: #f5f5f5;"><strong>النوع:</strong></td>
              <td style="border: 1px solid #ddd; padding: 5px;">${tenant.unitType}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 5px; background: #f5f5f5;"><strong>الإيجار الشهري:</strong></td>
              <td style="border: 1px solid #ddd; padding: 5px;">${tenant.rentValue} ر.س</td>
              <td style="border: 1px solid #ddd; padding: 5px; background: #f5f5f5;"><strong>نوع الدفع:</strong></td>
              <td style="border: 1px solid #ddd; padding: 5px;">${tenant.paymentType}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #ddd; padding: 5px; background: #f5f5f5;"><strong>الحالة:</strong></td>
              <td style="border: 1px solid #ddd; padding: 5px;">${tenant.status}</td>
              <td style="border: 1px solid #ddd; padding: 5px; background: #f5f5f5;"><strong>العداد:</strong></td>
              <td style="border: 1px solid #ddd; padding: 5px;">${tenant.electricityMeter || '-'}</td>
            </tr>
          </table>
          
          <h3 style="color: #EC4899; font-size: 14px; margin-top: 15px; margin-bottom: 10px;">جدول الدفعات:</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
            <thead>
              <tr style="background: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%); color: white;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">#</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">تاريخ الدفعة</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">المبلغ (ر.س)</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">الحالة</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">تاريخ الدفع الفعلي</th>
              </tr>
            </thead>
            <tbody>
              ${tenant.paymentSchedule?.map((payment, idx) => {
                const status = payment.status === 'مدفوع' ? '✓ مدفوع' : 'قادم';
                const bgColor = payment.status === 'مدفوع' ? '#E0F7E9' : '#FFF5E6';
                const date = new Date(payment.date).toLocaleDateString('ar-SA');
                const paidDate = payment.paidDate ? new Date(payment.paidDate).toLocaleDateString('ar-SA') : '-';
                return `
                  <tr style="background-color: ${bgColor};">
                    <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${idx + 1}</td>
                    <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${date}</td>
                    <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${tenant.rentValue}</td>
                    <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${status}</td>
                    <td style="border: 1px solid #ddd; padding: 6px; text-align: right;">${paidDate}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div style="page-break-after: always;"></div>
      `;
    });
    
    html += `
      <hr style="margin: 20px 0; border: 1px solid #ddd;">
      <p style="text-align: center; color: #999; font-size: 10px; margin-top: 20px;">
        تم إنشاء هذا التقرير تلقائياً من نظام إدارة العقارات
      </p>
    `;
    
    reportContainer.innerHTML = html;
    document.body.appendChild(reportContainer);
    
    try {
      // Convert HTML to canvas
      const canvas = await html2canvas(reportContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Create PDF from canvas
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add images to PDF
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save PDF
      pdf.save(`تقرير_الدفعات_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('خطأ في إنشاء PDF:', error);
      alert('حدث خطأ في تصدير PDF. يرجى المحاولة مجدداً.');
    } finally {
      // Remove temporary container
      document.body.removeChild(reportContainer);
    }
  };

  const exportPaidMonthPDF = async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // فلترة المستأجرين الذين دفعوا في الشهر الحالي
    const paidTenants = tenants.filter(tenant => {
      const paidInMonth = tenant.paymentSchedule?.some(p => {
        const payDate = new Date(p.paidDate);
        return p.status === 'مدفوع' && 
               payDate.getMonth() === currentMonth && 
               payDate.getFullYear() === currentYear;
      }) || false;
      return paidInMonth;
    });

    if (paidTenants.length === 0) {
      alert('لا توجد دفعات مدفوعة في هذا الشهر');
      return;
    }

    const reportContainer = document.createElement('div');
    reportContainer.style.position = 'absolute';
    reportContainer.style.left = '-9999px';
    reportContainer.style.width = '1000px';
    reportContainer.style.backgroundColor = 'white';
    reportContainer.style.padding = '20px';
    reportContainer.style.fontFamily = 'Arial, sans-serif';
    reportContainer.style.direction = 'rtl';
    
    let html = `
      <h1 style="text-align: center; color: #48dbfb; margin-bottom: 10px;">تقرير الدفعات المدفوعة - الشهر الحالي</h1>
      <p style="text-align: center; color: #666; margin-bottom: 20px;">التاريخ: ${new Date().toLocaleDateString('ar-SA')}</p>
      <hr style="margin: 20px 0; border: 2px solid #48dbfb;">
    `;
    
    paidTenants.forEach((tenant, index) => {
      html += `
        <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #48dbfb; border-radius: 5px; background: #E0F7FF;">
          <h2 style="color: #0369A1; font-size: 16px; margin-bottom: 10px;">✓ ${index + 1}. ${tenant.name}</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr>
              <td style="border: 1px solid #48dbfb; padding: 5px; background: #B3E5FC; font-weight: bold;"><strong>الهوية:</strong></td>
              <td style="border: 1px solid #48dbfb; padding: 5px;">${tenant.idNumber}</td>
              <td style="border: 1px solid #48dbfb; padding: 5px; background: #B3E5FC; font-weight: bold;"><strong>الجوال:</strong></td>
              <td style="border: 1px solid #48dbfb; padding: 5px;">${tenant.phone}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #48dbfb; padding: 5px; background: #B3E5FC; font-weight: bold;"><strong>الوحدة:</strong></td>
              <td style="border: 1px solid #48dbfb; padding: 5px;">${tenant.unit}</td>
              <td style="border: 1px solid #48dbfb; padding: 5px; background: #B3E5FC; font-weight: bold;"><strong>المبلغ المدفوع:</strong></td>
              <td style="border: 1px solid #48dbfb; padding: 5px; font-weight: bold; color: #00695C;">${tenant.rentValue} ر.س</td>
            </tr>
          </table>
        </div>
      `;
    });
    
    html += `
      <hr style="margin: 20px 0; border: 2px solid #48dbfb;">
      <p style="text-align: center; color: #666; font-weight: bold; font-size: 13px;">
        إجمالي المدفوعات: ${paidTenants.reduce((sum, t) => sum + t.rentValue, 0).toLocaleString()} ر.س
      </p>
      <p style="text-align: center; color: #999; font-size: 10px; margin-top: 20px;">
        تم إنشاء هذا التقرير تلقائياً من نظام إدارة العقارات
      </p>
    `;
    
    reportContainer.innerHTML = html;
    document.body.appendChild(reportContainer);
    
    try {
      const canvas = await html2canvas(reportContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`تقرير_المدفوعات_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('خطأ في إنشاء PDF:', error);
      alert('حدث خطأ في تصدير PDF. يرجى المحاولة مجدداً.');
    } finally {
      document.body.removeChild(reportContainer);
    }
  };

  const exportOverdueMonthPDF = async () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const today = new Date().toISOString().split('T')[0];

    // فلترة المستأجرين المتأخرين في الشهر الحالي
    const overdueTenants = tenants.filter(tenant => {
      const hasOverdueInMonth = tenant.paymentSchedule?.some(p => {
        const payDate = new Date(p.date);
        return p.date <= today && 
               p.status !== 'مدفوع' && 
               payDate.getMonth() === currentMonth && 
               payDate.getFullYear() === currentYear;
      }) || false;
      return hasOverdueInMonth;
    });

    if (overdueTenants.length === 0) {
      alert('لا توجد دفعات متأخرة في هذا الشهر');
      return;
    }

    const reportContainer = document.createElement('div');
    reportContainer.style.position = 'absolute';
    reportContainer.style.left = '-9999px';
    reportContainer.style.width = '1000px';
    reportContainer.style.backgroundColor = 'white';
    reportContainer.style.padding = '20px';
    reportContainer.style.fontFamily = 'Arial, sans-serif';
    reportContainer.style.direction = 'rtl';
    
    let html = `
      <h1 style="text-align: center; color: #f5576c; margin-bottom: 10px;">⚠️ تقرير الدفعات المتأخرة - الشهر الحالي</h1>
      <p style="text-align: center; color: #666; margin-bottom: 20px;">التاريخ: ${new Date().toLocaleDateString('ar-SA')}</p>
      <hr style="margin: 20px 0; border: 2px solid #f5576c;">
    `;
    
    overdueTenants.forEach((tenant, index) => {
      const overdueAmount = tenant.paymentSchedule
        ?.filter(p => p.date <= today && p.status !== 'مدفوع' && new Date(p.date).getMonth() === currentMonth && new Date(p.date).getFullYear() === currentYear)
        .reduce((sum) => sum + tenant.rentValue, 0) || 0;
      
      html += `
        <div style="margin-bottom: 20px; padding: 15px; border: 2px solid #f5576c; border-radius: 5px; background: #FFE4E8;">
          <h2 style="color: #C41E3A; font-size: 16px; margin-bottom: 10px;">⚠️ ${index + 1}. ${tenant.name}</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <tr>
              <td style="border: 1px solid #f5576c; padding: 5px; background: #FFB3BA; font-weight: bold;"><strong>الهوية:</strong></td>
              <td style="border: 1px solid #f5576c; padding: 5px;">${tenant.idNumber}</td>
              <td style="border: 1px solid #f5576c; padding: 5px; background: #FFB3BA; font-weight: bold;"><strong>الجوال:</strong></td>
              <td style="border: 1px solid #f5576c; padding: 5px;">${tenant.phone}</td>
            </tr>
            <tr>
              <td style="border: 1px solid #f5576c; padding: 5px; background: #FFB3BA; font-weight: bold;"><strong>الوحدة:</strong></td>
              <td style="border: 1px solid #f5576c; padding: 5px;">${tenant.unit}</td>
              <td style="border: 1px solid #f5576c; padding: 5px; background: #FFB3BA; font-weight: bold;"><strong>المبلغ المستحق:</strong></td>
              <td style="border: 1px solid #f5576c; padding: 5px; font-weight: bold; color: #C41E3A;">${overdueAmount} ر.س</td>
            </tr>
          </table>
        </div>
      `;
    });
    
    html += `
      <hr style="margin: 20px 0; border: 2px solid #f5576c;">
      <p style="text-align: center; color: #666; font-weight: bold; font-size: 13px;">
        إجمالي المتأخرات: ${overdueTenants.reduce((sum, t) => {
          const overdueAmount = t.paymentSchedule
            ?.filter(p => p.date <= today && p.status !== 'مدفوع' && new Date(p.date).getMonth() === currentMonth && new Date(p.date).getFullYear() === currentYear)
            .reduce((s) => s + t.rentValue, 0) || 0;
          return sum + overdueAmount;
        }, 0).toLocaleString()} ر.س
      </p>
      <p style="text-align: center; color: #999; font-size: 10px; margin-top: 20px;">
        تم إنشاء هذا التقرير تلقائياً من نظام إدارة العقارات
      </p>
    `;
    
    reportContainer.innerHTML = html;
    document.body.appendChild(reportContainer);
    
    try {
      const canvas = await html2canvas(reportContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`تقرير_المتأخرات_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('خطأ في إنشاء PDF:', error);
      alert('حدث خطأ في تصدير PDF. يرجى المحاولة مجدداً.');
    } finally {
      document.body.removeChild(reportContainer);
    }
  };

  const monthlyRate = tenants.reduce((sum, t) => sum + t.rentValue, 0);
  const totalTenants = tenants.length;
  const activeTenants = tenants.filter(t => t.status === 'نشط').length;
  const overdueCount = tenants.reduce((sum, t) => sum + getPaymentStatus(t).overdue, 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">👥 إدارة المستأجرين</h1>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={exportPaymentsToPDF} title="تصدير جميع الدفعات إلى PDF">
            📄 تصدير PDF - الكل
          </button>
          <button className="btn btn-success" onClick={exportPaidMonthPDF} title="تصدير الدفعات المدفوعة في الشهر الحالي">
            ✓ تصدير PDF - المدفوعات
          </button>
          <button className="btn btn-danger" onClick={exportOverdueMonthPDF} title="تصدير الدفعات المتأخرة في الشهر الحالي">
            ⚠️ تصدير PDF - المتأخرات
          </button>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ إغلاق' : '+ إضافة مستأجر جديد'}
          </button>
        </div>
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
              <div className="form-group">
                <label>عداد الكهرباء</label>
                <input
                  type="text"
                  name="electricityMeter"
                  value={newTenant.electricityMeter}
                  onChange={handleInputChange}
                  placeholder="رقم العداد (اختياري)"
                />
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
