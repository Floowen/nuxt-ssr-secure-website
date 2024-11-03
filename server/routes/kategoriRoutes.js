// routes/kategoriRoutes.js

import { Router } from 'express';
import KategoriController from './controllers/kategoriController';
import checkRole from '../middlewares/checkRoleMiddleware';
import validationMiddleware from '../middlewares/validationMiddleware';

const kategoriRoutes = Router();

kategoriRoutes.get('/', KategoriController.index);
kategoriRoutes.post('/', checkRole('admin'), validationMiddleware.validateKategori, KategoriController.store);
kategoriRoutes.get('/:id', KategoriController.show);
kategoriRoutes.put('/:id', checkRole('admin'), validationMiddleware.validateKategori, KategoriController.update);
kategoriRoutes.delete('/:id', checkRole('admin'), KategoriController.destroy);

export { kategoriRoutes };
