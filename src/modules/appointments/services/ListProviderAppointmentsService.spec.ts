// import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to retrieve appointments from one provider', async () => {
    const app_1 = await fakeAppointmentsRepository.create({
      provider_id: 'user_id',
      user_id: '123123',
      date: new Date(2020, 4, 20, 8, 0, 0),
    });

    const app_2 = await fakeAppointmentsRepository.create({
      provider_id: 'user_id',
      user_id: '123123',
      date: new Date(2020, 4, 20, 9, 0, 0),
    });

    const appointment = await listProviderAppointmentsService.execute({
      provider_id: 'user_id',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(appointment).toEqual([app_1, app_2]);
  });
});
