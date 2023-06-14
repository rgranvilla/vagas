import { inject, injectable } from "tsyringe";

import { IDatabaseRepository, User, UserDTO } from "@database";

import { ResourceNotFoundError } from "@errors/ResourceNotFoundError";
import { UnauthorizedActionError } from "@errors/UnauthorizedActionError";
import { UserNameAlreadyExistError } from "@errors/UserNameAlreadyExistError";

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject("Repository")
    private repository: IDatabaseRepository
  ) {}

  async execute(
    id: number,
    data: Partial<UserDTO>,
    authenticatedUserId: number
  ): Promise<User> {
    const { isAdmin } = (await this.repository.getUserById(
      authenticatedUserId
    )) as User;

    if (id === authenticatedUserId || isAdmin) {
      let canUpdate: boolean = false;
      if (data.name !== undefined) {
        const user = await this.repository.getUser(data.name);
        canUpdate = (!!user && user.id === id) || !user;
      }

      if (data.name && !canUpdate) {
        throw new UserNameAlreadyExistError();
      }

      const user = await this.repository.updateUser(id, data);

      if (!user) {
        throw new ResourceNotFoundError();
      }

      return user;
    }

    throw new UnauthorizedActionError();
  }
}
