// kategoriController.js

const { Kategori } = require('../models'); // Pastikan ini mengarah ke model Kategori Anda
const { validationResult } = require('express-validator');

// Fungsi untuk menampilkan semua kategori
exports.index = async (req, res) => {
  try {
    const kategoris = await Kategori.findAll({
      limit: 10,
      offset: req.query.page ? (req.query.page - 1) * 10 : 0, // Untuk paginasi
    });
    res.json(kategoris);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat data kategori' });
  }
};

// Fungsi untuk menampilkan form pembuatan kategori (dalam bentuk JSON)
exports.create = (req, res) => {
  res.json({ message: 'Tampilkan form pembuatan kategori' });
};

// Fungsi untuk menyimpan kategori baru
exports.store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const kategori = await Kategori.create(req.body);
    res.status(201).json({ message: 'Kategori berhasil ditambahkan.', kategori });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menambahkan kategori' });
  }
};

// Fungsi untuk menampilkan form pengeditan kategori
exports.edit = async (req, res) => {
  try {
    const kategori = await Kategori.findByPk(req.params.id);
    if (!kategori) {
      return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    }
    res.json(kategori);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat data kategori' });
  }
};

// Fungsi untuk memperbarui kategori
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const kategori = await Kategori.findByPk(req.params.id);
    if (!kategori) {
      return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    }

    await kategori.update(req.body);
    res.json({ message: 'Kategori berhasil diperbarui.', kategori });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memperbarui kategori' });
  }
};

// Fungsi untuk menghapus kategori
exports.destroy = async (req, res) => {
  try {
    const kategori = await Kategori.findByPk(req.params.id);
    if (!kategori) {
      return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    }

    await kategori.destroy();
    res.json({ message: 'Kategori berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menghapus kategori' });
  }
};
