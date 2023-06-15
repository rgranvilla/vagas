import "reflect-metadata";

import app from "@app";
import { env } from "@config/env";

app.listen(env.PORT, function () {
  console.info(`🚀 HTTP Server Running on ${env.API_BASE_URL}:${env.PORT}`);
});
