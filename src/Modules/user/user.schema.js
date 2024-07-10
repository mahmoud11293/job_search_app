import Joi from "joi";

// sign up Schema
export const signupSchema = {
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    recoveryEmail: Joi.string().email(),
    DOB: Joi.date().required(),
    mobileNumber: Joi.string().required(),
    role: Joi.string().valid("User", "Company_HR").required(),
    status: Joi.string().valid("online", "offline").default("offline"),
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
// update User Schema
export const updateUserSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    mobileNumber: Joi.string().required(),
    recoveryEmail: Joi.string().email(),
    DOB: Joi.date().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
  }),
};
// update Password Schema
export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string().required().min(6),
    newPassword: Joi.string().required().min(6),
  }),
};
// forget Password Schema
export const forgetPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};
// recovery Email Shema
export const recoveryEmailShema = {
  params: Joi.object({
    recoveryEmail: Joi.string().email().required(),
  }),
};
