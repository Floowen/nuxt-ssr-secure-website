// stokController.js

const { Stok, Produk } = require('../models'); // Pastikan ini mengarah ke model yang benar
const { validationResult } = require('express-validator');

// Fungsi untuk menampilkan semua stok
exports.index = async (req, res) => {
  try {
    const stoks = await Stok.findAll({
      include: ['produk'], // Pastikan relasi produk sudah diatur
      limit: 10,
      offset: req.query.page ? (req.query.page - 1) * 10 : 0, // Untuk paginasi
    });
    res.json(stoks);
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat data stok' });
  }
};

// Fungsi untuk menampilkan form pembuatan stok (dalam bentuk JSON)
exports.create = async (req, res) => {
  try {
    const produks = await Produk.findAll();
    res.json({ produks });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat data produk' });
  }
};

// Fungsi untuk menyimpan stok baru
exports.store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const validatedData = req.body; // Ambil data dari request

    // Buat stok baru di database
    const stok = await Stok.create(validatedData);

    res.status(201).json({ message: 'Stok berhasil ditambahkan', stok });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan stok' });
  }
};

// Fungsi untuk menampilkan form pengeditan stok
exports.edit = async (req, res) => {
  try {
    const stok = await Stok.findByPk(req.params.id);
    const produks = await Produk.findAll();
    if (!stok) {
      return res.status(404).json({ error: 'Stok tidak ditemukan' });
    }
    res.json({ stok, produks });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memuat data stok' });
  }
};

// Fungsi untuk memperbarui stok
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const stok = await Stok.findByPk(req.params.id);
    if (!stok) {
      return res.status(404).json({ error: 'Stok tidak ditemukan' });
    }

    const validatedData = req.body; // Ambil data dari request

    await stok.update(validatedData);

    res.json({ message: 'Stok berhasil diperbarui', stok });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui stok' });
  }
};

// Fungsi untuk menghapus stok
exports.destroy = async (req, res) => {
  try {
    const stok = await Stok.findByPk(req.params.id);
    if (!stok) {
      return res.status(404).json({ error: 'Stok tidak ditemukan' });
    }

    await stok.destroy(); // Hapus stok dari database

    res.json({ message: 'Stok berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus stok' });
  }
};
