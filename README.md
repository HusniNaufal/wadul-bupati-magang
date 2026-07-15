# Wadul Bupati — Portal Pengaduan Publik & Dashboard Admin Terintegrasi

Aplikasi full-stack berbasis **Next.js (App Router)** dan **MySQL/MariaDB** yang dirancang sebagai pusat pengaduan masyarakat terintegrasi (*E-Government Portal*) untuk **Diskominfo Kabupaten Kudus**. Sistem ini terhubung langsung dengan Bot WhatsApp sebagai backend penerima data, serta dilengkapi panel dashboard responsif khusus untuk masing-masing Dinas/Instansi terkait.

---

## 🌟 Fitur Utama

### 1. Portal Publik (`/`)
* **Pencarian Tiket Pengaduan**: Warga dapat memasukkan nomor tiket untuk melacak status aduan secara real-time.
* **Tampilan Detail Laporan Layar Penuh (Full Screen)**: Menyajikan data pelapor (Nama & No. HP disamarkan/ditampilkan sesuai wewenang), disposisi dinas, koordinat alamat lokasi, foto bukti lampiran, serta tanggapan resmi dari dinas terkait dalam format modern tanpa modal.
* **Umpan Aduan Terbaru**: Daftar 5 aduan masyarakat terverifikasi terbaru yang dikemas dalam bentuk kartu minimalis interaktif.

### 2. Portal Admin Dinas (`/login` & `/admin/dashboard`)
* **Autentikasi & Otorisasi Ketat**: Akses dashboard dibatasi berdasarkan instansi dinas masing-masing (contoh: *Dukcapil*, *Dinas PUPR*, dll.). Akun *Diskominfo* bertindak sebagai super-admin yang dapat memantau seluruh dinas.
* **Overview Statistik (KPI Cards)**: Ringkasan jumlah aduan bersatus *Total*, *Pending*, *Proses*, dan *Selesai* yang dikalkulasi dinamis sesuai wilayah kerja dinas terkait.
* **Tabel Manajemen Pengaduan**: Filter data berdasarkan status pengaduan dengan pembungkus tabel responsif yang mendukung geser horizontal pada perangkat mobile.
* **Tanggapan Resmi & Pembaruan Status**: Formulir detail pengaduan layar penuh yang memisahkan lampiran bukti (sisi kiri) dengan formulir respon resmi dinas (sisi kanan) untuk membalas aduan warga secara langsung ke database.

---

## 💻 Tech Stack

* **Core**: Next.js 15+ (App Router, React 19, TypeScript)
* **Styling**: Tailwind CSS v4 (Desain responsif, transisi halus, mobile-first)
* **Database**: MySQL / MariaDB (Koneksi pool cepat menggunakan `mysql2/promise`)
* **Deployment**: Node.js runtime environment

---

## 🗄️ Skema Basis Data

Sistem menggunakan database `db_wadul_bupati` dengan tabel utama `aduan` yang memuat struktur kolom berikut:

| Nama Kolom | Tipe Data | Deskripsi / Default |
| :--- | :--- | :--- |
| `id` | `INT` | Primary Key, Auto Increment |
| `no_tiket` | `VARCHAR(50)` | Kode unik tiket aduan (Unique, Not Null) |
| `waktu_masuk` | `VARCHAR(50)` | Tanggal & jam aduan masuk (Format WIB) |
| `dinas` | `VARCHAR(100)` | Dinas tujuan disposisi (Dukcapil, Dinas PUPR, dll.) |
| `kategori` | `VARCHAR(100)` | Kategori pengaduan masyarakat |
| `judul_aduan` | `VARCHAR(255)` | Judul singkat aduan dari WhatsApp Bot |
| `isi_aduan` | `TEXT` | Deskripsi lengkap keluhan warga |
| `foto_bukti` | `VARCHAR(255)` | Nama berkas foto bukti di folder `/uploads` |
| `status` | `VARCHAR(20)` | Status pengerjaan (`Pending`, `Proses`, `Selesai`) |
| `nama_pelapor` | `VARCHAR(100)` | Nama warga pengirim aduan |
| `no_hp` | `VARCHAR(20)` | Nomor kontak pengirim aduan |
| `alamat_pelapor`| `TEXT` | Lokasi alamat/koordinat pengirim aduan |
| `balasan_dinas` | `TEXT` | Tanggapan tertulis resmi dari petugas Dinas |
| `waktu_balasan` | `VARCHAR(50)` | Waktu pengiriman balasan resmi (Format WIB) |

*Sistem dilengkapi dengan fitur **Auto-Migration**; kolom baru dan tabel akan otomatis dibuat saat server Next.js dijalankan.*

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

### 1. Prasyarat
Pastikan Anda sudah menginstal:
* [Node.js](https://nodejs.org/) (Versi 18 atau terbaru)
* [MySQL / MariaDB Server](https://www.mysql.com/)

### 2. Konfigurasi Database
Buat file konfigurasi `.env` di direktori root proyek Anda dan sesuaikan dengan konfigurasi database lokal Anda:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password_db_anda
DB_NAME=db_wadul_bupati
```

### 3. Instal Dependensi & Jalankan
Jalankan perintah berikut di terminal:
```bash
# Menginstal modul node
npm install

# Menjalankan server development lokal
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

---

## 🔐 Akun Akses Default Admin (Seeded)

Sistem akan melakukan seeding otomatis ke tabel `users` saat dijalankan pertama kali. Berikut adalah kredensial admin default untuk pengujian:

| Username | Password | Otoritas Dinas |
| :--- | :--- | :--- |
| `diskominfo` | `admin123` | Diskominfo (Super-Admin / Lihat Semua) |
| `dukcapil` | `dukcapil123` | Dukcapil (Hanya melihat & merespon aduan Dukcapil) |
