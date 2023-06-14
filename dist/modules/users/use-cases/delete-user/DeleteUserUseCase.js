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

// src/modules/users/use-cases/delete-user/DeleteUserUseCase.ts
var DeleteUserUseCase_exports = {};
__export(DeleteUserUseCase_exports, {
  DeleteUserUseCase: () => DeleteUserUseCase
});
module.exports = __toCommonJS(DeleteUserUseCase_exports);

// src/core/errors/AppError.ts
var AppError = class extends Error {
  constructor(message, statusCode = 400) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/core/errors/ResourceNotFoundError.ts
var ResourceNotFoundError = class extends AppError {
  constructor() {
    super(`Resource not found.`, 404);
    this.name = "not_found";
  }
};

// src/modules/users/use-cases/delete-user/DeleteUserUseCase.ts
var import_tsyringe = require("tsyringe");
var DeleteUserUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id) {
    const userExist = !!await this.repository.getUserById(id);
    if (!userExist) {
      throw new ResourceNotFoundError();
    }
    await this.repository.deleteUser(id);
  }
};
DeleteUserUseCase = __decorateClass([
  (0, import_tsyringe.injectable)(),
  __decorateParam(0, (0, import_tsyringe.inject)("Repository"))
], DeleteUserUseCase);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeleteUserUseCase
});
