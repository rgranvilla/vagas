import "reflect-metadata";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { User } from "@database/IDatabaseRepository";
import { AuthenticateUserUseCase } from "@modules/sessions/use-cases/authenticate-user/AuthenticateUserUseCase";

import { DatabaseRepository } from "@tests/database";
import { CreateNewUser } from "@tests/utils/CreateNewUserFactory";

describe("Authenticate User", () => {
  let dbRepository: DatabaseRepository;
  let sut: AuthenticateUserUseCase;
  let createdUser: User;

  beforeEach(async () => {
    dbRepository = new DatabaseRepository();
    await dbRepository.open();
    sut = new AuthenticateUserUseCase(dbRepository);

    createdUser = await CreateNewUser({ repo: dbRepository });
  });

  afterEach(async () => {
    await dbRepository.close();
  });

  it("should able to authenticate user", async () => {
    const token = await sut.execute(createdUser.name, "12345678");

    expect(token).toEqual(expect.any(String));
  });
});
