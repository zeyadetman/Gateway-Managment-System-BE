import mongoose, { Schema } from "mongoose";
import { IDevice } from "../interfaces/IDevice";

const DeviceSchema: Schema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    vendor: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    gateway: { type: mongoose.Schema.Types.ObjectId, ref: "Gateway" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDevice & mongoose.Document>(
  "Device",
  DeviceSchema
);
