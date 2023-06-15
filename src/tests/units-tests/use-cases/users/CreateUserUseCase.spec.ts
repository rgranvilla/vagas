import "reflect-metadata";

import { compare } from "bcryptjs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { UserDTO } from "@database/IDatabaseRepository";
import { CreateUserUseCase } from "@modules/users/use-cases/create-user/CreateUserUseCase";

import { UserNameAlreadyExistError } from "@errors/UserNameAlreadyExistError";

import { DatabaseRepository } from "@tests/database";

describe("Create User", () => {
  let dbRepository: DatabaseRepository;
  let sut: CreateUserUseCase;

  const createdUser: UserDTO = {
    name: "John Doe",
    password: "12345678",
    job: "Developer",
  };

  beforeEach(async () => {
    dbRepository = new DatabaseRepository();
    await dbRepository.open();
    sut = new CreateUserUseCase(dbRepository);
  });

  afterEach(async () => {
    await dbRepository.close();
  });

  it("should able to create a new user", async () => {
    const result = await sut.execute(createdUser);

    expect(result).toEqual(
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

  it("should be able to hash user password upon registration", async () => {
    const user = await sut.execute(createdUser);

    const isPasswordCorrectlyHashed = await compare("12345678", user.password);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to create an user with name already exists", async () => {
    const name = "John Doe";

    await sut.execute({
      name,
      password: "12345678",
      job: "Tester",
    });

    await expect(
      sut.execute({
        name,
        password: "12345678",
        job: "Tester",
      })
    ).rejects.toBeInstanceOf(UserNameAlreadyExistError);
  });
});
