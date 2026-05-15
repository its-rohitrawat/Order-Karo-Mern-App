import Joi from "joi";

export const chatCompletionValidation = Joi.object({
  messages: Joi.array()
    .items(
      Joi.object({
        role: Joi.string().valid("user", "assistant").required(),
        content: Joi.string().trim().min(1).max(4000).required(),
      }),
    )
    .min(1)
    .max(40)
    .required()
    .messages({
      "array.min": "Send at least one message",
      "any.required": "messages is required",
    }),
});
