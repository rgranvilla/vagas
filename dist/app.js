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

// src/app.ts
var app_exports = {};
__export(app_exports, {
  default: () => app_default
});
module.exports = __toCommonJS(app_exports);
var import_body_parser = __toESM(require("body-parser"));
var import_express2 = __toESM(require("express"));
var import_reflect_metadata = require("reflect-metadata");

// src/container.ts
var import_tsyringe2 = require("tsyringe");

// src/infra/database/index.ts
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
  async userAlreadyExist(name) {
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

// src/container.ts
import_tsyringe2.container.registerSingleton(
  "Repository",
  DatabaseRepository
);

// src/routes.ts
var import_express = require("express");

// src/middlewares/ensureAdmin.ts
async function ensureAdmin(request, response, next) {
  const { id } = request.user;
  try {
    const repository = new DatabaseRepository();
    const user = await repository.getUserById(+id);
    if (!user?.isAdmin) {
      throw new Error("You are not authorized to perform this action.");
    }
    return next();
  } catch (error) {
    return response.status(403).json({ error: error.message });
  }
}

// src/middlewares/ensureAuthenticated.ts
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

// src/middlewares/ensurePermission.ts
async function ensurePermissions(request, response, next) {
  const { id } = request.user;
  try {
    const repository = new DatabaseRepository();
    const user = await repository.getUserById(+id);
    if (request.method === "PUT" && !user?.permissions.canUpdate) {
      throw new Error("You are not authorized to perform this action.");
    }
    if (request.method === "DELETE" && !user?.permissions.canDelete) {
      throw new Error("You are not authorized to perform this action.");
    }
    return next();
  } catch (error) {
    return response.status(403).json({ error: error.message });
  }
}

// src/use-cases/authenticate-user/AuthenticateUserController.ts
var import_tsyringe4 = require("tsyringe");
var import_zod = require("zod");

// src/errors/AppError.ts
var AppError = class {
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
};

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

// src/use-cases/authenticate-user/AuthenticateUserUseCase.ts
var import_bcryptjs = require("bcryptjs");
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var import_tsyringe3 = require("tsyringe");
var AuthenticateUserUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(name, password) {
    const user = await this.repository.getUser(name);
    const { secret_token, expires_in_token } = auth_default;
    if (!user) {
      throw new AppError("Invalid credentials.");
    }
    const passwordMatch = await (0, import_bcryptjs.compare)(password, user.password);
    if (!passwordMatch) {
      throw new AppError("Invalid credentials.");
    }
    const token = import_jsonwebtoken2.default.sign({ isAdmin: user.isAdmin }, secret_token, {
      expiresIn: expires_in_token,
      subject: user.id.toString()
    });
    return token;
  }
};
AuthenticateUserUseCase = __decorateClass([
  (0, import_tsyringe3.injectable)(),
  __decorateParam(0, (0, import_tsyringe3.inject)("Repository"))
], AuthenticateUserUseCase);

// src/use-cases/authenticate-user/AuthenticateUserController.ts
async function AuthenticateUserController(req, res, next) {
  const requestSchema = import_zod.z.object({
    name: import_zod.z.string(),
    password: import_zod.z.string().min(8)
  });
  const { name, password } = requestSchema.parse(req.body);
  try {
    const authenticateUserUseCase = import_tsyringe4.container.resolve(AuthenticateUserUseCase);
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
    console.log(typeof err);
    if (err instanceof AppError)
      return res.status(err.statusCode).json(err.message);
    next();
  }
}

// src/use-cases/create-user/CreateUserController.ts
var import_tsyringe6 = require("tsyringe");
var import_zod2 = require("zod");

// src/utils/passwordHashing.ts
var import_bcryptjs2 = require("bcryptjs");
async function passwordHashing(password) {
  const hashedPassword = await (0, import_bcryptjs2.hash)(password, 6);
  return hashedPassword;
}

// src/use-cases/create-user/CreateUserUseCase.ts
var import_tsyringe5 = require("tsyringe");
var CreateUserUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(data) {
    const userAlreadyExist = await this.repository.userAlreadyExist(data.name);
    if (userAlreadyExist) {
      throw new AppError("User already exist!", 401);
    }
    const user = await this.repository.createUser(data);
    return user;
  }
};
CreateUserUseCase = __decorateClass([
  (0, import_tsyringe5.injectable)(),
  __decorateParam(0, (0, import_tsyringe5.inject)("Repository"))
], CreateUserUseCase);

// src/use-cases/create-user/CreateUserController.ts
async function CreateUserController(req, res, next) {
  const requestSchema = import_zod2.z.object({
    name: import_zod2.z.string(),
    password: import_zod2.z.string().min(8),
    job: import_zod2.z.string()
  });
  const { name, password, job } = requestSchema.parse(req.body);
  try {
    const createUserUseCase = import_tsyringe6.container.resolve(CreateUserUseCase);
    const createdUser = await createUserUseCase.execute({
      name,
      isAdmin: false,
      password: await passwordHashing(password),
      job
    });
    const response = {
      id: createdUser.id,
      name: createdUser.name,
      isAdmin: createdUser.isAdmin,
      job: createdUser.job,
      permissions: {
        canUpdate: createdUser.permissions.canUpdate,
        canDelete: createdUser.permissions.canDelete
      }
    };
    return res.status(201).send(response);
  } catch (err) {
    console.error("AQUI", err);
  }
}

// src/use-cases/delete-user/DeleteUserController.ts
var import_tsyringe8 = require("tsyringe");
var import_zod3 = require("zod");

// src/use-cases/delete-user/DeleteUserUseCase.ts
var import_tsyringe7 = require("tsyringe");
var DeleteUserUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id) {
    await this.repository.deleteUser(id);
  }
};
DeleteUserUseCase = __decorateClass([
  (0, import_tsyringe7.injectable)(),
  __decorateParam(0, (0, import_tsyringe7.inject)("Repository"))
], DeleteUserUseCase);

// src/use-cases/delete-user/DeleteUserController.ts
async function DeleteUserController(req, res) {
  const requestSchema = import_zod3.z.object({
    id: import_zod3.z.coerce.number()
  });
  const { id } = requestSchema.parse(req.params);
  try {
    const deleteUserUseCase = import_tsyringe8.container.resolve(DeleteUserUseCase);
    await deleteUserUseCase.execute(id);
    return res.status(200).send({ message: `The user with id = ${id} was deleted successfully` });
  } catch (error) {
    console.error(error);
  }
}

// src/use-cases/get-metrics/GetMetricsController.ts
var import_tsyringe10 = require("tsyringe");

// src/use-cases/get-metrics/GetMetricsUseCase.ts
var import_tsyringe9 = require("tsyringe");
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
  (0, import_tsyringe9.injectable)(),
  __decorateParam(0, (0, import_tsyringe9.inject)("Repository"))
], GetMetricsUseCase);

// src/use-cases/get-metrics/GetMetricsController.ts
async function GetMetricsController(req, res) {
  try {
    const getMetricsUseCase = import_tsyringe10.container.resolve(GetMetricsUseCase);
    const metrics = await getMetricsUseCase.execute();
    return res.status(200).send(metrics);
  } catch (error) {
    console.error(error);
  }
}

// src/use-cases/get-user/GetUserController.ts
var import_tsyringe12 = require("tsyringe");
var import_zod4 = require("zod");

// src/use-cases/get-user/GetUserUseCase.ts
var import_tsyringe11 = require("tsyringe");
var GetUserUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(name) {
    const user = await this.repository.getUser(name);
    if (!user) {
      throw new Error("Resource not found!");
    }
    return user;
  }
};
GetUserUseCase = __decorateClass([
  (0, import_tsyringe11.injectable)(),
  __decorateParam(0, (0, import_tsyringe11.inject)("Repository"))
], GetUserUseCase);

// src/use-cases/get-user/GetUserController.ts
async function GetUserController(req, res) {
  const requestSchema = import_zod4.z.object({
    name: import_zod4.z.string()
  });
  const { name } = requestSchema.parse(req.body);
  try {
    const getUserUseCase = import_tsyringe12.container.resolve(GetUserUseCase);
    const user = await getUserUseCase.execute(name);
    const response = {
      id: user.id,
      name: user.name,
      isAdmin: user.isAdmin,
      permissions: {
        canUpdate: user.permissions.canUpdate,
        canDelete: user.permissions.canDelete
      },
      job: user.job
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(404).send({ message: "User not found!" });
  }
}

// src/use-cases/get-users/GetUsersController.ts
var import_tsyringe14 = require("tsyringe");

// src/use-cases/get-users/GetUsersUseCase.ts
var import_tsyringe13 = require("tsyringe");
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
  (0, import_tsyringe13.injectable)(),
  __decorateParam(0, (0, import_tsyringe13.inject)("Repository"))
], GetUsersUseCase);

// src/use-cases/get-users/GetUsersController.ts
async function GetUsersController(req, res) {
  try {
    const getUsersUseCase = import_tsyringe14.container.resolve(GetUsersUseCase);
    const users = await getUsersUseCase.execute();
    const response = users.map((user) => {
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
    return res.status(200).send(response);
  } catch (error) {
    console.error(error);
  }
}

// src/use-cases/update-user-permissions/UpdateUserPermissionsController.ts
var import_tsyringe16 = require("tsyringe");
var import_zod5 = require("zod");

// src/use-cases/update-user-permissions/UpdateUserPermissionsUseCase.ts
var import_tsyringe15 = require("tsyringe");
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
  (0, import_tsyringe15.injectable)(),
  __decorateParam(0, (0, import_tsyringe15.inject)("Repository"))
], UpdateUserPermissionsUseCase);

// src/use-cases/update-user-permissions/UpdateUserPermissionsController.ts
async function UpdateUserPermissionsController(req, res) {
  const requestSchema = import_zod5.z.object({
    isAdmin: import_zod5.z.boolean(),
    canUpdate: import_zod5.z.boolean(),
    canDelete: import_zod5.z.boolean(),
    id: import_zod5.z.coerce.number()
  });
  const requestUserSchema = import_zod5.z.object({
    id: import_zod5.z.coerce.number()
  });
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
  try {
    const updateUserPermissionsUseCase = import_tsyringe16.container.resolve(
      UpdateUserPermissionsUseCase
    );
    const updatedUser = await updateUserPermissionsUseCase.execute(
      id,
      toUpdate,
      authenticatedUserId
    );
    const response = {
      id: updatedUser.id,
      name: updatedUser.name,
      isAdmin: updatedUser.isAdmin,
      job: updatedUser.job,
      permissions: {
        canUpdate: updatedUser.permissions.canUpdate,
        canDelete: updatedUser.permissions.canDelete
      }
    };
    return res.status(200).send(response);
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
}

// src/use-cases/update-user/UpdateUserController.ts
var import_tsyringe18 = require("tsyringe");
var import_zod6 = require("zod");

// src/use-cases/update-user/UpdateUserUseCase.ts
var import_tsyringe17 = require("tsyringe");
var UpdateUserUseCase = class {
  constructor(repository) {
    this.repository = repository;
  }
  async execute(id, data) {
    let canUpdate = false;
    if (data.name !== void 0) {
      const user2 = await this.repository.getUser(data.name);
      canUpdate = !!user2 && user2.id === id || !user2;
    }
    if (data.name && !canUpdate)
      throw new Error("User name already exists!");
    const user = await this.repository.updateUser(id, data);
    if (!user) {
      throw new Error("Resource not found!");
    }
    return user;
  }
};
UpdateUserUseCase = __decorateClass([
  (0, import_tsyringe17.injectable)(),
  __decorateParam(0, (0, import_tsyringe17.inject)("Repository"))
], UpdateUserUseCase);

// src/use-cases/update-user/UpdateUserController.ts
async function UpdateUserController(req, res) {
  const requestSchema = import_zod6.z.object({
    name: import_zod6.z.string().optional(),
    password: import_zod6.z.string().min(8).optional(),
    job: import_zod6.z.string().optional(),
    id: import_zod6.z.coerce.number()
  });
  const requestUserSchema = import_zod6.z.object({
    id: import_zod6.coerce.number()
  });
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
  try {
    if (id === authenticatedUserId) {
      const updateUserUseCase = import_tsyringe18.container.resolve(UpdateUserUseCase);
      const updatedUser = await updateUserUseCase.execute(id, toUpdate);
      const response = {
        id: updatedUser.id,
        name: updatedUser.name,
        isAdmin: updatedUser.isAdmin,
        job: updatedUser.job,
        permissions: {
          canUpdate: updatedUser.permissions.canUpdate,
          canDelete: updatedUser.permissions.canDelete
        }
      };
      return res.status(200).send(response);
    }
    throw new Error("You are not authorized to perform this action.");
  } catch (error) {
    return res.status(401).send({ message: error.message });
  }
}

// src/routes.ts
var routes = (0, import_express.Router)();
routes.get("/", function(req, res) {
  res.send(`get user/ </br>
  get users/ </br>
  post users/ </br>
  delete users/ </br>
  put users/ </br>
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
routes.get("/users/access", GetMetricsController);
routes.put(
  "/admin/users/:id",
  ensureAuthenticated,
  ensureAdmin,
  ensurePermissions,
  UpdateUserPermissionsController
);
routes.post("/sessions", AuthenticateUserController);
var routes_default = routes;

// src/app.ts
var app = (0, import_express2.default)();
app.set("view engine", "jade");
app.use(import_express2.default.json());
app.use(import_express2.default.urlencoded({ extended: true }));
app.use(import_body_parser.default.json());
app.use(import_body_parser.default.urlencoded({ extended: true }));
app.use(import_express2.default.static(__dirname + "/public"));
app.use("/", routes_default);
var app_default = app;
