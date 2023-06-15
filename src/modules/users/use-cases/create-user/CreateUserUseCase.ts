import { inject, injectable } from "tsyringe";

import {
  IDatabaseRepository,
  User,
  UserDTO,
} from "@database/IDatabaseRepository";
import { passwordHashing } from "@utils/passwordHashing";

import { UserNameAlreadyExistError } from "@errors/UserNameAlreadyExistError";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("Repository")
    private repository: IDatabaseRepository
  ) {}

  async execute(data: UserDTO): Promise<User> {
    const hashedPassword = await passwordHashing(data.password);

    const userAlreadyExist = await this.repository.userExist(data.name);

    if (userAlreadyExist) {
      throw new UserNameAlreadyExistError();
    }

    const user = await this.repository.createUser({
      ...data,
      password: hashedPassword,
      isAdmin: data.isAdmin,
      permissions: {
        canUpdate: data.permissions?.canUpdate ?? false,
        canDelete: data.permissions?.canDelete ?? false,
      },
    });

    return user;
  }
}
