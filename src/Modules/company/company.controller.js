import Application from "../../../DB/models/application.model.js";
import Job from "../../../DB/models/job.model.js";
import Company from "../../../DB/models/company.model.js";
import { ErrorHandler } from "../../utils/error-class.utils.js";
import mongoose from "mongoose";

// ====================== Add company ======================
export const addCompany = async (req, res, next) => {
  // destruct data
  const { _id } = req.authUser;
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;
  // check if Company exist
  const isCompanyExist = await Company.findOne({
    $or: [{ companyName }, { companyEmail }, { companyHR: _id }],
  });
  if (isCompanyExist)
    return next(new ErrorHandler("The company is already exist", 400));
  // object data
  const companyData = new Company({
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    companyHR: _id,
  });
  // create company
  const addCompany = await companyData.save();
  res.status(201).json({ message: "Company created successfully", addCompany });
};

// ====================== Update company data ======================
export const updateCompany = async (req, res, next) => {
  // destruct data
  const { companyId } = req.params;
  const { _id } = req.authUser;
  const { companyName, industry, address, numberOfEmployees, companyEmail } =
    req.body;
  // find company
  const company = await Company.findOne({
    _id: companyId,
    companyName,
    companyEmail,
  });
  // check if company name exist
  if (company) return next(new ErrorHandler("Company already exists", 404));
  // check companyHR id
  if (company?.companyHR.toString() !== _id.toString())
    return next(new ErrorHandler("you not allowed to update this company"));

  // update company data
  const updateCompany = await Company.findByIdAndUpdate(
    companyId,
    { companyName, industry, address, numberOfEmployees, companyEmail },
    { new: true }
  );

  res.status(200).json({ message: "Update success", updateCompany });
};
// ====================== Delete company data ======================
export const deleteCompany = async (req, res, next) => {
  // destruct data
  const { companyId } = req.params;
  const { _id } = req.authUser;
  // find company
  const company = await Company.findById(companyId);
  // check if company not exist
  if (!company) {
    return next(new ErrorHandler("Company not found", 404));
  }
  // check about HR id
  if (company.companyHR.toString() !== _id.toString())
    return next(
      new ErrorHandler("you not allowed to delete this company", 401)
    );
  // delete company
  await Company.findByIdAndDelete(companyId);
  res.status(200).json({ message: "Delete success" });
};
// ================ Get company data ================
export const companyData = async (req, res, next) => {
  // destruct data
  const { companyId } = req.params;
  // find company by id
  const company = await Company.findById(companyId);
  // check if company not exist
  if (!company) return next(new ErrorHandler("Company not found", 404));
  // find jobs by companyHr
  const jobs = await Job.find({ addedBy: company.companyHR });
  // check if jobs not exist
  if (!jobs) return next(new ErrorHandler("Jobs not found", 404));
  // end data
  res.status(200).json({ Company: company, Jobs: jobs });
};
// ================ Search for a company with a name ================
export const searchCompany = async (req, res, next) => {
  // destruct data
  const { companyName } = req.params;
  // find company by name
  const company = await Company.findOne({
    companyName: { $regex: companyName, $options: "i" },
  });
  // check if company exsit
  if (!company) return next(new ErrorHandler("Company not found", 404));

  res.status(200).json(company);
};
// ================ Get all applications for specific Jobs ================

export const appSpecificJobs = async (req, res, next) => {
  // destruct data
  const { jobId } = req.params;
  // find job by id
  const job = await Job.findById(jobId);
  // check if job exist
  if (!job) {
    return next(new ErrorHandler("Job not found", 404));
  }
  // get user and his applications for job
  const applications = await Application.find({ jobId }).populate({
    path: "userId",
    select: "firstName lastName username email",
  });

  res.json(applications);
};
