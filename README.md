# OpenJob RESTful API v1

OpenJob API adalah RESTful API untuk platform lowongan pekerjaan yang dibangun menggunakan Node.js dan Express.js. Proyek ini dibuat untuk kebutuhan submission backend fundamental dengan fitur lengkap manajemen lowongan kerja, perusahaan, aplikasi, dan autentikasi pengguna.

## Fitur

- **Autentikasi & Otorisasi**
  - Register dan login pengguna
  - JWT-based authentication
  - Refresh token mechanism
  - Role-based access control (User/Company)

- **Manajemen Pengguna**
  - Profile management
  - Upload foto profil
  - Update informasi pengguna

- **Manajemen Perusahaan**
  - CRUD perusahaan
  - Upload logo perusahaan
  - Informasi detail perusahaan

- **Manajemen Lowongan Kerja**
  - CRUD lowongan pekerjaan
  - Filter berdasarkan kategori, lokasi, tipe pekerjaan
  - Pencarian lowongan
  - Detail informasi gaji dan requirements

- **Aplikasi Lowongan**
  - Apply lowongan pekerjaan
  - Upload dokumen lamaran (CV, portfolio)
  - Tracking status aplikasi
  - History aplikasi

- **Bookmark**
  - Simpan lowongan favorit
  - Hapus bookmark

- **Kategori Pekerjaan**
  - Manajemen kategori lowongan

## Teknologi

- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** Bcrypt
- **File Upload:** Multer
- **Validation:** Joi
- **Migration:** node-pg-migrate
- **Code Quality:** ESLint, Prettier
- **Development:** Nodemon

## Struktur Folder

```bash
src/
├── config/              # Konfigurasi database dan environment
├── core/                # Core utilities dan helpers
├── modules/             # Feature modules (controller, service, repository, schema)
│   ├── applications/    # Modul aplikasi lowongan
│   ├── auth/            # Modul autentikasi
│   ├── bookmarks/       # Modul bookmark
│   ├── categories/      # Modul kategori
│   ├── companies/       # Modul perusahaan
│   ├── documents/       # Modul dokumen
│   ├── jobs/            # Modul lowongan kerja
│   ├── profile/         # Modul profil pengguna
│   └── users/           # Modul pengguna
├── routes/              # Pusat registrasi routing API
│   └── index.js         # Penggabungan route dari seluruh modul
├── shared/              # Shared utilities dan middleware
├── app.js               # Express app setup dan mounting routes
└── server.js            # Server entry point
migrations/              # Database migrations
uploads/                 # Upload files storage
```

## Instalasi

Pastikan Node.js dan PostgreSQL sudah terpasang di sistem Anda.

### 1. Clone Repository

```bash
git clone <repository-url>
cd belajar-fundamental-backend-dengan-javascript
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

Buat file `.env` di root project:

```env
# Server
PORT=5000
HOST=localhost

# Database
PGHOST=localhost
PGPORT=5432
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=openjob_db

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

### 4. Setup Database

Jalankan migrasi database:

```bash
npm run migrate:up
```

## Menjalankan Project

Mode produksi:

```bash
npm run start
```

Mode development (dengan auto-reload):

```bash
npm run start:dev
```

Server akan berjalan di:

```
http://localhost:5000
```

## Scripts

```bash
npm run start          # Menjalankan server produksi
npm run start:dev      # Menjalankan server development dengan nodemon
npm run lint           # Cek kualitas kode dengan ESLint
npm run lint:fix       # Perbaiki masalah ESLint otomatis
npm run format         # Format kode dan file yang didukung dengan Prettier
npm run format:check   # Cek konsistensi format tanpa mengubah file
npm run migrate:up     # Jalankan migrasi database
npm run migrate:down   # Rollback migrasi database
```

Untuk menjaga keterbacaan dan konsistensi, jalankan minimal `npm run lint` dan
`npm run format:check` sebelum merge. Gunakan `lint:fix` dan `format` bila perlu
perbaikan otomatis.

## Endpoints API

### Authentication

| Method | Endpoint         | Deskripsi         |
| ------ | ---------------- | ----------------- |
| POST   | `/auth/register` | Register pengguna |
| POST   | `/auth/login`    | Login pengguna    |
| POST   | `/auth/refresh`  | Refresh token     |
| DELETE | `/auth/logout`   | Logout pengguna   |

### Users

| Method | Endpoint     | Deskripsi           |
| ------ | ------------ | ------------------- |
| GET    | `/users`     | Get semua pengguna  |
| GET    | `/users/:id` | Get detail pengguna |
| PUT    | `/users/:id` | Update pengguna     |
| DELETE | `/users/:id` | Hapus pengguna      |

### Profile

| Method | Endpoint           | Deskripsi          |
| ------ | ------------------ | ------------------ |
| GET    | `/profile`         | Get profil sendiri |
| PUT    | `/profile`         | Update profil      |
| POST   | `/profile/picture` | Upload foto profil |

### Companies

| Method | Endpoint         | Deskripsi             |
| ------ | ---------------- | --------------------- |
| POST   | `/companies`     | Tambah perusahaan     |
| GET    | `/companies`     | Get semua perusahaan  |
| GET    | `/companies/:id` | Get detail perusahaan |
| PUT    | `/companies/:id` | Update perusahaan     |
| DELETE | `/companies/:id` | Hapus perusahaan      |

### Jobs

| Method | Endpoint    | Deskripsi           |
| ------ | ----------- | ------------------- |
| POST   | `/jobs`     | Tambah lowongan     |
| GET    | `/jobs`     | Get semua lowongan  |
| GET    | `/jobs/:id` | Get detail lowongan |
| PUT    | `/jobs/:id` | Update lowongan     |
| DELETE | `/jobs/:id` | Hapus lowongan      |

### Applications

| Method | Endpoint            | Deskripsi              |
| ------ | ------------------- | ---------------------- |
| POST   | `/applications`     | Apply lowongan         |
| GET    | `/applications`     | Get semua aplikasi     |
| GET    | `/applications/:id` | Get detail aplikasi    |
| PUT    | `/applications/:id` | Update status aplikasi |
| DELETE | `/applications/:id` | Hapus aplikasi         |

### Bookmarks

| Method | Endpoint         | Deskripsi          |
| ------ | ---------------- | ------------------ |
| POST   | `/bookmarks`     | Tambah bookmark    |
| GET    | `/bookmarks`     | Get semua bookmark |
| DELETE | `/bookmarks/:id` | Hapus bookmark     |

### Categories

| Method | Endpoint          | Deskripsi           |
| ------ | ----------------- | ------------------- |
| POST   | `/categories`     | Tambah kategori     |
| GET    | `/categories`     | Get semua kategori  |
| GET    | `/categories/:id` | Get detail kategori |
| PUT    | `/categories/:id` | Update kategori     |
| DELETE | `/categories/:id` | Hapus kategori      |

## Database Schema

Lihat file `erd.txt` atau `ERD-OpenJob-versi-1.png` untuk detail skema database lengkap.

Tabel utama:

- `users` - Data pengguna
- `companies` - Data perusahaan
- `categories` - Kategori pekerjaan
- `jobs` - Lowongan pekerjaan
- `applications` - Aplikasi lowongan
- `bookmarks` - Bookmark lowongan
- `documents` - Dokumen aplikasi
- `refresh_tokens` - Token refresh untuk autentikasi

## Validasi

- Semua input divalidasi menggunakan Joi
- Password di-hash menggunakan bcrypt
- JWT token untuk autentikasi
- File upload dibatasi ukuran dan tipe

## Catatan

- File upload disimpan di folder `uploads/`
- Database menggunakan PostgreSQL dengan migrasi otomatis
- Token refresh disimpan di database untuk keamanan
- Role-based access untuk membedakan User dan Company

## AI Attribution / Acknowledgements

Dalam proses pengembangan proyek ini, saya memanfaatkan **AI tools** sebagai alat bantu pendukung dalam beberapa aspek berikut:

- **Membuat dan menyusun file README**, agar dokumentasi proyek lebih terstruktur, jelas, dan mudah dipahami.
- **Brainstorming struktur folder dan organisasi proyek**, sehingga menghasilkan struktur yang lebih rapi dan scalable.
- **Code review dan suggestion** untuk meningkatkan kualitas kode dan best practices.
