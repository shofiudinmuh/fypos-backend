# FyPOS Backend

Backend API untuk FyPOS (multi-tenant Point of Sale) dibangun dengan NestJS + Prisma, menggunakan PostgreSQL sebagai database dan Redis untuk cache/queue.

## Fitur utama

- Multi-tenant: entitas tenant/outlet & manajemen karyawan.
- Authentication: JWT login + Google OAuth (redirect ke frontend).
- Master data produk: product, category, variant, ingredient, product-ingredient.
- Audit log: histori aktivitas untuk owner.
- File upload: image produk (multipart) dan serve statis di `/uploads`.
- Swagger: dokumentasi API di `/api`.

## Tech stack

- NestJS (TypeScript)
- Prisma ORM + PostgreSQL
- Redis (node-redis) + BullMQ (disiapkan)
- Swagger (`@nestjs/swagger`)

## Prasyarat

- Node.js (disarankan Node 20+)
- PostgreSQL
- Redis

## Environment variables

Project ini membaca `.env` (lihat `src/app.module.ts`).

**Wajib**

- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `MIDTRANS_SERVER_KEY`

**Umum / disarankan**

- `FRONTEND_URL` (untuk redirect Google OAuth)
- `JWT_EXPIRATION` (saat ini JWT expire diset `24h` di module)
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `MIDTRANS_CLIENT_KEY`, `MIDTRANS_IS_PRODUCTION`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`

Contoh minimal:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173

DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/fypos?schema=public
JWT_SECRET=change-me

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

MIDTRANS_SERVER_KEY=change-me
MIDTRANS_CLIENT_KEY=change-me
MIDTRANS_IS_PRODUCTION=false

GOOGLE_CLIENT_ID=change-me
GOOGLE_CLIENT_SECRET=change-me
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

## Menjalankan project (dev)

```bash
npm install
```

Migrasi DB + generate Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

Run:

```bash
npm run start:dev
```

## Swagger (API Docs)

- Buka: `http://localhost:<PORT>/api`

## Auth & Roles

- Gunakan header `Authorization: Bearer <token>` untuk endpoint yang dilindungi.
- Role yang dipakai di controller: `SUPERADMIN`, `OWNER`, `MANAGER`, `ADMIN`, `CASHIER`.
- Google OAuth flow:
  - `GET /auth/google` untuk redirect ke Google
  - callback akan redirect ke `FRONTEND_URL/auth/callback?token=...&tenant_id=...`

## Upload file

- Endpoint create/update product menerima `multipart/form-data` dengan field `image`.
- File disimpan ke folder `uploads/` dan bisa diakses via URL `/uploads/...` (lihat `src/app.module.ts` dan `src/common/services/file-upload.service.ts`).

## Scripts

```bash
npm run start
npm run start:dev
npm run start:prod
npm run build
npm run lint
npm run format
npm run test
npm run test:e2e
```

## Struktur folder (ringkas)

- `src/modules/*`: controller + usecase + dto per domain
- `src/infrastructure/database`: Prisma + Redis provider
- `prisma/`: schema dan migrations

## Catatan

- CORS origin saat ini dibatasi ke `https://fypos.id` dan `http://localhost:5173` (lihat `src/main.ts`).
