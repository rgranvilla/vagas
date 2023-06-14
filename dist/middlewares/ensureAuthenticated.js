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

// src/middlewares/ensureAuthenticated.ts
var ensureAuthenticated_exports = {};
__export(ensureAuthenticated_exports, {
  ensureAuthenticated: () => ensureAuthenticated
});
module.exports = __toCommonJS(ensureAuthenticated_exports);
var import_jsonwebtoken = require("jsonwebtoken");

// src/config/auth.ts
var auth_default = {
  secret_token: "cfe275a5908b5650488e0b0342c2d6cc",
  expires_in_token: "15m"
};

// src/middlewares/ensureAuthenticated.ts
async function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new Error("Token missing");
  }
  const [, token] = authHeader.split(" ");
  try {
    const { sub: userId } = (0, import_jsonwebtoken.verify)(token, auth_default.secret_token);
    request.user = {
      id: userId
    };
    next();
  } catch {
    return response.status(403).json({ error: "Invalid token!" });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ensureAuthenticated
});
