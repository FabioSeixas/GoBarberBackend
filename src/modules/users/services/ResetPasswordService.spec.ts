import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'fabio',
      email: 'emaildefault@gmail.com',
      password: 'fakePassword',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassword.execute({
      password: 'newPassword',
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('newPassword');
    expect(updatedUser?.password).toBe('newPassword');
  });

  it('should not be able to reset password for a non-existing userToken', async () => {
    await expect(
      resetPassword.execute({
        password: 'newPassword',
        token: '1231235asdfs',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password for a non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate('123123');

    await expect(
      resetPassword.execute({
        password: 'newPassword',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password more than two hour later', async () => {
    const user = await fakeUsersRepository.create({
      name: 'fabio',
      email: 'emaildefault@gmail.com',
      password: 'fakePassword',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementation(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password: 'newPassword',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
