# Kalkulator Harga Produk (Google Apps Script)

Tools kalkulator harga untuk pesanan kaos, polo, dan kemeja milik **ZIPZAP CORP**, dibuat dengan **Google Apps Script** dan **HTML Service**. Menghitung harga per pcs, subtotal per ukuran, diskon, dan total transaksi.

Dibuat sebagai bagian dari technical test IT Developer Recruitment.

> Versi Laravel: [kalkulator-harga-laravel](https://github.com/bayukresnaadjie/kalkulator-harga-laravel)

## Demo

Link web app: **(isi dengan URL web app setelah deploy)**

## Fitur

- Pilihan jenis produk: **Kaos**, **Polo**, **Kemeja**
- Pilihan warna (5 warna), model lengan (pendek/panjang), dan saku (ada/tidak)
- Input jumlah untuk tiap ukuran **S sampai 5XL**
- Rincian harga per pcs beserta komponen tambahannya
- Subtotal per ukuran dan total keseluruhan transaksi
- **Diskon 10%** untuk seluruh transaksi bernilai Rp 10.000.000 atau lebih
- Validasi input di sisi server (`Code.gs`)
- Tanpa Spreadsheet atau database, semua harga diatur di satu objek `CONFIG`

## Daftar Harga

**Harga dasar**

| Produk | Harga |
|---|---|
| Kaos | Rp 70.000 |
| Polo | Rp 110.000 |
| Kemeja | Rp 150.000 |

**Tambahan harga**

| Variasi | Tambahan |
|---|---|
| Lengan pendek | - |
| Lengan panjang | + Rp 10.000 |
| Warna Putih, Biru, Merah | - |
| Warna Hitam, Navy | + Rp 5.000 |
| Ukuran S, M, L | - |
| Ukuran XL | + Rp 3.000 |
| Ukuran 2XL | + Rp 6.000 |
| Ukuran 3XL | + Rp 9.000 |
| Ukuran 4XL | + Rp 12.000 |
| Ukuran 5XL | + Rp 15.000 |
| Saku | + Rp 5.000 |

## Rumus

```
harga per pcs = harga dasar + lengan + warna + ukuran + saku
subtotal      = jumlah x harga per pcs
total         = jumlah seluruh subtotal - diskon
diskon        = 10% dari total, jika total >= Rp 10.000.000
```

Contoh: Kemeja, Navy, Lengan Panjang, Ada saku, ukuran M = 150.000 + 10.000 + 5.000 + 0 + 5.000 = **Rp 170.000** per pcs.

## Struktur File

| File | Fungsi |
|---|---|
| `Code.gs` | `CONFIG` (harga dan diskon), `doGet()`, `calculatePrice()` untuk validasi dan perhitungan, `testCalculatePrice()` untuk uji manual |
| `Index.html` | Tampilan form dan hasil, memanggil server lewat `google.script.run` |

Alur: **Input** (`Index.html`) -> **Proses** (`calculatePrice` di `Code.gs`) -> **Output** (`Index.html`).

## Cara Pasang

1. Buka https://script.google.com lalu klik **New project**.
2. Ganti isi file `Code.gs` dengan isi `Code.gs` dari repo ini.
3. Klik **+** di samping "Files", pilih **HTML**, beri nama persis **`Index`** (tanpa `.html`), lalu tempel isi `Index.html` dari repo ini.
4. Klik **Deploy -> New deployment**, pilih jenis **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone** (atau sesuai kebutuhan)
5. Klik **Deploy**, izinkan akses jika diminta, lalu buka URL web app yang muncul.

Setelah mengubah kode, deploy ulang lewat **Deploy -> Manage deployments -> Edit -> Version: New version**. Kalau tidak, URL web app tetap menampilkan versi lama.

## Uji Manual

Di editor Apps Script, pilih fungsi `testCalculatePrice` lalu klik **Run**. Hasilnya muncul di **Execution log**.

Contoh uji: Kemeja, Navy, Lengan Panjang, Ada saku, M = 50, L = 10, XL = 50.

| | |
|---|---|
| Subtotal (110 pcs) | Rp 18.850.000 |
| Diskon 10% | - Rp 1.885.000 |
| **Total** | **Rp 16.965.000** |

## Mengubah Harga atau Diskon

Semua angka ada di objek `CONFIG` pada `Code.gs`. Contoh mengubah aturan diskon:

```js
discount: { threshold: 10000000, percent: 10 }
```

Pilihan dropdown di halaman dibuat otomatis dari `CONFIG`, jadi tidak ada yang perlu diubah di `Index.html`.

## Teknologi

- Google Apps Script
- HTML Service
- JavaScript, HTML, dan CSS
