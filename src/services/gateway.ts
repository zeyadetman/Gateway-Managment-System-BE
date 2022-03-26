import { IGatewayInputDTO } from "../interfaces/IGateway";
import GatewayModel from "../models/Gateway";
import { gatewayValidationSchema } from "../validations/gateway";

export default class Gateway {
  async createGateway(body: IGatewayInputDTO) {
    try {
      const { error, value } = gatewayValidationSchema.validate(body);
      if (error?.message) {
        throw new Error(error.message);
      }

      const res = await GatewayModel.create(value);
      return res.toJSON();
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getGatewayBySerialNumber(serialnumber: string) {
    try {
      const { error, value } = gatewayValidationSchema
        .extract("serialnumber")
        .validate(serialnumber);
      if (error?.message) {
        throw new Error(error.message);
      }

      const res = await GatewayModel.findOne({ serialnumber: value });
      return res?.toJSON();
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getAllGateways(page: number, limit: number) {
    try {
      const count = await GatewayModel.countDocuments();
      const res = await GatewayModel.find()
        .sort({
          name: "asc",
        })
        .skip((page - 1) * limit)
        .limit(limit);
      const data = res.map((gateway) => gateway.toJSON());
      return { data, count, page: Number(page), limit: Number(limit) };
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
