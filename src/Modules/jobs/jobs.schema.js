import Joi from "joi";
import { generalRules } from "../../utils/general-rules.utils.js";

// Add Job Shema
export const addJobSchema = {
  body: Joi.object({
    jobTitle: Joi.string().required(),
    jobLocation: Joi.string().valid("onsite", "emotely", "hybrid").required(),
    workingTime: Joi.string().valid("part-time", "full-time").required(),
    seniorityLevel: Joi.string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
      .required(),
    jobDescription: Joi.string().required(),
    technicalSkills: Joi.array().items(Joi.string()).required(),
    softSkills: Joi.array().items(Joi.string()).required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};
// Update Job Schema
export const updateJobSchema = {
  body: Joi.object({
    jobTitle: Joi.string().required(),
    jobLocation: Joi.string().valid("onsite", "emotely", "hybrid").required(),
    workingTime: Joi.string().valid("part-time", "full-time").required(),
    seniorityLevel: Joi.string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
      .required(),
    jobDescription: Joi.string().required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
  params: Joi.object({
    jobId: generalRules._id.required(),
  }),
};
// delete job schema
export const deleteJobSchema = {
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
  params: Joi.object({
    jobId: generalRules._id.required(),
  }),
};
// Jobs for a specific company Schema
export const jobsSpecificCompanySchema = {
  query: Joi.object({
    companyName: Joi.string().required(),
  }),
};
// Jobs match filters
export const matchFiltersSchema = {
  query: Joi.object({
    workingTime: Joi.string()
      .valid("full-time", "part-time", "emote", "internship")
      .optional(),
    jobLocation: Joi.string().optional(),
    seniorityLevel: Joi.string()
      .valid("junior", "id-level", "enior", "executive")
      .optional(),
    jobTitle: Joi.string().optional(),
    technicalSkills: Joi.array().items(Joi.string()).optional(),
  }),
};
//  Apply to Job Schema
export const applyToJobSchema = {
  body: Joi.object({
    userTechSkills: Joi.array().items(Joi.string()).optional(),
    userSoftSkills: Joi.array().items(Joi.string()).optional(),
    jobId: generalRules._id.required(),
  }),
  headers: Joi.object({
    token: Joi.string().required(),
    ...generalRules.headers,
  }),
};
