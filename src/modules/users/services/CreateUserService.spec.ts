import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from '@modules/users/services/CreateUserService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'fabio',
      email: 'emaildefault@gmail.com',
      password: 'fakepassword',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('emaildefault@gmail.com');
  });

  it('should not be able to create two users with the same email', async () => {
    await createUserService.execute({
      name: 'fabio',
      email: 'emaildefault@gmail.com',
      password: 'fakepassword',
    });

    await expect(
      createUserService.execute({
        name: 'luis',
        email: 'emaildefault@gmail.com',
        password: 'fakepassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
