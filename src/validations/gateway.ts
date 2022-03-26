import Joi, { Schema } from "joi";

export const gatewayValidationSchema: Schema = Joi.object({
  serialnumber: Joi.string().required(),
  name: Joi.string().required(),
  ip4: Joi.string()
    .ip({ version: ["ipv4"] })
    .required(),
});
