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

// src/use-cases/authenticate-user/AuthenticateUserController.ts
var AuthenticateUserController_exports = {};
__export(AuthenticateUserController_exports, {
  AuthenticateUserController: () => AuthenticateUserController
});
module.exports = __toCommonJS(AuthenticateUserController_exports);
var import_tsyringe2 = require("tsyringe");
var import_zod = require("zod");

// src/errors/AppError.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/factories/responseFactory.ts
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

// src/use-cases/authenticate-user/AuthenticateUserUseCase.ts
var import_bcryptjs = require("bcryptjs");
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_tsyringe = require("tsyringe");

// src/config/auth.ts
var auth_default = {
  secret_token: "cfe275a5908b5650488e0b0342c2d6cc",
  expires_in_token: "15m"
};

// src/use-cases/authenticate-user/AuthenticateUserUseCase.ts
var AuthenticateUserUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(name, password) {
    const user = await this.repository.getUser(name);
    const { secret_token, expires_in_token } = auth_default;
    if (!user) {
      throw new AppError("Invalid credentials.");
    }
    const passwordMatch = await (0, import_bcryptjs.compare)(password, user.password);
    if (!passwordMatch) {
      throw new AppError("Invalid credentials.");
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

// src/use-cases/authenticate-user/AuthenticateUserController.ts
async function AuthenticateUserController(req, res, next) {
  const requestSchema = import_zod.z.object({
    name: import_zod.z.string(),
    password: import_zod.z.string().min(8)
  });
  const { name, password } = requestSchema.parse(req.body);
  try {
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
    console.log(typeof err);
    if (err instanceof AppError)
      return res.status(err.statusCode).json(err.message);
    next();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthenticateUserController
});
