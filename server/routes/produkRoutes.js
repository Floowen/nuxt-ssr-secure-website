// routes/produkRoutes.js

import { Router } from 'express';
import ProdukController from './controllers/produkController';
import checkRole from '../middlewares/checkRoleMiddleware';
import validationMiddleware from '../middlewares/validationMiddleware';

const produkRoutes = Router();

produkRoutes.get('/', ProdukController.index);
produkRoutes.post('/', checkRole('admin'), validationMiddleware.validateProduk, ProdukController.store);
produkRoutes.get('/:id', ProdukController.show);
produkRoutes.put('/:id', checkRole('admin'), validationMiddleware.validateProduk, ProdukController.update);
produkRoutes.delete('/:id', checkRole('admin'), ProdukController.destroy);

export { produkRoutes };
