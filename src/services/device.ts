import { IDevice, IDeviceInputDTO } from "../interfaces/IDevice";
import { deviceValidationSchema } from "../validations/device";
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

      const res = await DeviceModel.create(value);
      const jsonRes = res?.toJSON();
      this.assignDeviceToGateway(jsonRes, value.gatewaySerialNumber);
      return jsonRes;
    } catch (error: any) {
      throw new Error(error);
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

      await gateway.updateOne({ devices: [...gateway.devices, device] });
      return true;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getDeviceById(id: string) {
    try {
      const { error, value } = deviceValidationSchema
        .extract("uid")
        .validate(id);
      if (error?.message) {
        throw new Error(error.message);
      }

      const res = await DeviceModel.findOne({ uid: id });
      return res?.toJSON();
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getAllDevices(page: number, limit: number) {
    try {
      const count = await DeviceModel.countDocuments();
      const res = await DeviceModel.find()
        .sort({
          name: "asc",
        })
        .skip((page - 1) * limit)
        .limit(limit);
      const data = res.map((device) => device.toJSON());
      return { data, count, page: Number(page), limit: Number(limit) };
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getDevicesByGatewayId() {}
  async updateDeviceById() {}
  async deleteDeviceById(uid: string) {
    try {
      const { error, value } = deviceValidationSchema
        .extract("uid")
        .validate(uid);
      if (error?.message) {
        throw new Error(error.message);
      }

      await DeviceModel.findOneAndDelete({ uid });
      return true;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
