import { Router } from "express";
const router = Router();

// Imported APIs
import {
  signup,
  verifyEmail,
  signin,
  updateAccount,
  deleteAccount,
  userAccountData,
  profileData,
  updatePassword,
  forgetPassword,
  recoveryEmail,
} from "./user.controller.js";
import { authMiddleware } from "../../Middlewares/auth.middleware.js";
import { errorHandle } from "../../Middlewares/error-handle.middleware.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
// Imported Validation Schemas
import {
  signupSchema,
  signInSchema,
  updateUserSchema,
  updatePasswordSchema,
  forgetPasswordSchema,
  recoveryEmailShema,
} from "./user.schema.js";
// sign Up API
router.post("/signup", validationMiddleware(signupSchema), errorHandle(signup));
// verify Email API
router.get("/verify-email/:token", errorHandle(verifyEmail));
// sign In API
router.post("/signin", validationMiddleware(signInSchema), errorHandle(signin));
// Update Account API
router.put(
  "/update",
  authMiddleware(),
  validationMiddleware(updateUserSchema),
  errorHandle(updateAccount)
);
// Delete Account API
router.delete("/delete", authMiddleware(), errorHandle(deleteAccount));
// Get user account data API
router.get("/user-data", authMiddleware(), errorHandle(userAccountData));
// Get profile data for another user
router.get("/profile-data/:userId", authMiddleware(), errorHandle(profileData));
// update Password API
router.patch(
  "/update-pass",
  authMiddleware(),
  validationMiddleware(updatePasswordSchema),
  errorHandle(updatePassword)
);
// forget Password API
router.post(
  "/forgot-password",
  validationMiddleware(forgetPasswordSchema),
  errorHandle(forgetPassword)
);
// Get all accounts associated to a specific recovery Email API
router.get(
  "/recovery-email/:recoveryEmail",
  validationMiddleware(recoveryEmailShema),
  errorHandle(recoveryEmail)
);

export default router;
