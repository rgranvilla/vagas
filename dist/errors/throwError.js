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

// src/errors/throwError.ts
var throwError_exports = {};
__export(throwError_exports, {
  throwError: () => throwError
});
module.exports = __toCommonJS(throwError_exports);
var import_zod = require("zod");

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

// src/errors/invalidCredentialsError.ts
var InvalidCredentialsError = class extends Error {
  constructor() {
    super("Invalid credentials.");
  }
};

// src/errors/resourceNotFoundError.ts
var ResourceNotFoundError = class extends Error {
  constructor(resource) {
    super(`Resource not found: ${resource}`);
    this.name = "ResourceNotFoundError";
  }
};

// src/errors/throwError.ts
function throwError(err, callback) {
  if (err instanceof import_zod.ZodError) {
    const error = {
      message: "Validation error.",
      issues: err.errors.map((error2) => ({
        field: error2.path.join("."),
        message: error2.message
      }))
    };
    return responseFactory({
      status: "validation_error",
      code: 400,
      message: "Validation Error",
      error
    });
  }
  if (err instanceof ResourceNotFoundError) {
    const response = responseFactory({
      status: "not_found",
      code: 404,
      message: err.message
    });
    return callback(response);
  }
  if (err instanceof InvalidCredentialsError) {
    const response = responseFactory({
      status: "conflict",
      code: 409,
      message: err.message
    });
    return callback(response);
  }
  throw err;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  throwError
});
