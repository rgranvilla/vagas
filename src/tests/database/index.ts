import fs from "node:fs/promises";
import path from "node:path";

import {
  IDatabaseRepository,
  Metrics,
  User,
  UserDTO,
} from "@database/IDatabaseRepository";
import { ResourceNotFoundError } from "@errors/ResourceNotFoundError";

interface DatabaseData {
  users: User[];
  metrics: Metrics[];
}

export class DatabaseRepository implements IDatabaseRepository {
  private _database: DatabaseData = { users: [], metrics: [] };
  private _lastId: number = -1;

  constructor() {
    this._loadDatabase();
  }

  async open(): Promise<void> {
    const initialDBPath = path.join(__dirname, "./initialDB.json");

    try {
      await fs.access(initialDBPath);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        // Create the initialDB.json file with an empty database
        await fs.writeFile(
          initialDBPath,
          JSON.stringify({
            users: [
              {
                id: 0,
                name: "admin",
                isAdmin: true,
                password:
                  "$2a$06$JTkakiET1QKLLUQbDEpXs..VSuYpxcvWVnfS0hVuxxi6PvQz5U2uK",
                job: "Admin",
                permissions: { canUpdate: true, canDelete: true },
              },
            ],
            metrics: [],
          })
        );
      } else {
        throw error;
      }
    }

    const data = await fs.readFile(initialDBPath, "utf-8");
    this._database = JSON.parse(data || "{}") as DatabaseData;
    await this.persist();
  }

  async close(): Promise<void> {
    const initialDBPath = path.join(__dirname, "./initialDB.json");
    const initialDatabase: DatabaseData = {
      users: [
        {
          id: 0,
          name: "admin",
          isAdmin: true,
          password:
            "$2a$06$JTkakiET1QKLLUQbDEpXs..VSuYpxcvWVnfS0hVuxxi6PvQz5U2uK",
          job: "Admin",
          permissions: { canUpdate: true, canDelete: true },
        },
      ],
      metrics: [],
    };
    await fs.writeFile(initialDBPath, JSON.stringify(initialDatabase));
  }

  private async _loadDatabase(): Promise<void> {
    const databasePath = path.join(__dirname, "./db.json");

    try {
      const data = await fs.readFile(databasePath, "utf-8");
      this._database = JSON.parse(data) as DatabaseData;
      await this._updateLastId();
    } catch (error: any) {
      if (error.code === "ENOENT") {
        // Create the db.json file with an empty database
        this._database = { users: [], metrics: [] };
        await this.persist();
      } else {
        throw error;
      }
    }
  }

  private async persist(): Promise<void> {
    const databasePath = path.join(__dirname, "./db.json");
    try {
      await fs.writeFile(databasePath, JSON.stringify(this._database));
    } catch (error: any) {
      throw new Error(`Failed to persist the database: ${error.message}`);
    }
  }

  private _updateLastId(): void {
    const users = this._database.users;
    if (users.length > 0) {
      this._lastId = Math.max(...users.map((user) => user.id));
    } else {
      this._lastId = 0;
    }
  }

  private _autoIncrement(): number {
    return ++this._lastId;
  }

  private async _setUserMetrics(user: User): Promise<void> {
    const records = this._database.metrics ?? [];
    const userMetricIndex = records.findIndex((item) => item.id === user.id);

    if (userMetricIndex === -1) {
      this._database.metrics.push({
        id: user.id,
        readCount: 1,
      });
    } else {
      this._database.metrics[userMetricIndex].readCount += 1;
    }

    await this.persist();
  }

  async userExist(name: string): Promise<boolean> {
    await this._loadDatabase();

    const alreadyExist = this._database.users.find(
      (user) => user.name === name
    );

    if (!alreadyExist) return false;

    return true;
  }

  async getUserById(id: number): Promise<User | null> {
    await this._loadDatabase();

    const user = this._database.users.find((row) => row.id === id);

    if (!user) return null;

    return user;
  }

  async getUsers(): Promise<User[] | null> {
    await this._loadDatabase();

    const { users }: DatabaseData = this._database ?? [];

    if (users.length > 0) {
      users.forEach((user) => {
        this._setUserMetrics(user);
      });

      return users;
    }

    return null;
  }

  async getUser(name: string): Promise<User | null> {
    await this._loadDatabase();

    const user = this._database.users.find((row) => row.name === name);

    if (!user) return null;

    this._setUserMetrics(user);

    return user;
  }

  async getMetrics(): Promise<Metrics[] | null> {
    await this._loadDatabase();

    const { metrics }: DatabaseData = this._database ?? [];

    if (metrics.length > 0) {
      return metrics;
    }

    return null;
  }

  async createUser(data: UserDTO): Promise<User> {
    await this._loadDatabase();

    const user = {
      id: await this._autoIncrement(),
      ...data,
      isAdmin: false,
      permissions: {
        canUpdate: false,
        canDelete: false,
      },
    };

    if (Array.isArray(this._database.users)) {
      this._database.users.push(user);
    } else {
      this._database.users = [user];
    }

    await this.persist();

    return user;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User | null> {
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
            canDelete: rawData?.permissions.canDelete,
          },
          password: data.password ?? rawData?.password,
          job: data.job ?? rawData?.job,
        });

        await this.persist();

        return records[rowIndex];
      }
    }

    return null;
  }

  async updateUserPermissions(
    id: number,
    data: Partial<User>
  ): Promise<User | null> {
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
            canUpdate:
              data.permissions?.canUpdate ?? rawData?.permissions.canUpdate,
            canDelete:
              data.permissions?.canDelete ?? rawData?.permissions.canDelete,
          },
        });

        await this.persist();

        return records[rowIndex];
      }
    }

    return null;
  }

  async deleteUser(id: number): Promise<void> {
    await this._loadDatabase();

    const users = this._database.users;
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new ResourceNotFoundError();
    }

    users.splice(userIndex, 1);
    await this.persist();
  }
}
