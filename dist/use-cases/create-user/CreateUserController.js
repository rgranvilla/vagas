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

// src/use-cases/create-user/CreateUserController.ts
var CreateUserController_exports = {};
__export(CreateUserController_exports, {
  CreateUserController: () => CreateUserController
});
module.exports = __toCommonJS(CreateUserController_exports);
var import_tsyringe2 = require("tsyringe");
var import_zod = require("zod");

// src/utils/passwordHashing.ts
var import_bcryptjs = require("bcryptjs");
async function passwordHashing(password) {
  const hashedPassword = await (0, import_bcryptjs.hash)(password, 6);
  return hashedPassword;
}

// src/use-cases/create-user/CreateUserUseCase.ts
var import_tsyringe = require("tsyringe");

// src/errors/AppError.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/use-cases/create-user/CreateUserUseCase.ts
var CreateUserUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(data) {
    const userAlreadyExist = await this.repository.userAlreadyExist(data.name);
    if (userAlreadyExist) {
      throw new AppError("User already exist!", 401);
    }
    const user = await this.repository.createUser(data);
    return user;
  }
};
CreateUserUseCase = __decorateClass([
  (0, import_tsyringe.injectable)(),
  __decorateParam(0, (0, import_tsyringe.inject)("Repository"))
], CreateUserUseCase);

// src/use-cases/create-user/CreateUserController.ts
async function CreateUserController(req, res, next) {
  const requestSchema = import_zod.z.object({
    name: import_zod.z.string(),
    password: import_zod.z.string().min(8),
    job: import_zod.z.string()
  });
  const { name, password, job } = requestSchema.parse(req.body);
  try {
    const createUserUseCase = import_tsyringe2.container.resolve(CreateUserUseCase);
    const createdUser = await createUserUseCase.execute({
      name,
      isAdmin: false,
      password: await passwordHashing(password),
      job
    });
    const response = {
      id: createdUser.id,
      name: createdUser.name,
      isAdmin: createdUser.isAdmin,
      job: createdUser.job,
      permissions: {
        canUpdate: createdUser.permissions.canUpdate,
        canDelete: createdUser.permissions.canDelete
      }
    };
    return res.status(201).send(response);
  } catch (err) {
    console.error("AQUI", err);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateUserController
});
