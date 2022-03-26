import { Router } from "express";

const route = Router();

export default (app: Router) => {
  app.use("/device", route);

  route.get("/", (req, res) => {
    res.send("Hello World!");
  });
};
