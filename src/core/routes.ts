import { Request, Response, Router } from "express";

import { env } from "@config/env";

import { ensureAdmin } from "@middlewares/ensureAdmin";
import { ensureAuthenticated } from "@middlewares/ensureAuthenticated";
import { ensurePermissions } from "@middlewares/ensurePermission";

import { UpdateUserPermissionsController } from "@modules/admin/update-user-permissions/UpdateUserPermissionsController";
import { GetMetricsController } from "@modules/metrics/get-metrics/GetMetricsController";
import { AuthenticateUserController } from "@modules/sessions/use-cases/authenticate-user/AuthenticateUserController";
import { CreateUserController } from "@modules/users/use-cases/create-user/CreateUserController";
import { DeleteUserController } from "@modules/users/use-cases/delete-user/DeleteUserController";
import { GetUserController } from "@modules/users/use-cases/get-user/GetUserController";
import { GetUsersController } from "@modules/users/use-cases/get-users/GetUsersController";
import { UpdateUserController } from "@modules/users/use-cases/update-user/UpdateUserController";

const routes = Router();

routes.get("/", function (_req: Request, res: Response) {
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

export default routes;
