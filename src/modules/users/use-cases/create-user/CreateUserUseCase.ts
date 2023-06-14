import { UserNameAlreadyExistError } from "@errors/UserNameAlreadyExistError";
import {
  IDatabaseRepository,
  User,
  UserDTO,
} from "src/core/database/IDatabaseRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("Repository")
    private repository: IDatabaseRepository
  ) {}

  async execute(data: UserDTO): Promise<User> {
    const userAlreadyExist = await this.repository.userExist(data.name);

    if (userAlreadyExist) {
      throw new UserNameAlreadyExistError();
    }

    const user = await this.repository.createUser(data);

    return user;
  }
}
