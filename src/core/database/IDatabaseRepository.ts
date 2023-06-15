interface Permission {
  canUpdate: boolean;
  canDelete: boolean;
}

export interface User {
  id: number;
  name: string;
  password: string;
  isAdmin: boolean;
  permissions: Permission;
  job: string;
  [key: string]: string | number | Permission | boolean | undefined;
}

export interface UserDTO {
  name: string;
  password: string;
  isAdmin?: boolean;
  permissions?: {
    canUpdate: boolean;
    canDelete: boolean;
  };
  job: string;
}

export interface Metrics {
  id: number;
  readCount: number;
}

export abstract class IDatabaseRepository {
  abstract getUserById(id: number): Promise<User | null>;
  abstract getUser(name: string): Promise<User | null>;
  abstract getUsers(): Promise<User[] | null>;
  abstract getMetrics(): Promise<Metrics[] | null>;
  abstract userExist(name: string): Promise<boolean>;
  abstract createUser(data: UserDTO): Promise<User>;
  abstract updateUser(id: number, data: Partial<User>): Promise<User | null>;
  abstract updateUserPermissions(
    id: number,
    data: Partial<User>
  ): Promise<User | null>;
  abstract deleteUser(id: number): Promise<void>;
}
