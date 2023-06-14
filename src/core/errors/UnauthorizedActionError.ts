import { AppError } from "./AppError";

export class UnauthorizedActionError extends AppError {
  constructor() {
    super("You are not authorized to perform this action.", 401);
    this.name = "unauthorized";
  }
}
