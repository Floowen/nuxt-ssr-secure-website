// transaksiController.js

import { Transaksi, Produk, Ulasan, DetailTransaksi } from '../models'; // Pastikan ini mengarah ke model yang benar
import { validationResult } from 'express-validator';
import { Op } from 'sequelize'; // Operator untuk pencarian
import { Transaction } from 'sequelize'; // Untuk transaksi database

// Fungsi untuk menampilkan semua transaksi
export const index = async (req, res) => {
  try {
    const query = {
      include: ['user'],
      where: {},
      order: [['createdAt', 'DESC']],
    };

    if (req.query.search) {
      const searchTerm = req.query.search;
      query.where[Op.or] = [
        { id: { [Op.like]: `%${searchTerm}%` } },
        { '$user.name$': { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    if (req.query.status) {
      query.where.status = req.query.status;
    }

    if (req.query.date_from) {
      query.where.createdAt = { [Op.gte]: req.query.date_from };
    }

    if (req.query.date_to) {
      query.where.createdAt = { [Op.lte]: req.query.date_to };
    }

    const transaksis = await Transaksi.findAll(query);
    res.json(transaksis);
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data transaksi' });
  }
};

// Fungsi untuk menampilkan detail transaksi
export const show = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.id, {
      include: ['detailTransaksis.produk', 'ulasan', 'user'],
    });
    if (!transaksi) {
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

  const t = await Transaction.start(); // Memulai transaksi

  try {
    const transaksi = await Transaksi.create({ user_id, status: 'pending', total: 0 }, { transaction: t });

    let total = 0;
    for (const produkData of produk) {
      const produkRecord = await Produk.findByPk(produkData.id);
      const subtotal = produkRecord.harga * produkData.jumlah;
      total += subtotal;

      await DetailTransaksi.create({
        transaksi_id: transaksi.id,
        produk_id: produkRecord.id,
        jumlah: produkData.jumlah,
        harga: produkRecord.harga,
      }, { transaction: t });
    }

    await transaksi.update({ total }, { transaction: t });

    await t.commit(); // Commit transaksi
    res.status(201).json({ message: 'Transaksi berhasil dibuat.', transaksi });
  } catch (error) {
    await t.rollback(); // Rollback jika terjadi kesalahan
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
    const transaksi = await Transaksi.findByPk(req.params.id);
    if (!transaksi) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }

    await transaksi.update({ status: req.body.status });
    res.json({ message: 'Status transaksi berhasil diperbarui.', transaksi });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui transaksi' });
  }
};

// Fungsi untuk menghapus transaksi
export const destroy = async (req, res) => {
  try {
    const transaksi = await Transaksi.findByPk(req.params.id);
    if (!transaksi) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }

    if (transaksi.status !== 'pending') {
      return res.status(400).json({ error: 'Hanya transaksi dengan status pending yang dapat dihapus.' });
    }

    await DetailTransaksi.destroy({ where: { transaksi_id: transaksi.id } });
    await transaksi.destroy();

    res.json({ message: 'Transaksi berhasil dihapus.' });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus transaksi.' });
  }
};

// Fungsi untuk memberikan ulasan pada transaksi
export const ulasan = async (req, res) => {
  const transaksi = await Transaksi.findByPk(req.params.id);
  if (!transaksi || transaksi.user_id !== req.user.id) {
    return res.status(403).json({ error: 'Anda tidak memiliki akses untuk memberikan ulasan pada transaksi ini.' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    for (const detail of transaksi.detailTransaksis) {
      await Ulasan.create({
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
    const query = {
      where: { user_id: req.user.id },
      include: ['user'],
      order: [['createdAt', 'DESC']],
    };

    if (req.query.search) {
      const searchTerm = req.query.search;
      query.where[Op.or] = [
        { id: { [Op.like]: `%${searchTerm}%` } },
        { '$user.name$': { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    if (req.query.status) {
      query.where.status = req.query.status;
    }

    if (req.query.date_from) {
      query.where.createdAt = { [Op.gte]: req.query.date_from };
    }

    if (req.query.date_to) {
      query.where.createdAt = { [Op.lte]: req.query.date_to };
    }

    const transaksis = await Transaksi.findAll(query);
    res.json(transaksis);
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data transaksi' });
  }
};
