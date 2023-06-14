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

// src/use-cases/update-user/UpdateUserController.ts
var UpdateUserController_exports = {};
__export(UpdateUserController_exports, {
  UpdateUserController: () => UpdateUserController
});
module.exports = __toCommonJS(UpdateUserController_exports);
var import_tsyringe2 = require("tsyringe");
var import_zod = require("zod");

// src/utils/passwordHashing.ts
var import_bcryptjs = require("bcryptjs");
async function passwordHashing(password) {
  const hashedPassword = await (0, import_bcryptjs.hash)(password, 6);
  return hashedPassword;
}

// src/use-cases/update-user/UpdateUserUseCase.ts
var import_tsyringe = require("tsyringe");
var UpdateUserUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id, data) {
    let canUpdate = false;
    if (data.name !== void 0) {
      const user2 = await this.repository.getUser(data.name);
      canUpdate = !!user2 && user2.id === id || !user2;
    }
    if (data.name && !canUpdate)
      throw new Error("User name already exists!");
    const user = await this.repository.updateUser(id, data);
    if (!user) {
      throw new Error("Resource not found!");
    }
    return user;
  }
};
UpdateUserUseCase = __decorateClass([
  (0, import_tsyringe.injectable)(),
  __decorateParam(0, (0, import_tsyringe.inject)("Repository"))
], UpdateUserUseCase);

// src/use-cases/update-user/UpdateUserController.ts
async function UpdateUserController(req, res) {
  const requestSchema = import_zod.z.object({
    name: import_zod.z.string().optional(),
    password: import_zod.z.string().min(8).optional(),
    job: import_zod.z.string().optional(),
    id: import_zod.z.coerce.number()
  });
  const requestUserSchema = import_zod.z.object({
    id: import_zod.coerce.number()
  });
  const { id: authenticatedUserId } = requestUserSchema.parse(req.user);
  const { id, name, password, job } = requestSchema.parse({
    ...req.params,
    ...req.body
  });
  const toUpdate = {
    name,
    password,
    job
  };
  if (toUpdate.password) {
    Object.assign(toUpdate, {
      ...toUpdate,
      password: await passwordHashing(toUpdate.password)
    });
  }
  try {
    if (id === authenticatedUserId) {
      const updateUserUseCase = import_tsyringe2.container.resolve(UpdateUserUseCase);
      const updatedUser = await updateUserUseCase.execute(id, toUpdate);
      const response = {
        id: updatedUser.id,
        name: updatedUser.name,
        isAdmin: updatedUser.isAdmin,
        job: updatedUser.job,
        permissions: {
          canUpdate: updatedUser.permissions.canUpdate,
          canDelete: updatedUser.permissions.canDelete
        }
      };
      return res.status(200).send(response);
    }
    throw new Error("You are not authorized to perform this action.");
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateUserController
});
