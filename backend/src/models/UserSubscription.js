const mongoose = require("mongoose");

const userSubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
  startDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  applicationsUsed: { type: Number, default: 0, min: 0 },
  applicationsLimit: { type: Number, default: 0, min: 0 },
  status: { type: String, enum: ["ACTIVE", "EXPIRED", "CANCELLED"], default: "ACTIVE" },
  razorpayOrderId: { type: String, default: "" },
  razorpayPaymentId: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("UserSubscription", userSubscriptionSchema);
