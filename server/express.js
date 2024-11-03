import express from 'express';
import cookieParser from 'cookie-parser';
import { authRoutes } from './routes/authRoutes';
import { captchaRoutes } from './routes/captchaRoutes';
import { loginRoutes } from './routes/loginRoutes';
import { mailRoutes } from './routes/mailRoutes';
import { userRoutes } from './routes/userRoutes';
import { kategoriRoutes } from './routes/kategoriRoutes'; // Pastikan untuk menambahkannya
import { keranjangRoutes } from './routes/keranjangRoutes'; // Pastikan untuk menambahkannya
import { stokRoutes } from './routes/stokRoutes'; // Pastikan untuk menambahkannya
import { produkRoutes } from './routes/produkRoutes'; // Pastikan untuk menambahkannya
import { transaksiRoutes } from './routes/transaksiRoutes'; // Pastikan untuk menambahkannya
import { ulasanRoutes } from './routes/ulasanRoutes'; // Pastikan untuk menambahkannya
import checkRole from './middleware/checkRoleMiddleware'; // Middleware untuk pemeriksaan peran

/** Create express instance */
const app = express();

/** Add Express options and plugins */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/** Do not show 'x-powered-by: Express' in page header */
app.disable('x-powered-by');

/** Add Express Routes */
// Middleware untuk semua rute yang memerlukan autentikasi
app.use('/server/*', (req, res, next) => {
  // Misalkan Anda memiliki autentikasi di sini
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// Tambahkan rute dengan awalan '/server' untuk menghindari konflik
app.use('/server/auth', authRoutes);
app.use('/server/captcha', captchaRoutes);
app.use('/server/mail', mailRoutes);
app.use('/server/login', loginRoutes);
app.use('/server/users', userRoutes);
app.use('/server/kategori', kategoriRoutes); // Rute kategori
app.use('/server/keranjang', keranjangRoutes); // Rute keranjang
app.use('/server/stok', stokRoutes); // Rute stok
app.use('/server/produk', produkRoutes); // Rute produk
app.use('/server/transaksi', transaksiRoutes); // Rute transaksi
app.use('/server/ulasan', ulasanRoutes); // Rute ulasan

/**
 * Middleware untuk memeriksa peran pengguna di rute tertentu
 * Misalnya, jika Anda ingin melindungi rute dengan pemeriksaan peran:
 */
app.use('/server/admin/*', checkRole('admin')); // Contoh memeriksa peran admin
app.use('/server/petugas/*', checkRole('petugas')); // Contoh memeriksa peran petugas

/**
 * Express has access to the root of the project.
 * ALL Express routes should start with '/server/...' to avoid collision with
 * client-side page paths.
 */
export default { path: '/', handler: app };
