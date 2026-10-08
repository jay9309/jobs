const UserSubscription = require("../models/UserSubscription");

async function getActiveSubscription(userId) {
  const subscription = await UserSubscription.findOne({
    user: userId,
    status: "ACTIVE",
    expiryDate: { $gt: new Date() }
  }).populate("plan");

  if (!subscription) {
    await UserSubscription.updateMany(
      { user: userId, status: "ACTIVE", expiryDate: { $lte: new Date() } },
      { $set: { status: "EXPIRED" } }
    );
    return null;
  }

  return subscription;
}

async function canApply(userId) {
  const subscription = await getActiveSubscription(userId);

  if (!subscription) {
    return { allowed: false, reason: "ACTIVE_SUBSCRIPTION_REQUIRED" };
  }

  if (
    subscription.applicationsLimit > 0 &&
    subscription.applicationsUsed >= subscription.applicationsLimit
  ) {
    return { allowed: false, reason: "APPLICATION_LIMIT_REACHED", subscription };
  }

  return { allowed: true, subscription };
}

module.exports = { getActiveSubscription, canApply };
