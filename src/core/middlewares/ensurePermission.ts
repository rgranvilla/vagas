import { NextFunction, Request, Response } from "express";

import { DatabaseRepository } from "@database";
import { HandleErrors } from "@errors/HandleErrors";
import { UnauthorizedActionError } from "@errors/UnauthorizedActionError";

export async function ensurePermissions(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { id } = request.user;

  try {
    const repository = new DatabaseRepository();
    const user = await repository.getUserById(+id);

    if (request.method === "PUT" && !user?.permissions.canUpdate) {
      throw new UnauthorizedActionError();
    }

    if (request.method === "DELETE" && !user?.permissions.canDelete) {
      throw new UnauthorizedActionError();
    }

    return next();
  } catch (error: any) {
    HandleErrors(error, response);
  }
}
