const { body } = require('express-validator');

const isImage = (value, { req }) => {
  if (!req.file) {
    throw new Error('File is required');
  }

  const fileTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!fileTypes.includes(req.file.mimetype)) {
    throw new Error('File must be an image (jpeg, png, gif)');
  }

  return true;
};

exports.validateKategori = [
  body('name').notEmpty().withMessage('Category name is required'),
  // Add other validations as needed...
];

// Middleware untuk validasi input pada controller PenggunaController
exports.validatePengguna = [
  body('name').isString().isLength({ max: 255 }).notEmpty().withMessage('Nama pengguna diperlukan'),
  body('email').isEmail().withMessage('Email harus valid').custom(async (value) => {
    const existingUser = await User.findOne({ where: { email: value } });
    if (existingUser) {
      throw new Error('Email sudah digunakan');
    }
    return true;
  }),
  body('password').isLength({ min: 8 }).withMessage('Password minimal 8 karakter'),
  body('role').notEmpty().withMessage('Role diperlukan'),
];

// Middleware untuk validasi input pada controller ProdukController
exports.validateProduk = [
  body('nama').notEmpty().withMessage('Nama produk diperlukan'),
  body('deskripsi').optional().isString().withMessage('Deskripsi harus berupa string'),
  body('harga').isNumeric().withMessage('Harga harus berupa angka'),
  body('kategori_id').notEmpty().withMessage('ID kategori diperlukan'),
];

// Middleware untuk validasi input pada controller StokController
exports.validateStok = [
  body('produk_id').isInt().withMessage('ID produk diperlukan dan harus valid'),
  body('jumlah').isInt({ min: 0 }).withMessage('Jumlah harus berupa angka dan minimal 0'),
  body('lokasi_penyimpanan').notEmpty().withMessage('Lokasi penyimpanan diperlukan'),
  body('tanggal_kadaluarsa').isDate().withMessage('Tanggal kadaluarsa harus valid'),
  body('batch_number').notEmpty().withMessage('Batch number diperlukan'),
];

// Middleware untuk validasi input pada controller TransaksiController
exports.validateTransaksi = [
  body('user_id').notEmpty().withMessage('ID pengguna diperlukan'),
  body('produk').isArray().withMessage('Data produk harus berupa array'),
  body('produk.*.id').notEmpty().withMessage('ID produk diperlukan untuk setiap item'),
  body('produk.*.jumlah').isInt({ min: 1 }).withMessage('Jumlah produk harus minimal 1'),
];

// Middleware untuk validasi input pada controller UlasanController
exports.validateUlasan = [
  body('produk_id').isInt().withMessage('ID produk diperlukan dan harus valid'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating harus antara 1 dan 5'),
  body('komentar').isString().notEmpty().withMessage('Komentar diperlukan'),
];
