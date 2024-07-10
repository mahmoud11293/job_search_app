import { ErrorHandler } from "../utils/error-class.utils.js";

export const authorization = (allowedRoles) => {
  return async (req, res, next) => {
    // loggedIn role
    const user = req.authUser;
    if (!allowedRoles.includes(user.role)) {
      return next(new ErrorHandler("You are not authorized"), 401);
    }
    next();
  };
};
