import { Router } from "express";
const router = Router();
import { systemRoles } from "../../utils/system-roles.utils.js";
import { authMiddleware } from "../../Middlewares/auth.middleware.js";
import { authorization } from "../../Middlewares/authorization.middleware.js";
import { errorHandle } from "../../Middlewares/error-handle.middleware.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
// Imported APIs
import {
  addJob,
  updateJob,
  deleteJob,
  getAllJobs,
  jobsSpecificCompany,
  jobsMatchFilters,
  applyToJob,
} from "./jobs.controller.js";
// Imported Validation Schemas
import {
  addJobSchema,
  updateJobSchema,
  matchFiltersSchema,
  ApplyJob,
} from "./jobs.schema.js";

const { USER, HR } = systemRoles;

// Add Job API
router.post(
  "/add-job",
  authMiddleware(),
  authorization(HR),
  validationMiddleware(addJobSchema),
  errorHandle(addJob)
);
// Update Job APi
router.put(
  "/update-job/:jobId",
  authMiddleware(),
  authorization(HR),
  validationMiddleware(updateJobSchema),
  errorHandle(updateJob)
);
// Delete Job APi
router.delete(
  "/delete-job/:jobId",
  authMiddleware(),
  authorization(HR),
  errorHandle(deleteJob)
);
// Get all Jobs with their company’s information API
router.get(
  "/get-jobs",
  authMiddleware(),
  authorization([USER, HR]),
  errorHandle(getAllJobs)
);
// Get all Jobs for a specific company API
router.get(
  "/jobs-company",
  authMiddleware(),
  authorization([USER, HR]),
  errorHandle(jobsSpecificCompany)
);
// Get all Jobs that match the following filters API
router.get(
  "/jobs-filters",
  authMiddleware(),
  authorization([USER, HR]),
  validationMiddleware(matchFiltersSchema),
  errorHandle(jobsMatchFilters)
);
// Apply to Job API
router.post(
  "/apply-job",
  authMiddleware(),
  authorization(USER),
  validationMiddleware(ApplyJob),
  errorHandle(applyToJob)
);

export default router;
