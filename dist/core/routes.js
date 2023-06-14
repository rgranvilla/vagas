"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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

// src/core/routes.ts
var routes_exports = {};
__export(routes_exports, {
  default: () => routes_default
});
module.exports = __toCommonJS(routes_exports);
var import_express = require("express");

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

// src/core/database/index.ts
var import_promises = __toESM(require("fs/promises"));
var import_node_path = __toESM(require("path"));
var import_tsyringe = require("tsyringe");
var DatabaseRepository = class {
  constructor() {
    this._database = { users: [], metrics: [] };
    this._lastId = 0;
    this._loadDatabase();
  }
  async _loadDatabase() {
    const databasePath = import_node_path.default.join(__dirname, "./db.json");
    try {
      const data = await import_promises.default.readFile(databasePath, "utf-8");
      this._database = JSON.parse(data);
      this._updateLastId();
    } catch {
      this.persist();
    }
  }
  async persist() {
    const databasePath = import_node_path.default.join(__dirname, "./db.json");
    await import_promises.default.writeFile(databasePath, JSON.stringify(this._database));
  }
  _updateLastId() {
    const users = this._database.users;
    if (users.length > 0) {
      this._lastId = Math.max(...users.map((user) => user.id));
    } else {
      this._lastId = 0;
    }
  }
  _autoIncrement() {
    return this._lastId + 1;
  }
  async _setUserMetrics(user) {
    const records = this._database.metrics ?? [];
    const userMetricIndex = records.findIndex((item) => item.id === user.id);
    if (userMetricIndex === -1) {
      this._database.metrics.push({
        id: user.id,
        readCount: 1
      });
    } else {
      this._database.metrics[userMetricIndex].readCount += 1;
    }
    await this.persist();
  }
  async userExist(name) {
    await this._loadDatabase();
    const alreadyExist = this._database.users.find(
      (user) => user.name === name
    );
    if (!alreadyExist)
      return false;
    return true;
  }
  async getUserById(id) {
    await this._loadDatabase();
    const user = this._database.users.find((row) => row.id === id);
    if (!user)
      return null;
    return user;
  }
  async getUsers() {
    await this._loadDatabase();
    const { users } = this._database ?? [];
    if (users.length > 0) {
      users.forEach((user) => {
        this._setUserMetrics(user);
      });
      return users;
    }
    return null;
  }
  async getUser(name) {
    await this._loadDatabase();
    const user = this._database.users.find((row) => row.name === name);
    if (!user)
      return null;
    this._setUserMetrics(user);
    return user;
  }
  async getMetrics() {
    await this._loadDatabase();
    const { metrics } = this._database ?? [];
    if (metrics.length > 0) {
      return metrics;
    }
    return null;
  }
  async createUser(data) {
    await this._loadDatabase();
    const user = {
      id: this._autoIncrement(),
      ...data,
      isAdmin: false,
      permissions: {
        canUpdate: false,
        canDelete: false
      }
    };
    if (Array.isArray(this._database.users)) {
      this._database.users.push(user);
    } else {
      this._database.users = [user];
    }
    await this.persist();
    return user;
  }
  async updateUser(id, data) {
    await this._loadDatabase();
    const records = this._database.users;
    if (records.length > 0) {
      const rowIndex = records.findIndex((row) => row.id === id);
      const rawData = records.find((row) => row.id === id);
      if (rowIndex > -1) {
        Object.assign(records[rowIndex], {
          name: data.name ?? rawData?.name,
          isAdmin: rawData?.isAdmin,
          permissions: {
            canUpdate: rawData?.permissions.canUpdate,
            canDelete: rawData?.permissions.canDelete
          },
          password: data.password ?? rawData?.password,
          job: data.job ?? rawData?.job
        });
        await this.persist();
        return records[rowIndex];
      }
    }
    return null;
  }
  async updateUserPermissions(id, data) {
    await this._loadDatabase();
    const records = this._database.users;
    if (records.length > 0) {
      const rowIndex = records.findIndex((row) => row.id === id);
      const rawData = records.find((row) => row.id === id);
      if (rowIndex > -1) {
        Object.assign(records[rowIndex], {
          ...rawData,
          isAdmin: data.isAdmin ?? rawData?.isAdmin,
          permissions: {
            canUpdate: data.permissions?.canUpdate ?? rawData?.permissions.canUpdate,
            canDelete: data.permissions?.canDelete ?? rawData?.permissions.canDelete
          }
        });
        await this.persist();
        return records[rowIndex];
      }
    }
    return null;
  }
  async deleteUser(id) {
    await this._loadDatabase();
    const records = this._database.users;
    if (records) {
      const rowIndex = records.findIndex((row) => row.id === id);
      if (rowIndex > -1) {
        records.splice(rowIndex, 1);
        this.persist();
      }
    }
  }
};
DatabaseRepository = __decorateClass([
  (0, import_tsyringe.injectable)()
], DatabaseRepository);

// src/core/errors/HandleErrors.ts
var import_zod2 = require("zod");

// src/core/factories/responseFactory.ts
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

// src/core/errors/AppError.ts
var AppError = class extends Error {
  constructor(message, statusCode = 400) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/core/errors/InvalidCredentialsError.ts
var InvalidCredentialsError = class extends AppError {
  constructor() {
    super("Invalid credentials.", 401);
    this.name = "unauthorized";
  }
};

// src/core/errors/ResourceNotFoundError.ts
var ResourceNotFoundError = class extends AppError {
  constructor() {
    super(`Resource not found.`, 404);
    this.name = "not_found";
  }
};

// src/core/errors/TokenMissingError.ts
var TokenMissingError = class extends AppError {
  constructor() {
    super("Token missing.", 403);
    this.name = "forbidden";
  }
};

// src/core/errors/UnauthorizedActionError.ts
var UnauthorizedActionError = class extends AppError {
  constructor() {
    super("You are not authorized to perform this action.", 401);
    this.name = "unauthorized";
  }
};

// src/core/errors/UserNameAlreadyExistError.ts
var UserNameAlreadyExistError = class extends AppError {
  constructor() {
    super("User name already exist.", 409);
    this.name = "conflict";
  }
};

// src/core/errors/HandleErrors.ts
function HandleErrors(err, res) {
  if (err instanceof ResourceNotFoundError || err instanceof UserNameAlreadyExistError || err instanceof InvalidCredentialsError || err instanceof TokenMissingError || err instanceof UnauthorizedActionError) {
    const response2 = responseFactory({
      status: err.name,
      code: err.statusCode,
      message: err.message
    });
    return res.status(response2.code).json(response2);
  }
  if (err instanceof import_zod2.ZodError) {
    const zodErr = {
      message: "Validation error.",
      issues: err.errors.map((err2) => ({
        field: err2.path.join("."),
        message: err2.message
      }))
    };
    const response2 = responseFactory({
      status: "validation_error",
      code: 400,
      message: "Validation Error",
      error: zodErr
    });
    return res.status(response2.code).json(response2);
  }
  const response = responseFactory({
    status: "server_error",
    code: 500,
    message: "Internal server error.",
    error: err
  });
  return res.status(response.code).json(response);
}

// src/core/middlewares/ensureAdmin.ts
async function ensureAdmin(request, response, next) {
  const { id } = request.user;
  try {
    const repository = new DatabaseRepository();
    const user = await repository.getUserById(+id);
    if (!user?.isAdmin) {
      throw new UnauthorizedActionError();
    }
    return next();
  } catch (error) {
    HandleErrors(error, response);
  }
}

// src/core/middlewares/ensureAuthenticated.ts
var import_jsonwebtoken = require("jsonwebtoken");

// src/config/auth.ts
var auth_default = {
  secret_token: "cfe275a5908b5650488e0b0342c2d6cc",
  expires_in_token: "15m"
};

// src/core/middlewares/ensureAuthenticated.ts
async function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new TokenMissingError();
  }
  const [, token] = authHeader.split(" ");
  try {
    const { sub: userId } = (0, import_jsonwebtoken.verify)(token, auth_default.secret_token);
    request.user = {
      id: userId
    };
    next();
  } catch (error) {
    HandleErrors(error, response);
  }
}

// src/core/middlewares/ensurePermission.ts
async function ensurePermissions(request, response, next) {
  const { id } = request.user;
  try {
    const repository = new DatabaseRepository();
    const user = await repository.getUserById(+id);
    if (request.method === "PUT" && !user?.permissions.canUpdate) {
      throw new UnauthorizedActionError();
    }
    if (request.method === "DELETE" && !user?.permissions.canDelete) {
      throw new UnauthorizedActionError();
    }
    return next();
  } catch (error) {
    HandleErrors(error, response);
  }
}

// src/modules/admin/update-user-permissions/UpdateUserPermissionsController.ts
var import_tsyringe3 = require("tsyringe");
var import_zod3 = require("zod");

// src/modules/admin/update-user-permissions/UpdateUserPermissionsUseCase.ts
var import_tsyringe2 = require("tsyringe");
var UpdateUserPermissionsUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id, data, authenticatedUserId) {
    const { isAdmin } = await this.repository.getUserById(
      authenticatedUserId
    );
    if (!isAdmin)
      throw new UnauthorizedActionError();
    const user = await this.repository.updateUserPermissions(id, data);
    if (!user) {
      throw new ResourceNotFoundError();
    }
    return user;
  }
};
UpdateUserPermissionsUseCase = __decorateClass([
  (0, import_tsyringe2.injectable)(),
  __decorateParam(0, (0, import_tsyringe2.inject)("Repository"))
], UpdateUserPermissionsUseCase);

// src/modules/admin/update-user-permissions/UpdateUserPermissionsController.ts
async function UpdateUserPermissionsController(req, res) {
  const requestSchema = import_zod3.z.object({
    isAdmin: import_zod3.z.boolean().optional().default(false),
    canUpdate: import_zod3.z.boolean().optional().default(false),
    canDelete: import_zod3.z.boolean().optional().default(false),
    id: import_zod3.z.coerce.number()
  });
  const requestUserSchema = import_zod3.z.object({
    id: import_zod3.z.coerce.number()
  });
  try {
    const { id: authenticatedUserId } = requestUserSchema.parse(req.user);
    const { id, isAdmin, canUpdate, canDelete } = requestSchema.parse({
      ...req.params,
      ...req.body
    });
    const toUpdate = {
      isAdmin,
      permissions: {
        canUpdate: canUpdate ?? false,
        canDelete: canDelete ?? false
      }
    };
    const updateUserPermissionsUseCase = import_tsyringe3.container.resolve(
      UpdateUserPermissionsUseCase
    );
    const updatedUser = await updateUserPermissionsUseCase.execute(
      id,
      toUpdate,
      authenticatedUserId
    );
    const response = responseFactory({
      status: "successfully",
      code: 200,
      message: "",
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          isAdmin: updatedUser.isAdmin,
          job: updatedUser.job,
          permissions: {
            canUpdate: updatedUser.permissions.canUpdate,
            canDelete: updatedUser.permissions.canDelete
          }
        }
      }
    });
    return res.status(response.code).json(response);
  } catch (err) {
    HandleErrors(err, res);
  }
}

// src/modules/metrics/get-metrics/GetMetricsController.ts
var import_tsyringe5 = require("tsyringe");

// src/modules/metrics/get-metrics/GetMetricsUseCase.ts
var import_tsyringe4 = require("tsyringe");
var GetMetricsUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute() {
    const metrics = await this.repository.getMetrics();
    if (!metrics)
      return [];
    return metrics;
  }
};
GetMetricsUseCase = __decorateClass([
  (0, import_tsyringe4.injectable)(),
  __decorateParam(0, (0, import_tsyringe4.inject)("Repository"))
], GetMetricsUseCase);

// src/modules/metrics/get-metrics/GetMetricsController.ts
async function GetMetricsController(req, res) {
  try {
    const getMetricsUseCase = import_tsyringe5.container.resolve(GetMetricsUseCase);
    const metrics = await getMetricsUseCase.execute();
    const response = responseFactory({
      status: "successfully",
      code: 200,
      message: "Metrics retrieval successful.",
      data: {
        metrics
      }
    });
    return res.status(response.code).send(response);
  } catch (err) {
    HandleErrors(err, res);
  }
}

// src/modules/sessions/use-cases/authenticate-user/AuthenticateUserController.ts
var import_tsyringe7 = require("tsyringe");
var import_zod4 = require("zod");

// src/modules/sessions/use-cases/authenticate-user/AuthenticateUserUseCase.ts
var import_bcryptjs = require("bcryptjs");
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var import_tsyringe6 = require("tsyringe");
var AuthenticateUserUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(name, password) {
    const user = await this.repository.getUser(name);
    const { secret_token, expires_in_token } = auth_default;
    if (!user) {
      throw new InvalidCredentialsError();
    }
    const passwordMatch = await (0, import_bcryptjs.compare)(password, user.password);
    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }
    const token = import_jsonwebtoken2.default.sign({ isAdmin: user.isAdmin }, secret_token, {
      expiresIn: expires_in_token,
      subject: user.id.toString()
    });
    return token;
  }
};
AuthenticateUserUseCase = __decorateClass([
  (0, import_tsyringe6.injectable)(),
  __decorateParam(0, (0, import_tsyringe6.inject)("Repository"))
], AuthenticateUserUseCase);

// src/modules/sessions/use-cases/authenticate-user/AuthenticateUserController.ts
async function AuthenticateUserController(req, res, next) {
  const requestSchema = import_zod4.z.object({
    name: import_zod4.z.string(),
    password: import_zod4.z.string().min(8)
  });
  try {
    const { name, password } = requestSchema.parse(req.body);
    const authenticateUserUseCase = import_tsyringe7.container.resolve(AuthenticateUserUseCase);
    const token = await authenticateUserUseCase.execute(name, password);
    const response = responseFactory({
      status: "successfully",
      code: 200,
      message: "Successful login.",
      data: {
        token
      }
    });
    return res.status(response.code).json(response);
  } catch (err) {
    HandleErrors(err, res);
  }
}

// src/core/utils/passwordHashing.ts
var import_bcryptjs2 = require("bcryptjs");
async function passwordHashing(password) {
  const hashedPassword = await (0, import_bcryptjs2.hash)(password, 6);
  return hashedPassword;
}

// src/modules/users/use-cases/create-user/CreateUserController.ts
var import_tsyringe9 = require("tsyringe");
var import_zod5 = require("zod");

// src/modules/users/use-cases/create-user/CreateUserUseCase.ts
var import_tsyringe8 = require("tsyringe");
var CreateUserUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(data) {
    const userAlreadyExist = await this.repository.userExist(data.name);
    if (userAlreadyExist) {
      throw new UserNameAlreadyExistError();
    }
    const user = await this.repository.createUser(data);
    return user;
  }
};
CreateUserUseCase = __decorateClass([
  (0, import_tsyringe8.injectable)(),
  __decorateParam(0, (0, import_tsyringe8.inject)("Repository"))
], CreateUserUseCase);

// src/modules/users/use-cases/create-user/CreateUserController.ts
async function CreateUserController(req, res, next) {
  const requestSchema = import_zod5.z.object({
    name: import_zod5.z.string(),
    password: import_zod5.z.string().min(8),
    job: import_zod5.z.string()
  });
  try {
    const { name, password, job } = requestSchema.parse(req.body);
    const createUserUseCase = import_tsyringe9.container.resolve(CreateUserUseCase);
    const createdUser = await createUserUseCase.execute({
      name,
      isAdmin: false,
      password: await passwordHashing(password),
      job
    });
    const response = responseFactory({
      status: "successfully",
      code: 201,
      message: "User was created successfully.",
      data: {
        user: {
          id: createdUser.id,
          name: createdUser.name,
          isAdmin: createdUser.isAdmin,
          job: createdUser.job,
          permissions: {
            canUpdate: createdUser.permissions.canUpdate,
            canDelete: createdUser.permissions.canDelete
          }
        }
      }
    });
    return res.status(response.code).send(response);
  } catch (err) {
    HandleErrors(err, res);
  }
}

// src/modules/users/use-cases/delete-user/DeleteUserController.ts
var import_tsyringe11 = require("tsyringe");
var import_zod6 = require("zod");

// src/modules/users/use-cases/delete-user/DeleteUserUseCase.ts
var import_tsyringe10 = require("tsyringe");
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
  (0, import_tsyringe10.injectable)(),
  __decorateParam(0, (0, import_tsyringe10.inject)("Repository"))
], DeleteUserUseCase);

// src/modules/users/use-cases/delete-user/DeleteUserController.ts
async function DeleteUserController(req, res) {
  const requestSchema = import_zod6.z.object({
    id: import_zod6.z.coerce.number()
  });
  const { id } = requestSchema.parse(req.params);
  try {
    const deleteUserUseCase = import_tsyringe11.container.resolve(DeleteUserUseCase);
    await deleteUserUseCase.execute(id);
    const response = responseFactory({
      status: "successfully",
      code: 200,
      message: "User was deleted successfully."
    });
    return res.status(response.code).json(response);
  } catch (err) {
    HandleErrors(err, res);
  }
}

// src/modules/users/use-cases/get-user/GetUserController.ts
var import_tsyringe13 = require("tsyringe");
var import_zod7 = require("zod");

// src/modules/users/use-cases/get-user/GetUserUseCase.ts
var import_tsyringe12 = require("tsyringe");
var GetUserUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(name) {
    const user = await this.repository.getUser(name);
    if (!user) {
      throw new ResourceNotFoundError();
    }
    return user;
  }
};
GetUserUseCase = __decorateClass([
  (0, import_tsyringe12.injectable)(),
  __decorateParam(0, (0, import_tsyringe12.inject)("Repository"))
], GetUserUseCase);

// src/modules/users/use-cases/get-user/GetUserController.ts
async function GetUserController(req, res) {
  const requestSchema = import_zod7.z.object({
    name: import_zod7.z.string()
  });
  try {
    const { name } = requestSchema.parse(req.query);
    const getUserUseCase = import_tsyringe13.container.resolve(GetUserUseCase);
    const user = await getUserUseCase.execute(name);
    const response = responseFactory({
      status: "successfully",
      code: 200,
      message: "User retrieval successful.",
      data: {
        user: {
          id: user.id,
          name: user.name,
          isAdmin: user.isAdmin,
          permissions: {
            canUpdate: user.permissions.canUpdate,
            canDelete: user.permissions.canDelete
          },
          job: user.job
        }
      }
    });
    return res.status(response.code).json(response);
  } catch (err) {
    HandleErrors(err, res);
  }
}

// src/modules/users/use-cases/get-users/GetUsersController.ts
var import_tsyringe15 = require("tsyringe");

// src/modules/users/use-cases/get-users/GetUsersUseCase.ts
var import_tsyringe14 = require("tsyringe");
var GetUsersUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute() {
    const users = await this.repository.getUsers();
    if (!users)
      return [];
    return users;
  }
};
GetUsersUseCase = __decorateClass([
  (0, import_tsyringe14.injectable)(),
  __decorateParam(0, (0, import_tsyringe14.inject)("Repository"))
], GetUsersUseCase);

// src/modules/users/use-cases/get-users/GetUsersController.ts
async function GetUsersController(req, res) {
  try {
    const getUsersUseCase = import_tsyringe15.container.resolve(GetUsersUseCase);
    const result = await getUsersUseCase.execute();
    const users = result.map((user) => {
      const row = {
        id: user.id,
        name: user.name,
        isAdmin: user.isAdmin,
        permissions: {
          canUpdate: user.permissions.canUpdate,
          canDelete: user.permissions.canDelete
        },
        job: user.job
      };
      return row;
    });
    const response = responseFactory({
      status: "successfully",
      code: 200,
      message: "Users retrieval successful",
      data: {
        users
      }
    });
    return res.status(response.code).json(response);
  } catch (err) {
    HandleErrors(err, res);
  }
}

// src/modules/users/use-cases/update-user/UpdateUserController.ts
var import_tsyringe17 = require("tsyringe");
var import_zod8 = require("zod");

// src/modules/users/use-cases/update-user/UpdateUserUseCase.ts
var import_tsyringe16 = require("tsyringe");
var UpdateUserUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id, data, authenticatedUserId) {
    const { isAdmin } = await this.repository.getUserById(
      authenticatedUserId
    );
    if (id === authenticatedUserId || isAdmin) {
      let canUpdate = false;
      if (data.name !== void 0) {
        const user2 = await this.repository.getUser(data.name);
        canUpdate = !!user2 && user2.id === id || !user2;
      }
      if (data.name && !canUpdate) {
        throw new UserNameAlreadyExistError();
      }
      const user = await this.repository.updateUser(id, data);
      if (!user) {
        throw new ResourceNotFoundError();
      }
      return user;
    }
    throw new UnauthorizedActionError();
  }
};
UpdateUserUseCase = __decorateClass([
  (0, import_tsyringe16.injectable)(),
  __decorateParam(0, (0, import_tsyringe16.inject)("Repository"))
], UpdateUserUseCase);

// src/modules/users/use-cases/update-user/UpdateUserController.ts
async function UpdateUserController(req, res) {
  const requestSchema = import_zod8.z.object({
    name: import_zod8.z.string().optional(),
    password: import_zod8.z.string().min(8).optional(),
    job: import_zod8.z.string().optional(),
    id: import_zod8.z.coerce.number()
  });
  const requestUserSchema = import_zod8.z.object({
    id: import_zod8.coerce.number()
  });
  try {
    const { id: authenticatedUserId } = requestUserSchema.parse(req.user);
    const { id, name, password, job } = requestSchema.parse({
      ...req.params,
      ...req.body
    });
    const toUpdate = {
      name,
      password,
      job
    };
    if (toUpdate.password) {
      Object.assign(toUpdate, {
        ...toUpdate,
        password: await passwordHashing(toUpdate.password)
      });
    }
    const updateUserUseCase = import_tsyringe17.container.resolve(UpdateUserUseCase);
    const updatedUser = await updateUserUseCase.execute(
      id,
      toUpdate,
      authenticatedUserId
    );
    const response = responseFactory({
      status: "successfully",
      code: 200,
      message: "",
      data: {
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          isAdmin: updatedUser.isAdmin,
          job: updatedUser.job,
          permissions: {
            canUpdate: updatedUser.permissions.canUpdate,
            canDelete: updatedUser.permissions.canDelete
          }
        }
      }
    });
    return res.status(response.code).json(response);
  } catch (err) {
    HandleErrors(err, res);
  }
}

// src/core/routes.ts
var routes = (0, import_express.Router)();
routes.get("/", function(req, res) {
  res.send(`
  Welcome to API do Processo Seletivo da SCF Brasil </br>
  </br>
  Access API Documentation: <a href="${env.API_BASE_URL}:${env.PORT}/api-docs">${env.API_BASE_URL}:${env.PORT}/api-docs</a> </br>
  `);
});
routes.get("/user", GetUserController);
routes.get("/users", GetUsersController);
routes.post("/users", CreateUserController);
routes.delete(
  "/users/:id",
  ensureAuthenticated,
  ensurePermissions,
  DeleteUserController
);
routes.put(
  "/users/:id",
  ensureAuthenticated,
  ensurePermissions,
  UpdateUserController
);
routes.get("/metrics", GetMetricsController);
routes.put(
  "/admin/users/:id",
  ensureAuthenticated,
  ensureAdmin,
  ensurePermissions,
  UpdateUserPermissionsController
);
routes.post("/sessions", AuthenticateUserController);
var routes_default = routes;
