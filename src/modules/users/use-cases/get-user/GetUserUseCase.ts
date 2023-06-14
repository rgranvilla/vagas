import { IDatabaseRepository, User } from "@database";
import { ResourceNotFoundError } from "@errors/ResourceNotFoundError";
import { inject, injectable } from "tsyringe";

@injectable()
export class GetUserUseCase {
  constructor(
    @inject("Repository")
    private repository: IDatabaseRepository
  ) {}

  async execute(name: string): Promise<User> {
    const user = await this.repository.getUser(name);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return user;
  }
}
