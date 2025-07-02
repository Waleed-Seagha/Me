# مدونة تقنية - Arabic Technical Blog

## نظرة عامة | Overview

هذا المشروع عبارة عن مدونة تقنية عربية تقوم بتوليد محتوى يومي جديد باستخدام الذكاء الاصطناعي، حول آخر مستجدات تطوير الويب والتقنيات الحديثة.

This project is an Arabic technical blog that automatically generates new daily content using AI about the latest web development news and trends.

### المميزات | Features

- توليد تلقائي للمحتوى كل 24 ساعة
- محتوى باللغة العربية عن أحدث تقنيات الويب
- دعم وضع الإضاءة الفاتح والداكن
- واجهة مستخدم سلسة وبسيطة
- تصميم متجاوب لجميع أحجام الشاشات

## التقنيات المستخدمة | Technologies

### الواجهة الأمامية | Frontend
- React
- TypeScript
- Tailwind CSS
- shadcn/ui Components
- React Router

### الخادم | Backend
- Node.js
- Express
- node-cron
- OpenRouter API (AI)

## متطلبات النظام | Requirements

- Node.js (v16+)
- PNPM (v8+)
- مفتاح API من OpenRouter | OpenRouter API key

## التثبيت والإعداد | Setup & Installation

### 1. استنساخ المشروع | Clone the repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. تثبيت التبعيات | Install dependencies

قم بتثبيت تبعيات الواجهة الأمامية:

```bash
pnpm install
```

قم بتثبيت تبعيات الخادم:

```bash
cd server
npm install
cd ..
```

### 3. إعداد مفتاح API | Configure API Key

1. قم بإنشاء ملف `.env` في مجلد `server/` باستخدام النموذج الموجود في `.env.example`:

```bash
cp .env.example server/.env
```

2. قم بتعديل ملف `server/.env` لإضافة مفتاح API الخاص بك من [OpenRouter](https://openrouter.ai/):

```
OPENROUTER_API_KEY=your_api_key_here
```

## التشغيل | Running the Project

### تشغيل الواجهة الأمامية | Running the Frontend

```bash
pnpm run dev
```

### تشغيل الخادم | Running the Server

```bash
cd server
node index.js
```

يمكنك أيضًا تشغيل الخادم في وضع التطوير بهذا الأمر:

```bash
cd server
npm run dev
```

## آلية عمل المشروع | How It Works

1. الخادم يستخدم `node-cron` لجدولة مهمة تنفذ كل 24 ساعة
2. عند التنفيذ، يتم الاتصال بـ OpenRouter API باستخدام نموذج Mixtral-8x7b لتوليد محتوى جديد باللغة العربية
3. يتم استخراج العنوان والوسوم من المحتوى المولد
4. يتم حفظ التدوينة الجديدة في قاعدة البيانات (ملف JSON)
5. الواجهة الأمامية تعرض التدوينات مرتبة حسب التاريخ

## المساهمة | Contributing

نرحب بمساهماتكم! يرجى اتباع هذه الخطوات:

1. Fork المشروع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add some amazing feature'`)
4. Push الفرع (`git push origin feature/amazing-feature`)
5. فتح طلب Pull Request

## الترخيص | License

هذا المشروع مرخص تحت رخصة MIT.
