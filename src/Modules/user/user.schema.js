import Joi from "joi";
import { generalRules } from "../../utils/general-rules.utils.js";

// sign up Schema
export const signupSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(30).alphanum().required(),
    lastName: Joi.string().min(3).max(30).alphanum().required(),
    email: generalRules.email.required(),
    password: generalRules.password.required(),
    recoveryEmail: generalRules.email.required(),
    DOB: Joi.date().required(),
    mobileNumber: Joi.string().required(),
    role: Joi.string().valid("User", "Company_HR").required(),
    status: Joi.string().valid("online", "offline").default("offline"),
  }),
};
// verify Schema
export const verifySchema = {
  params: Joi.object({
    token: Joi.string().required(),
  }),
};

// sign In Schema
export const signInSchema = {
  body: Joi.object({
    emailOrmobileNumber: [
      Joi.string().email().required(),
      Joi.string().alphanum(),
    ],
    password: Joi.string().required().min(6),
  }),
};
// log out Schema
export const logOutSchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};
// update User Schema
export const updateUserSchema = {
  body: Joi.object({
    email: Joi.string().email().optional(),
    mobileNumber: Joi.string().optional(),
    recoveryEmail: Joi.string().email().optional(),
    DOB: Joi.date().required().optional(),
    firstName: Joi.string().min(3).max(30).alphanum().optional(),
    lastName: Joi.string().min(3).max(30).alphanum().optional(),
  }),
};
// delete account Schema
export const deleteAccountSchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};
// userAccountData Schema
export const userAccountDataSchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};
// profile data for another user Schema
export const profileDataSchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};
// update Password Schema
export const updatePasswordSchema = {
  body: Joi.object({
    password: generalRules.password.required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};
// forget Password Schema
export const forgetPasswordSchema = {
  body: Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
      })
      .required(),
  }),
};
// reset Password Schema
export const resetPasswordSchema = {
  body: Joi.object({
    email: generalRules.email.required(),
    password: generalRules.password.required(),
    otp: Joi.string().required(),
  }),
};
// recovery Email Shema
export const recoveryEmailShema = {
  params: Joi.object({
    recoveryEmail: Joi.string()
      .email({
        minDomainSegments: 2,
      })
      .required(),
  }),
};
