import Joi from "joi";

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
    companyHR: Joi.required(),
  }),
};
// Update companye Schema
export const updateCompanySchema = {
  body: Joi.object({
    companyName: Joi.string().required(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numberOfEmployees: Joi.string()
      .required()
      .valid("1-10", "11-20", "21-50", "51-100", "101+"),
    companyEmail: Joi.string().email().required(),
  }),
  params: Joi.object({
    companyId: Joi.string().required(),
  }),
};
// delete Company Schema
export const deleteCompanySchema = {
  params: Joi.object({
    companyId: Joi.string().required(),
  }),
};
// Get company data Schema
export const getCompanyDataSchema = {
  params: Joi.object({
    companyId: Joi.string().required(),
  }),
};
// Search for a company Schema
export const searchCompanySchema = {
  params: Joi.object({
    companyName: Joi.string().required(),
  }),
};
