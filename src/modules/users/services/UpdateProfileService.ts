import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
// import User from '@modules/users/infra/typeorm/entities/User';

interface RequestDTO {
  user_id: string;
  email: string;
  name: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    email,
    name,
    old_password,
    password,
  }: RequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User id does not exists', 401);
    }

    const existingUserWithEmail = await this.usersRepository.findByEmail(email);

    if (existingUserWithEmail && existingUserWithEmail.id !== user.id) {
      throw new AppError('Email already in used', 401);
    }

    if (password && !old_password) {
      throw new AppError('Old password is necessary', 401);
    }

    if (password && old_password) {
      const passwordMatch = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!passwordMatch) {
        throw new AppError('Wrong old password', 400);
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    Object.assign(user, {
      email,
      name,
    });

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
