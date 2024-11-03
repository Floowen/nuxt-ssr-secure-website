// routes/keranjangRoutes.js

import { Router } from 'express';
import KeranjangController from './controllers/keranjangController';
import validationMiddleware from '../middlewares/validationMiddleware';

const keranjangRoutes = Router();

keranjangRoutes.get('/', KeranjangController.index);
keranjangRoutes.post('/tambah', KeranjangController.tambahProduk);
keranjangRoutes.delete('/hapus/:id', KeranjangController.hapusProduk);
keranjangRoutes.post('/checkout', KeranjangController.checkout);

export { keranjangRoutes };
