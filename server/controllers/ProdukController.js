// produkController.js

import db from '../database/knex.cjs'; // Mengimpor koneksi database
import { validationResult } from 'express-validator';
import fs from 'fs'; // Untuk menghapus file
import path from 'path';

// Fungsi untuk menampilkan semua produk
export const index = async (req, res) => {
  try {
    const query = db('produk')
      .leftJoin('kategori', 'produk.kategori_id', 'kategori.id')
      .leftJoin('stoks', 'produk.id', 'stoks.produk_id')
      .select('produk.*', 'kategori.nama as kategori_nama', 'stoks.jumlah as stok_jumlah')
      .limit(10)
      .offset(req.query.page ? (req.query.page - 1) * 10 : 0); // Untuk paginasi

    if (req.query.search) {
      const searchTerm = req.query.search;
      query.where(function() {
        this.where('produk.nama', 'like', `%${searchTerm}%`)
          .orWhere('produk.deskripsi', 'like', `%${searchTerm}%`);
      });
    }

    if (req.query.kategori) {
      query.where('produk.kategori_id', req.query.kategori);
    }

    if (req.query.min_harga) {
      query.where('produk.harga', '>=', req.query.min_harga);
    }

    if (req.query.max_harga) {
      query.where('produk.harga', '<=', req.query.max_harga);
    }

    const produks = await query;
    const kategoris = await db('kategori').select(); // Ambil semua kategori

    res.json({ produks, kategoris });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat produk' });
  }
};

// Fungsi untuk menampilkan form pembuatan produk (dalam bentuk JSON)
export const create = async (req, res) => {
  try {
    const kategoris = await db('kategori').select();
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

    const [produkId] = await db('produk').insert(data).returning('id'); // Menyimpan data produk dan mengembalikan ID

    // Hanya membuat entri dasar di tabel stok
    await db('stok').insert({
      produk_id: produkId,
      jumlah: 0, // Jumlah awal 0
      lokasi_penyimpanan: 'Belum ditentukan',
      tanggal_kadaluarsa: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Tanggal default 1 tahun dari sekarang
      batch_number: `BATCH-${produkId}`, // Batch number awal
    });

    res.status(201).json({ message: 'Produk berhasil ditambahkan.', produkId });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan produk.' });
  }
};

// Fungsi untuk menampilkan detail produk
export const show = async (req, res) => {
  try {
    const produk = await db('produk')
      .leftJoin('stoks', 'produk.id', 'stoks.produk_id')
      .leftJoin('ulasans', 'produk.id', 'ulasans.produk_id')
      .select('produk.*', 'stoks.jumlah as stok_jumlah', 'ulasans.*')
      .where('produk.id', req.params.id)
      .first();

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
    const produk = await db('produk').where('id', req.params.id).first();
    const kategoris = await db('kategori').select();
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
    const produk = await db('produk').where('id', req.params.id).first();
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

    await db('produk').where('id', req.params.id).update(data);
    res.json({ message: 'Produk berhasil diperbarui.', produk });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui produk.' });
  }
};

// Fungsi untuk menghapus produk
export const destroy = async (req, res) => {
  try {
    const produk = await db('produk').where('id', req.params.id).first();
    if (!produk) {
      return res.status(404).json({ error: 'Produk tidak ditemukan' });
    }

    // Hapus ulasan terkait produk
    await db('ulasans').where('produk_id', produk.id).delete();

    // Hapus detail transaksi terkait produk
    const detailTransaksis = await db('detail_transaksi').where({ produk_id: produk.id });
    for (const detail of detailTransaksis) {
      await db('detail_transaksi').where('id', detail.id).delete();

      // Cek apakah transaksi masih memiliki detail lain
      const transaksi = await db('transaksi').where('id', detail.transaksi_id).first();
      const hasDetails = await db('detail_transaksi').where('transaksi_id', transaksi.id).count();
      if (hasDetails === 0) {
        await db('transaksi').where('id', transaksi.id).delete(); // Hapus transaksi jika tidak ada detail lain
      } else {
        // Jika masih ada detail lain, update total transaksi
        const total = await db('detail_transaksi').sum('harga * jumlah').where('transaksi_id', transaksi.id);
        await db('transaksi').where('id', transaksi.id).update({ total });
      }
    }

    // Hapus stok terkait produk
    await db('stoks').where('produk_id', produk.id).delete();

    // Hapus gambar produk jika ada
    if (produk.image) {
      fs.unlinkSync(path.join(__dirname, '../public', produk.image));
    }

    // Hapus produk
    await db('produk').where('id', req.params.id).delete();

    res.json({ message: 'Produk dan semua data terkait berhasil dihapus.' });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus produk.' });
  }
};

// Fungsi untuk memfilter produk berdasarkan kriteria
export const filter = async (req, res) => {
  try {
    const query = db('produk')
      .leftJoin('kategori', 'produk.kategori_id', 'kategori.id')
      .leftJoin('stoks', 'produk.id', 'stoks.produk_id')
      .select('produk.*', 'kategori.nama as kategori_nama', 'stoks.jumlah as stok_jumlah');

    if (req.query.search) {
      const searchTerm = req.query.search;
      query.where(function() {
        this.where('produk.nama', 'like', `%${searchTerm}%`)
          .orWhere('produk.deskripsi', 'like', `%${searchTerm}%`);
      });
    }

    if (req.query.kategori) {
      query.where('produk.kategori_id', req.query.kategori);
    }

    if (req.query.min_harga) {
      query.where('produk.harga', '>=', req.query.min_harga);
    }

    if (req.query.max_harga) {
      query.where('produk.harga', '<=', req.query.max_harga);
    }

    const produks = await query;
    const kategoris = await db('kategori').select(); // Ambil semua kategori

    res.json({ produks, kategoris });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat produk' });
  }
};
