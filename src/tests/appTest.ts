import "reflect-metadata";

import express from "express";
import swaggerUi from "swagger-ui-express";

import "./containerTest";

import routes from "@routes/*";
import swaggerFile from "../swagger.json";

const app = express();

app.set("view engine", "jade");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/", routes);

export default app;
