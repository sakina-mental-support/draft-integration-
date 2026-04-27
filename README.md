# مشروع سكينة (Sakina Project) 🌿

مشروع متكامل لدعم الصحة النفسية باستخدام الذكاء الاصطناعي (Gemini AI).

## خطوات التشغيل لصاحبك (How to Run)

عشان صاحبك يشغل المشروع عنده، محتاج يتبع الخطوات دي بالترتيب:

### 1. إعداد ملفات البيئة (.env Setup) 🔑
بما إننا مش بنرفع ملفات الـ `.env` على Git للأمان، صاحبك لازم يعملهم يدوي:

*   **في مجلد `sakina-backend`**: يعمل ملف `.env` ويحط فيه:
    ```env
    MONGO_URI=your_mongodb_uri
    PORT=5005
    JWT_SECRET=any_secret_key
    GEMINI_API_KEY=your_gemini_api_key
    ```
*   **في مجلد `sakina-ai-service-main`**: يعمل ملف `.env` ويحط فيه:
    ```env
    GEMINI_API_KEY=your_gemini_api_key
    ```

### 2. تثبيت المكتبات (Installation) 📦

يفتح الـ Terminal في المجلد الرئيسي وينفذ الأوامر دي:

*   **Backend**:
    ```bash
    cd sakina-backend
    npm install
    ```
*   **Frontend**:
    ```bash
    cd ../sakina-frontend/sakina-frontend-main
    npm install
    ```
*   **AI Service (Python)**:
    ```bash
    cd ../../sakina-ai-service-main
    pip install -r requirements.txt
    ```

### 3. تشغيل المشروع (Running) 🚀

محتاج يفتح 3 Terminal ويشغل كل خدمة:

1.  **AI Service**: `python app.py` (بيشتغل على بورت 5000)
2.  **Backend**: `node server.js` (بيشتغل على بورت 5005)
3.  **Frontend**: `npm run dev` (بيفتح الموقع)

---

## حل مشكلة الـ (MongoDB Error) 🛠️
لو ظهر لصاحبك إيرور فيه `querySrv ECONNREFUSED` أو `ECONNRESET` ده معناه إن الشبكة عنده قافلة الـ DNS بتاع أطلس.

**الحل:**
يستخدم الرابط المباشر (Standard Connection String) بدلاً من `+srv` في ملف الـ `.env`:

```env
MONGO_URI=mongodb://mohamedehab:mohamedehab7@ac-2snafe2-shard-00-00.f9qpppx.mongodb.net:27017,ac-2snafe2-shard-00-01.f9qpppx.mongodb.net:27017,ac-2snafe2-shard-00-02.f9qpppx.mongodb.net:27017/?ssl=true&replicaSet=atlas-xziulm-shard-0&authSource=admin&retryWrites=true&w=majority
```

---

## ملاحظة هامة (Important Note)
لو واجه مشكلة في الاتصال بـ MongoDB من الجهاز بتاعه، لازم يتأكد إن الـ IP بتاعه مضاف في الـ **Whitelist** في MongoDB Atlas dashboard.

---

## تقنيات المشروع (Tech Stack)
*   **Frontend**: React.js + Vite
*   **Backend**: Node.js + Express
*   **AI Service**: Python (Flask) + Google Gemini AI + Transformers
*   **Database**: MongoDB Atlas
