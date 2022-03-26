import express, { Express } from "express";
import config from "./config";

async function startServer() {
  const app: Express = express();

  /* eslint @typescript-eslint/no-var-requires: "off" */
  await require("./loaders").default({ expressApp: app });

  app.listen(config.port, () => {
    console.log(
      `⚡️[server]: Server is running at https://localhost:${config.port}`
    );
  });
}

startServer();
