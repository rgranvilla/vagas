import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";

import { UserDTO } from "@database/IDatabaseRepository";
import { HandleErrors } from "@errors/HandleErrors";
import { responseFactory } from "@factories/responseFactory";

import { UpdateUserPermissionsUseCase } from "./UpdateUserPermissionsUseCase";

export async function UpdateUserPermissionsController(
  req: Request,
  res: Response
) {
  const requestSchema = z.object({
    isAdmin: z.boolean().optional().default(false),
    canUpdate: z.boolean().optional().default(false),
    canDelete: z.boolean().optional().default(false),
    id: z.coerce.number(),
  });

  try {
    const { id, isAdmin, canUpdate, canDelete } = requestSchema.parse({
      ...req.params,
      ...(req.body as UserDTO),
    });

    const toUpdate = {
      isAdmin: isAdmin ?? false,
      permissions: {
        canUpdate: canUpdate ?? false,
        canDelete: canDelete ?? false,
      },
    };

    const updateUserPermissionsUseCase = container.resolve(
      UpdateUserPermissionsUseCase
    );

    const updatedUser = await updateUserPermissionsUseCase.execute(
      id,
      toUpdate
    );

    console.log(toUpdate, updatedUser);

    const response = responseFactory({
      status: "successfully",
      code: 200,
      message: "",
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          isAdmin: updatedUser.isAdmin,
          job: updatedUser.job,
          permissions: {
            canUpdate: updatedUser.permissions.canUpdate,
            canDelete: updatedUser.permissions.canDelete,
          },
        },
      },
    });

    return res.status(response.code).json(response);
  } catch (err) {
    HandleErrors(err, res);
  }
}
