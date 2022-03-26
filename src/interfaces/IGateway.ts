import { IDevice } from "./IDevice";

export interface IGateway {
  id: number;
  serialnumber: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  ip4: string;
  devices: IDevice[];
}

export interface IGatewayInputDTO {
  serialnumber: string;
  name: string;
  ip4: string;
}
