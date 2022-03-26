import { Router } from "express";

const deviceRoute = Router();
const devicesRoute = Router();

export default (app: Router) => {
  app.use("/device", deviceRoute);
  app.use("/devices", devicesRoute);

  // Create device
  deviceRoute.post("/", (req, res) => {
    res.send("Create device!");
  });

  // Get device by id
  deviceRoute.get("/:id", (req, res) => {
    const { id } = req.params;
    res.send("Get device!" + id);
  });

  // Update device by id
  deviceRoute.patch("/:id", (req, res) => {
    const { id } = req.params;
    res.send("Update device!" + id);
  });

  // Delete device by id
  deviceRoute.delete("/:id", (req, res) => {
    const { id } = req.params;
    res.send("Delete device!" + id);
  });

  // Get all devices
  devicesRoute.get("/", (req, res) => {
    res.send("Get all devices!");
  });

  // Get all devices by gateway id
  devicesRoute.get("/:id", (req, res) => {
    const { id } = req.params;
    res.send("Get devices by gatway id!" + id);
  });
};
