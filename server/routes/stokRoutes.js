// routes/stokRoutes.js

import { Router } from 'express';
import StokController from './controllers/stokController';
import checkRole from '../middlewares/checkRoleMiddleware';
import validationMiddleware from '../middlewares/validationMiddleware';

const stokRoutes = Router();

stokRoutes.get('/', StokController.index);
stokRoutes.post('/', checkRole('admin'), validationMiddleware.validateStok, StokController.store);
stokRoutes.get('/:id', StokController.show);
stokRoutes.put('/:id', checkRole('admin'), validationMiddleware.validateStok, StokController.update);
stokRoutes.delete('/:id', checkRole('admin'), StokController.destroy);

export { stokRoutes };
