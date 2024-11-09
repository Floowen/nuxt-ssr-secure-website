// kategoriController.js

import { Kategori } from '../../models'; // Pastikan ini mengarah ke model Kategori Anda
import { validationResult } from 'express-validator';

// Fungsi untuk menampilkan semua kategori
export const index = async (req, res) => {
  try {
    const limit = 10; // Jumlah kategori per halaman
    const page = req.query.page ? parseInt(req.query.page, 10) : 1; // Halaman saat ini
    const offset = (page - 1) * limit; // Offset untuk paginasi

    const kategoris = await Kategori.findAll({
      limit,
      offset,
    });

    res.json(kategoris);
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data kategori' });
  }
};

// Fungsi untuk menampilkan form pembuatan kategori (dalam bentuk JSON)
export const create = (req, res) => {
  res.json({ message: 'Tampilkan form pembuatan kategori' });
};

// Fungsi untuk menyimpan kategori baru
export const store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const kategori = await Kategori.create(req.body);
    res.status(201).json({ message: 'Kategori berhasil ditambahkan.', kategori });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal menambahkan kategori' });
  }
};

// Fungsi untuk menampilkan form pengeditan kategori
export const edit = async (req, res) => {
  try {
    const kategori = await Kategori.findByPk(req.params.id);
    if (!kategori) {
      return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    }
    res.json(kategori);
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data kategori' });
  }
};

// Fungsi untuk memperbarui kategori
export const update = async (req, res) => {
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
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memperbarui kategori' });
  }
};

// Fungsi untuk menghapus kategori
export const destroy = async (req, res) => {
  try {
    const kategori = await Kategori.findByPk(req.params.id);
    if (!kategori) {
      return res.status(404).json({ error: 'Kategori tidak ditemukan' });
    }

    await kategori.destroy();
    res.json({ message: 'Kategori berhasil dihapus.' });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal menghapus kategori' });
  }
};

export const show = async (req, res) => {
  try {
    const { id } = req.params;
    const kategori = await Kategori.findByPk(id);

    if (!kategori) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(kategori);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: 'Failed to load category' });
  }
};