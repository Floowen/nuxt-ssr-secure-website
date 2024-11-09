// stokController.js

import { Stok, Produk } from '../../models'; // Pastikan ini mengarah ke model yang benar
import { validationResult } from 'express-validator';

// Fungsi untuk menampilkan semua stok
export const index = async (req, res) => {
  try {
    const stoks = await Stok.findAll({
      include: ['produk'], // Pastikan relasi produk sudah diatur
      limit: 10,
      offset: req.query.page ? (req.query.page - 1) * 10 : 0, // Untuk paginasi
    });
    res.json(stoks);
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data stok' });
  }
};

// Fungsi untuk menampilkan form pembuatan stok (dalam bentuk JSON)
export const create = async (req, res) => {
  try {
    const produks = await Produk.findAll();
    res.json({ produks });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data produk' });
  }
};

// Fungsi untuk menyimpan stok baru
export const store = async (req, res) => {
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
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan stok' });
  }
};

// Fungsi untuk menampilkan form pengeditan stok
export const edit = async (req, res) => {
  try {
    const stok = await Stok.findByPk(req.params.id);
    const produks = await Produk.findAll();
    if (!stok) {
      return res.status(404).json({ error: 'Stok tidak ditemukan' });
    }
    res.json({ stok, produks });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data stok' });
  }
};

// Fungsi untuk memperbarui stok
export const update = async (req, res) => {
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
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui stok' });
  }
};

// Fungsi untuk menghapus stok
export const destroy = async (req, res) => {
  try {
    const stok = await Stok.findByPk(req.params.id);
    if (!stok) {
      return res.status(404).json({ error: 'Stok tidak ditemukan' });
    }

    await stok.destroy(); // Hapus stok dari database

    res.json({ message: 'Stok berhasil dihapus' });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus stok' });
  }
};

export const show = async (req, res) => {
  try {
    const { id } = req.params;
    const stok = await Stok.findByPk(id);

    if (!stok) {
      return res.status(404).json({ error: 'Stok tidak ditemukan' });
    }

    res.json(stok);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: 'Gagal memuat data stok' });
  }
};
