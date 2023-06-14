import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import auth from "@config/auth";
import { HandleErrors } from "@errors/HandleErrors";
import { TokenMissingError } from "@errors/TokenMissingError";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new TokenMissingError();
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: userId } = verify(token, auth.secret_token) as IPayload;

    request.user = {
      id: userId,
    };

    next();
  } catch (error) {
    HandleErrors(error, response);
  }
}
