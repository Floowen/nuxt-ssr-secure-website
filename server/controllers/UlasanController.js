// ulasanController.js

import { Ulasan, Produk } from '../../models'; // Pastikan ini mengarah ke model yang benar
import { validationResult } from 'express-validator';

// Fungsi untuk menampilkan semua ulasan
export const index = async (req, res) => {
  try {
    const ulasans = await Ulasan.findAll({
      include: ['user', 'produk'], // Pastikan relasi sudah diatur
      limit: 10,
      offset: req.query.page ? (req.query.page - 1) * 10 : 0,
    });
    res.json(ulasans);
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data ulasan' });
  }
};

// Fungsi untuk menampilkan form pembuatan ulasan (dalam bentuk JSON)
export const create = async (req, res) => {
  try {
    const produks = await Produk.findAll();
    res.json({ produks });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data produk' });
  }
};

// Fungsi untuk menyimpan ulasan baru
export const store = async (req, res) => {
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
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan ulasan.' });
  }
};

// Fungsi untuk menampilkan detail ulasan
export const show = async (req, res) => {
  try {
    const ulasan = await Ulasan.findByPk(req.params.id, {
      include: ['user', 'produk'], // Pastikan relasi sudah diatur
    });
    if (!ulasan) {
      return res.status(404).json({ error: 'Ulasan tidak ditemukan' });
    }
    res.json(ulasan);
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data ulasan' });
  }
};

// Fungsi untuk menampilkan form pengeditan ulasan
export const edit = async (req, res) => {
  try {
    const ulasan = await Ulasan.findByPk(req.params.id);
    const produks = await Produk.findAll();
    if (!ulasan) {
      return res.status(404).json({ error: 'Ulasan tidak ditemukan' });
    }
    res.json({ ulasan, produks });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data ulasan' });
  }
};

// Fungsi untuk memperbarui ulasan
export const update = async (req, res) => {
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
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui ulasan' });
  }
};

// Fungsi untuk menghapus ulasan
export const destroy = async (req, res) => {
  try {
    const ulasan = await Ulasan.findByPk(req.params.id);
    if (!ulasan) {
      return res.status(404).json({ error: 'Ulasan tidak ditemukan' });
    }

    await ulasan.destroy(); // Hapus ulasan dari database

    res.json({ message: 'Ulasan berhasil dihapus' });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus ulasan.' });
  }
};
