import Joi from "joi";
import { generalRules } from "../../utils/general-rules.utils.js";

// Add company Schema
export const addCompanySchema = {
  body: Joi.object({
    companyName: Joi.string().required(),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numberOfEmployees: Joi.string()
      .required()
      .valid("1-10", "11-20", "21-50", "51-100", "101+"),
    companyEmail: Joi.string().email().required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};
// Update companye Schema
export const updateCompanySchema = {
  body: Joi.object({
    companyName: Joi.string().optional(),
    industry: Joi.string().optional(),
    address: Joi.string().optional(),
    numberOfEmployees: Joi.string()
      .optional()
      .valid("1-10", "11-20", "21-50", "51-100", "101+"),
    companyEmail: Joi.string().email().optional(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
  params: Joi.object({
    companyId: generalRules._id.required(),
  }),
};
// delete Company Schema
export const deleteCompanySchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
  params: Joi.object({
    companyId: generalRules._id.required(),
  }),
};
// Get company data Schema
export const getCompanyDataSchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
  params: Joi.object({
    companyId: generalRules._id.required(),
  }),
};
// Search for a company Schema
export const searchCompanySchema = {
  params: Joi.object({
    companyName: Joi.string().required(),
  }),
};
// Get all applications Schema
export const GetAllApplicationsSchema = {
  params: Joi.object({
    jobId: generalRules._id.required(),
  }),
};
