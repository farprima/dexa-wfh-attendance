# WFH Attendance

Jawaban Fullstack Developer Skill Test Dexa Group: aplikasi absensi WFH karyawan dan aplikasi
monitoring karyawan untuk HRD.

- **Karyawan** login, lalu absen dengan foto sebagai bukti bekerja di rumah. Tanggal dan waktu
  absen dicatat oleh server, satu kali per hari.
- **Admin HRD** menambah, mengubah, dan menghapus data karyawan, serta melihat (view only) absensi
  semua karyawan dengan filter tanggal dan karyawan.

## Teknologi

- **Backend**: NestJS, TypeScript, TypeORM, MySQL.
- **Frontend**: React, TypeScript, Vite.

## Arsitektur

```
React (Vite) ──HTTP──> API Gateway :3000 ──TCP──> Employee Service :4001 ──> MySQL dexa_employee
                       (JWT, upload foto)  └─TCP──> Attendance Service :4002 ──> MySQL dexa_attendance
```

- **API Gateway** satu-satunya pintu HTTP: validasi input, login JWT, cek role, dan menyimpan foto.
  Gateway meneruskan request ke service lewat NestJS microservices (transport TCP).
- **Employee Service** memiliki data karyawan dan password (bcrypt).
- **Attendance Service** memiliki data absensi.
- Setiap service punya database sendiri. Karena itu `attendances.employee_id` tidak memakai foreign
  key ke tabel karyawan; nama karyawan di laporan absensi digabungkan oleh gateway.

## Struktur

```
backend/src/
  shared/      config dan kontrak pesan antar service
  gateway/     HTTP API: controller, DTO, guard JWT dan role
  employee/    Employee Service: entity, service, message handler
  attendance/  Attendance Service: entity, service, message handler
frontend/src/
  pages/       Login, Check in, Employees, Attendance
  components/  komponen buatan sendiri: Table, Modal, PhotoInput, Photo, EmployeeForm, Layout
db/init.sql    membuat dua database
```

## Struktur database

`dexa_employee.employees`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| id | int, PK | auto increment |
| name | varchar(100) | |
| email | varchar(100) | unique, dipakai untuk login |
| position | varchar(100) | jabatan |
| role | enum(ADMIN, EMPLOYEE) | ADMIN = admin HRD |
| password_hash | varchar(255) | bcrypt |

`dexa_attendance.attendances`

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| id | int, PK | auto increment |
| employee_id | int | id karyawan dari Employee Service |
| work_date | date | hari kerja (WIB), index |
| checked_in_at | datetime | waktu absen dari server (UTC) |
| photo | varchar(255) | nama file foto bukti WFH |

Unique `(employee_id, work_date)` menjaga satu absen per karyawan per hari.

## Menjalankan

Prasyarat: Node.js 22.12+ dan MySQL 8. Jika ada Docker, MySQL cukup dijalankan dengan:

```sh
docker compose up -d
```

Jika memakai MySQL sendiri, jalankan `db/init.sql` lalu sesuaikan `DB_*` di `backend/.env`.

Backend (gateway dan kedua service berjalan sekaligus):

```sh
cd backend
cp .env.example .env
npm install
npm start
```

Frontend, di terminal kedua:

```sh
cd frontend
npm install
npm run dev
```

Buka http://localhost:5173. Saat pertama kali berjalan, tabel dibuat otomatis dan dua akun demo
ditambahkan:

| Email | Password | Role |
| --- | --- | --- |
| `admin@dexa.test` | `admin123` | Admin HRD |
| `budi@dexa.test` | `budi123` | Karyawan |

## API

Semua endpoint di bawah `/api`, dan selain login memerlukan header `Authorization: Bearer <token>`.

| Method | Path | Akses | Keterangan |
| --- | --- | --- | --- |
| POST | `/auth/login` | publik | `{ email, password }`, menghasilkan token JWT |
| POST | `/attendances` | karyawan | absen, `multipart/form-data` dengan field `photo` |
| GET | `/attendances/me` | karyawan | riwayat absen sendiri |
| GET | `/attendances?from=&to=&employeeId=` | admin | absensi semua karyawan |
| GET | `/employees` | admin | daftar karyawan |
| GET | `/employees/:id` | admin | detail karyawan |
| POST | `/employees` | admin | tambah karyawan |
| PATCH | `/employees/:id` | admin | ubah karyawan, password opsional |
| DELETE | `/employees/:id` | admin | hapus karyawan |

Foto disimpan di `backend/uploads` dan dapat dibuka di `/uploads/<nama file>`.
