import "reflect-metadata";

import { container } from "tsyringe";

import { IDatabaseRepository } from "@database/IDatabaseRepository";
import { DatabaseRepository } from "./database";

container.registerSingleton<IDatabaseRepository>(
  "Repository",
  DatabaseRepository
);
