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

// src/use-cases/get-user/GetUserController.ts
var GetUserController_exports = {};
__export(GetUserController_exports, {
  GetUserController: () => GetUserController
});
module.exports = __toCommonJS(GetUserController_exports);
var import_tsyringe2 = require("tsyringe");
var import_zod = require("zod");

// src/use-cases/get-user/GetUserUseCase.ts
var import_tsyringe = require("tsyringe");
var GetUserUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(name) {
    const user = await this.repository.getUser(name);
    if (!user) {
      throw new Error("Resource not found!");
    }
    return user;
  }
};
GetUserUseCase = __decorateClass([
  (0, import_tsyringe.injectable)(),
  __decorateParam(0, (0, import_tsyringe.inject)("Repository"))
], GetUserUseCase);

// src/use-cases/get-user/GetUserController.ts
async function GetUserController(req, res) {
  const requestSchema = import_zod.z.object({
    name: import_zod.z.string()
  });
  const { name } = requestSchema.parse(req.body);
  try {
    const getUserUseCase = import_tsyringe2.container.resolve(GetUserUseCase);
    const user = await getUserUseCase.execute(name);
    const response = {
      id: user.id,
      name: user.name,
      isAdmin: user.isAdmin,
      permissions: {
        canUpdate: user.permissions.canUpdate,
        canDelete: user.permissions.canDelete
      },
      job: user.job
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(404).send({ message: "User not found!" });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetUserController
});
