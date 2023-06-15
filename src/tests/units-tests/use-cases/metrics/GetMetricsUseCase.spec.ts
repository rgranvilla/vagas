import "reflect-metadata";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { GetMetricsUseCase } from "@modules/metrics/get-metrics/GetMetricsUseCase";

import { DatabaseRepository } from "@tests/database";
import { CreateNewUser } from "@tests/utils/CreateNewUserFactory";

describe("Get Users", () => {
  let dbRepository: DatabaseRepository;
  let sut: GetMetricsUseCase;

  beforeEach(async () => {
    dbRepository = new DatabaseRepository();
    await dbRepository.open();
    sut = new GetMetricsUseCase(dbRepository);

    const createdUser = await CreateNewUser({ repo: dbRepository });

    await dbRepository.getUsers();
    await dbRepository.getUser(createdUser.name);
  });

  afterEach(async () => {
    await dbRepository.close();
  });

  it("should able to get all metrics list", async () => {
    const metrics = await sut.execute();

    expect(metrics).toHaveLength(2);
    expect(metrics).toEqual(
      expect.arrayContaining([
        {
          id: 0,
          readCount: 1,
        },
        {
          id: 1,
          readCount: 2,
        },
      ])
    );
  });
});
