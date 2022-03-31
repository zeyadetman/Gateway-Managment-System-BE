import { IDevice, IDeviceInputDTO } from "../interfaces/IDevice";
import {
  deviceDTOValidationSchema,
  deviceValidationSchema,
} from "../validations/device";
import DeviceModel from "../models/Device";
import GatewayModel from "../models/Gateway";
import Gateway from "./gateway";
import { NextFunction } from "express";

const gatewayInstance = new Gateway();
export default class Device {
  async createDevice(body: IDeviceInputDTO, next?: NextFunction) {
    try {
      const { error, value } = deviceValidationSchema.validate(body);
      if (error?.message) {
        throw new Error(error.message);
      }

      const gateway = await gatewayInstance.getGatewayBySerialNumber(
        value.gatewaySerialNumber
      );
      if (!gateway && next) {
        return next({ status: 404, message: "Gateway not found" });
      }

      const device = await DeviceModel.find({ uid: body.uid });
      if (device.length > 0) {
        throw new Error("Device already exists");
      }

      const res = await DeviceModel.create(value);
      const jsonRes = res?.toJSON();
      this.assignDeviceToGateway(jsonRes, value.gatewaySerialNumber);
      return jsonRes;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async removeDeviceFromGateway(device: IDevice) {
    if (device.gatewaySerialNumber) {
      const gateway = await GatewayModel.findOne({
        serialnumber: device.gatewaySerialNumber,
      });
      if (!gateway) {
        throw new Error("Gateway not found");
      }

      await gateway.updateOne({
        $pull: { devices: device._id },
      });
    }
  }

  async assignDeviceToGateway(device: IDevice, gatewaySerialNumber: string) {
    try {
      const gateway = await GatewayModel.findOne({
        serialnumber: gatewaySerialNumber,
      });
      if (!gateway) {
        throw new Error("Gateway not found");
      }

      if (gateway.devices.length >= 10) {
        throw new Error("Cannot Add more devices to this gateway!");
      }

      await this.removeDeviceFromGateway(device);
      await DeviceModel.updateOne(
        { uid: device.uid },
        { $set: { gatewaySerialNumber: gateway.serialnumber } }
      );
      await gateway.updateOne({ devices: [...gateway.devices, device] });
      return true;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getDeviceById(id: string) {
    try {
      const { error } = deviceValidationSchema.extract("uid").validate(id);
      if (error?.message) {
        throw new Error(error.message);
      }

      const res = await DeviceModel.findOne({ uid: id }, { __v: 0 });
      return res?.toJSON();
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getAllDevices(page: number, limit: number) {
    try {
      const count = await DeviceModel.countDocuments();
      const data = await DeviceModel.aggregate([
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $project: { __v: 0 } },
      ]);

      return { data, count, page: Number(page), limit: Number(limit) };
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getDevicesByGatewayId(gatewayId: string) {
    try {
      const { error } = deviceValidationSchema
        .extract("gatewaySerialNumber")
        .validate(gatewayId);
      if (error?.message) {
        throw new Error(error.message);
      }

      const gateway = await gatewayInstance.getGatewayBySerialNumber(gatewayId);
      if (!gateway) {
        throw new Error("Gateway not found");
      }

      const [devices] = await GatewayModel.aggregate([
        { $match: { serialnumber: gatewayId } },
        { $project: { devices: 1, _id: 0 } },
        {
          $lookup: {
            from: "devices",
            localField: "devices",
            foreignField: "_id",
            as: "devices",
          },
        },
      ]);

      return devices;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async updateDeviceById(id: string, body: IDeviceInputDTO) {
    try {
      const { error } = deviceDTOValidationSchema.validate(body);
      if (error?.message) {
        throw new Error(error.message);
      }

      const device = await DeviceModel.findOne({ uid: id });
      if (!device) {
        throw new Error("Device not found");
      }

      const { vendor, status, gatewaySerialNumber } = body;

      if (device.gatewaySerialNumber !== gatewaySerialNumber) {
        await this.assignDeviceToGateway(device, gatewaySerialNumber);
      }

      const res = await DeviceModel.findOneAndUpdate(
        { uid: id },
        {
          $set: {
            vendor: vendor || device.vendor,
            status: status || device.status,
            gatewaySerialNumber:
              gatewaySerialNumber || device.gatewaySerialNumber,
          },
        },
        { new: true }
      );
      return res ? res.toJSON() : true;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async deleteDeviceById(uid: string) {
    try {
      const { error } = deviceValidationSchema.extract("uid").validate(uid);
      if (error?.message) {
        throw new Error(error.message);
      }

      const device = await DeviceModel.findOne({ uid });
      if (!device) {
        throw new Error("Device not found");
      }

      await this.removeDeviceFromGateway(device);
      const res = await DeviceModel.findOneAndDelete({ uid });
      return res ? true : true;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
