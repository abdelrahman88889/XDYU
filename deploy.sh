#!/bin/bash
# Real Estate App Deployment Script

echo "🏢 تطبيق إدارة العقارات - سكريبت النشر"
echo "=================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت!"
    exit 1
fi

echo "✅ Node.js مثبت: $(node --version)"
echo "✅ npm مثبت: $(npm --version)"
echo ""

# Install dependencies
echo "📦 تثبيت المكتبات..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ فشل تثبيت المكتبات"
    exit 1
fi

echo "✅ تم تثبيت المكتبات بنجاح"
echo ""

# Build
echo "🔨 بناء التطبيق..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ فشل بناء التطبيق"
    exit 1
fi

echo "✅ تم بناء التطبيق بنجاح"
echo ""

# Create deployment summary
echo "📊 ملخص البناء:"
echo "- المجلد: build/"
echo "- الحجم: $(du -sh build/ | cut -f1)"
echo ""

echo "🎉 تم الانتهاء بنجاح!"
echo ""
echo "خيارات النشر:"
echo "1. npm start          - تشغيل في وضع التطوير"
echo "2. serve -s build     - تشغيل النسخة الإنتاجية محلياً"
echo "3. نشر على خادم ويب"
echo ""
echo "مزيد من المعلومات: اطلع على GUIDE.md"
