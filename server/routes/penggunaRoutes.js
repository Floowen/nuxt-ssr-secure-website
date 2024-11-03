// routes/penggunaRoutes.js

import { Router } from 'express';
import PenggunaController from './controllers/penggunaController';
import checkRole from '../middlewares/checkRoleMiddleware';
import validationMiddleware from '../middlewares/validationMiddleware';

const penggunaRoutes = Router();

penggunaRoutes.get('/', PenggunaController.index);
penggunaRoutes.post('/', checkRole('admin'), validationMiddleware.validatePengguna, PenggunaController.store);
penggunaRoutes.get('/:id', PenggunaController.show);
penggunaRoutes.put('/:id', checkRole('admin'), validationMiddleware.validatePengguna, PenggunaController.update);
penggunaRoutes.delete('/:id', checkRole('admin'), PenggunaController.destroy);

export { penggunaRoutes };
