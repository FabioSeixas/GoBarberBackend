import { Router } from 'express';

import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ensureAnthenticated from '@modules/users/infra/http/middlewares/ensureAnthenticated';

const providerRoutes = Router();
const providersController = new ProvidersController();

providerRoutes.use(ensureAnthenticated);

providerRoutes.get('/', providersController.index);

export default providerRoutes;
