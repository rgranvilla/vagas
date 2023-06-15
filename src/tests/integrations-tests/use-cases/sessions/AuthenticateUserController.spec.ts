import "reflect-metadata";

import request from "supertest";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

import app from "@tests/appTest";
import { DatabaseRepository } from "@tests/database";
import { CreateAndAuthenticateUser } from "@tests/utils/CreateAndAuthenticateUserFactory";

describe("Authenticate User (e2e)", () => {
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

  test("should be able to authenticate a user", async () => {
    const response = await request(app).post(`/sessions`).send({
      name: "John Doe",
      password: "12345678",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: "successfully",
      code: 200,
      message: "Successful login.",
      data: {
        token: expect.any(String),
      },
    });
  });

  test("should not be able to authenticate a user with wrong credentials", async () => {
    const response = await request(app).post(`/sessions`).send({
      name: "Wrong name",
      password: "12345678",
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      status: "unauthorized",
      code: 401,
      message: "Invalid credentials.",
    });
  });
});
