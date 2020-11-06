import { inject, injectable } from 'tsyringe';
import { isAfter, getHours } from 'date-fns';

// import User from '@modules/users/infra/typeorm/entities/User';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface RequestDTO {
  provider_id: string;
  month: number;
  year: number;
  day: number;
}

type ResponseDTO = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
    day,
  }: RequestDTO): Promise<ResponseDTO> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        month,
        year,
        day,
      },
    );

    const hoursArray = Array.from({ length: 10 }, (_, index) => index + 8);

    const currentDate = new Date(Date.now());

    const availability = hoursArray.map(hour => {
      const existingAppointment = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !existingAppointment && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
