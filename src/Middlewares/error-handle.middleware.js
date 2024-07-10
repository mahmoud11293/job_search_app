import { ErrorHandler } from "../utils/error-class.utils.js";

export const errorHandle = (API) => {
  return (req, res, next) => {
    API(req, res, next).catch((error) => {
      console.log("Error in ErrorHandle middleware", error);
      next(
        new ErrorHandler("Internal server error", 500, error.stack, error.name)
      );
    });
  };
};

export const globalResponse = (err, req, res, next) => {
  if (err) {
    res.status(err["statusCode"] || 500).json({
      message: "Internal server error",
      name: err.name,
      error: err.message,
      status: err.statusCode,
      stack: err.stack,
    });
  }
};
