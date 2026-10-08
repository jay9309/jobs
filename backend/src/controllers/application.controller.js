const Application = require("../models/Application");
const Job = require("../models/Job");
const { canApply } = require("../services/subscription.service");

async function applyToJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || !job.published) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const permission = await canApply(req.user._id);
    if (!permission.allowed) {
      return res.status(402).json({
        success: false,
        message: "Active subscription required",
        reason: permission.reason
      });
    }

    const existing = await Application.findOne({
      user: req.user._id,
      job: job._id
    });

    if (!existing) {
      await Application.create({
        user: req.user._id,
        job: job._id,
        status: "REDIRECTED"
      });

      permission.subscription.applicationsUsed += 1;
      await permission.subscription.save();
    }

    res.json({
      success: true,
      message: "Application access granted",
      redirectUrl: job.sourceUrl
    });
  } catch (error) {
    if (error.code === 11000) {
      const job = await Job.findById(req.params.jobId);
      return res.json({ success: true, message: "Already accessed", redirectUrl: job?.sourceUrl });
    }
    next(error);
  }
}

async function myApplications(req, res, next) {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate({ path: "job", populate: { path: "company" } })
      .sort({ createdAt: -1 });

    res.json({ success: true, applications });
  } catch (error) {
    next(error);
  }
}

module.exports = { applyToJob, myApplications };
