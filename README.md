# OpenJob RESTful API v2

OpenJob API adalah RESTful API untuk platform lowongan pekerjaan yang dibangun menggunakan Node.js dan Express.js. Versi 2 menambahkan fitur upload CV PDF yang aman, caching Redis, serta proses notifikasi asynchronous menggunakan RabbitMQ dan Nodemailer.

## Struktur Project

Project ini terdiri dari dua komponen terpisah:

1. **OpenJob API** - RESTful API utama (folder root)
2. **OpenJob Consumer** - Worker untuk memproses notifikasi email (folder `openjob_consumer/`)

Kedua project berkomunikasi melalui RabbitMQ untuk fitur notifikasi asynchronous.

## Fitur

- **Autentikasi & Otorisasi**
  - Register dan login pengguna
  - JWT-based authentication
  - Refresh token mechanism
  - Role-based access control (User/Company)

- **Manajemen Pengguna**
  - Profile management
  - Upload foto profil
  - Update informasi pengguna (dengan cache invalidation)

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
  - Tracking status aplikasi
  - History aplikasi

- **Dokumen Pelamar (V2)**
  - Upload CV/Resume khusus format PDF
  - Validasi ukuran maksimal 5 MB
  - Validasi MIME type PDF menggunakan Multer
  - Download dokumen melalui endpoint `/documents/:id`

- **Caching Redis (V2)**
  - Caching endpoint detail/list terpilih dengan TTL 1 jam
  - Header `X-Data-Source` (`database`/`cache`) pada endpoint yang di-cache
  - Invalidation cache saat data berubah (company, user, application, bookmark)

- **Message Broker & Email Notifikasi (V2)**
  - Publisher RabbitMQ saat aplikasi lowongan dibuat
  - Consumer sebagai **project terpisah** (`openjob_consumer/`) untuk proses asynchronous
  - Pengiriman email notifikasi ke pemilik lowongan menggunakan Nodemailer
  - Sender email dapat dikustomisasi melalui `MAIL_FROM_ADDRESS` dan `MAIL_FROM_NAME`
  - Consumer dan API berkomunikasi melalui RabbitMQ

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
- **Caching:** Redis
- **Message Broker:** RabbitMQ (amqplib)
- **Email:** Nodemailer
- **Validation:** Joi
- **Migration:** node-pg-migrate
- **Code Quality:** ESLint, Prettier
- **Development:** Nodemon

## Struktur Folder

### OpenJob API (Root Project)

```bash
src/
├── config/              # Konfigurasi database dan environment
├── core/                # Core utilities dan helpers
├── modules/             # Feature modules (controller, service, repository, schema)
│   ├── applications/    # Modul aplikasi lowongan (dengan RabbitMQ publisher)
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
├── shared/              # Shared utilities, middleware, dan integration libs
├── app.js               # Express app setup dan mounting routes
└── server.js            # Server entry point
migrations/              # Database migrations
uploads/                 # Upload files storage
```

### OpenJob Consumer (Separate Project)

```bash
openjob_consumer/
├── src/
│   ├── config/          # Konfigurasi consumer (env, logger, database)
│   ├── consumers/       # Consumer logic
│   │   └── application-notification.consumer.js
│   ├── shared/
│   │   ├── libs/        # Database & RabbitMQ clients
│   │   └── utils/       # Repository untuk query notification
│   └── consumer.js      # Consumer entry point
├── package.json         # Dependencies terpisah
├── .env.example         # Template environment variables
└── README.md            # Dokumentasi consumer
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
ACCESS_TOKEN_KEY=your_access_token_secret_key
REFRESH_TOKEN_KEY=your_refresh_token_secret_key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# RabbitMQ
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# Mail (Nodemailer)
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=your_mail_user
MAIL_PASSWORD=your_mail_password
MAIL_FROM_ADDRESS=your_mail_sender_address
MAIL_FROM_NAME=OpenJob
```

### 4. Setup Database

Jalankan migrasi database:

```bash
npm run migrate:up
```

## Menjalankan Project

### 1. Menjalankan API Server

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

### 2. Menjalankan Consumer (Project Terpisah)

Consumer harus dijalankan secara terpisah untuk memproses notifikasi email.

```bash
cd openjob_consumer
npm install
cp .env.example .env
# Edit .env dengan konfigurasi yang sesuai
npm start
```

Untuk development mode:

```bash
npm run start:dev
```

**Catatan:** Consumer menggunakan database, RabbitMQ, dan SMTP yang sama dengan API. Pastikan konfigurasi di `.env` consumer sesuai dengan API.

## Scripts

### API Project (Root)

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

### Consumer Project (`openjob_consumer/`)

```bash
npm start          # Menjalankan consumer produksi
npm run start:dev  # Menjalankan consumer development dengan nodemon
```

Untuk menjaga keterbacaan dan konsistensi, jalankan minimal `npm run lint` dan
`npm run format:check` sebelum merge. Gunakan `lint:fix` dan `format` bila perlu
perbaikan otomatis.

## Endpoints API

### Authentication

| Method | Endpoint           | Deskripsi       |
| ------ | ------------------ | --------------- |
| POST   | `/authentications` | Login pengguna  |
| PUT    | `/authentications` | Refresh token   |
| DELETE | `/authentications` | Logout pengguna |

### Users

| Method | Endpoint     | Deskripsi           |
| ------ | ------------ | ------------------- |
| POST   | `/users`     | Register pengguna   |
| GET    | `/users/:id` | Get detail pengguna |
| PATCH  | `/users/:id` | Update pengguna     |

### Profile

| Method | Endpoint                | Deskripsi                      |
| ------ | ----------------------- | ------------------------------ |
| GET    | `/profile`              | Get profil user login          |
| GET    | `/profile/applications` | Get aplikasi user login        |
| GET    | `/profile/bookmarks`    | Get daftar bookmark user login |

### Companies

| Method | Endpoint         | Deskripsi             |
| ------ | ---------------- | --------------------- |
| POST   | `/companies`     | Tambah perusahaan     |
| GET    | `/companies`     | Get semua perusahaan  |
| GET    | `/companies/:id` | Get detail perusahaan |
| PUT    | `/companies/:id` | Update perusahaan     |
| DELETE | `/companies/:id` | Hapus perusahaan      |

### Jobs

| Method | Endpoint                     | Deskripsi                |
| ------ | ---------------------------- | ------------------------ |
| POST   | `/jobs`                      | Tambah lowongan          |
| GET    | `/jobs`                      | Get semua lowongan       |
| GET    | `/jobs/company/:companyId`   | Get lowongan by company  |
| GET    | `/jobs/category/:categoryId` | Get lowongan by category |
| GET    | `/jobs/:id`                  | Get detail lowongan      |
| PUT    | `/jobs/:id`                  | Update lowongan          |
| DELETE | `/jobs/:id`                  | Hapus lowongan           |

### Applications

| Method | Endpoint                     | Deskripsi              |
| ------ | ---------------------------- | ---------------------- |
| POST   | `/applications`              | Apply lowongan         |
| GET    | `/applications`              | Get semua aplikasi     |
| GET    | `/applications/:id`          | Get detail aplikasi    |
| GET    | `/applications/user/:userId` | Get aplikasi by user   |
| GET    | `/applications/job/:jobId`   | Get aplikasi by job    |
| PUT    | `/applications/:id`          | Update status aplikasi |
| DELETE | `/applications/:id`          | Hapus aplikasi         |

### Documents

| Method | Endpoint         | Deskripsi                           |
| ------ | ---------------- | ----------------------------------- |
| GET    | `/documents`     | Get daftar dokumen                  |
| POST   | `/documents`     | Upload dokumen PDF (auth, max 5 MB) |
| GET    | `/documents/:id` | Download/view dokumen PDF           |
| DELETE | `/documents/:id` | Hapus dokumen (auth)                |

### Bookmarks

| Method | Endpoint                    | Deskripsi                     |
| ------ | --------------------------- | ----------------------------- |
| POST   | `/jobs/:jobId/bookmark`     | Tambah bookmark by job        |
| GET    | `/jobs/:jobId/bookmark/:id` | Get detail bookmark by job    |
| DELETE | `/jobs/:jobId/bookmark`     | Hapus bookmark by job         |
| GET    | `/bookmarks`                | Get semua bookmark user login |

### Categories

| Method | Endpoint          | Deskripsi           |
| ------ | ----------------- | ------------------- |
| POST   | `/categories`     | Tambah kategori     |
| GET    | `/categories`     | Get semua kategori  |
| GET    | `/categories/:id` | Get detail kategori |
| PUT    | `/categories/:id` | Update kategori     |
| DELETE | `/categories/:id` | Hapus kategori      |

## Cache Behavior (V2)

Endpoint berikut menggunakan cache Redis dengan TTL 1 jam:

- `GET /companies/:id`
- `GET /users/:id`
- `GET /applications/:id`
- `GET /applications/user/:userId`
- `GET /applications/job/:jobId`
- `GET /bookmarks`

Setiap respons endpoint di atas menyertakan header:

- `X-Data-Source: database` (cache miss)
- `X-Data-Source: cache` (cache hit)

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

Tambahan skema V2:

- `companies.owner_user_id` - relasi pemilik perusahaan
- `jobs.owner_user_id` - relasi pemilik lowongan

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
- **Consumer harus dijalankan sebagai project terpisah** (`openjob_consumer/`)
- Consumer dan API menggunakan database dan RabbitMQ yang sama
- Jika `MAIL_FROM_ADDRESS` tidak diisi, sender email akan fallback ke `MAIL_USER`
- Lihat `openjob_consumer/README.md` untuk detail setup dan troubleshooting consumer
