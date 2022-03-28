import { Router } from "express";
import Device from "../../services/device";
import { PER_PAGE } from "../../utils/helpers";

const deviceRoute = Router();
const devicesRoute = Router();

export default (app: Router) => {
  app.use("/device", deviceRoute);
  app.use("/devices", devicesRoute);

  const deviceInstance = new Device();
  // Create device
  deviceRoute.post("/", async (req, res, next) => {
    try {
      const { body } = req;
      const response = await deviceInstance.createDevice(body, next);
      res.status(201).json(response);
    } catch (error: any) {
      return next(error);
    }
  });

  // Get device by uid
  deviceRoute.get("/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const response = await deviceInstance.getDeviceById(id);
      if (response) {
        res.status(200).json(response);
      } else {
        return next({ status: 404, message: "Device not found" });
      }
    } catch (error: any) {
      return next(error);
    }
  });

  // Update device by id
  deviceRoute.patch("/:id", (req, res) => {
    const { id } = req.params;
    res.send("Update device!" + id);
  });

  // Delete device by id
  deviceRoute.delete("/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      await deviceInstance.deleteDeviceById(id);
      return res.status(200).json({ message: "Removed Successfully" });
    } catch (error: any) {
      return next(error);
    }
  });

  // Get all devices
  devicesRoute.get("/", async (req, res, next) => {
    try {
      const page: number = Number(req.query.page) || 1;
      const limit: number = Number(req.query.limit) || PER_PAGE;
      const response = await deviceInstance.getAllDevices(page, limit);
      res.send(response);
    } catch (error: any) {
      return next(error);
    }
  });

  // Get all devices by gateway id
  devicesRoute.get("/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const response = await deviceInstance.getDevicesByGatewayId(id);
      res.status(200).json(response);
    } catch (error: any) {
      return next(error);
    }
  });
};
