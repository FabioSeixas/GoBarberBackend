import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from '@modules/users/services/CreateUserService';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      name: 'fabio',
      email: 'emaildefault@gmail.com',
      password: 'fakepassword',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('emaildefault@gmail.com');
  });

  it('should not be able to create two users with the same email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

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
