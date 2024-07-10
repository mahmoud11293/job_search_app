import { Router } from "express";
const router = Router();
import { systemRoles } from "../../utils/system-roles.utils.js";
import { authMiddleware } from "../../Middlewares/auth.middleware.js";
import { authorization } from "../../Middlewares/authorization.middleware.js";
import { errorHandle } from "../../Middlewares/error-handle.middleware.js";
import { validationMiddleware } from "../../Middlewares/validation.middleware.js";
// Imported APIs
import {
  addCompany,
  updateCompany,
  deleteCompany,
  companyData,
  searchCompany,
  appSpecificJobs,
} from "./company.controller.js";
// Imported Validation Schemas
import {
  addCompanySchema,
  updateCompanySchema,
  deleteCompanySchema,
  getCompanyDataSchema,
  searchCompanySchema,
} from "./company.schema.js";

const { USER, HR } = systemRoles;

// Add company API
router.post(
  "/add-company",
  authMiddleware(),
  authorization(HR),
  validationMiddleware(addCompanySchema),
  errorHandle(addCompany)
);
// Update company data API
router.put(
  "/update-company/:companyId",
  authMiddleware(),
  authorization(HR),
  validationMiddleware(updateCompanySchema),
  errorHandle(updateCompany)
);
// Delete company data API
router.delete(
  "/delete-company/:companyId",
  authMiddleware(),
  authorization(HR),
  validationMiddleware(deleteCompanySchema),
  errorHandle(deleteCompany)
);
// Get company data API
router.get(
  "/:companyId",
  authMiddleware(),
  authorization(HR),
  validationMiddleware(getCompanyDataSchema),
  errorHandle(companyData)
);
// Search for a company with a name API
router.get(
  "/search-company/:companyName",
  authMiddleware(),
  authorization([USER, HR]),
  validationMiddleware(searchCompanySchema),
  errorHandle(searchCompany)
);
// Get all applications for specific Jobs API
router.get(
  "/:jobId/applications",
  authMiddleware(),
  authorization(HR),
  errorHandle(appSpecificJobs)
);

export default router;
