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

// src/infra/database/index.ts
var database_exports = {};
__export(database_exports, {
  DatabaseRepository: () => DatabaseRepository,
  IDatabaseRepository: () => IDatabaseRepository
});
module.exports = __toCommonJS(database_exports);
var import_promises = __toESM(require("fs/promises"));
var import_node_path = __toESM(require("path"));
var import_tsyringe = require("tsyringe");
var IDatabaseRepository = class {
};
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DatabaseRepository,
  IDatabaseRepository
});
