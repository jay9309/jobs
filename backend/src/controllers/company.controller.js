const Company = require("../models/Company");

async function getCompanies(req, res, next) {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json({ success: true, companies });
  } catch (error) { next(error); }
}

async function createCompany(req, res, next) {
  try {
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, company });
  } catch (error) { next(error); }
}

async function updateCompany(req, res, next) {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    res.json({ success: true, company });
  } catch (error) { next(error); }
}

async function deleteCompany(req, res, next) {
  try {
    const Job = require("../models/Job");
    const hasJobs = await Job.exists({ company: req.params.id });
    if (hasJobs) return res.status(400).json({ success: false, message: "Delete or move this company's jobs first." });
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    res.json({ success: true, message: "Company deleted" });
  } catch (error) { next(error); }
}

module.exports = { getCompanies, createCompany, updateCompany, deleteCompany };
