import { HandleErrors } from "@errors/HandleErrors";
import { responseFactory } from "@factories/responseFactory";
import { Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";
import { DeleteUserUseCase } from "./DeleteUserUseCase";
("../../factories/responseFactory");

export async function DeleteUserController(req: Request, res: Response) {
  const requestSchema = z.object({
    id: z.coerce.number(),
  });

  const { id } = requestSchema.parse(req.params);

  try {
    const deleteUserUseCase = container.resolve(DeleteUserUseCase);

    await deleteUserUseCase.execute(id);

    const response = responseFactory({
      status: "successfully",
      code: 200,
      message: "User was deleted successfully.",
    });

    return res.status(response.code).json(response);
  } catch (err) {
    HandleErrors(err, res);
  }
}
