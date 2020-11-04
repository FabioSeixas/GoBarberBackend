import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ShowProfileService from '@modules/users/services/ShowProfileService';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to retrieve correct user information', async () => {
    const user = await fakeUsersRepository.create({
      name: 'fabio',
      email: 'emaildefault@gmail.com',
      password: 'fakepassword',
    });

    const showUser = await showProfile.execute(user.id);

    expect(showUser).toBe(user);
  });

  it('should not be able to retrieve user by a non existing user id ', async () => {
    await expect(showProfile.execute('123123')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
