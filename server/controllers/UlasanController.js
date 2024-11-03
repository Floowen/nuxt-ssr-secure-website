// ulasanController.js

const { Ulasan, Produk } = require('../models'); // Pastikan ini mengarah ke model yang benar
const { validationResult } = require('express-validator');

// Fungsi untuk menampilkan semua ulasan
exports.index = async (req, res) => {
  try {
    const ulasans = await Ulasan.findAll({
      include: ['user', 'produk'], // Pastikan relasi sudah diatur
      limit: 10,
      offset: req.query.page ? (req.query.page - 1) * 10 : 0,
    });
    res.json(ulasans);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat data ulasan' });
  }
};

// Fungsi untuk menampilkan form pembuatan ulasan (dalam bentuk JSON)
exports.create = async (req, res) => {
  try {
    const produks = await Produk.findAll();
    res.json({ produks });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat data produk' });
  }
};

// Fungsi untuk menyimpan ulasan baru
exports.store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { produk_id, rating, komentar } = req.body;

  try {
    const ulasan = await Ulasan.create({
      produk_id,
      user_id: req.user.id, // Ambil ID pengguna dari sesi
      rating,
      komentar,
      tanggal_ulasan: new Date(),
    });

    res.status(201).json({ message: 'Ulasan berhasil ditambahkan', ulasan });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan ulasan.' });
  }
};

// Fungsi untuk menampilkan detail ulasan
exports.show = async (req, res) => {
  try {
    const ulasan = await Ulasan.findByPk(req.params.id, {
      include: ['user', 'produk'], // Pastikan relasi sudah diatur
    });
    if (!ulasan) {
      return res.status(404).json({ error: 'Ulasan tidak ditemukan' });
    }
    res.json(ulasan);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat data ulasan' });
  }
};

// Fungsi untuk menampilkan form pengeditan ulasan
exports.edit = async (req, res) => {
  try {
    const ulasan = await Ulasan.findByPk(req.params.id);
    const produks = await Produk.findAll();
    if (!ulasan) {
      return res.status(404).json({ error: 'Ulasan tidak ditemukan' });
    }
    res.json({ ulasan, produks });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat data ulasan' });
  }
};

// Fungsi untuk memperbarui ulasan
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const ulasan = await Ulasan.findByPk(req.params.id);
    if (!ulasan) {
      return res.status(404).json({ error: 'Ulasan tidak ditemukan' });
    }

    const { produk_id, rating, komentar } = req.body;
    await ulasan.update({ produk_id, rating, komentar });

    res.json({ message: 'Ulasan berhasil diperbarui', ulasan });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui ulasan' });
  }
};

// Fungsi untuk menghapus ulasan
exports.destroy = async (req, res) => {
  try {
    const ulasan = await Ulasan.findByPk(req.params.id);
    if (!ulasan) {
      return res.status(404).json({ error: 'Ulasan tidak ditemukan' });
    }

    await ulasan.destroy(); // Hapus ulasan dari database

    res.json({ message: 'Ulasan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus ulasan.' });
  }
};
