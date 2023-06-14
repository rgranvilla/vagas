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

// src/core/common-schemas/validationErrorSchema.ts
var validationErrorSchema_exports = {};
__export(validationErrorSchema_exports, {
  ValidationErrorSchema: () => ValidationErrorSchema
});
module.exports = __toCommonJS(validationErrorSchema_exports);
var ValidationErrorSchema = {
  description: "Validation Error",
  type: "object",
  properties: {
    status: {
      type: "string",
      example: "validation_error"
    },
    code: {
      type: "integer",
      format: "int32",
      example: 400
    },
    message: {
      type: "string",
      example: "Validation Error"
    },
    error: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Validation error."
        },
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              field: {
                type: "string",
                example: "email"
              },
              message: {
                type: "string",
                example: "Invalid email"
              }
            }
          }
        }
      }
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ValidationErrorSchema
});
