import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: RequestDTO): Promise<User> {
    const usersRepository = getRepository(User);

    const checkUserExist = await usersRepository.findOne({
      where: { email },
    });

    if (checkUserExist) {
      throw new Error('Email adress already used.');
    }

    const hashedPassword = await hash(password, 8);

    const newUser = usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await usersRepository.save(newUser);

    return newUser;
  }
}

export default CreateUserService;
