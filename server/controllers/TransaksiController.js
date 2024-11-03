// transaksiController.js

import db from '../database/knex.cjs'; // Mengimpor koneksi database
import { validationResult } from 'express-validator';

// Fungsi untuk menampilkan semua transaksi
export const index = async (req, res) => {
  try {
    const query = db('transaksi')
      .leftJoin('users', 'transaksi.user_id', 'users.id')
      .select('transaksi.*', 'users.name as user_name')
      .orderBy('transaksi.created_at', 'DESC');

    if (req.query.search) {
      const searchTerm = req.query.search;
      query.where(function() {
        this.where('transaksi.id', 'like', `%${searchTerm}%`)
          .orWhere('users.name', 'like', `%${searchTerm}%`);
      });
    }

    if (req.query.status) {
      query.where('transaksi.status', req.query.status);
    }

    if (req.query.date_from) {
      query.where('transaksi.created_at', '>=', req.query.date_from);
    }

    if (req.query.date_to) {
      query.where('transaksi.created_at', '<=', req.query.date_to);
    }

    const transaksis = await query;
    res.json(transaksis);
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data transaksi' });
  }
};

// Fungsi untuk menampilkan detail transaksi
export const show = async (req, res) => {
  try {
    const transaksi = await db('transaksi')
      .leftJoin('detail_transaksi', 'transaksi.id', 'detail_transaksi.transaksi_id')
      .leftJoin('users', 'transaksi.user_id', 'users.id')
      .select('transaksi.*', 'users.name as user_name', 'detail_transaksi.*')
      .where('transaksi.id', req.params.id);

    if (!transaksi.length) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }
    res.json(transaksi);
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data transaksi' });
  }
};

// Fungsi untuk menyimpan transaksi baru
export const store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { user_id, produk } = req.body;

  const trx = await db.transaction(); // Memulai transaksi

  try {
    const [transaksiId] = await trx('transaksi').insert({ user_id, status: 'pending', total: 0 }).returning('id');

    let total = 0;
    for (const produkData of produk) {
      const produkRecord = await db('produk').where('id', produkData.id).first();
      const subtotal = produkRecord.harga * produkData.jumlah;
      total += subtotal;

      await trx('detail_transaksi').insert({
        transaksi_id: transaksiId,
        produk_id: produkRecord.id,
        jumlah: produkData.jumlah,
        harga: produkRecord.harga,
      });
    }

    await trx('transaksi').where('id', transaksiId).update({ total });

    await trx.commit(); // Commit transaksi
    res.status(201).json({ message: 'Transaksi berhasil dibuat.', transaksiId });
  } catch (error) {
    await trx.rollback(); // Rollback jika terjadi kesalahan
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat membuat transaksi. Silakan coba lagi.' });
  }
};

// Fungsi untuk memperbarui status transaksi
export const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const transaksi = await db('transaksi').where('id', req.params.id).first();
    if (!transaksi) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }

    await db('transaksi').where('id', req.params.id).update({ status: req.body.status });
    res.json({ message: 'Status transaksi berhasil diperbarui.', transaksi });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui transaksi' });
  }
};

// Fungsi untuk menghapus transaksi
export const destroy = async (req, res) => {
  try {
    const transaksi = await db('transaksi').where('id', req.params.id).first();
    if (!transaksi) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }

    if (transaksi.status !== 'pending') {
      return res.status(400).json({ error: 'Hanya transaksi dengan status pending yang dapat dihapus.' });
    }

    await db('detail_transaksi').where('transaksi_id', transaksi.id).delete();
    await db('transaksi').where('id', req.params.id).delete();

    res.json({ message: 'Transaksi berhasil dihapus.' });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus transaksi.' });
  }
};

// Fungsi untuk memberikan ulasan pada transaksi
export const ulasan = async (req, res) => {
  const transaksi = await db('transaksi').where('id', req.params.id).first();
  if (!transaksi || transaksi.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Anda tidak memiliki akses untuk memberikan ulasan pada transaksi ini.' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    for (const detail of transaksi.detailTransaksis) {
      await db('ulasans').insert({
        user_id: req.user.id,
        transaksi_id: transaksi.id,
        produk_id: detail.produk_id,
        rating: req.body.rating[detail.id],
        komentar: req.body.komentar[detail.id],
        tanggal_ulasan: new Date(),
      });
    }

    res.json({ message: 'Ulasan berhasil ditambahkan untuk semua produk.' });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal menambahkan ulasan' });
  }
};

// Fungsi untuk menampilkan daftar transaksi pembeli
export const list = async (req, res) => {
  try {
    const query = db('transaksi')
      .where({ user_id: req.user.id })
      .leftJoin('users', 'transaksi.user_id', 'users.id')
      .select('transaksi.*', 'users.name as user_name')
      .orderBy('transaksi.created_at', 'DESC');

    if (req.query.search) {
      const searchTerm = req.query.search;
      query.where(function() {
        this.where('transaksi.id', 'like', `%${searchTerm}%`)
          .orWhere('users.name', 'like', `%${searchTerm}%`);
      });
    }

    if (req.query.status) {
      query.where('transaksi.status', req.query.status);
    }

    if (req.query.date_from) {
      query.where('transaksi.created_at', '>=', req.query.date_from);
    }

    if (req.query.date_to) {
      query.where('transaksi.created_at', '<=', req.query.date_to);
    }

    const transaksis = await query;
    res.json(transaksis);
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data transaksi' });
  }
};
