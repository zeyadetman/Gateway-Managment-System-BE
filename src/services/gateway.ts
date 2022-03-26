import { IGatewayInputDTO } from "../interfaces/IGateway";
import GatewayModel from "../models/Gateway";
import { gatewayValidationSchema } from "../validations/gateway";

export default class Gateway {
  public async createGateway(body: IGatewayInputDTO) {
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
  getGatewayById() {
    return;
  }
  getAllGateways() {
    return;
  }
}
