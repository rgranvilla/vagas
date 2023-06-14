import { NextFunction, Request, Response } from "express";

import { DatabaseRepository } from "@database";
import { HandleErrors } from "@errors/HandleErrors";
import { UnauthorizedActionError } from "@errors/UnauthorizedActionError";

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { id } = request.user;

  try {
    const repository = new DatabaseRepository();
    const user = await repository.getUserById(+id);

    if (!user?.isAdmin) {
      throw new UnauthorizedActionError();
    }

    return next();
  } catch (error: any) {
    HandleErrors(error, response);
  }
}
