# Aplikasi Aset Bakti Komdigi

## Ringkasan

Dokumentasi ini menggabungkan informasi teknis aplikasi dan panduan troubleshoot dalam satu file.
Aplikasi terdiri dari frontend React/Vite dan backend Node/Express.

## Struktur Proyek

```
asetbaktikomdigi-main/
├─ backend/
│  ├─ package.json
│  ├─ server.js
│  ├─ .env
│  ├─ config/
│  ├─ middleware/
│  └─ services/
├─ frontend/
│  ├─ package.json
│  ├─ src/
│  ├─ public/
│  └─ vite.config.ts
├─ package.json
├─ DOCUMENTATION.md
└─ README.md
```

## Ekosistem dan Alur

Aplikasi ini menggunakan model monorepo sederhana dengan root `package.json` yang memanggil folder `frontend` dan `backend`.
Frontend menampilkan UI sedangkan backend menyediakan API, LDAP auth, dan koneksi database.

---

## Root `package.json` Scripts

Script utama di root:

- `install:all`
  - `npm install && cd backend && npm install && cd ../frontend && npm install`
  - Instal semua dependensi di root, backend, dan frontend.
- `dev`
  - `concurrently "npm run server" "npm run client"`
  - Menjalankan backend dan frontend secara paralel.
- `server`
  - `cd backend && npm run dev -- --host`
  - Menjalankan backend di `backend/`.
- `client`
  - `cd frontend && npm run dev -- --host`
  - Menjalankan frontend di `frontend/`.
- `build`
  - `cd frontend && npm run build`
  - Build frontend untuk produksi.
- `start`
  - `cd backend && npm start`
  - Menjalankan backend (yang men-serve hasil build frontend).

---

## Frontend

Folder: `frontend/`

### Teknologi

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn-ui
- React Router
- React Query

### Script Frontend

- `npm run dev` — Jalankan development server Vite.
- `npm run build` — Build aplikasi untuk produksi.
- `npm run preview` — Preview hasil build static.
- `npm run lint` — Jalankan ESLint.
- `npm run test` — Jalankan Vitest.
- `npm run start` — Dummy script: `echo "Frontend is served by backend"`.

### Catatan

Frontend tidak dijalankan sendiri dalam production; hasil build `frontend/dist` dilayani oleh backend.

---

## Backend

Folder: `backend/`

### Teknologi

- Node.js
- Express 5
- MySQL (`mysql2`)
- LDAP (`ldapts`)
- JWT (`jsonwebtoken`)
- dotenv
- bcryptjs
- cors

### Script Backend

- `npm run dev` — Jalankan server dengan `node server.js`.
- `npm start` — Jalankan server produksi dengan `node server.js`.
- `npm run build` — Placeholder; backend tidak perlu build.

### Konfigurasi Server

Backend server:

- Berjalan pada port `3001`.
- Menggunakan `.env` untuk konfigurasi database, LDAP, dan JWT.
- Melayani file statis dari `frontend/dist`.
- Menggunakan SPA fallback middleware untuk mengirim `index.html` pada route yang tidak dikenali.

### Variabel Lingkungan

`backend/.env` harus berisi:

- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `LDAP_URL_1`
- `JWT_SECRET`

Contoh:

```env
DB_HOST=172.16.10.239
DB_USER=baktiuser
DB_PASSWORD=Bakti2025.
DB_NAME=aset_bakti
LDAP_URL_1=ldap://172.16.10.136:389
JWT_SECRET=your_jwt_secret_here
```

---

## Alur Deployment

1. Install dependensi:

```bash
npm run install:all
```

2. Jalankan development:

```bash
npm run dev
```

3. Build frontend produksi:

```bash
npm run build
```

4. Jalankan backend produksi:

```bash
npm start
```

5. Akses aplikasi melalui backend, misalnya `http://localhost:3001`.

---

## Troubleshooting

### 1. `npm run dev` gagal

- Pastikan `concurrently` terpasang di root.
- Jalankan ulang install di root:

```bash
npm install
```

- Jika masih gagal, jalankan layanan secara terpisah:

```bash
cd backend
npm run dev -- --host
```

```bash
cd frontend
npm run dev -- --host
```

### 2. `npm run build` frontend error

- Jalankan build langsung di folder frontend:

```bash
cd frontend
npm run build
```

- Perbaiki error dependensi atau konfigurasi Vite.

### 3. `npm start` tidak menampilkan frontend

- Pastikan `frontend/dist/index.html` ada.
- Pastikan backend hanya men-serve `frontend/dist`.
- Coba jalankan backend langsung:

```bash
cd backend
npm start
```

### 4. Error route SPA fallback

Jika backend crash dengan error parameter route di Express 5, pastikan `server.js` menggunakan middleware fallback dan bukan `app.get('*', ...)`.
Contoh:

```js
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/login') || req.path.startsWith('/aset') || req.path.startsWith('/me')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});
```

### 5. Error koneksi database

- Periksa `backend/.env`.
- Pastikan `DB_HOST`, `DB_USER`, `DB_PASSWORD`, dan `DB_NAME` benar.
- Jika perlu, jalankan query test dari MySQL client.

### 6. Error LDAP

- Periksa `LDAP_URL_1` di `backend/.env`.
- Pastikan server LDAP dapat diakses dari jaringan.

### 7. Error JWT / auth

- Pastikan `JWT_SECRET` di `.env` terisi.
- Token harus valid dan dikirim melalui header `Authorization: Bearer <token>`.

---

## Quick Checklist

- [ ] `npm run install:all`
- [ ] `npm run dev`
- [ ] `npm run build`
- [ ] `npm start`
- [ ] `backend/.env` terisi dengan benar
- [ ] `frontend/dist` ada setelah build
- [ ] `backend/server.js` sudah menyajikan file statis dari `frontend/dist`

---

## Catatan Tambahan

- Root `start` hanya menjalankan backend.
- Backend harus menemukan hasil build frontend di `frontend/dist`.
- Jika ingin deploy di server lain, pastikan port dan environment variables disesuaikan.
