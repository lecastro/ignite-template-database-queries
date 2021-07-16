import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;
  private repositoryUser: Repository<User>;

  constructor() {
    this.repository = getRepository(Game);
    this.repositoryUser = getRepository(User);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const gamesTitle = await this.repository
      .createQueryBuilder("games")
      .where("games.title ILIKE :title", { title: `%${param}%` })
      .getMany();

    return gamesTitle;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query('SELECT COUNT(id) FROM games');
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const user = await this.repositoryUser
      .createQueryBuilder("user")
      .select([
        "user.first_name",
        "user.last_name",
        "user.email",
      ])
      .leftJoinAndSelect("user.games", "game")
      .where("game.id = :id", { id: id })
      .getMany();

    return user;
  }
}
