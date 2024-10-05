import { Router } from "express";
const router = Router();

// Imported APIs
import {
  signup,
  verifyEmail,
  signin,
  logOut,
  updateAccount,
  deleteAccount,
  userAccountData,
  profileData,
  updatePassword,
  forgetPassword,
  resetPassword,
  recoveryEmail,
} from "./user.controller.js";
import { authMiddleware } from "../../Middlewares/auth.middleware.js";
import { errorHandle } from "../../Middlewares/error-handle.middleware.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
// Imported Validation Schemas
import {
  signupSchema,
  verifySchema,
  signInSchema,
  logOutSchema,
  updateUserSchema,
  deleteAccountSchema,
  userAccountDataSchema,
  profileDataSchema,
  updatePasswordSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  recoveryEmailShema,
} from "./user.schema.js";
// sign Up API
router.post(
  "/signup",
  errorHandle(validationMiddleware(signupSchema)),
  errorHandle(signup)
);
// verify Email API
router.get(
  "/verify-email/:token",
  errorHandle(validationMiddleware(verifySchema)),
  errorHandle(verifyEmail)
);
// sign In API
router.post(
  "/signin",
  errorHandle(validationMiddleware(signInSchema)),
  errorHandle(signin)
);
// Log out
router.patch(
  "/logout",
  errorHandle(authMiddleware()),
  errorHandle(validationMiddleware(logOutSchema)),
  errorHandle(logOut)
);
// Update Account API
router.put(
  "/update",
  errorHandle(authMiddleware()),
  errorHandle(validationMiddleware(updateUserSchema)),
  errorHandle(updateAccount)
);
// Delete Account API
router.delete(
  "/delete",
  errorHandle(authMiddleware()),
  errorHandle(validationMiddleware(deleteAccountSchema)),
  errorHandle(deleteAccount)
);
// Get user account data API
router.get(
  "/user-data",
  errorHandle(authMiddleware()),
  errorHandle(validationMiddleware(userAccountDataSchema)),
  errorHandle(userAccountData)
);
// Get profile data for another user
router.get(
  "/profile-data/:userId",
  errorHandle(authMiddleware()),
  errorHandle(validationMiddleware(profileDataSchema)),
  errorHandle(profileData)
);
// update Password API
router.patch(
  "/update-pass",
  errorHandle(authMiddleware()),
  errorHandle(validationMiddleware(updatePasswordSchema)),
  errorHandle(updatePassword)
);
// forget Password API
router.patch(
  "/forgot-password",
  errorHandle(validationMiddleware(forgetPasswordSchema)),
  errorHandle(forgetPassword)
);
// Reset Password API
router.patch(
  "/reset-password",
  errorHandle(validationMiddleware(resetPasswordSchema)),
  errorHandle(resetPassword)
);
// Get all accounts associated to a specific recovery Email API
router.get(
  "/recovery-email/:recoveryEmail",
  errorHandle(validationMiddleware(recoveryEmailShema)),
  errorHandle(recoveryEmail)
);

export default router;
