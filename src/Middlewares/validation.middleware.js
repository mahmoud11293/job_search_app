import { ErrorHandler } from "../utils/error-class.utils.js";

const reqKeys = ["body", "params", "query", "headers"];

export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    let validationErrors = [];
    for (const key of reqKeys) {
      const validationResult = schema[key]?.validate(req[key], {
        abortEarly: false,
      });
      if (validationResult?.error) {
        validationErrors.push(validationResult.error.details);
      }
    }
    validationErrors.length
      ? next(new ErrorHandler("Validation Error", 400, validationErrors))
      : next();
  };
};
