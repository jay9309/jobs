const SubscriptionPlan = require("../models/SubscriptionPlan");
const UserSubscription = require("../models/UserSubscription");

async function getPlans(req, res, next) {
  try {
    const filter = req.user?.role === "ADMIN" && req.query.all === "true" ? {} : { isActive: true };
    const plans = await SubscriptionPlan.find(filter).sort({ price: 1 });
    res.json({ success: true, plans });
  } catch (error) { next(error); }
}
async function createPlan(req, res, next) {
  try {
    const { name, price, validityDays, applicationLimit, description, isActive } = req.body;
    const plan = await SubscriptionPlan.create({ name, price, validityDays, applicationLimit, description, isActive: isActive !== false });
    res.status(201).json({ success: true, plan });
  } catch (error) { next(error); }
}
async function updatePlan(req, res, next) {
  try {
    const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });
    res.json({ success: true, plan });
  } catch (error) { next(error); }
}
async function getMySubscription(req, res, next) {
  try {
    const subscription = await UserSubscription.findOne({ user: req.user._id, status: "ACTIVE", expiryDate: { $gt: new Date() } }).populate("plan").sort({ expiryDate: -1 });
    res.json({ success: true, subscription: subscription || null });
  } catch (error) { next(error); }
}
module.exports = { getPlans, createPlan, updatePlan, getMySubscription };
