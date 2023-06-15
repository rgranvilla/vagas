import "reflect-metadata";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { GetUsersUseCase } from "@modules/users/use-cases/get-users/GetUsersUseCase";

import { DatabaseRepository } from "@tests/database";
import { CreateNewUser } from "@tests/utils/CreateNewUserFactory";

describe("Get Users", () => {
  let dbRepository: DatabaseRepository;
  let sut: GetUsersUseCase;

  beforeEach(async () => {
    dbRepository = new DatabaseRepository();
    await dbRepository.open();
    sut = new GetUsersUseCase(dbRepository);

    await CreateNewUser({ repo: dbRepository });
  });

  afterEach(async () => {
    await dbRepository.close();
  });

  it("should able to get all users list", async () => {
    // Expect assertion to have two entries, one admin user create on dbRepository.open()
    // and another user created on CreateNewUser.
    const users = await sut.execute();

    expect(users).toHaveLength(2);
  });
});
