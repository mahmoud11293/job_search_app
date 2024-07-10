import Joi from "joi";

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
    technicalSkills: Joi.array().required(),
    softSkills: Joi.array().required(),
    addedBy: Joi.required(),
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
};
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
export const ApplyJob = {
  body: Joi.object({
    jobId: Joi.required(),
    userTechSkills: Joi.array().required(),
    userSoftSkills: Joi.array().required(),
  }),
};
