import { Router } from "express";
import Gateway from "../../services/gateway";
import { PER_PAGE } from "../../utils/helpers";

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

  // Get gateway by serial number
  gatewayRoute.get("/:serial_number", async (req, res, next) => {
    try {
      const { serial_number } = req.params;
      const response = await gatewayInstance.getGatewayBySerialNumber(
        serial_number
      );
      if (response) {
        res.status(200).json(response);
      } else {
        return next({ status: 404, message: "Gateway not found" });
      }
    } catch (error: any) {
      return next(error);
    }
  });

  // Get All Gateways
  gatewaysRoute.get("/", async (req, res, next) => {
    try {
      const page: number = Number(req.query.page) || 1;
      const limit: number = Number(req.query.limit) || PER_PAGE;
      const response = await gatewayInstance.getAllGateways(page, limit);
      res.status(200).json(response);
    } catch (error: any) {
      return next(error);
    }
  });
};
