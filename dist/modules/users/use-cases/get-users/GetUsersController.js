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
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
var __decorateParam = (index, decorator) => (target, key) => decorator(target, key, index);

// src/modules/users/use-cases/get-users/GetUsersController.ts
var GetUsersController_exports = {};
__export(GetUsersController_exports, {
  GetUsersController: () => GetUsersController
});
module.exports = __toCommonJS(GetUsersController_exports);
var import_tsyringe2 = require("tsyringe");

// src/core/errors/HandleErrors.ts
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

// src/modules/users/use-cases/get-users/GetUsersUseCase.ts
var import_tsyringe = require("tsyringe");
var GetUsersUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute() {
    const users = await this.repository.getUsers();
    if (!users)
      return [];
    return users;
  }
};
GetUsersUseCase = __decorateClass([
  (0, import_tsyringe.injectable)(),
  __decorateParam(0, (0, import_tsyringe.inject)("Repository"))
], GetUsersUseCase);

// src/modules/users/use-cases/get-users/GetUsersController.ts
async function GetUsersController(req, res) {
  try {
    const getUsersUseCase = import_tsyringe2.container.resolve(GetUsersUseCase);
    const result = await getUsersUseCase.execute();
    const users = result.map((user) => {
      const row = {
        id: user.id,
        name: user.name,
        isAdmin: user.isAdmin,
        permissions: {
          canUpdate: user.permissions.canUpdate,
          canDelete: user.permissions.canDelete
        },
        job: user.job
      };
      return row;
    });
    const response = responseFactory({
      status: "successfully",
      code: 200,
      message: "Users retrieval successful",
      data: {
        users
      }
    });
    return res.status(response.code).json(response);
  } catch (err) {
    HandleErrors(err, res);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetUsersController
});
