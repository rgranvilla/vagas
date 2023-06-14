"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
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

// src/core/errors/AppError.ts
var AppError = class extends Error {
  constructor(message, statusCode = 400) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
};

// src/core/errors/UserNameAlreadyExistError.ts
var UserNameAlreadyExistError = class extends AppError {
  constructor() {
    super("User name already exist.", 409);
    this.name = "conflict";
  }
};

// src/modules/users/use-cases/create-user/CreateUserUseCase.spec.ts
var import_tsyringe2 = require("tsyringe");

// src/modules/users/use-cases/create-user/CreateUserUseCase.ts
var import_tsyringe = require("tsyringe");
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
  (0, import_tsyringe.injectable)(),
  __decorateParam(0, (0, import_tsyringe.inject)("Repository"))
], CreateUserUseCase);

// src/modules/users/use-cases/create-user/CreateUserUseCase.spec.ts
describe("CreateUserUseCase", () => {
  let createUserUseCase;
  let databaseRepository;
  beforeEach(() => {
    databaseRepository = import_tsyringe2.container.resolve("Repository");
    createUserUseCase = new CreateUserUseCase(databaseRepository);
  });
  it("Deve criar um novo usu\xE1rio", async () => {
    const userDTO = {
      name: "john_doe",
      password: "password",
      isAdmin: false,
      permissions: {
        canUpdate: true,
        canDelete: false
      },
      job: "Developer"
    };
    const createdUser = await createUserUseCase.execute(userDTO);
    expect(createdUser).toBeDefined();
    expect(createdUser.id).toBeDefined();
    expect(createdUser.name).toBe(userDTO.name);
    expect(createdUser.password).toBe(userDTO.password);
    expect(createdUser.isAdmin).toBe(userDTO.isAdmin);
    expect(createdUser.permissions).toEqual(userDTO.permissions);
    expect(createdUser.job).toBe(userDTO.job);
  });
  it("Deve lan\xE7ar um erro se o nome de usu\xE1rio j\xE1 existir", async () => {
    const userDTO = {
      name: "john_doe",
      password: "password",
      isAdmin: false,
      permissions: {
        canUpdate: true,
        canDelete: false
      },
      job: "Developer"
    };
    await databaseRepository.createUser(userDTO);
    await expect(createUserUseCase.execute(userDTO)).rejects.toThrow(
      UserNameAlreadyExistError
    );
  });
});
