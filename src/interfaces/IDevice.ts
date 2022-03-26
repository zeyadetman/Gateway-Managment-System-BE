export interface IDevice {
  uid: number;
  vendor: string;
  createdAt: Date;
  updatedAt: Date;
  gatewaySerialNumber: string;
  status: "online" | "offline";
}

export interface IDeviceInputDTO {
  uid: number;
  vendor: string;
  status: "online" | "offline";
  gatewaySerialNumber: string;
}
