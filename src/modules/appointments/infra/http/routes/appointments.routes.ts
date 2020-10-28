import { Router } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ensureAnthenticated from '@modules/users/infra/http/middlewares/ensureAnthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAnthenticated);

// appointmentsRouter.get('/', async (request, response) => {
//   const appointmentsList = await appointmentsRepository.find();
//   return response.json(appointmentsList);
// });

appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  const parsedDate = parseISO(date);

  const createAppointment = container.resolve(CreateAppointmentService);

  const appointment = await createAppointment.execute({
    provider_id,
    date: parsedDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
