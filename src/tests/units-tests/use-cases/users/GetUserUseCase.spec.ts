import "reflect-metadata";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { User } from "@database/IDatabaseRepository";
import { GetUserUseCase } from "@modules/users/use-cases/get-user/GetUserUseCase";

import { ResourceNotFoundError } from "@errors/ResourceNotFoundError";

import { DatabaseRepository } from "@tests/database";
import { CreateNewUser } from "@tests/utils/CreateNewUserFactory";

describe("Get User", () => {
  let dbRepository: DatabaseRepository;
  let sut: GetUserUseCase;
  let createdUser: User;

  beforeEach(async () => {
    dbRepository = new DatabaseRepository();
    await dbRepository.open();
    sut = new GetUserUseCase(dbRepository);

    createdUser = await CreateNewUser({ repo: dbRepository });
  });

  afterEach(async () => {
    await dbRepository.close();
  });

  it("should able to get user by name", async () => {
    const user = await sut.execute(createdUser.name);

    expect(user).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: createdUser.name,
        password: expect.any(String),
        isAdmin: false,
        permissions: {
          canUpdate: false,
          canDelete: false,
        },
        job: createdUser.job,
      })
    );
  });

  it("should throw an error when an unexistent name is provided", async () => {
    const executeSpy = vi.spyOn(sut, "execute");

    await expect(sut.execute("Unexistent Name")).rejects.toBeInstanceOf(
      ResourceNotFoundError
    );
    expect(executeSpy).toBeCalled();
  });
});
