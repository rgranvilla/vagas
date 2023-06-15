import "reflect-metadata";

import request from "supertest";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

import app from "@tests/appTest";
import { DatabaseRepository } from "@tests/database";

describe("Get Metrics (e2e)", () => {
  let dbRepository: DatabaseRepository;

  beforeEach(async () => {
    dbRepository = new DatabaseRepository();
    await dbRepository.open();
  });

  afterEach(async () => {
    await dbRepository.close();
  });

  test("should be able to get all metrics list", async () => {
    // After calling the function 3 times to retrieve the user,
    // it is expected that the metrics record a 'readCount' equal to 3.
    await dbRepository.getUsers();
    await dbRepository.getUsers();
    await dbRepository.getUsers();

    const result = await request(app).get(`/metrics`).send();

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual({
      status: "successfully",
      code: 200,
      message: "Metrics retrieval successful.",
      data: {
        metrics: [
          {
            id: 0,
            readCount: 3,
          },
        ],
      },
    });
  });
});
