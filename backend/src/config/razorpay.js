const Razorpay = require("razorpay");

const hasCredentials = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

if (!hasCredentials) {
  console.warn("Razorpay keys are not configured. Payment APIs will not work until .env is configured.");
}

const razorpay = hasCredentials
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })
  : null;

module.exports = razorpay;
