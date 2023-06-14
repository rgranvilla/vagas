import { IDatabaseRepository, User } from "@database";
import { inject, injectable } from "tsyringe";

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
