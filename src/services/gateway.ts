import { IGatewayInputDTO } from "../interfaces/IGateway";
import GatewayModel from "../models/Gateway";

export default class Gateway {
  public async createGateway(body: IGatewayInputDTO) {
    try {
      const res = await GatewayModel.create(body);
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
