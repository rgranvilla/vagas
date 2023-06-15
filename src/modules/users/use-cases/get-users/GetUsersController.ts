import { Request, Response } from "express";
import { container } from "tsyringe";

import { HandleErrors } from "@errors/HandleErrors";
import { responseFactory } from "@factories/responseFactory";

import { GetUsersUseCase } from "./GetUsersUseCase";

export async function GetUsersController(req: Request, res: Response) {
  try {
    const getUsersUseCase = container.resolve(GetUsersUseCase);

    const result = await getUsersUseCase.execute();

    const users = result.map((user) => {
      const row = {
        id: user.id,
        name: user.name,
        isAdmin: user.isAdmin,
        permissions: {
          canUpdate: user.permissions.canUpdate,
          canDelete: user.permissions.canDelete,
        },
        job: user.job,
      };

      return row;
    });

    const response = responseFactory({
      status: "successfully",
      code: 200,
      message: "Users retrieval successful",
      data: {
        users,
      },
    });

    return res.status(response.code).json(response);
  } catch (err) {
    HandleErrors(err, res);
  }
}
