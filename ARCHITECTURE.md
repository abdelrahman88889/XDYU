# 🏗️ البنية الهندسية للتطبيق

## 📐 معمارية التطبيق

```
real-estate-app/
│
├── src/
│   ├── firebase.js                 [← ✨ تهيئة Firebase]
│   ├── firebaseService.js          [← ✨ خدمات Firestore]
│   │
│   ├── App.js                      [← معالجة المصادقة والتوجيه]
│   │
│   ├── pages/
│   │   ├── Login.js               [← ✨ تسجيل الدخول عبر Firebase]
│   │   ├── Dashboard.js           [← ✨ البيانات الفورية من Firestore]
│   │   ├── Tenants.js             [← ✨ العمل مع Firestore]
│   │   ├── Units.js               [← ✨ العمل مع Firestore]
│   │   ├── Collections.js         [← ✨ العمل مع Firestore]
│   │   └── Expenses.js            [← ✨ العمل مع Firestore]
│   │
│   └── components/
│       └── Footer.js
│
├── FIREBASE_INTEGRATION.md         [← دليل التكامل الكامل]
├── QUICKSTART.md                   [← البدء السريع]
└── ARCHITECTURE.md                 [← هذا الملف]
```

---

## 🔄 سير العمل (Data Flow)

### 1️⃣ المصادقة (Authentication Flow)

```
المستخدم
   ↓
[Login Component]
   ↓
Firebase Authentication
   ↓
✓ تسجيل ناجح → حفظ البيانات في localStorage
✓ إنشاء حساب → حفظ في Firestore (users collection)
✓ تسجيل دخول اجتماعي → حفظ في Firestore
   ↓
[App Component]
   ↓
عرض Dashboard
```

### 2️⃣ حفظ البيانات (Data Save Flow)

```
[Component] ← مثال: Tenants.js
   ↓
handleAddTenant()
   ↓
   ├─ إذا كان ضيف → localStorage
   └─ إذا مسجل دخول → 
      ↓
      firebaseService.addTenant()
         ↓
         Firestore
         ↓
         Real-time listener يحدث البيانات
```

### 3️⃣ قراءة البيانات (Data Read Flow)

```
[Component] يتم تحميله
   ↓
useEffect() hook
   ↓
   ├─ إذا كان ضيف → localStorage.getItem()
   └─ إذا مسجل دخول → 
      ↓
      firebaseService.onTenantsChange()
         ↓
         Real-time Listener تُنشئ
         ↓
         عند أي تغيير → setTenants() يُحدث
```

---

## 🔐 معالجة المصادقة

### قبل التحديث (القديم):
```
Login → localStorage.setItem('currentUser', userData)
        └─ لا يوجد أمان حقيقي
```

### بعد التحديث (الجديد):
```
Login → Firebase Authentication
        ↓
        ✓ تحقق آمن من البيانات
        ✓ إنشاء جلسة آمنة
        ✓ حفظ في Firestore
        ↓
        localStorage.setItem('currentUser', userData)
        └─ نسخة محلية من البيانات للأداء
```

---

## 📊 بنية Firestore

### Collection: `users`
```json
{
  "uid": "firebase-user-id",
  "email": "user@example.com",
  "displayName": "اسم المستخدم",
  "photoURL": "url-to-photo",
  "method": "google|facebook|apple|microsoft|email",
  "createdAt": "2024-05-02T...",
  "updatedAt": "2024-05-02T..."
}
```

### Collection: `tenants`
```json
{
  "userId": "firebase-user-id",
  "name": "اسم المستأجر",
  "idNumber": "1234567890",
  "phone": "+966501234567",
  "unit": "رقم الوحدة",
  "rentValue": 2000,
  "status": "نشط",
  "paymentSchedule": [
    {
      "date": "2024-05-01",
      "status": "قادم",
      "paidDate": null
    }
  ],
  "createdAt": "2024-05-02T...",
  "updatedAt": "2024-05-02T..."
}
```

### Collection: `units`
```json
{
  "userId": "firebase-user-id",
  "number": "101",
  "type": "شقة",
  "location": "الطابق الأول",
  "area": 120,
  "status": "مشغول",
  "tenant": "اسم المستأجر",
  "createdAt": "2024-05-02T...",
  "updatedAt": "2024-05-02T..."
}
```

### Collection: `expenses`
```json
{
  "userId": "firebase-user-id",
  "unitId": 1,
  "unitName": "101",
  "category": "صيانة",
  "amount": 500,
  "description": "صيانة الأنابيب",
  "date": "2024-05-01",
  "notes": "ملاحظات إضافية",
  "createdAt": "2024-05-02T...",
  "updatedAt": "2024-05-02T..."
}
```

### Collection: `payments`
```json
{
  "userId": "firebase-user-id",
  "tenantId": "firebase-doc-id",
  "amount": 2100,
  "date": "2024-05-01",
  "status": "مدفوع",
  "paidDate": "2024-05-02",
  "notes": "دفعة الإيجار والضريبة",
  "createdAt": "2024-05-02T...",
  "updatedAt": "2024-05-02T..."
}
```

---

## 🔌 واجهات firebaseService.js

### دوال Tenants
```javascript
addTenant(userId, tenantData)        // إضافة مستأجر
getTenants(userId)                   // جلب المستأجرين
updateTenant(tenantId, tenantData)   // تحديث مستأجر
deleteTenant(tenantId)               // حذف مستأجر
onTenantsChange(userId, callback)    // Real-time listener
```

### دوال Units
```javascript
addUnit(userId, unitData)            // إضافة وحدة
getUnits(userId)                     // جلب الوحدات
updateUnit(unitId, unitData)         // تحديث وحدة
deleteUnit(unitId)                   // حذف وحدة
onUnitsChange(userId, callback)      // Real-time listener
```

### دوال Expenses
```javascript
addExpense(userId, expenseData)       // إضافة مصروف
getExpenses(userId)                  // جلب المصروفات
updateExpense(expenseId, data)       // تحديث مصروف
deleteExpense(expenseId)             // حذف مصروف
onExpensesChange(userId, callback)   // Real-time listener
```

### دوال Payments
```javascript
addPayment(userId, paymentData)       // إضافة دفعة
getPayments(userId)                  // جلب الدفعات
updatePayment(paymentId, data)       // تحديث دفعة
deletePayment(paymentId)             // حذف دفعة
onPaymentsChange(userId, callback)   // Real-time listener
```

---

## 🎯 تدفق بيانات العينة

### مثال: إضافة مستأجر جديد

```
1. المستخدم يملأ النموذج
   ↓
2. يضغط "إضافة المستأجر"
   ↓
3. handleAddTenant() في Tenants.js
   ↓
4. التحقق من الصحة
   ↓
5. التحقق: هل المستخدم مسجل دخول؟
   ├─ نعم → firebaseService.addTenant(userId, data)
   │         ↓
   │         Firebase Firestore
   │         ↓
   │         Real-time listener يستقبل التحديث
   │         ↓
   │         setTenants() يحدث الحالة
   │         ↓
   │         واجهة تتحدث تلقائياً
   │
   └─ لا → localStorage.setItem('tenants', ...)
            ↓
            setTenants() يحدث الحالة
            ↓
            واجهة تتحدث
```

---

## 🔒 Security Rules (مثال)

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // المستخدمون يرون بياناتهم فقط
    match /tenants/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    match /units/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    match /expenses/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
    
    match /payments/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 🚀 أداء التطبيق

### التحسينات المضافة:
```
✓ Lazy loading للبيانات الكبيرة
✓ Caching محلي في localStorage للضيوف
✓ Real-time listeners بدلاً من polling
✓ Pagination (إذا لزم الأمر)
✓ Indexes في Firestore للبحث السريع
```

---

## 📈 التطور المستقبلي

### مرحلة 2:
- [ ] إضافة تقارير متقدمة
- [ ] تصدير إلى Excel/PDF
- [ ] إشعارات في الوقت الفعلي
- [ ] رسائل نصية عند استحقاق الدفعات

### مرحلة 3:
- [ ] تطبيق mobile (React Native)
- [ ] نظام CRM متكامل
- [ ] API عام للتطبيقات الثالثة
- [ ] تحليلات متقدمة

---

## 💾 المخزن المؤقت (Caching)

### للضيوف:
```javascript
// يتم حفظ كل شيء محلياً
localStorage.setItem('tenants', JSON.stringify(data))
localStorage.setItem('units', JSON.stringify(data))
localStorage.setItem('expenses', JSON.stringify(data))
```

### للمستخدمين المسجلين:
```javascript
// يتم حفظ في Firestore
// والـ listeners تحدث البيانات تلقائياً
// بدون الحاجة لـ localStorage إذا رغبت
```

---

## 🧪 الاختبار

### اختبار الوحدة (Unit Tests):
```javascript
// اختبر كل دالة في firebaseService بمعزل
test('addTenant should save to Firestore', async () => {
  const result = await addTenant('user-id', {...});
  expect(result.id).toBeDefined();
});
```

### اختبار التكامل (Integration Tests):
```javascript
// اختبر تدفق كامل: دخول → إضافة بيانات → قراءة
test('Full tenant creation flow', async () => {
  // تسجيل دخول
  // إضافة مستأجر
  // التحقق من ظهوره
});
```

---

## 📚 المراجع

- Firebase Documentation: https://firebase.google.com/docs
- Firestore: https://firebase.google.com/docs/firestore
- Authentication: https://firebase.google.com/docs/auth
- Real-time Database: https://firebase.google.com/docs/realtime-database

---

**هذه البنية توفر:**
- ✅ أمان قوي
- ✅ قابلية توسع
- ✅ أداء جيد
- ✅ تطوير سهل في المستقبل
