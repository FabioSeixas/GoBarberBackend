import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update user email and name', async () => {
    const user = await fakeUsersRepository.create({
      name: 'fabio',
      email: 'emaildefault@gmail.com',
      password: 'fakepassword',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      email: 'NewEmail@gmail.com',
      name: 'rodrigo',
    });

    expect(updatedUser.email).toBe('NewEmail@gmail.com');
    expect(updatedUser.name).toBe('rodrigo');
  });

  it('should not be able to update email for an existing email', async () => {
    await fakeUsersRepository.create({
      name: 'João',
      email: 'emailJoao@gmail.com',
      password: 'fakepassword',
    });

    const user = await fakeUsersRepository.create({
      name: 'fabio',
      email: 'emailFabio@gmail.com',
      password: 'fakepassword',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'emailJoao@gmail.com',
        name: 'rodrigo',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update user password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'fabio',
      email: 'emaildefault@gmail.com',
      password: 'fakepassword',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      email: 'NewEmail@gmail.com',
      name: 'rodrigo',
      old_password: 'fakepassword',
      password: 'newPassword',
    });

    expect(updatedUser.password).toBe('newPassword');
  });

  it('should not be able to update password with a wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'fabio',
      email: 'emaildefault@gmail.com',
      password: 'fakepassword',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'NewEmail@gmail.com',
        name: 'rodrigo',
        old_password: 'WrongPassword',
        password: 'newPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'fabio',
      email: 'emaildefault@gmail.com',
      password: 'fakepassword',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'NewEmail@gmail.com',
        name: 'rodrigo',
        password: 'newPassword',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
