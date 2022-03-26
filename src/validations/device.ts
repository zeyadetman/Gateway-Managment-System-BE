import Joi, { Schema } from "joi";

export const deviceValidationSchema: Schema = Joi.object({
  uid: Joi.number().required(),
  vendor: Joi.string().required(),
  status: Joi.string().valid("online", "offline").default("offline"),
  gatewaySerialNumber: Joi.string().required(),
});
