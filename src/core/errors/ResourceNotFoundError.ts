import { AppError } from "./AppError";

export class ResourceNotFoundError extends AppError {
  constructor() {
    super(`Resource not found.`, 404);
    this.name = "not_found";
  }
}
