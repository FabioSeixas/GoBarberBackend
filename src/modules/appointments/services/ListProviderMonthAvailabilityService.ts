import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

// import User from '@modules/users/infra/typeorm/entities/User';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface RequestDTO {
  provider_id: string;
  month: number;
  year: number;
}

type ResponseDTO = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: RequestDTO): Promise<ResponseDTO> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const currentDate = new Date(Date.now());

    const availability = eachDayArray.map(day => {
      const compareDate = new Date(year, month - 1, day, 17, 0, 0, 1);

      const appointmentsInDay = appointments.filter(
        appointment => getDate(appointment.date) === day,
      );

      return {
        day,
        available:
          isAfter(compareDate, currentDate) && appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
