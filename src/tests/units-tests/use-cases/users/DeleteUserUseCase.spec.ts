import "reflect-metadata";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { User } from "@database/IDatabaseRepository";
import { DeleteUserUseCase } from "@modules/users/use-cases/delete-user/DeleteUserUseCase";

import { ResourceNotFoundError } from "@errors/ResourceNotFoundError";

import { DatabaseRepository } from "@tests/database";
import { CreateNewUser } from "@tests/utils/CreateNewUserFactory";

describe("Delete User", () => {
  let dbRepository: DatabaseRepository;
  let sut: DeleteUserUseCase;
  let createdUser: User;

  beforeEach(async () => {
    dbRepository = new DatabaseRepository();
    await dbRepository.open();
    sut = new DeleteUserUseCase(dbRepository);

    createdUser = await CreateNewUser({ repo: dbRepository });
  });

  afterEach(async () => {
    await dbRepository.close();
  });

  it("should able to delete a user", async () => {
    const beforeDeleteUser = await dbRepository.getUsers();
    expect(beforeDeleteUser).toHaveLength(2);

    const executeSpy = vi.spyOn(sut, "execute");

    await sut.execute(createdUser.id);

    expect(executeSpy).toBeCalled();

    const afterDeleteUser = await dbRepository.getUsers();
    expect(afterDeleteUser).toHaveLength(1);
  });

  it("should throw error on delete a user when dont have user with unexistent id", async () => {
    const beforeDeleteUser = await dbRepository.getUsers();
    expect(beforeDeleteUser).toHaveLength(2);

    const executeSpy = vi.spyOn(sut, "execute");

    const UnexistentId = 123;

    await expect(sut.execute(UnexistentId)).rejects.toBeInstanceOf(
      ResourceNotFoundError
    );
    expect(executeSpy).toBeCalled();

    const afterDeleteUser = await dbRepository.getUsers();
    expect(afterDeleteUser).toHaveLength(2);
  });
});
