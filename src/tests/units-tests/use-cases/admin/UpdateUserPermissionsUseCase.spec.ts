import "reflect-metadata";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { User } from "@database/IDatabaseRepository";
import { UpdateUserPermissionsUseCase } from "@modules/admin/update-user-permissions/UpdateUserPermissionsUseCase";

import { DatabaseRepository } from "@tests/database";
import { CreateNewUser } from "@tests/utils/CreateNewUserFactory";

describe("Delete User", () => {
  let dbRepository: DatabaseRepository;
  let sut: UpdateUserPermissionsUseCase;
  let createdUser: User;

  beforeEach(async () => {
    dbRepository = new DatabaseRepository();
    await dbRepository.open();
    sut = new UpdateUserPermissionsUseCase(dbRepository);

    // Create user on Database
    createdUser = await CreateNewUser({ repo: dbRepository });
  });

  afterEach(async () => {
    await dbRepository.close();
  });

  it("should able to update a user", async () => {
    const beforeUpdate = await dbRepository.getUserById(createdUser.id);

    expect(beforeUpdate?.isAdmin).not.toBeTruthy();
    expect(beforeUpdate?.permissions.canUpdate).not.toBeTruthy();
    expect(beforeUpdate?.permissions.canDelete).not.toBeTruthy();

    const newUserData = {
      isAdmin: true,
      permissions: {
        canUpdate: true,
        canDelete: true,
      },
    };

    const afterUpdate = await sut.execute(createdUser.id, newUserData);

    expect(afterUpdate).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: createdUser.name,
        password: expect.any(String),
        isAdmin: true,
        permissions: {
          canUpdate: true,
          canDelete: true,
        },
        job: createdUser.job,
      })
    );
  });
});
