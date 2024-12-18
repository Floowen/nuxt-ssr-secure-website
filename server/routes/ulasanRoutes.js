// routes/ulasanRoutes.js

import { Router } from 'express';
import * as UlasanController from '../controllers/ulasanController';
import * as validationMiddleware from '../../middleware/validationMiddleware';

const ulasanRoutes = Router();

ulasanRoutes.get('/', UlasanController.index);
ulasanRoutes.post('/', validationMiddleware.validateUlasan, UlasanController.store);
ulasanRoutes.get('/:id', UlasanController.show);
ulasanRoutes.put('/:id', validationMiddleware.validateUlasan, UlasanController.update);
ulasanRoutes.delete('/:id', UlasanController.destroy);

export { ulasanRoutes };
