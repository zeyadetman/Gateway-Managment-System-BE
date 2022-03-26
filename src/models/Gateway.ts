import mongoose, { Schema } from "mongoose";
import { isIPv4 } from "net";
import { IGateway } from "../interfaces/IGateway";

const Gateway: Schema = new mongoose.Schema({
  serialnumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  ip4: {
    type: String,
    required: true,
    validate: async (ip4: string) => {
      if (isIPv4(ip4)) {
        return true;
      } else {
        throw new Error("Invalid IP4");
      }
    },
  },
  devices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Device" }],
});

export default mongoose.model<IGateway & mongoose.Document>("Gateway", Gateway);
