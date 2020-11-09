import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

// import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
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
