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

// src/errors/errorHandler.ts
var errorHandler_exports = {};
__export(errorHandler_exports, {
  errorHandler: () => errorHandler
});
module.exports = __toCommonJS(errorHandler_exports);
var import_zod2 = require("zod");

// src/config/env.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["dev", "test", "production"]).default("dev"),
  API_BASE_URL: import_zod.z.string().default("http://localhost"),
  JWT_SECRET: import_zod.z.string(),
  PORT: import_zod.z.coerce.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("\u274C Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;

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

// src/errors/errorHandler.ts
function createValidationErrorResponse(error) {
  const err = {
    message: "Validation error.",
    issues: error.errors.map((error2) => ({
      field: error2.path.join("."),
      message: error2.message
    }))
  };
  return responseFactory({
    status: "validation_error",
    code: 400,
    message: "Validation Error",
    error: err
  });
}
function createServerErrorResponse(error) {
  return responseFactory({
    status: "server_error",
    code: 500,
    message: "Internal server error.",
    error
  });
}
function logError(error) {
  if (env.NODE_ENV !== "production") {
    console.error(error);
  }
}
function errorHandler(error, _req, res, next) {
  if (error instanceof import_zod2.ZodError) {
    console.log("AQUI");
    const response2 = createValidationErrorResponse(error);
    return res.status(response2.code).json(response2);
  }
  logError(error);
  if (env.NODE_ENV !== "production") {
    console.error(error);
  }
  const response = createServerErrorResponse(error);
  return res.status(response.code).send(response);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  errorHandler
});
