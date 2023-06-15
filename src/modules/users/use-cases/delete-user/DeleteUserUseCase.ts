import { inject, injectable } from "tsyringe";

import { IDatabaseRepository } from "@database/IDatabaseRepository";

import { ResourceNotFoundError } from "@errors/ResourceNotFoundError";

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject("Repository")
    private repository: IDatabaseRepository
  ) {}

  async execute(id: number): Promise<void> {
    const userExist = !!(await this.repository.getUserById(id));

    if (!userExist) {
      throw new ResourceNotFoundError();
    }

    await this.repository.deleteUser(id);
  }
}
