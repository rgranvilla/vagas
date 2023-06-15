import "reflect-metadata";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { User } from "@database/IDatabaseRepository";
import { UpdateUserUseCase } from "@modules/users/use-cases/update-user/UpdateUserUseCase";

import { DatabaseRepository } from "@tests/database";
import { CreateNewUser } from "@tests/utils/CreateNewUserFactory";

describe("Delete User", () => {
  let dbRepository: DatabaseRepository;
  let sut: UpdateUserUseCase;
  let createdUser: User;

  beforeEach(async () => {
    dbRepository = new DatabaseRepository();
    await dbRepository.open();
    sut = new UpdateUserUseCase(dbRepository);

    // Create user on Database
    createdUser = await CreateNewUser({ repo: dbRepository });
  });

  afterEach(async () => {
    await dbRepository.close();
  });

  it("should able to update a user", async () => {
    const beforeUpdate = await dbRepository.getUserById(createdUser.id);
    expect(beforeUpdate?.name).toBe("John Doe");
    expect(beforeUpdate?.job).toBe("Tester");

    const newUserData = {
      name: "Oliver",
      job: "Developer",
    };

    const afterUpdate = await sut.execute(
      createdUser.id,
      newUserData,
      createdUser.id
    );

    expect(afterUpdate).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: newUserData.name,
        password: expect.any(String),
        isAdmin: false,
        permissions: {
          canUpdate: false,
          canDelete: false,
        },
        job: newUserData.job,
      })
    );
  });
});
