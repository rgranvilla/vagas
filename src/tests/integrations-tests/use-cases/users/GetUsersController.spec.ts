import "reflect-metadata";

import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import app from "@tests/appTest";
import { DatabaseRepository } from "@tests/database";
import { CreateAndAuthenticateUser } from "@tests/utils/CreateAndAuthenticateUserFactory";

describe("Get Users (e2e)", () => {
  let dbRepository: DatabaseRepository;

  beforeAll(async () => {
    dbRepository = new DatabaseRepository();
    await dbRepository.open();
    await CreateAndAuthenticateUser({
      repo: dbRepository,
      app,
    });
  });

  afterAll(async () => {
    await dbRepository.close();
  });

  test("should be able to get all user list", async () => {
    const result = await request(app).get(`/users`).send();

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      status: "successfully",
      code: 200,
      message: "Users retrieval successful",
      data: {
        users: [
          {
            id: 0,
            name: "admin",
            isAdmin: true,
            job: "Admin",
            permissions: {
              canUpdate: true,
              canDelete: true,
            },
          },
          {
            id: 1,
            name: "John Doe",
            isAdmin: false,
            job: "Tester",
            permissions: {
              canUpdate: false,
              canDelete: false,
            },
          },
        ],
      },
    });
  });
});
