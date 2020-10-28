import { Router } from 'express';

import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ensureAnthenticated from '@modules/users/infra/http/middlewares/ensureAnthenticated';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAnthenticated);

// appointmentsRouter.get('/', async (request, response) => {
//   const appointmentsList = await appointmentsRepository.find();
//   return response.json(appointmentsList);
// });

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
