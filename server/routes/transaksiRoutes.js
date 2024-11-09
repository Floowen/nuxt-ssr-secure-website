// routes/transaksiRoutes.js

import { Router } from 'express';
import * as TransaksiController from '../controllers/TransaksiController';
import validationMiddleware from '../../middleware/validationMiddleware';

const transaksiRoutes = Router();

transaksiRoutes.get('/', TransaksiController.index);
transaksiRoutes.post('/', validationMiddleware.validateTransaksi, TransaksiController.store);
transaksiRoutes.get('/:id', TransaksiController.show);
transaksiRoutes.put('/:id', validationMiddleware.validateTransaksi, TransaksiController.update);
transaksiRoutes.delete('/:id', TransaksiController.destroy);

export { transaksiRoutes };
