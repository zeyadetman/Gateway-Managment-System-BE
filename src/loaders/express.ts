import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import api from "../api";
import { AnyError } from "mongodb";

export default ({ app }: { app: express.Application }) => {
  app.use(cors());
  app.use(express.json());

  app.get("/", (req: Request, res: Response) => {
    res.send("Gateway Management API");
  });

  app.use("/api", api());

  app.use((req, res, next) => {
    const err: any = new Error("Not Found");
    err.status = 404;
    next(err);
  });

  app.use(
    (
      err: AnyError & { status: number },
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      if (err.name === "UnauthorizedError") {
        return res.status(err.status).send({ message: err.message }).end();
      }

      return res
        .status(err.status || 400)
        .json({
          errors: {
            message: err.message,
          },
        })
        .end();
    }
  );
};
