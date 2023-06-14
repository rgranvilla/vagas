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

// src/core/errors/UnauthorizedActionError.ts
var UnauthorizedActionError_exports = {};
__export(UnauthorizedActionError_exports, {
  UnauthorizedActionError: () => UnauthorizedActionError
});
module.exports = __toCommonJS(UnauthorizedActionError_exports);

// src/core/errors/AppError.ts
var AppError = class extends Error {
  constructor(message, statusCode = 400) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/core/errors/UnauthorizedActionError.ts
var UnauthorizedActionError = class extends AppError {
  constructor() {
    super("You are not authorized to perform this action.", 401);
    this.name = "unauthorized";
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UnauthorizedActionError
});
