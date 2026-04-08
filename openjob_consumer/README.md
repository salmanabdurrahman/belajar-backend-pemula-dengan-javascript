# OpenJob Consumer

Consumer service untuk memproses notifikasi aplikasi pekerjaan secara asynchronous menggunakan RabbitMQ.

## Deskripsi

Consumer ini bertugas untuk:
- Mengkonsumsi pesan dari RabbitMQ queue `application.notifications`
- Mengambil data detail aplikasi dari database
- Mengirim notifikasi email ke pemilik job ketika ada pelamar baru

## Prasyarat

- Node.js (v18 atau lebih tinggi)
- PostgreSQL database (menggunakan database yang sama dengan OpenJob API)
- RabbitMQ server
- SMTP server untuk mengirim email

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

3. Konfigurasi environment variables di file `.env`:
```env
# Database Configuration (gunakan credentials yang sama dengan API)
PGUSER=postgres
PGPASSWORD=your_password
PGDATABASE=openjob_db
PGHOST=localhost
PGPORT=5432

# RabbitMQ Configuration (gunakan instance yang sama dengan API)
RABBITMQ_HOST=localhost
RABBITMQ_PORT=5672
RABBITMQ_USER=guest
RABBITMQ_PASSWORD=guest

# Mail Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM_ADDRESS=noreply@openjob.com
MAIL_FROM_NAME=OpenJob

# Node Environment
NODE_ENV=development
```

## Menjalankan Consumer

### Development mode (dengan auto-reload):
```bash
npm run start:dev
```

### Production mode:
```bash
npm start
```

## Struktur Folder

```
openjob_consumer/
├── src/
│   ├── config/           # Konfigurasi aplikasi
│   │   ├── env.js        # Environment variables
│   │   ├── logger.js     # Winston logger
│   │   └── database.js   # Database pool
│   ├── consumers/        # Consumer logic
│   │   └── application-notification.consumer.js
│   ├── shared/
│   │   ├── libs/         # Shared libraries
│   │   │   ├── db.js           # Database export
│   │   │   └── rabbitmq.js     # RabbitMQ client
│   │   └── utils/        # Utilities
│   │       └── application.repository.js
│   └── consumer.js       # Main entry point
├── package.json
├── .env.example
└── README.md
```

## Flow Proses

1. **API mengirim pesan ke RabbitMQ** ketika ada aplikasi baru dibuat
2. **Consumer menerima pesan** dari queue `application.notifications`
3. **Consumer query database** untuk mendapatkan detail:
   - Nama dan email pelamar
   - Email pemilik job (job owner atau company owner)
   - Tanggal aplikasi dibuat
4. **Consumer mengirim email** ke pemilik job dengan informasi pelamar

## Format Pesan RabbitMQ

Consumer mengharapkan pesan dengan format JSON:
```json
{
  "application_id": "uuid-aplikasi"
}
```

## Troubleshooting

### Consumer tidak menerima pesan
- Pastikan RabbitMQ server berjalan
- Periksa credentials RabbitMQ di `.env`
- Pastikan queue `application.notifications` sudah dibuat
- Periksa log untuk error koneksi

### Email tidak terkirim
- Periksa konfigurasi SMTP di `.env`
- Pastikan `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASSWORD` sudah benar
- Untuk Gmail, gunakan App Password, bukan password akun biasa
- Periksa log untuk error pengiriman email

### Database connection error
- Pastikan PostgreSQL server berjalan
- Periksa credentials database di `.env`
- Pastikan database `openjob_db` sudah dibuat dan migration sudah dijalankan

### Consumer crash saat startup
- Periksa semua environment variables sudah diisi dengan benar
- Periksa log error untuk detail masalah
- Pastikan semua dependencies sudah terinstall (`npm install`)

## Logging

Consumer menggunakan Winston untuk logging dengan format JSON. Log akan menampilkan:
- Info: Consumer started, notification processed
- Warning: Invalid payload, missing data
- Error: Processing failures, connection errors

## Graceful Shutdown

Consumer mendukung graceful shutdown dengan signal:
- `SIGINT` (Ctrl+C)
- `SIGTERM`

Saat menerima signal, consumer akan:
1. Menutup koneksi RabbitMQ
2. Exit dengan code 0

## Catatan Penting

- Consumer ini **harus** berjalan bersamaan dengan OpenJob API untuk memproses notifikasi
- Database yang digunakan **harus sama** dengan API (read-only access)
- RabbitMQ instance **harus sama** dengan yang digunakan API
- Consumer tidak memiliki HTTP server, hanya message processor
- Pastikan SMTP credentials valid untuk mengirim email

## Dependencies

- `amqplib` - RabbitMQ client
- `nodemailer` - Email sending
- `pg` - PostgreSQL client
- `dotenv` - Environment variables
- `winston` - Logging

## Lisensi

ISC
