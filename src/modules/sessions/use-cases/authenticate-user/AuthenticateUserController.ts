import { HandleErrors } from "@errors/HandleErrors";
import { responseFactory } from "@factories/responseFactory";
import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { z } from "zod";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
("../../factories/responseFactory");

export async function AuthenticateUserController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestSchema = z.object({
    name: z.string(),
    password: z.string().min(8),
  });

  try {
    const { name, password } = requestSchema.parse(req.body);

    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

    const token = await authenticateUserUseCase.execute(name, password);

    const response = responseFactory({
      status: "successfully",
      code: 200,
      message: "Successful login.",
      data: {
        token,
      },
    });

    return res.status(response.code).json(response);
  } catch (err) {
    HandleErrors(err, res);
  }
}
