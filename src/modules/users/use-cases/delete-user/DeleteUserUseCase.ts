import { IDatabaseRepository } from "@database";
import { ResourceNotFoundError } from "@errors/ResourceNotFoundError";
import { inject, injectable } from "tsyringe";

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
