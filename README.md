# Da Vinci Dental Clinic

موقع Next.js + PostgreSQL + Prisma. الخطوات التالية كافية لتشغيل المشروع من الصفر.

## 1) ثبّت المتطلبات

- **Node.js 20+** — [nodejs.org](https://nodejs.org)
- **pnpm** — بعد تثبيت Node:
  ```bash
  npm install -g pnpm
  ```
- **PostgreSQL 14+** — [postgresql.org/download](https://www.postgresql.org/download)
  - **Ubuntu/Debian**: `sudo apt install postgresql`
  - **macOS**: `brew install postgresql@16 && brew services start postgresql@16`
  - **Windows**: نزّل المثبّت واتبع المعالج

## 2) أنشئ قاعدة البيانات

سجّل الدخول إلى PostgreSQL:

```bash
sudo -u postgres psql
```

ثم نفّذ:

```sql
CREATE USER clinic_user WITH PASSWORD 'اختار_كلمة_مرور_قوية';
CREATE DATABASE clinic OWNER clinic_user;
\q
```

> على Windows استخدم `psql -U postgres` بعد التثبيت (سيطلب كلمة المرور التي وضعتها أثناء التثبيت).

**تحقق**:

```bash
psql "postgresql://clinic_user:كلمة_المرور@localhost:5432/clinic" -c "SELECT 1;"
```

يجب أن يظهر `1`. إن ظهر، القاعدة جاهزة.

## 3) أنشئ ملف `.env`

في مجلد المشروع:

```bash
cp .env.example .env
```

إن لم يكن `.env.example` موجودًا، أنشئ `.env` يدويًا بمحتواه:

```env
DATABASE_URL="postgresql://clinic_user:كلمة_المرور@localhost:5432/clinic?schema=public"
AUTH_SECRET="ضع_هنا_قيمة_عشوائية_طويلة_32_حرف_على_الأقل"
SEED_ADMIN_USERNAME="admin"
SEED_ADMIN_PASSWORD="123456789"
```

**لتوليد `AUTH_SECRET`**:

```bash
openssl rand -base64 48
```

انسخ الناتج كاملًا.

> ⚠️ `AUTH_SECRET` سرّي. لا تشاركه، لا ترفعه إلى Git.

## 4) ثبّت الاعتماديات

```bash
pnpm install
```

## 5) أنشئ جداول قاعدة البيانات

```bash
pnpm db:deploy
```

## 6) أنشئ حساب الأدمن والبيانات الأولية

```bash
pnpm db:seed
```

يجب أن ترى:
```
Admin user ready: admin
Services: 30, categories: 12
Doctors: 2
Seed finished.
```

## 7) شغّل الموقع

**للتطوير**:
```bash
pnpm dev
```

**للإنتاج** (بعد `pnpm build`):
```bash
pnpm build
pnpm start
```

افتح: **http://localhost:3000**

- الموقع: `/ar` أو `/en`
- لوحة الإدارة: `/admin/login`
  - **Username**: `admin`
  - **Password**: `123456789`

---

## ماذا يفعل كل أمر؟

| الأمر | ماذا يفعل |
|---|---|
| `pnpm install` | يثبّت مكتبات المشروع (next, react, prisma…) |
| `pnpm db:deploy` | يطبّق جداول Prisma على PostgreSQL |
| `pnpm db:seed` | ينشئ حساب الأدمن + يعبّئ الخدمات والأطباء والأسئلة والمعرض |
| `pnpm dev` | يشغّل الموقع على `localhost:3000` (تطوير، مع hot reload) |
| `pnpm build` | يبني نسخة الإنتاج (مجلد `.next/`) |
| `pnpm start` | يشغّل نسخة الإنتاج على `localhost:3000` |

---

## تغيير كلمة مرور الأدمن

بعد أول تسجيل دخول، غيّر كلمة المرور من لوحة الإدارة:

1. سجّل الدخول بـ `admin / 123456789`.
2. اذهب إلى **Settings → Change Password** (`/admin/settings/password`).
3. أدخل كلمة المرور الحالية (`123456789`) وكلمة مرور جديدة قوية.
4. احفظ.

> يمكنك أيضًا تغيير اسم المستخدم من قاعدة البيانات لاحقًا عند الحاجة.

---

## حل مشاكل سريع

### ❌ `Can't reach database server`
PostgreSQL لا يعمل. جرّب:
```bash
sudo systemctl start postgresql    # Linux
brew services start postgresql@16  # macOS
```
ثم:
```bash
pg_isready -h localhost -p 5432
```

### ❌ `password authentication failed`
كلمة المرور في `.env` لا تطابق القاعدة. أعد تعيينها:
```bash
sudo -u postgres psql -c "ALTER USER clinic_user WITH PASSWORD 'new_password';"
```
ثم حدّث `.env`.

### ❌ `AUTH_SECRET must be at least 32 characters`
أضف قيمة صحيحة في `.env`. استخدم `openssl rand -base64 48`.

### ❌ `Cannot find module '@prisma/client'`
```bash
pnpm prisma:generate
```

### ❌ `Prisma Client` out of date
بعد تعديل السكيما:
```bash
pnpm prisma:generate
pnpm dev
```

### ❌ نسيت كلمة مرور الأدمن (بعد التسليم)

أنشئ ملفًا مؤقتًا `reset-admin.mjs` في جذر المشروع:

```js
import { PrismaClient } from "@prisma/client";
import crypto from "node:crypto";

function hash(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString("base64");
}
function record(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  return `${salt}:${hash(password, salt)}`;
}

const prisma = new PrismaClient();
await prisma.adminUser.update({
  where: { username: "admin" },
  data: { passwordHash: record("كلمة_المرور_الجديدة") },
});
console.log("Password reset done");
await prisma.$disconnect();
```

نفّذه:

```bash
node reset-admin.mjs
rm reset-admin.mjs
```

ثم سجّل الدخول بالكلمة الجديدة.

---

## للنشر على خادم (VPS)

1. ارفع المشروع إلى الخادم (Git أو SCP).
2. كرّر الخطوات 1-6 أعلاه.
3. `pnpm build && pnpm start`
4. (اختياري) اجعل Nginx يمرّر الدومين إلى `localhost:3000`.

---

## تحذيرات أمنية قبل الإطلاق

- [ ] `AUTH_SECRET` عشوائي ≥ 32 حرفًا (مختلف عن بيئة التطوير)
- [ ] **غيّر كلمة مرور الأدمن من `/admin/settings/password` بعد أول تسجيل دخول.**
  - كلمة المرور الافتراضية `123456789` **ضعيفة ولا تصلح للإنتاج**.
  - المسؤول عن الرفع يجب أن يغيّرها فورًا بعد تسجيل الدخول الأول.
  - إن نُسي تغييرها، فالموقع مكشوف لأي محاولة اختراق بسيطة.
- [ ] `.env` غير مرفوع إلى Git
- [ ] نسخة احتياطية للقاعدة قبل أي تعديل كبير:
  ```bash
  set -a; source .env; set +a
  pg_dump "${DATABASE_URL%%\?*}" > backup.sql
  ```
- [ ] رفع صور الأدمن (`public/uploads/`) يحتاج تخزينًا خارجيًا لو استخدمت Vercel. على VPS عادي، يعمل مباشرة.
