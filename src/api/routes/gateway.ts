import { Router } from "express";
import Gateway from "../../services/gateway";

const gatewayRoute = Router();
const gatewaysRoute = Router();

const gatewayInstance = new Gateway();
export default (app: Router) => {
  app.use("/gateway", gatewayRoute);
  app.use("/gateways", gatewaysRoute);

  // Create gateway
  gatewayRoute.post("/", async (req, res, next) => {
    try {
      const { body } = req;
      const response = await gatewayInstance.createGateway(body);
      res.status(201).json(response);
    } catch (error: any) {
      return next(error);
    }
  });

  // Get gateway by id
  gatewayRoute.get("/:id", (req, res) => {
    const { id } = req.params;
    res.send("Get Gateway!" + id);
  });

  // Get All Gateways
  gatewaysRoute.get("/", (req, res) => {
    res.send("Get all gateways!");
  });
};
