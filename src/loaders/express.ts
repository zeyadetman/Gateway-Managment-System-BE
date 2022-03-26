import express, { Request, Response } from "express";
import cors from "cors";
import api from "../api";

export default ({ app }: { app: express.Application }) => {
  app.use(cors());
  app.use(express.json());

  app.get("/", (req: Request, res: Response) => {
    res.send("Gateway Management API");
  });

  app.use("/api", api());
};
