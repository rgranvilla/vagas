import { NextFunction, Request, Response } from "express";

import { IDatabaseRepository } from "@database/IDatabaseRepository";
import { HandleErrors } from "@errors/HandleErrors";
import { UnauthorizedActionError } from "@errors/UnauthorizedActionError";
import { container } from "tsyringe";

export async function ensurePermissions(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { id } = request.user;

  try {
    const repository: IDatabaseRepository = await container.resolve(
      "Repository"
    );
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
