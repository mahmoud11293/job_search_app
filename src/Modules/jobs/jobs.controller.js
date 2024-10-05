import Application from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";
import { ErrorHandler } from "../../utils/error-class.utils.js";

// ==================== Add Job ====================
export const addJob = async (req, res, next) => {
  // destruct data
  const { authUser } = req;
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
  } = req.body;
  // object data
  const jobData = new Job({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: authUser._id,
  });
  // create company
  await jobData.save();
  res.status(201).json({ message: "Job created successfully", jobData });
};
// ==================== update Job ====================
export const updateJob = async (req, res, next) => {
  // destruct data
  const { jobId } = req.params;
  const { _id } = req.authUser;
  const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription } =
    req.body;

  // find job by id
  const job = await Job.findById(jobId);
  // check if job not exist
  if (!job) return next(new ErrorHandler("job not found", 404));

  // check if hr id the same
  if (job.addedBy.toString() !== _id.toString())
    return next(
      new ErrorHandler("you are not allowed to update this job", 401)
    );
  // update job data
  const updateJob = await Job.findByIdAndUpdate(
    jobId,
    { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription },
    { new: true }
  );
  // check if Something wrong
  if (!updateJob) return next(new ErrorHandler("Something went wrong", 400));

  res.status(201).json({ message: "Updated successfully", updateJob });
};
// ==================== delete Job ====================
export const deleteJob = async (req, res, next) => {
  // destruct data
  const { jobId } = req.params;
  const { _id } = req.authUser;
  // find job
  const job = await Job.findById(jobId);
  // check if job not exist
  if (!job) {
    return next(new ErrorHandler("Job not found", 404));
  }
  // check if hr id not the same
  if (job.addedBy.toString() !== _id.toString())
    return next(
      new ErrorHandler("you are not allowed to delete this job", 401)
    );
  // delete job by id
  await Job.findByIdAndDelete(jobId);
  res.status(200).json({ message: "Delete success" });
};
// =============== Get all Jobs with their company’s information ===============
export const JobsWithCompanies = async (req, res, next) => {
  const JobsWithCompanies = await Job.aggregate([
    {
      $lookup: {
        from: "companies",
        localField: "addedBy",
        foreignField: "companyHR",
        as: "company info",
      },
    },
  ]);
  res.status(200).json(JobsWithCompanies);
};
// ==================== Get all Jobs for a specific company ====================
export const jobsSpecificCompany = async (req, res, next) => {
  // destruct data
  const { companyName } = req.query;
  // find company by query name
  const company = await Company.findOne({ companyName });
  // check if company not exist
  if (!company) return next(new ErrorHandler("Company not found", 404));
  // find all jobs of specific company
  const jobs = await Job.find({ addedBy: company.companyHR });
  res.status(200).json(jobs);
};
// ==================== Get all Jobs that match the following filters  ====================
export const jobsMatchFilters = async (req, res, next) => {
  // destruct data
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.query;
  // empty object
  const filters = {};
  // check about filter words
  if (workingTime) filters.workingTime = workingTime;
  if (jobLocation) filters.jobLocation = jobLocation;
  if (seniorityLevel) filters.seniorityLevel = seniorityLevel;
  if (jobTitle) filters.jobTitle = jobTitle;
  if (technicalSkills)
    filters.technicalSkills = { $in: technicalSkills.split(",") };
  // send data
  const jobs = await Job.find(filters);
  res.status(200).json(jobs);
};
// ==================== Apply to Job ====================
export const applyToJob = async (req, res, next) => {
  // destruct data
  const { jobId, userTechSkills, userSoftSkills } = req.body;
  const { _id } = req.authUser;
  // find job by id
  const job = await Job.findById(jobId);
  // check if job not exist
  if (!job) return next(new ErrorHandler("Job not found", 404));
  // object new application data
  const application = new Application({
    jobId,
    userId: _id,
    userTechSkills,
    userSoftSkills,
  });
  // saving the data
  await application.save();
  res.status(200).json({ message: "Application submitted successfully" });
};
