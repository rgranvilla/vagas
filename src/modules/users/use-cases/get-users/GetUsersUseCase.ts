import { inject, injectable } from "tsyringe";

import { IDatabaseRepository, User } from "@database/IDatabaseRepository";

@injectable()
export class GetUsersUseCase {
  constructor(
    @inject("Repository")
    private repository: IDatabaseRepository
  ) {}

  async execute(): Promise<User[]> {
    const users = await this.repository.getUsers();

    if (!users) return [];

    return users;
  }
}
