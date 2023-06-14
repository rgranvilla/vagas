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

// src/modules/sessions/use-cases/authenticate-user/AuthenticateUserUseCase.ts
var AuthenticateUserUseCase_exports = {};
__export(AuthenticateUserUseCase_exports, {
  AuthenticateUserUseCase: () => AuthenticateUserUseCase
});
module.exports = __toCommonJS(AuthenticateUserUseCase_exports);

// src/config/auth.ts
var auth_default = {
  secret_token: "cfe275a5908b5650488e0b0342c2d6cc",
  expires_in_token: "15m"
};

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

// src/modules/sessions/use-cases/authenticate-user/AuthenticateUserUseCase.ts
var import_bcryptjs = require("bcryptjs");
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_tsyringe = require("tsyringe");
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthenticateUserUseCase
});
