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

// src/core/utils/passwordHashing.ts
var passwordHashing_exports = {};
__export(passwordHashing_exports, {
  passwordHashing: () => passwordHashing
});
module.exports = __toCommonJS(passwordHashing_exports);
var import_bcryptjs = require("bcryptjs");
async function passwordHashing(password) {
  const hashedPassword = await (0, import_bcryptjs.hash)(password, 6);
  return hashedPassword;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  passwordHashing
});
