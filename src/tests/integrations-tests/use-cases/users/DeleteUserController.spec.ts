import "reflect-metadata";

import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import app from "@tests/appTest";
import { DatabaseRepository } from "@tests/database";
import { CreateAndAuthenticateUser } from "@tests/utils/CreateAndAuthenticateUserFactory";

describe("Delete User (e2e)", () => {
  let dbRepository: DatabaseRepository;

  beforeAll(async () => {
    dbRepository = new DatabaseRepository();
    await dbRepository.open();
  });

  afterAll(async () => {
    await dbRepository.close();
  });

  test("should be able to delete a user", async () => {
    const { token, id } = await CreateAndAuthenticateUser({
      repo: dbRepository,
      app,
      canDelete: true,
    });

    const userToken = token;
    const userId = id;

    const response = await request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: "successfully",
      code: 200,
      message: "User was deleted successfully.",
    });
  });

  test("should be able to delete a user if you are admin", async () => {
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
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: "successfully",
      code: 200,
      message: "User was deleted successfully.",
    });
  });

  test("should not be able to delete a user without delete permissions", async () => {
    const { token, id } = await CreateAndAuthenticateUser({
      repo: dbRepository,
      app,
    });

    const userToken = token;
    const userId = id;

    const response = await request(app)
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send();

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      status: "unauthorized",
      code: 401,
      message: "You are not authorized to perform this action.",
    });
  });
});
