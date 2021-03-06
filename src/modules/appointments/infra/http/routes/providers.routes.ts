import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';

import ProviderDailyAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderDailyAvailabilityController';
import ProviderMonthAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController';

import ensureAnthenticated from '@modules/users/infra/http/middlewares/ensureAnthenticated';

const providerRoutes = Router();

const providersController = new ProvidersController();
const providerDailyAvailabilityController = new ProviderDailyAvailabilityController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();

providerRoutes.use(ensureAnthenticated);

providerRoutes.get('/', providersController.index);

providerRoutes.get(
  '/:provider_id/day-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerDailyAvailabilityController.index,
);
providerRoutes.get(
  '/:provider_id/month-availability',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
  }),
  providerMonthAvailabilityController.index,
);

export default providerRoutes;
