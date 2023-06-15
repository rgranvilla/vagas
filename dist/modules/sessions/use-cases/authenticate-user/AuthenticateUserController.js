"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/modules/sessions/use-cases/authenticate-user/AuthenticateUserController.ts
var AuthenticateUserController_exports = {};
__export(AuthenticateUserController_exports, {
  AuthenticateUserController: () => AuthenticateUserController
});
module.exports = __toCommonJS(AuthenticateUserController_exports);
var import_tsyringe2 = require("tsyringe");
var import_zod2 = require("zod");

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

// src/modules/sessions/use-cases/authenticate-user/AuthenticateUserUseCase.ts
var import_bcryptjs = require("bcryptjs");
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_tsyringe = require("tsyringe");

// src/config/auth.ts
var auth_default = {
  secret_token: "cfe275a5908b5650488e0b0342c2d6cc",
  expires_in_token: "15m"
};

// src/modules/sessions/use-cases/authenticate-user/AuthenticateUserUseCase.ts
var AuthenticateUserUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(name, password) {
    const user = await this.repository.getUser(name);
    const { secret_token, expires_in_token } = auth_default;
    if (!user) {
      throw new InvalidCredentialsError();
    }
    const passwordMatch = await (0, import_bcryptjs.compare)(password, user.password);
    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }
    const token = import_jsonwebtoken.default.sign({ isAdmin: user.isAdmin }, secret_token, {
      expiresIn: expires_in_token,
      subject: user.id.toString()
    });
    return token;
  }
};
AuthenticateUserUseCase = __decorateClass([
  (0, import_tsyringe.injectable)(),
  __decorateParam(0, (0, import_tsyringe.inject)("Repository"))
], AuthenticateUserUseCase);

// src/modules/sessions/use-cases/authenticate-user/AuthenticateUserController.ts
async function AuthenticateUserController(req, res, next) {
  const requestSchema = import_zod2.z.object({
    name: import_zod2.z.string(),
    password: import_zod2.z.string().min(8)
  });
  try {
    const { name, password } = requestSchema.parse(req.body);
    const authenticateUserUseCase = import_tsyringe2.container.resolve(AuthenticateUserUseCase);
    const token = await authenticateUserUseCase.execute(name, password);
    const response = responseFactory({
      status: "successfully",
      code: 200,
      message: "Successful login.",
      data: {
        token
      }
    });
    return res.status(response.code).json(response);
  } catch (err) {
    HandleErrors(err, res);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthenticateUserController
});
