// dashboardController.js

import db from '../database/knex.cjs'; // Mengimpor koneksi database
import moment from 'moment'; // Library untuk manipulasi tanggal
import Try from '../../helpers/tryCatch'; // Helper untuk penanganan error
import { Op } from 'sequelize'; // Jika menggunakan Sequelize untuk operasi database
// Jika Anda menggunakan model, impor model-model yang diperlukan:
import { Transaksi, Produk, User } from '../models'; // Pastikan ini sesuai dengan struktur model Anda

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
    const totalPenjualan = await db('transaksis').sum('total').where({ status: 'selesai' });
    const totalProduk = await db('produks').count();
    const totalPengguna = await db('users').count();
    const totalTransaksi = await db('transaksis').count();
    const transaksiTerbaru = await db('transaksis')
      .select('*')
      .join('users', 'transaksis.user_id', '=', 'users.id')
      .orderBy('transaksis.created_at', 'DESC')
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
    const totalPenjualanHariIni = await db('transaksis').sum('total').where({
      created_at: {
        [Op.gte]: moment().startOf('day').toDate(),
      },
      status: 'selesai',
    });
    const produkTerlaris = await db('produks')
      .select('produks.*')
      .join('detail_transaksis', 'produks.id', '=', 'detail_transaksis.produk_id')
      .groupBy('produks.id')
      .orderByRaw('COUNT(detail_transaksis.id) DESC')
      .limit(5);
    const stokMenipis = await db('produks').where('stok', '<=', 10);

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
    const transaksiTerbaru = await db('transaksis')
      .where({ user_id: req.user.id })
      .orderBy('created_at', 'DESC')
      .limit(5);
    const produkTerbaru = await db('produks').orderBy('created_at', 'DESC').limit(6);

    res.json({
      transaksiTerbaru,
      produkTerbaru,
    });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data pembeli dashboard' });
  }
};
