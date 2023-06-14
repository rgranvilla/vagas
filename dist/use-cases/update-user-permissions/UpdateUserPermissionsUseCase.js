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

// src/use-cases/update-user-permissions/UpdateUserPermissionsUseCase.ts
var UpdateUserPermissionsUseCase_exports = {};
__export(UpdateUserPermissionsUseCase_exports, {
  UpdateUserPermissionsUseCase: () => UpdateUserPermissionsUseCase
});
module.exports = __toCommonJS(UpdateUserPermissionsUseCase_exports);
var import_tsyringe = require("tsyringe");
var UpdateUserPermissionsUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id, data, authenticatedUserId) {
    const { isAdmin } = await this.repository.getUserById(
      authenticatedUserId
    );
    if (!isAdmin)
      throw new Error("You are not authorized to perform this action.");
    const user = await this.repository.updateUserPermissions(id, data);
    if (!user) {
      throw new Error("Resource not found!");
    }
    return user;
  }
};
UpdateUserPermissionsUseCase = __decorateClass([
  (0, import_tsyringe.injectable)(),
  __decorateParam(0, (0, import_tsyringe.inject)("Repository"))
], UpdateUserPermissionsUseCase);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateUserPermissionsUseCase
});
