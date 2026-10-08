// Optional scheduled task.
// In production use a scheduler/cron package or hosting scheduler.
const UserSubscription = require("../models/UserSubscription");

async function expireSubscriptions() {
  await UserSubscription.updateMany(
    { status: "ACTIVE", expiryDate: { $lte: new Date() } },
    { $set: { status: "EXPIRED" } }
  );
}

module.exports = { expireSubscriptions };
