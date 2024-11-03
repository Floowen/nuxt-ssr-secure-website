// keranjangController.js

import db from '../database/knex.cjs'; // Mengimpor koneksi database
import { validationResult } from 'express-validator';
import moment from 'moment'; // Library untuk manipulasi tanggal

// Fungsi untuk menampilkan semua produk di keranjang
export const index = async (req, res) => {
  try {
    const keranjang = await db('keranjang').where({ userId: req.session.user.id }).first();
    if (!keranjang) {
      return res.json({ keranjang: [] });
    }

    const detailKeranjang = await db('detail_keranjang')
      .where({ keranjangId: keranjang.id })
      .join('produk', 'detail_keranjang.produkId', '=', 'produk.id') // Pastikan relasi produk sudah diatur
      .select('detail_keranjang.*', 'produk.nama', 'produk.harga');

    res.json(detailKeranjang);
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat keranjang' });
  }
};

// Fungsi untuk menambah produk ke keranjang
export const tambahProduk = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { produk_id, jumlah } = req.body;

  try {
    let keranjang = await db('keranjang').where({ userId: req.session.user.id }).first();

    if (!keranjang) {
      keranjang = await db('keranjang').insert({ userId: req.session.user.id }).returning('*');
    }

    const detailKeranjang = await db('detail_keranjang').where({ keranjangId: keranjang.id, produkId: produk_id }).first();

    if (detailKeranjang) {
      await db('detail_keranjang').where({ id: detailKeranjang.id }).update({ jumlah: detailKeranjang.jumlah + jumlah }); // Tambah jumlah jika produk sudah ada
    } else {
      await db('detail_keranjang').insert({
        keranjangId: keranjang.id,
        produkId: produk_id,
        jumlah,
      });
    }

    res.json({ message: 'Produk berhasil ditambahkan ke keranjang.' });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal menambahkan produk ke keranjang' });
  }
};

// Fungsi untuk menghapus produk dari keranjang
export const hapusProduk = async (req, res) => {
  try {
    const { id } = req.params; // Mengambil id dari parameter
    const detailKeranjang = await db('detail_keranjang').where({ id }).first();

    if (!detailKeranjang) {
      return res.status(404).json({ error: 'Detail keranjang tidak ditemukan' });
    }

    await db('detail_keranjang').where({ id }).del();
    res.json({ message: 'Produk berhasil dihapus dari keranjang.' });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal menghapus produk dari keranjang' });
  }
};

// Fungsi untuk checkout
export const checkout = async (req, res) => {
  try {
    const keranjang = await db('keranjang').where({ userId: req.session.user.id }).first();

    if (!keranjang) {
      return res.status(400).json({ error: 'Keranjang belanja Anda kosong.' });
    }

    const detailKeranjangs = await db('detail_keranjang').where({ keranjangId: keranjang.id });
    if (detailKeranjangs.length === 0) {
      return res.status(400).json({ error: 'Keranjang belanja Anda kosong.' });
    }

    let total = 0;

    // Hitung total harga
    for (const item of detailKeranjangs) {
      const produk = await db('produk').where({ id: item.produkId }).first();
      total += produk.harga * item.jumlah;
    }

    const transaksi = await db('transaksi').insert({
      userId: req.session.user.id,
      total,
      status: 'selesai',
    }).returning('*');

    for (const item of detailKeranjangs) {
      await db('detail_transaksi').insert({
        transaksi_id: transaksi.id,
        produk_id: item.produkId,
        jumlah: item.jumlah,
        harga: item.harga, // Pastikan harga diambil dari relasi produk
      });

      // Kurangi stok produk
      await db('stok').where({ produkId: item.produkId }).decrement('jumlah', item.jumlah);
    }

    // Kosongkan keranjang
    await db('detail_keranjang').where({ keranjangId: keranjang.id }).del();

    res.json({ message: 'Checkout berhasil! Terima kasih atas pembelian Anda.' });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat checkout. Silakan coba lagi.' });
  }
};
