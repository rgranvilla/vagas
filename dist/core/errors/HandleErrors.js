"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/core/errors/HandleErrors.ts
var HandleErrors_exports = {};
__export(HandleErrors_exports, {
  HandleErrors: () => HandleErrors
});
module.exports = __toCommonJS(HandleErrors_exports);
var import_zod = require("zod");

// src/core/factories/responseFactory.ts
function responseFactory({
  status,
  code,
  message,
  data,
  error
}) {
  const response = {
    status,
    code,
    message,
    data,
    error
  };
  return response;
}

// src/core/errors/AppError.ts
var AppError = class extends Error {
  constructor(message, statusCode = 400) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/core/errors/InvalidCredentialsError.ts
var InvalidCredentialsError = class extends AppError {
  constructor() {
    super("Invalid credentials.", 401);
    this.name = "unauthorized";
  }
};

// src/core/errors/ResourceNotFoundError.ts
var ResourceNotFoundError = class extends AppError {
  constructor() {
    super(`Resource not found.`, 404);
    this.name = "not_found";
  }
};

// src/core/errors/TokenMissingError.ts
var TokenMissingError = class extends AppError {
  constructor() {
    super("Token missing.", 403);
    this.name = "forbidden";
  }
};

// src/core/errors/UnauthorizedActionError.ts
var UnauthorizedActionError = class extends AppError {
  constructor() {
    super("You are not authorized to perform this action.", 401);
    this.name = "unauthorized";
  }
};

// src/core/errors/UserNameAlreadyExistError.ts
var UserNameAlreadyExistError = class extends AppError {
  constructor() {
    super("User name already exist.", 409);
    this.name = "conflict";
  }
};

// src/core/errors/HandleErrors.ts
function HandleErrors(err, res) {
  if (err instanceof ResourceNotFoundError || err instanceof UserNameAlreadyExistError || err instanceof InvalidCredentialsError || err instanceof TokenMissingError || err instanceof UnauthorizedActionError) {
    const response2 = responseFactory({
      status: err.name,
      code: err.statusCode,
      message: err.message
    });
    return res.status(response2.code).json(response2);
  }
  if (err instanceof import_zod.ZodError) {
    const zodErr = {
      message: "Validation error.",
      issues: err.errors.map((err2) => ({
        field: err2.path.join("."),
        message: err2.message
      }))
    };
    const response2 = responseFactory({
      status: "validation_error",
      code: 400,
      message: "Validation Error",
      error: zodErr
    });
    return res.status(response2.code).json(response2);
  }
  const response = responseFactory({
    status: "server_error",
    code: 500,
    message: "Internal server error.",
    error: err
  });
  return res.status(response.code).json(response);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HandleErrors
});
