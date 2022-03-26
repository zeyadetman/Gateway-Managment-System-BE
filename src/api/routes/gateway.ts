import { Router } from "express";

const route = Router();

export default (app: Router) => {
  app.use("/gateway", route);

  route.get("/", (req, res) => {
    res.send("Get Gateway!");
  });

  route.post("/", (req, res) => {
    res.send("Create gateway!");
  });
};
