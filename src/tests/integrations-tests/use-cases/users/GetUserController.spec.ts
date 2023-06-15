import "reflect-metadata";

import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import app from "@tests/appTest";
import { DatabaseRepository } from "@tests/database";

describe("Get User (e2e)", () => {
  let dbRepository: DatabaseRepository;

  beforeAll(async () => {
    dbRepository = new DatabaseRepository();
    await dbRepository.open();
  });

  afterAll(async () => {
    await dbRepository.close();
  });

  test("should be able to get a user", async () => {
    const result = await request(app).get(`/user?name=admin`).send();

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      status: "successfully",
      code: 200,
      message: "User retrieval successful.",
      data: {
        user: {
          id: 0,
          name: "admin",
          isAdmin: true,
          job: "Admin",
          permissions: {
            canUpdate: true,
            canDelete: true,
          },
        },
      },
    });
  });
});
