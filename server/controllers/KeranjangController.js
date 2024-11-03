// keranjangController.js

const { Keranjang, DetailKeranjang, Transaksi, DetailTransaksi, Stok } = require('../models'); // Pastikan model sudah sesuai
const { validationResult } = require('express-validator');
const { Op } = require('sequelize'); // Operator untuk pencarian
const moment = require('moment'); // Library untuk manipulasi tanggal

// Fungsi untuk menampilkan semua produk di keranjang
exports.index = async (req, res) => {
  try {
    const keranjang = await Keranjang.findOne({ where: { userId: req.session.user.id } });
    if (!keranjang) {
      return res.json({ keranjang: [] });
    }

    const detailKeranjang = await DetailKeranjang.findAll({
      where: { keranjangId: keranjang.id },
      include: [{ model: Produk }] // Pastikan relasi produk sudah diatur
    });

    res.json(detailKeranjang);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat keranjang' });
  }
};

// Fungsi untuk menambah produk ke keranjang
exports.tambahProduk = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { produk_id, jumlah } = req.body;

  try {
    let keranjang = await Keranjang.findOne({ where: { userId: req.session.user.id } });
    
    if (!keranjang) {
      keranjang = await Keranjang.create({ userId: req.session.user.id });
    }

    const detailKeranjang = await DetailKeranjang.findOne({
      where: { keranjangId: keranjang.id, produkId: produk_id }
    });

    if (detailKeranjang) {
      detailKeranjang.jumlah += jumlah; // Tambah jumlah jika produk sudah ada
      await detailKeranjang.save();
    } else {
      await DetailKeranjang.create({
        keranjangId: keranjang.id,
        produkId: produk_id,
        jumlah
      });
    }

    res.json({ message: 'Produk berhasil ditambahkan ke keranjang.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambahkan produk ke keranjang' });
  }
};

// Fungsi untuk menghapus produk dari keranjang
exports.hapusProduk = async (req, res) => {
  try {
    const { id } = req.params; // Mengambil id dari parameter
    const detailKeranjang = await DetailKeranjang.findByPk(id);
    
    if (!detailKeranjang) {
      return res.status(404).json({ error: 'Detail keranjang tidak ditemukan' });
    }

    await detailKeranjang.destroy();
    res.json({ message: 'Produk berhasil dihapus dari keranjang.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus produk dari keranjang' });
  }
};

// Fungsi untuk checkout
exports.checkout = async (req, res) => {
  try {
    const keranjang = await Keranjang.findOne({ where: { userId: req.session.user.id } });

    if (!keranjang || !keranjang.detailKeranjangs || keranjang.detailKeranjangs.length === 0) {
      return res.status(400).json({ error: 'Keranjang belanja Anda kosong.' });
    }

    const total = await DetailKeranjang.sum('jumlah * harga', {
      where: { keranjangId: keranjang.id },
      include: [{ model: Produk }]
    });

    const transaksi = await Transaksi.create({
      userId: req.session.user.id,
      total,
      status: 'selesai'
    });

    const detailKeranjangs = await DetailKeranjang.findAll({ where: { keranjangId: keranjang.id } });

    for (const item of detailKeranjangs) {
      await DetailTransaksi.create({
        transaksiId: transaksi.id,
        produkId: item.produkId,
        jumlah: item.jumlah,
        harga: item.harga // Pastikan harga diambil dari relasi produk
      });

      // Kurangi stok produk
      await Stok.decrement('jumlah', { where: { produkId: item.produkId }, by: item.jumlah });
    }

    // Kosongkan keranjang
    await DetailKeranjang.destroy({ where: { keranjangId: keranjang.id } });

    res.json({ message: 'Checkout berhasil! Terima kasih atas pembelian Anda.' });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan saat checkout. Silakan coba lagi.' });
  }
};
