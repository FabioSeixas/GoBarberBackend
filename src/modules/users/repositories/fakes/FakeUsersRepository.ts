import { v4 } from 'uuid';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import User from '@modules/users/infra/typeorm/entities/User';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class FakeUsersRepository implements IUsersRepository {
  private usersRepository: User[] = [];

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users = this.usersRepository;

    if (except_user_id) {
      users = this.usersRepository.filter(item => item.id !== except_user_id);
    }

    return users;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.usersRepository.find(item => email === item.email);

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.usersRepository.find(item => id === item.id);

    return user;
  }

  public async create({
    email,
    name,
    password,
  }: ICreateUserDTO): Promise<User> {
    const newUser = new User();

    Object.assign(newUser, { id: v4(), email, name, password });

    this.usersRepository.push(newUser);

    return newUser;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.usersRepository.findIndex(
      findUser => findUser.id === user.id,
    );

    this.usersRepository[findIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
