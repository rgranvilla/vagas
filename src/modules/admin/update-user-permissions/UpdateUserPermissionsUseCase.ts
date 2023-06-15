import { inject, injectable } from "tsyringe";

import {
  IDatabaseRepository,
  User,
  UserDTO,
} from "@database/IDatabaseRepository";

import { ResourceNotFoundError } from "@errors/ResourceNotFoundError";

@injectable()
export class UpdateUserPermissionsUseCase {
  constructor(
    @inject("Repository")
    private repository: IDatabaseRepository
  ) {}

  async execute(id: number, data: Partial<UserDTO>): Promise<User> {
    const user = await this.repository.updateUserPermissions(id, data);

    if (!user) {
      throw new ResourceNotFoundError();
    }

    return user;
  }
}
