import { AppError } from "./AppError";

export class UserNameAlreadyExistError extends AppError {
  constructor() {
    super("User name already exist.", 409);
    this.name = "conflict";
  }
}
