/**
 * Kalkulator Harga Produk - ZIPZAP CORP
 * Google Apps Script + HTML Service
 *
 * Alur: Input (Index.html) -> Proses (calculatePrice) -> Output (Index.html)
 */

// ===================== KONFIGURASI HARGA =====================
const CONFIG = {
  products: {
    kaos:   { label: 'Kaos',   price: 70000 },
    polo:   { label: 'Polo',   price: 110000 },
    kemeja: { label: 'Kemeja', price: 150000 }
  },
  sleeves: {
    pendek:  { label: 'Lengan Pendek',  extra: 0 },
    panjang: { label: 'Lengan Panjang', extra: 10000 }
  },
  colors: {
    putih: { label: 'Putih', extra: 0 },
    biru:  { label: 'Biru',  extra: 0 },
    merah: { label: 'Merah', extra: 0 },
    hitam: { label: 'Hitam', extra: 5000 },
    navy:  { label: 'Navy',  extra: 5000 }
  },
  // Urutan = urutan tampil
  sizes: [
    { code: 'S',   extra: 0 },
    { code: 'M',   extra: 0 },
    { code: 'L',   extra: 0 },
    { code: 'XL',  extra: 3000 },
    { code: '2XL', extra: 6000 },
    { code: '3XL', extra: 9000 },
    { code: '4XL', extra: 12000 },
    { code: '5XL', extra: 15000 }
  ],
  pocketExtra: 5000,
  // Diskon untuk seluruh transaksi jika total >= threshold
  discount: { threshold: 10000000, percent: 10 }
};

// ===================== WEB APP =====================
function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Kalkulator Harga Produk | ZIPZAP CORP')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getConfig() {
  return CONFIG;
}

// ===================== PROSES =====================
/**
 * @param {{product:string,color:string,sleeve:string,pocket:boolean,quantities:Object<string,number>}} input
 */
function calculatePrice(input) {
  if (!input) throw new Error('Input tidak valid.');

  const product = CONFIG.products[input.product];
  const color   = CONFIG.colors[input.color];
  const sleeve  = CONFIG.sleeves[input.sleeve];
  if (!product) throw new Error('Jenis produk tidak valid.');
  if (!color)   throw new Error('Warna tidak valid.');
  if (!sleeve)  throw new Error('Model lengan tidak valid.');

  const hasPocket = input.pocket === true || input.pocket === 'true';
  const pocketExtra = hasPocket ? CONFIG.pocketExtra : 0;
  const quantities = input.quantities || {};

  const rows = [];
  let totalQty = 0;
  let subtotalAll = 0;

  CONFIG.sizes.forEach(function (s) {
    const raw = quantities[s.code];
    const qty = raw === undefined || raw === null || raw === '' ? 0 : Number(raw);
    if (!Number.isInteger(qty) || qty < 0) {
      throw new Error('Jumlah ukuran ' + s.code + ' harus bilangan bulat >= 0.');
    }
    if (qty === 0) return;

    const components = [
      { label: 'Harga dasar ' + product.label, amount: product.price },
      { label: sleeve.label,                    amount: sleeve.extra },
      { label: 'Warna ' + color.label,          amount: color.extra },
      { label: 'Ukuran ' + s.code,              amount: s.extra },
      { label: hasPocket ? 'Ada saku' : 'Tanpa saku', amount: pocketExtra }
    ];
    const unitPrice = components.reduce(function (sum, c) { return sum + c.amount; }, 0);
    const subtotal = unitPrice * qty;

    rows.push({ size: s.code, qty: qty, components: components, unitPrice: unitPrice, subtotal: subtotal });
    totalQty += qty;
    subtotalAll += subtotal;
  });

  if (totalQty === 0) throw new Error('Isi jumlah minimal pada satu ukuran.');

  const d = CONFIG.discount;
  const discountApplied = subtotalAll >= d.threshold;
  const discountAmount = discountApplied ? Math.round(subtotalAll * d.percent / 100) : 0;

  return {
    summary: {
      product: product.label,
      color: color.label,
      sleeve: sleeve.label,
      pocket: hasPocket ? 'Ada' : 'Tidak'
    },
    rows: rows,
    totalQty: totalQty,
    subtotal: subtotalAll,
    discountApplied: discountApplied,
    discountPercent: d.percent,
    discountThreshold: d.threshold,
    discountAmount: discountAmount,
    grandTotal: subtotalAll - discountAmount
  };
}

// ===================== TEST (jalankan manual dari editor) =====================
function testCalculatePrice() {
  const r = calculatePrice({
    product: 'kemeja', color: 'navy', sleeve: 'panjang', pocket: true,
    quantities: { M: 50, L: 10, XL: 50 }
  });
  Logger.log(JSON.stringify(r, null, 2));
  if (r.subtotal !== 18850000 || r.discountAmount !== 1885000 || r.grandTotal !== 16965000) {
    throw new Error('Test gagal: ' + r.grandTotal);
  }
  Logger.log('OK: total = ' + r.grandTotal);
}
