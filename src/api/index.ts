import { Router } from "express";
import device from "./routes/device";
import gateway from "./routes/gateway";

export default () => {
  const app = Router();
  device(app);
  gateway(app);

  return app;
};
