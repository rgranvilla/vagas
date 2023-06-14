import { inject, injectable } from "tsyringe";

import { IDatabaseRepository, User, UserDTO } from "@database";
import { ResourceNotFoundError } from "@errors/ResourceNotFoundError";
import { UnauthorizedActionError } from "@errors/UnauthorizedActionError";

@injectable()
export class UpdateUserPermissionsUseCase {
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

    if (!isAdmin) throw new UnauthorizedActionError();

    const user = await this.repository.updateUserPermissions(id, data);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return user;
  }
}
