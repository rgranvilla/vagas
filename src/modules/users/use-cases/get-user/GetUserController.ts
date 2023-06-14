import { HandleErrors } from "@errors/HandleErrors";
import { responseFactory } from "@factories/responseFactory";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";
import { GetUserUseCase } from "./GetUserUseCase";
("../../factories/responseFactory");

export async function GetUserController(req: Request, res: Response) {
  const requestSchema = z.object({
    name: z.string(),
  });

  try {
    const { name } = requestSchema.parse(req.query);

    const getUserUseCase = container.resolve(GetUserUseCase);

    const user = await getUserUseCase.execute(name);

    const response = responseFactory({
      status: "successfully",
      code: 200,
      message: "User retrieval successful.",
      data: {
        user: {
          id: user.id,
          name: user.name,
          isAdmin: user.isAdmin,
          permissions: {
            canUpdate: user.permissions.canUpdate,
            canDelete: user.permissions.canDelete,
          },
          job: user.job,
        },
      },
    });

    return res.status(response.code).json(response);
  } catch (err) {
    HandleErrors(err, res);
  }
}
