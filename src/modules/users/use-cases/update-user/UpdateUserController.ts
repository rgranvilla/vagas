import { UserDTO } from "@database";
import { HandleErrors } from "@errors/HandleErrors";
import { responseFactory } from "@factories/responseFactory";
import { passwordHashing } from "@utils/passwordHashing";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { coerce, z } from "zod";
import { UpdateUserUseCase } from "./UpdateUserUseCase";
("../../utils/passwordHashing");
("../../factories/responseFactory");

export async function UpdateUserController(req: Request, res: Response) {
  const requestSchema = z.object({
    name: z.string().optional(),
    password: z.string().min(8).optional(),
    job: z.string().optional(),
    id: z.coerce.number(),
  });

  const requestUserSchema = z.object({
    id: coerce.number(),
  });

  try {
    const { id: authenticatedUserId } = requestUserSchema.parse(req.user);

    const { id, name, password, job } = requestSchema.parse({
      ...req.params,
      ...(req.body as UserDTO),
    });

    const toUpdate = {
      name,
      password,
      job,
    };

    if (toUpdate.password) {
      Object.assign(toUpdate, {
        ...toUpdate,
        password: await passwordHashing(toUpdate.password),
      });
    }

    const updateUserUseCase = container.resolve(UpdateUserUseCase);

    const updatedUser = await updateUserUseCase.execute(
      id,
      toUpdate,
      authenticatedUserId
    );

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
