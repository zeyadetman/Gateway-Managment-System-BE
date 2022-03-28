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
      const { error } = gatewayValidationSchema
        .extract("serialnumber")
        .validate(serialnumber);
      if (error?.message) {
        throw new Error(error.message);
      }

      const [res] = await GatewayModel.aggregate([
        { $match: { serialnumber: serialnumber } },
        { $limit: 1 },
        {
          $lookup: {
            from: "devices",
            localField: "devices",
            foreignField: "_id",
            as: "devices",
            pipeline: [{ $project: { __v: 0 } }],
          },
        },
        { $project: { __v: 0 } },
      ]);

      return res;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async getAllGateways(page: number, limit: number) {
    try {
      const count = await GatewayModel.countDocuments();
      const data = await GatewayModel.aggregate([
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: "devices",
            localField: "devices",
            foreignField: "_id",
            as: "devices",
            pipeline: [{ $project: { __v: 0 } }],
          },
        },
        { $project: { __v: 0 } },
      ]);

      return { data, count, page: Number(page), limit: Number(limit) };
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
