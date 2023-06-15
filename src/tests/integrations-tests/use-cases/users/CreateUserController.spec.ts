import "reflect-metadata";

import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import { UserDTO } from "@database/IDatabaseRepository";
import { DatabaseRepository } from "@tests/database";
import app from "../../../appTest";

describe("Create User (e2e)", () => {
  let dbRepository: DatabaseRepository;

  const createdUser: UserDTO = {
    name: "John Doe",
    password: "12345678",
    job: "Developer",
  };

  beforeAll(async () => {
    dbRepository = new DatabaseRepository();
    await dbRepository.open();
  });

  afterAll(async () => {
    await dbRepository.close();
  });

  test("should be able to create an user", async () => {
    const result = await request(app).post("/users").send(createdUser);

    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual({
      status: "successfully",
      code: 201,
      message: "User was created successfully.",
      data: {
        user: {
          id: 1,
          name: createdUser.name,
          isAdmin: false,
          job: createdUser.job,
          permissions: {
            canUpdate: false,
            canDelete: false,
          },
        },
      },
    });
  });
});
