const User = require("../models/User");
const Job = require("../models/Job");
const Payment = require("../models/Payment");
const Company = require("../models/Company");
const Application = require("../models/Application");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const UserSubscription = require("../models/UserSubscription");

async function dashboard(req, res, next) {
  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const [totalUsers, totalJobs, totalCompanies, totalApplications, activeSubscriptions, revenueResult, monthlyRevenueResult, successfulPayments, recentPayments, recentUsers, recentJobs] = await Promise.all([
      User.countDocuments({ role: "USER" }),
      Job.countDocuments(),
      Company.countDocuments(),
      Application.countDocuments(),
      UserSubscription.countDocuments({ status: "ACTIVE", expiryDate: { $gt: now } }),
      Payment.aggregate([{ $match: { status: "SUCCESS" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Payment.aggregate([{ $match: { status: "SUCCESS", createdAt: { $gte: monthStart } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Payment.countDocuments({ status: "SUCCESS" }),
      Payment.find().populate("user", "name email").populate("plan", "name price validityDays").sort({ createdAt: -1 }).limit(8),
      User.find({ role: "USER" }).select("-password").sort({ createdAt: -1 }).limit(8),
      Job.find().populate("company", "name").sort({ createdAt: -1 }).limit(8)
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalJobs,
        totalCompanies,
        totalApplications,
        activeSubscriptions,
        totalRevenue: revenueResult[0]?.total || 0,
        monthlyRevenue: monthlyRevenueResult[0]?.total || 0,
        successfulPayments
      },
      recentPayments,
      recentUsers,
      recentJobs
    });
  } catch (error) { next(error); }
}

async function listUsers(req, res, next) {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) { next(error); }
}

async function updateUserStatus(req, res, next) {
  try {
    if (String(req.user._id) === String(req.params.id)) return res.status(400).json({ success: false, message: "You cannot deactivate your own admin account." });
    const user = await User.findByIdAndUpdate(req.params.id, { isActive: Boolean(req.body.isActive) }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) { next(error); }
}

async function listApplications(req, res, next) {
  try {
    const applications = await Application.find()
      .populate("user", "name email")
      .populate({ path: "job", populate: { path: "company", select: "name" } })
      .sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) { next(error); }
}

async function updateApplicationStatus(req, res, next) {
  try {
    const allowed = ["REDIRECTED", "APPLIED", "WITHDRAWN"];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid application status" });
    const application = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
      .populate("user", "name email")
      .populate({ path: "job", populate: { path: "company", select: "name" } });
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    res.json({ success: true, application });
  } catch (error) { next(error); }
}

module.exports = { dashboard, listUsers, updateUserStatus, listApplications, updateApplicationStatus };
