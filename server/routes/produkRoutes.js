// routes/produkRoutes.js

import { Router } from 'express';
import * as ProdukController from '../controllers/ProdukController';
import checkRole from '../../middleware/checkRoleMiddleware';
import * as validationMiddleware from '../../middleware/validationMiddleware';

const produkRoutes = Router();

produkRoutes.get('/', ProdukController.index);
produkRoutes.post('/', checkRole('admin'), validationMiddleware.validateProduk, ProdukController.store);
produkRoutes.get('/:id', ProdukController.show);
produkRoutes.put('/:id', checkRole('admin'), validationMiddleware.validateProduk, ProdukController.update);
produkRoutes.delete('/:id', checkRole('admin'), ProdukController.destroy);

export { produkRoutes };
