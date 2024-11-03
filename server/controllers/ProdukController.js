// produkController.js

import { Produk, Kategori, Stok, DetailTransaksi, Transaksi } from '../models'; // Pastikan ini mengarah ke model yang benar
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import fs from 'fs'; // Untuk menghapus file
import path from 'path';
import { Op } from 'sequelize'; // Pastikan Op diimpor untuk digunakan dalam query

// Fungsi untuk menampilkan semua produk
export const index = async (req, res) => {
  try {
    const query = {
      include: ['kategori', 'stoks'],
      limit: 10,
      offset: req.query.page ? (req.query.page - 1) * 10 : 0, // Untuk paginasi
    };

    if (req.query.search) {
      const searchTerm = req.query.search;
      query.where = {
        [Op.or]: [
          { nama: { [Op.like]: `%${searchTerm}%` } },
          { deskripsi: { [Op.like]: `%${searchTerm}%` } },
        ],
      };
    }

    if (req.query.kategori) {
      query.where = { ...query.where, kategoriId: req.query.kategori };
    }

    if (req.query.min_harga) {
      query.where = { ...query.where, harga: { [Op.gte]: req.query.min_harga } };
    }

    if (req.query.max_harga) {
      query.where = { ...query.where, harga: { [Op.lte]: req.query.max_harga } };
    }

    const produks = await Produk.findAll(query);
    const kategoris = await Kategori.findAll(); // Ambil semua kategori

    res.json({ produks, kategoris });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat produk' });
  }
};

// Fungsi untuk menampilkan form pembuatan produk (dalam bentuk JSON)
export const create = async (req, res) => {
  try {
    const kategoris = await Kategori.findAll();
    res.json({ kategoris });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data kategori' });
  }
};

// Fungsi untuk menyimpan produk baru
export const store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const data = req.body;

    if (req.file) {
      const imagePath = `produk_images/${req.file.filename}`; // Simpan path
      data.image = imagePath;
    }

    const produk = await Produk.create(data);

    // Hanya membuat entri dasar di tabel stok
    await Stok.create({
      produkId: produk.id,
      jumlah: 0, // Jumlah awal 0
      lokasi_penyimpanan: 'Belum ditentukan',
      tanggal_kadaluarsa: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Tanggal default 1 tahun dari sekarang
      batch_number: `BATCH-${produk.id}`, // Batch number awal
    });

    res.status(201).json({ message: 'Produk berhasil ditambahkan.', produk });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan produk.' });
  }
};

// Fungsi untuk menampilkan detail produk
export const show = async (req, res) => {
  try {
    const produk = await Produk.findByPk(req.params.id, {
      include: ['stoks', 'ulasans.user'], // Sesuaikan relasi sesuai dengan model Anda
    });
    if (!produk) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }
    res.json(produk);
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat produk' });
  }
};

// Fungsi untuk menampilkan form pengeditan produk
export const edit = async (req, res) => {
  try {
    const produk = await Produk.findByPk(req.params.id);
    const kategoris = await Kategori.findAll();
    if (!produk) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }
    res.json({ produk, kategoris });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data produk' });
  }
};

// Fungsi untuk memperbarui produk
export const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const produk = await Produk.findByPk(req.params.id);
    if (!produk) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    const data = req.body;

    if (req.file) {
      // Hapus gambar lama
      if (produk.image) {
        fs.unlinkSync(path.join(__dirname, '../public', produk.image));
      }
      const imagePath = `produk_images/${req.file.filename}`; // Simpan path baru
      data.image = imagePath;
    }

    await produk.update(data);
    res.json({ message: 'Produk berhasil diperbarui.', produk });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui produk.' });
  }
};

// Fungsi untuk menghapus produk
export const destroy = async (req, res) => {
  try {
    const produk = await Produk.findByPk(req.params.id);
    if (!produk) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    // Hapus ulasan terkait produk
    await produk.ulasans.destroy();

    // Hapus detail transaksi terkait produk
    const detailTransaksis = await DetailTransaksi.findAll({ where: { produkId: produk.id } });
    for (const detail of detailTransaksis) {
      await detail.destroy();

      // Cek apakah transaksi masih memiliki detail lain
      const transaksi = await Transaksi.findByPk(detail.transaksiId);
      const hasDetails = await DetailTransaksi.count({ where: { transaksiId: transaksi.id } });
      if (hasDetails === 0) {
        await transaksi.destroy(); // Hapus transaksi jika tidak ada detail lain
      } else {
        // Jika masih ada detail lain, update total transaksi
        transaksi.total = await DetailTransaksi.sum('harga * jumlah', { where: { transaksiId: transaksi.id } });
        await transaksi.save();
      }
    }

    // Hapus stok terkait produk
    await produk.stoks.destroy();

    // Hapus gambar produk jika ada
    if (produk.image) {
      fs.unlinkSync(path.join(__dirname, '../public', produk.image));
    }

    // Hapus produk
    await produk.destroy();

    res.json({ message: 'Produk dan semua data terkait berhasil dihapus.' });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus produk.' });
  }
};

// Fungsi untuk memfilter produk berdasarkan kriteria
export const filter = async (req, res) => {
  try {
    const query = {
      include: ['kategori', 'stoks'],
    };

    if (req.query.search) {
      const searchTerm = req.query.search;
      query.where = {
        [Op.or]: [
          { nama: { [Op.like]: `%${searchTerm}%` } },
          { deskripsi: { [Op.like]: `%${searchTerm}%` } },
        ],
      };
    }

    if (req.query.kategori) {
      query.where = { ...query.where, kategoriId: req.query.kategori };
    }

    if (req.query.min_harga) {
      query.where = { ...query.where, harga: { [Op.gte]: req.query.min_harga } };
    }

    if (req.query.max_harga) {
      query.where = { ...query.where, harga: { [Op.lte]: req.query.max_harga } };
    }

    const produks = await Produk.findAll(query);
    const kategoris = await Kategori.findAll(); // Ambil semua kategori

    res.json({ produks, kategoris });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat produk' });
  }
};
