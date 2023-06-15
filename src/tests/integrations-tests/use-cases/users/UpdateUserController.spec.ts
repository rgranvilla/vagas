import "reflect-metadata";

import request from "supertest";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import app from "@tests/appTest";
import { DatabaseRepository } from "@tests/database";
import { CreateAndAuthenticateUser } from "@tests/utils/CreateAndAuthenticateUserFactory";

describe("Update User (e2e)", () => {
  let dbRepository: DatabaseRepository;

  beforeEach(async () => {
    dbRepository = new DatabaseRepository();
    await dbRepository.open();
  });

  afterEach(async () => {
    await dbRepository.close();
  });

  test("should be able to update a user", async () => {
    const { token, id } = await CreateAndAuthenticateUser({
      repo: dbRepository,
      app,
      canUpdate: true,
    });

    const userToken = token;
    const userId = id;

    const response = await request(app)
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "John",
        job: "Developer",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: "successfully",
      code: 200,
      message: "",
      data: {
        user: {
          id: 1,
          name: "John",
          isAdmin: false,
          job: "Developer",
          permissions: {
            canUpdate: true,
            canDelete: false,
          },
        },
      },
    });
  });

  test("should be able to update a user if you are admin", async () => {
    const admin = await request(app).post("/sessions").send({
      name: "admin",
      password: "12345678",
    });

    const adminToken = admin.body.data.token;

    const { id } = await CreateAndAuthenticateUser({
      repo: dbRepository,
      app,
    });

    const userId = id;

    const response = await request(app)
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "John",
        job: "Developer",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: "successfully",
      code: 200,
      message: "",
      data: {
        user: {
          id: 1,
          name: "John",
          isAdmin: false,
          job: "Developer",
          permissions: {
            canUpdate: false,
            canDelete: false,
          },
        },
      },
    });
  });

  test("should not be able to update a user without update permissions", async () => {
    const { token, id } = await CreateAndAuthenticateUser({
      repo: dbRepository,
      app,
    });

    const userToken = token;
    const userId = id;

    const response = await request(app)
      .put(`/users/${userId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "John",
        job: "Developer",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      status: "unauthorized",
      code: 401,
      message: "You are not authorized to perform this action.",
    });
  });
});
