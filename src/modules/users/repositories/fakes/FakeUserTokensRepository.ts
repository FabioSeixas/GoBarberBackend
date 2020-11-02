import { v4 } from 'uuid';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const newUserToken = new UserToken();

    Object.assign(newUserToken, {
      id: v4(),
      user_id,
      token: v4(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(newUserToken);

    return newUserToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find(item => item.token === token);

    return userToken;
  }
}

export default FakeUserTokensRepository;
