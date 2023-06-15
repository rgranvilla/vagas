import "reflect-metadata";

import request from "supertest";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { User } from "@database/IDatabaseRepository";
import app from "@tests/appTest";
import { DatabaseRepository } from "@tests/database";
import { CreateAndAuthenticateUser } from "@tests/utils/CreateAndAuthenticateUserFactory";
import { passwordHashing } from "@utils/passwordHashing";

describe("Update User Permission (e2e)", () => {
  let dbRepository: DatabaseRepository;
  let userId: number = 1;

  beforeEach(async () => {
    dbRepository = new DatabaseRepository();
    await dbRepository.open();

    await dbRepository.createUser({
      name: "John Doe",
      password: await passwordHashing("12345678"),
      job: "Tester",
    });

    const createdUser = (await dbRepository.getUser("John Doe")) as User;
    userId = createdUser.id;
  });

  afterEach(async () => {
    await dbRepository.close();
  });

  test("should be able to update a user permission if you are admin user", async () => {
    const admin = await request(app).post("/sessions").send({
      name: "admin",
      password: "12345678",
    });

    const adminToken = admin.body.data.token;

    const response = await request(app)
      .put(`/admin/users/${userId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        isAdmin: true,
        canUpdate: true,
        canDelete: true,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: "successfully",
      code: 200,
      message: "",
      data: {
        user: {
          id: 1,
          name: "John Doe",
          isAdmin: true,
          job: "Tester",
          permissions: {
            canUpdate: true,
            canDelete: true,
          },
        },
      },
    });
  });

  test("should not be able to update a user permissions if you are not admin user", async () => {
    const { token, id } = await CreateAndAuthenticateUser({
      repo: dbRepository,
      app,
    });

    const userToken = token;
    const userId = id;

    const response = await request(app)
      .put(`/admin/users/${userId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        isAdmin: true,
        canUpdate: true,
        canDelete: true,
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      status: "unauthorized",
      code: 401,
      message: "You are not authorized to perform this action.",
    });
  });
});
