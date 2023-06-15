import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { HandleErrors } from "@errors/HandleErrors";
import { responseFactory } from "@factories/responseFactory";

import { CreateUserUseCase } from "./CreateUserUseCase";

export async function CreateUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestSchema = z.object({
    name: z.string(),
    password: z.string().min(8),
    job: z.string(),
  });

  try {
    const { name, password, job } = requestSchema.parse(req.body);

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const createdUser = await createUserUseCase.execute({
      name,
      isAdmin: false,
      password,
      job,
    });

    const response = responseFactory({
      status: "successfully",
      code: 201,
      message: "User was created successfully.",
      data: {
        user: {
          id: createdUser.id,
          name: createdUser.name,
          isAdmin: createdUser.isAdmin,
          job: createdUser.job,
          permissions: {
            canUpdate: createdUser.permissions.canUpdate,
            canDelete: createdUser.permissions.canDelete,
          },
        },
      },
    });

    return res.status(response.code).send(response);
  } catch (err) {
    HandleErrors(err, res);
  }
}
