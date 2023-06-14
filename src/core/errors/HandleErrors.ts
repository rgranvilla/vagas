import { Response } from "express";
import { ZodError } from "zod";

import { responseFactory } from "@factories/responseFactory";

import { InvalidCredentialsError } from "./InvalidCredentialsError";
import { ResourceNotFoundError } from "./ResourceNotFoundError";
import { TokenMissingError } from "./TokenMissingError";
import { UnauthorizedActionError } from "./UnauthorizedActionError";
import { UserNameAlreadyExistError } from "./UserNameAlreadyExistError";

export function HandleErrors(err: unknown, res: Response) {
  if (
    err instanceof ResourceNotFoundError ||
    err instanceof UserNameAlreadyExistError ||
    err instanceof InvalidCredentialsError ||
    err instanceof TokenMissingError ||
    err instanceof UnauthorizedActionError
  ) {
    const response = responseFactory({
      status: err.name,
      code: err.statusCode,
      message: err.message,
    });

    return res.status(response.code).json(response);
  }

  if (err instanceof ZodError) {
    const zodErr = {
      message: "Validation error.",
      issues: err.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    };
    const response = responseFactory({
      status: "validation_error",
      code: 400,
      message: "Validation Error",
      error: zodErr,
    });

    return res.status(response.code).json(response);
  }

  const response = responseFactory<undefined, typeof err>({
    status: "server_error",
    code: 500,
    message: "Internal server error.",
    error: err,
  });

  return res.status(response.code).json(response);
}
