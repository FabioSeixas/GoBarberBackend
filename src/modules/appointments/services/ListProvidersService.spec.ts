import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

// import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to retrieve all providers', async () => {
    const user1 = await fakeUsersRepository.create({
      name: 'lucas',
      email: 'lucasEmail@gmail.com',
      password: 'fakepassword',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'rodrigo',
      email: 'rodrigoEmail@gmail.com',
      password: 'fakepassword',
    });

    const user = await fakeUsersRepository.create({
      name: 'fabio',
      email: 'fabioEmail@gmail.com',
      password: 'fakepassword',
    });

    const providersList = await listProviders.execute(user.id);

    expect(providersList).toEqual([user1, user2]);
  });
});
