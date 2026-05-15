import { Router } from "express";
import { chatCompletion } from "../controllers/chat.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { chatCompletionValidation } from "../validators/chat.validator.js";

const chatRouter = Router();

chatRouter.post(
  "/completion",
  authenticate,
  validateBody(chatCompletionValidation),
  chatCompletion,
);

export default chatRouter;
