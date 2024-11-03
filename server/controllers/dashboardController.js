// dashboardController.js

import db from '../database/knex.cjs'; // Mengimpor koneksi database
import moment from 'moment'; // Library untuk manipulasi tanggal
import Try from '../../helpers/tryCatch'; // Helper untuk penanganan error

// Fungsi utama untuk menentukan dashboard berdasarkan peran
export const index = async (req, res) => {
  try {
    const user = req.user; // Mengambil data user dari sesi

    if (!user) {
      return res.status(401).json({ error: 'Pengguna belum login' });
    }

    if (user.role === 'admin') {
      return await adminDashboard(req, res);
    } else if (user.role === 'petugas') {
      return await petugasDashboard(req, res);
    } else {
      return await pembeliDashboard(req, res);
    }
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

// Fungsi dashboard untuk admin
const adminDashboard = async (req, res) => {
  try {
    const totalPenjualan = await db('transaksi').sum('total').where({ status: 'selesai' });
    const totalProduk = await db('produk').count();
    const totalPengguna = await db('users').count();
    const totalTransaksi = await db('transaksi').count();
    const transaksiTerbaru = await db('transaksi')
      .select('transaksi.*', 'users.name', 'users.email')
      .join('users', 'transaksi.user_id', '=', 'users.id')
      .orderBy('transaksi.created_at', 'DESC')
      .limit(5);

    res.json({
      totalPenjualan: totalPenjualan[0]['sum'] || 0,
      totalProduk: totalProduk[0]['count'] || 0,
      totalPengguna: totalPengguna[0]['count'] || 0,
      totalTransaksi: totalTransaksi[0]['count'] || 0,
      transaksiTerbaru,
    });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data admin dashboard' });
  }
};

// Fungsi dashboard untuk petugas
const petugasDashboard = async (req, res) => {
  try {
    const totalPenjualanHariIni = await db('transaksi').sum('total').where('created_at', '>=', moment().startOf('day').toDate()).andWhere('status', 'selesai');
    const produkTerlaris = await db('produk')
      .select('produk.*')
      .join('detail_transaksi', 'produk.id', '=', 'detail_transaksi.produk_id')
      .groupBy('produk.id')
      .orderByRaw('COUNT(detail_transaksi.id) DESC')
      .limit(5);
    const stokMenipis = await db('produk').where('stok', '<=', 10);

    res.json({
      totalPenjualanHariIni: totalPenjualanHariIni[0]['sum'] || 0,
      produkTerlaris,
      stokMenipis,
    });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data petugas dashboard' });
  }
};

// Fungsi dashboard untuk pembeli
const pembeliDashboard = async (req, res) => {
  try {
    const transaksiTerbaru = await db('transaksi')
      .where({ user_id: req.user.id })
      .orderBy('created_at', 'DESC')
      .limit(5);
    const produkTerbaru = await db('produk').orderBy('created_at', 'DESC').limit(6);

    res.json({
      transaksiTerbaru,
      produkTerbaru,
    });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data pembeli dashboard' });
  }
};
