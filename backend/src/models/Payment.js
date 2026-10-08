const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  razorpayOrderId: { type: String, default: "" },
  razorpayPaymentId: { type: String, default: "" },
  status: { type: String, enum: ["CREATED", "SUCCESS", "FAILED", "REFUNDED"], default: "CREATED" }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
