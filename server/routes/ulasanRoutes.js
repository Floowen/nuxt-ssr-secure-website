// routes/ulasanRoutes.js

import { Router } from 'express';
import UlasanController from './controllers/ulasanController';
import validationMiddleware from '../middlewares/validationMiddleware';

const ulasanRoutes = Router();

ulasanRoutes.get('/', UlasanController.index);
ulasanRoutes.post('/', validationMiddleware.validateUlasan, UlasanController.store);
ulasanRoutes.get('/:id', UlasanController.show);
ulasanRoutes.put('/:id', validationMiddleware.validateUlasan, UlasanController.update);
ulasanRoutes.delete('/:id', UlasanController.destroy);

export { ulasanRoutes };
