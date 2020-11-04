import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from '@modules/users/services/CreateUserService';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate an user', async () => {
    const user = await createUserService.execute({
      name: 'fabio',
      email: 'emaildefault@gmail.com',
      password: 'fakepassword',
    });

    const response = await authenticateUserService.execute({
      email: 'emaildefault@gmail.com',
      password: 'fakepassword',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to anthenticate with an wrong password', async () => {
    await createUserService.execute({
      name: 'fabio',
      email: 'emaildefault@gmail.com',
      password: 'fakepassword',
    });

    await expect(
      authenticateUserService.execute({
        email: 'emaildefault@gmail.com',
        password: 'wrongPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to anthenticate with an wrong email', async () => {
    await createUserService.execute({
      name: 'fabio',
      email: 'emaildefault@gmail.com',
      password: 'fakepassword',
    });

    await expect(
      authenticateUserService.execute({
        email: 'wrongEmail@gmail.com',
        password: 'fakepassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
