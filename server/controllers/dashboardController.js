// dashboardController.js

const { Op } = require('sequelize'); // Operator untuk pencarian
const moment = require('moment'); // Library untuk manipulasi tanggal
const { Transaksi, Produk, User } = require('../models'); // Pastikan model sudah sesuai

// Fungsi utama untuk menentukan dashboard berdasarkan peran
exports.index = async (req, res) => {
  try {
    const user = req.session.user; // Mengambil data user dari sesi

    if (!user) {
      return res.status(401).json({ error: 'Pengguna belum login' });
    }

    if (user.role === 'admin') {
      return this.adminDashboard(req, res);
    } else if (user.role === 'petugas') {
      return this.petugasDashboard(req, res);
    } else {
      return this.pembeliDashboard(req, res);
    }
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

// Fungsi dashboard untuk admin
exports.adminDashboard = async (req, res) => {
  try {
    const totalPenjualan = await Transaksi.sum('total', { where: { status: 'selesai' } });
    const totalProduk = await Produk.count();
    const totalPengguna = await User.count();
    const totalTransaksi = await Transaksi.count();
    const transaksiTerbaru = await Transaksi.findAll({
      include: [{ model: User, attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    res.json({
      totalPenjualan,
      totalProduk,
      totalPengguna,
      totalTransaksi,
      transaksiTerbaru,
    });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat data admin dashboard' });
  }
};

// Fungsi dashboard untuk petugas
exports.petugasDashboard = async (req, res) => {
  try {
    const totalPenjualanHariIni = await Transaksi.sum('total', {
      where: {
        createdAt: {
          [Op.gte]: moment().startOf('day').toDate(),
        },
        status: 'selesai',
      },
    });
    const produkTerlaris = await Produk.findAll({
      include: [{ association: 'detailTransaksis' }],
      order: [[{ association: 'detailTransaksis' }, 'count', 'DESC']],
      limit: 5,
    });
    const stokMenipis = await Produk.findAll({ where: { stok: { [Op.lte]: 10 } } });

    res.json({
      totalPenjualanHariIni,
      produkTerlaris,
      stokMenipis,
    });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat data petugas dashboard' });
  }
};

// Fungsi dashboard untuk pembeli
exports.pembeliDashboard = async (req, res) => {
  try {
    const transaksiTerbaru = await Transaksi.findAll({
      where: { userId: req.session.user.id },
      order: [['createdAt', 'DESC']],
      limit: 5,
    });
    const produkTerbaru = await Produk.findAll({
      order: [['createdAt', 'DESC']],
      limit: 6,
    });

    res.json({
      transaksiTerbaru,
      produkTerbaru,
    });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat data pembeli dashboard' });
  }
};
