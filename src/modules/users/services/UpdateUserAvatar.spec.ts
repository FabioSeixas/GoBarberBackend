import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import UpdateAvatarService from '@modules/users/services/UpdateUserAvatarService';

describe('UpdateAvatar', () => {
  it('should be able to upload an avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();

    const fakeStorageProvider = new FakeStorageProvider();
    const updateAvatarService = new UpdateAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'fabio',
      email: 'emaildefault@gmail.com',
      password: 'fakepassword',
    });

    const UpdatedAvatarUser = await updateAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'fakeAvatarFilename',
    });

    expect(user).toEqual(UpdatedAvatarUser);
    expect(user.avatar).toEqual('fakeAvatarFilename');
  });

  it('should delete an old avatar to update a new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateAvatarService = new UpdateAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      name: 'fabio',
      email: 'emaildefault@gmail.com',
      password: 'fakepassword',
    });

    await updateAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'fakeAvatarFilename',
    });

    await updateAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'NewFakeAvatarFilename',
    });

    expect(deleteFile).toHaveBeenCalledWith('fakeAvatarFilename');
    expect(user.avatar).toEqual('NewFakeAvatarFilename');
  });

  it('should not be able to update avatar for an unexistent user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateAvatarService = new UpdateAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    await expect(
      updateAvatarService.execute({
        user_id: 'inexistentId',
        avatarFilename: 'fakeAvatarFilename',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
