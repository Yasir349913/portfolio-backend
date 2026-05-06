// validators/contact.validator.js
import Joi from "joi";

export const contactSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(10).required(),
});