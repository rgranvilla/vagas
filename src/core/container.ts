import { container } from "tsyringe";

import { DatabaseRepository } from "@database";
import { IDatabaseRepository } from "./database/IDatabaseRepository";

container.registerSingleton<IDatabaseRepository>(
  "Repository",
  DatabaseRepository
);
