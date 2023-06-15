import { Express } from "express";
import request from "supertest";

import { IDatabaseRepository } from "@database/IDatabaseRepository";
import { passwordHashing } from "@utils/passwordHashing";

interface OverrideProps {
  name: string;
  password: string;
  job: string;
}

interface CreateAndAuthenticateUserProps {
  app: Express;
  repo: IDatabaseRepository;
  override?: OverrideProps;
  isAdmin?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

interface Result {
  id: number;
  token: string;
}

export async function CreateAndAuthenticateUser({
  app,
  repo,
  override,
  isAdmin = false,
  canUpdate = false,
  canDelete = false,
}: CreateAndAuthenticateUserProps): Promise<Result> {
  const createdUser = await repo.createUser({
    name: override?.name ?? "John Doe",
    password: override?.password
      ? await passwordHashing(override?.password)
      : await passwordHashing("12345678"),
    job: override?.job ?? "Tester",
  });

  const userId = createdUser.id;
  const userName = createdUser.name;

  await repo.updateUserPermissions(userId, {
    isAdmin,
    permissions: {
      canUpdate,
      canDelete,
    },
  });

  const loggedUser = await request(app)
    .post("/sessions")
    .send({
      name: userName,
      password: override?.password ?? "12345678",
    });

  const result = {
    id: userId,
    token: loggedUser.body.data.token,
  };

  return result;
}
