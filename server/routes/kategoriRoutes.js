// routes/kategoriRoutes.js

import { Router } from 'express';
import * as KategoriController from '../controllers/KategoriController';
import checkRole from '../../middleware/checkRoleMiddleware';
import * as validationMiddleware from '../../middleware/validationMiddleware';

const kategoriRoutes = Router();

kategoriRoutes.get('/', KategoriController.index);
kategoriRoutes.post('/', checkRole('admin'), validationMiddleware.validateKategori, KategoriController.store);
kategoriRoutes.get('/:id', KategoriController.show);
kategoriRoutes.put('/:id', checkRole('admin'), validationMiddleware.validateKategori, KategoriController.update);
kategoriRoutes.delete('/:id', checkRole('admin'), KategoriController.destroy);

export { kategoriRoutes };
