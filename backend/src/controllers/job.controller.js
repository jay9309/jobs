const Job = require("../models/Job");
const Company = require("../models/Company");
const { fetchJobPage } = require("../services/jobFetcher.service");
const { parseJobPage } = require("../services/jobParser.service");

const searchSynonyms = [
  ["developer", "engineer", "programmer", "coder"],
  ["frontend", "front end", "ui developer"],
  ["backend", "back end", "server side"],
  ["full stack", "fullstack"],
  ["fresher", "entry level", "junior"],
  ["remote", "work from home", "wfh"],
  ["javascript", "js"],
  ["typescript", "ts"],
  ["react", "reactjs"],
  ["node", "nodejs"],
  ["qa", "quality assurance", "tester"],
  ["data analyst", "business analyst"]
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSearchBuckets(search) {
  const normalizedSearch = search.toLowerCase().replace(/[^a-z0-9+#.]+/g, " ").trim();
  const terms = normalizedSearch.match(/[a-z0-9+#.]+/g) || [];
  const consumedTerms = new Set();
  const buckets = [];

  searchSynonyms.forEach(group => {
    const matchingAliases = group.filter(term => ` ${normalizedSearch} `.includes(` ${term} `));
    if (!matchingAliases.length) return;

    matchingAliases.forEach(alias => alias.split(/\s+/).forEach(term => consumedTerms.add(term)));
    buckets.push(group);
  });

  terms
    .filter(term => term.length > 1 && !consumedTerms.has(term))
    .forEach(term => buckets.push([term]));

  return buckets;
}

async function getJobs(req, res, next) {
  try {
    const filter = { published: true };
    if (req.query.search) {
      const buckets = getSearchBuckets(String(req.query.search));
      const searchFields = [
        "title",
        "location",
        "skills",
        "experience",
        "qualification",
        "jobType",
        "salary",
        "description",
        "responsibilities",
        "requirements"
      ];
      const matchingBucketFilters = [];

      for (const bucket of buckets) {
        const regexes = bucket.map(term => new RegExp(escapeRegex(term), "i"));
        const matchingCompanies = await Company.find({ name: { $in: regexes } }).select("_id");
        matchingBucketFilters.push({
          $or: [
            ...searchFields.map(field => ({ [field]: { $in: regexes } })),
            ...(matchingCompanies.length ? [{ company: { $in: matchingCompanies.map(company => company._id) } }] : [])
          ]
        });
      }
      if (matchingBucketFilters.length) filter.$and = matchingBucketFilters;
    }
    const jobs = await Job.find(filter).populate("company").sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) { next(error); }
}

async function getAdminJobs(req, res, next) {
  try {
    const filter = {};
    if (req.query.search) filter.$or = [{ title: { $regex: req.query.search, $options: "i" } }, { location: { $regex: req.query.search, $options: "i" } }];
    if (req.query.published === "true" || req.query.published === "false") filter.published = req.query.published === "true";
    const jobs = await Job.find(filter).populate("company").sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) { next(error); }
}

async function getJobById(req, res, next) {
  try {
    const job = await Job.findById(req.params.id).populate("company");
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, job });
  } catch (error) { next(error); }
}

async function createJob(req, res, next) {
  try {
    const { companyName, companyWebsite, title, location, experience, jobType, qualification, skills, salary, description, responsibilities, requirements, sourceUrl, published, featured } = req.body;
    if (!companyName || !title || !sourceUrl) return res.status(400).json({ success: false, message: "companyName, title and sourceUrl are required" });
    let company = await Company.findOne({ name: companyName });
    if (!company) company = await Company.create({ name: companyName, website: companyWebsite || "" });
    const job = await Job.create({ company: company._id, title, location, experience, jobType, qualification, skills: skills || [], salary, description, responsibilities: responsibilities || [], requirements: requirements || [], sourceUrl, published: published !== false, featured: featured === true });
    res.status(201).json({ success: true, job: await job.populate("company") });
  } catch (error) { next(error); }
}

async function updateJob(req, res, next) {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("company");
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, job });
  } catch (error) { next(error); }
}
async function deleteJob(req, res, next) {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, message: "Job deleted" });
  } catch (error) { next(error); }
}
async function previewJobFromUrl(req, res, next) {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ success: false, message: "Job URL is required" });
    const html = await fetchJobPage(url);
    const data = parseJobPage(html, url);
    res.json({ success: true, message: "Preview generated. Review the data before publishing.", job: data });
  } catch (error) { next(error); }
}
module.exports = { getJobs, getAdminJobs, getJobById, createJob, updateJob, deleteJob, previewJobFromUrl };
