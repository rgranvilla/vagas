import bodyParser from "body-parser";
import express from "express";
import "reflect-metadata";
import "./container";
import routes from "./routes";

import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger.json";

const app = express();

app.set("view engine", "jade");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/", routes);

export default app;
