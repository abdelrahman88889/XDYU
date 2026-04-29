import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>📋 شروط والبنود الاستخدام</h4>
          <p>
            نظام إدارة العقارات الاحترافي مخصص لتسهيل عملية إدارة الوحدات السكنية والتجارية وتتبع الإيجارات والدفعات. 
            يلتزم المستخدم باستخدام النظام بطريقة قانونية وأخلاقية. جميع البيانات محفوظة بسرية تامة ولا تُشارك مع أطراف ثالثة.
            المسؤولية الكاملة تقع على مدير الحساب عن أي استخدام غير صحيح للنظام.
          </p>
        </div>

        <div className="footer-section">
          <h4>🛠️ الدعم الفني</h4>
          <div className="support-info">
            <p><strong>📞 الهاتف:</strong> <span className="support-link">+966545368669</span></p>
            <p><strong>💬 الواتس اب:</strong> <a href="https://wa.me/966545368669" target="_blank" rel="noopener noreferrer" className="support-link">0545368669</a></p>
            <p><strong>⏰ ساعات العمل:</strong> من 9 صباحاً إلى 6 مساءً</p>
            <p><strong>📅 أيام العمل:</strong> الأحد - الخميس</p>
          </div>
        </div>

        <div className="footer-section">
          <h4>👤 مدير الموقع</h4>
          <div className="manager-info">
            <p className="manager-name">عبدالرحمن احمد السيد عبدالمقصود</p>
            <p><strong>الدور:</strong> مدير النظام الرئيسي</p>
            <p><strong>البريد الإلكتروني:</strong> <span className="support-link">abdelrahman1ahmmed@gmail.com</span></p>
            <p><strong>المسؤولية:</strong> الإشراف على النظام وضمان جودة الخدمة</p>
          </div>
        </div>

        <div className="footer-section">
          <h4>ℹ️ معلومات النظام</h4>
          <p><strong>النسخة:</strong> 1.4.1</p>
          <p><strong>آخر تحديث:</strong> 2026-04-29</p>
          <p><strong>الحالة:</strong> ✅ جاهز للاستخدام والنشر</p>
          <p><strong>الأمان:</strong> 🔒 محمي بكلمات مرور + مصادقة متقدمة</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 جميع الحقوق محفوظة | نظام إدارة العقارات المتقدم</p>
        <p>تم تطويره بعناية لتسهيل عملية الإدارة والتحصيل</p>
      </div>
    </footer>
  );
}

export default Footer;
