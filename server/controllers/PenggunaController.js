// penggunaController.js

import { User } from '../models'; // Pastikan ini mengarah ke model User Anda
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { Role } from '../models/Role'; // Ganti dengan path ke model Role yang sesuai

// Fungsi untuk menampilkan semua pengguna
export const index = async (req, res) => {
  try {
    const users = await User.findAll({
      limit: 10,
      offset: req.query.page ? (req.query.page - 1) * 10 : 0, // Untuk paginasi
    });
    res.json(users);
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data pengguna' });
  }
};

// Fungsi untuk menampilkan form pembuatan pengguna (dalam bentuk JSON)
export const create = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles); // Mengembalikan data role
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data role' });
  }
};

// Fungsi untuk menyimpan pengguna baru
export const store = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Assign role (pastikan Anda memiliki relasi yang sesuai)
    await user.setRoles([role]); // Sesuaikan jika menggunakan metode yang berbeda untuk mengatur role

    res.status(201).json({ message: 'Pengguna berhasil ditambahkan!', user });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan pengguna' });
  }
};

// Fungsi untuk menampilkan form pengeditan pengguna
export const edit = async (req, res) => {
  try {
    const pengguna = await User.findByPk(req.params.id);
    const roles = await Role.findAll();
    if (!pengguna) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    }
    res.json({ pengguna, roles });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Gagal memuat data pengguna' });
  }
};

// Fungsi untuk memperbarui pengguna
export const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const pengguna = await User.findByPk(req.params.id);
    if (!pengguna) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    }

    const { name, email, password, role } = req.body;

    // Hanya memperbarui password jika disediakan
    const updatedData = {
      name,
      email,
    };

    if (password) {
      updatedData.password = bcrypt.hashSync(password, 10);
    }

    await pengguna.update(updatedData);

    // Update roles
    await pengguna.setRoles([role]); // Sesuaikan jika menggunakan metode yang berbeda

    res.json({ message: 'Pengguna berhasil diperbarui!', pengguna });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat memperbarui pengguna' });
  }
};

// Fungsi untuk menghapus pengguna
export const destroy = async (req, res) => {
  try {
    const pengguna = await User.findByPk(req.params.id);
    if (!pengguna) {
      return res.status(404).json({ error: 'Pengguna tidak ditemukan' });
    }

    await pengguna.destroy();
    res.json({ message: 'Pengguna berhasil dihapus!' });
  } catch (error) {
    console.error(error); // Log error untuk debugging
    res.status(500).json({ error: 'Terjadi kesalahan saat menghapus pengguna' });
  }
};
