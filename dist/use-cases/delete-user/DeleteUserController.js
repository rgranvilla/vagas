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

// src/use-cases/delete-user/DeleteUserController.ts
var DeleteUserController_exports = {};
__export(DeleteUserController_exports, {
  DeleteUserController: () => DeleteUserController
});
module.exports = __toCommonJS(DeleteUserController_exports);
var import_tsyringe2 = require("tsyringe");
var import_zod = require("zod");

// src/use-cases/delete-user/DeleteUserUseCase.ts
var import_tsyringe = require("tsyringe");
var DeleteUserUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id) {
    await this.repository.deleteUser(id);
  }
};
DeleteUserUseCase = __decorateClass([
  (0, import_tsyringe.injectable)(),
  __decorateParam(0, (0, import_tsyringe.inject)("Repository"))
], DeleteUserUseCase);

// src/use-cases/delete-user/DeleteUserController.ts
async function DeleteUserController(req, res) {
  const requestSchema = import_zod.z.object({
    id: import_zod.z.coerce.number()
  });
  const { id } = requestSchema.parse(req.params);
  try {
    const deleteUserUseCase = import_tsyringe2.container.resolve(DeleteUserUseCase);
    await deleteUserUseCase.execute(id);
    return res.status(200).send({ message: `The user with id = ${id} was deleted successfully` });
  } catch (error) {
    console.error(error);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeleteUserController
});
