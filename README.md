# 🏢 تطبيق إدارة العقارات

تطبيق React متكامل وحديث لإدارة العقارات والمستأجرين والتحصيل بواجهة عربية احترافية.

## ✨ المميزات الرئيسية

- 📊 **لوحة تحكم متقدمة** - عرض إحصائيات شاملة وملخص العمليات
- 👥 **إدارة المستأجرين** - إضافة وتعديل وحذف المستأجرين
- 🏠 **إدارة الوحدات** - تتبع الوحدات والحالات وأسعار الإيجار
- 💰 **إدارة التحصيل** - تتبع الدفعات والمبالغ المستحقة
- 🎨 **تصميم عربي احترافي** - واجهة جميلة وسهلة الاستخدام
- 📱 **متجاوب** - يعمل على جميع الأجهزة والشاشات
- 🔒 **تخزين آمن** - البيانات تُحفظ محلياً على جهازك

## 🚀 التشغيل السريع

### المتطلبات
- Node.js 14.0 أو أحدث
- npm 6.0 أو أحدث

### التثبيت والتشغيل
```bash
# تثبيت المكتبات
npm install

# تشغيل التطبيق في وضع التطوير
npm start

# بناء التطبيق للإنتاج
npm run build

# تشغيل الاختبارات
npm test
```

## 📁 بنية المشروع

```
real-estate-app/
├── public/                 # ملفات عامة
├── src/
│   ├── pages/             # صفحات التطبيق
│   │   ├── Dashboard.js   # لوحة التحكم
│   │   ├── Tenants.js     # إدارة المستأجرين
│   │   ├── Units.js       # إدارة الوحدات
│   │   └── Collections.js # إدارة التحصيل
│   ├── App.js             # المكون الرئيسي
│   ├── App.css            # الأنماط الرئيسية
│   ├── config.js          # الإعدادات
│   └── utils.js           # دوال مساعدة
├── package.json           # المكتبات والبيانات
└── README.md             # هذا الملف
```

## 🛠️ الأدوات المستخدمة

- **React** - مكتبة لبناء الواجهات
- **React Router** - لإدارة التنقل بين الصفحات
- **CSS3** - للتصميم والأنماط
- **JavaScript ES6+** - لغة البرمجة

## 📖 دليل الاستخدام

### إضافة وحدة جديدة
1. اذهب إلى صفحة "الوحدات"
2. اضغط "إضافة وحدة جديدة"
3. ملء النموذج ببيانات الوحدة
4. اضغط "حفظ"

### إضافة مستأجر جديد
1. اذهب إلى صفحة "المستأجرين"
2. اضغط "إضافة مستأجر جديد"
3. ملء بيانات المستأجر
4. اضغط "حفظ"

### تسجيل دفعة إيجار
1. اذهب إلى صفحة "التحصيل"
2. اضغط "إضافة إيجار جديد"
3. ملء تفاصيل الإيجار
4. اضغط "حفظ"
5. بعد الدفع، اضغط "مدفوع" لتحديث الحالة

## 🎨 التصميم والألوان

- **اللون الأساسي**: بنفسجي غامق (#667eea)
- **لون النجاح**: أزرق فاتح (#48dbfb)
- **لون الخطأ**: أحمر (#f5576c)
- **لون التحذير**: برتقالي (#ffa502)

## 🔐 أمان البيانات

- البيانات تُحفظ محلياً في متصفحك
- لا تُرسل البيانات إلى أي خادم
- تنسيخ احتياطي عند الحاجة

## 🤝 المساهمة

لديك أفكار لتحسين التطبيق؟ نرحب بمساهماتك!

## 📞 التواصل والدعم

إذا واجهت أي مشاكل أو لديك اقتراحات:
1. تحقق من ملف GUIDE.md للمزيد من المعلومات
2. تأكد من تثبيت المكتبات بشكل صحيح
3. جرب إعادة تشغيل التطبيق

## 📄 الترخيص

جميع الحقوق محفوظة ©2024 - تطبيق إدارة العقارات

---

**نسخة التطبيق**: 1.0.0  
**آخر تحديث**: أبريل 2024  
**الحالة**: ✅ جاهز للاستخدام الفعلي

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
