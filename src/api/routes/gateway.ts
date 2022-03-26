import { Router } from "express";

const gatewayRoute = Router();
const gatewaysRoute = Router();

export default (app: Router) => {
  app.use("/gateway", gatewayRoute);
  app.use("/gateways", gatewaysRoute);

  // Create gateway
  gatewayRoute.post("/", (req, res) => {
    res.send("Create gateway!");
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
