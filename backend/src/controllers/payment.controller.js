const crypto = require("crypto");
const mongoose = require("mongoose");
const razorpay = require("../config/razorpay");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const Payment = require("../models/Payment");
const UserSubscription = require("../models/UserSubscription");

async function createOrder(req, res, next) {
  try {
    if (!razorpay || !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({
        success: false,
        message: "Payment service is not configured. Set Razorpay credentials in the backend .env and restart the server."
      });
    }

    const { planId } = req.body;
    if (typeof planId !== "string" || !mongoose.isValidObjectId(planId)) {
      return res.status(400).json({ success: false, message: "A valid subscription plan ID is required" });
    }

    const plan = await SubscriptionPlan.findOne({
      _id: planId,
      isActive: true
    });

    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

    const order = await razorpay.orders.create({
      amount: Math.round(plan.price * 100),
      currency: "INR",
      receipt: `sub_${req.user._id}_${Date.now()}`,
      notes: {
        userId: String(req.user._id),
        planId: String(plan._id)
      }
    });

    const payment = await Payment.create({
      user: req.user._id,
      plan: plan._id,
      amount: plan.price,
      currency: "INR",
      razorpayOrderId: order.id,
      status: "CREATED"
    });

    res.status(201).json({
      success: true,
      order,
      paymentId: payment._id,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    next(error);
  }
}

async function verifyPayment(req, res, next) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;
    if (!razorpay || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({
        success: false,
        message: "Payment service is not configured. Set Razorpay credentials in the backend .env and restart the server."
      });
    }
    if (![razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId].every(
      (value) => typeof value === "string" && value.length > 0
    )) {
      return res.status(400).json({ success: false, message: "Required payment verification details are missing" });
    }
    if (!mongoose.isValidObjectId(paymentId)) {
      return res.status(400).json({ success: false, message: "Invalid payment record ID" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedSignature = Buffer.from(generatedSignature, "hex");
    const suppliedSignature = /^[a-f\d]{64}$/i.test(razorpay_signature)
      ? Buffer.from(razorpay_signature, "hex")
      : Buffer.alloc(0);
    if (
      expectedSignature.length !== suppliedSignature.length ||
      !crypto.timingSafeEqual(expectedSignature, suppliedSignature)
    ) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const payment = await Payment.findOne({
      _id: paymentId,
      razorpayOrderId: razorpay_order_id,
      user: req.user._id
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);
    if (
      razorpayPayment.order_id !== razorpay_order_id ||
      razorpayPayment.amount !== Math.round(payment.amount * 100) ||
      razorpayPayment.currency !== payment.currency
    ) {
      return res.status(400).json({ success: false, message: "Payment details do not match the requested order" });
    }

    let paymentStatus = razorpayPayment.status;
    if (paymentStatus === "authorized") {
      const capturedPayment = await razorpay.payments.capture(
        razorpay_payment_id,
        razorpayPayment.amount,
        razorpayPayment.currency
      );
      paymentStatus = capturedPayment.status;
    }
    if (paymentStatus !== "captured") {
      return res.status(409).json({
        success: false,
        message: `Payment is ${paymentStatus || "not captured"}; the subscription has not been activated.`
      });
    }

    let subscription = await UserSubscription.findOne({
      razorpayPaymentId: razorpay_payment_id,
      user: req.user._id
    });
    if (subscription) {
      await UserSubscription.updateMany(
        { user: req.user._id, status: "ACTIVE", _id: { $ne: subscription._id } },
        { $set: { status: "EXPIRED" } }
      );
      payment.status = "SUCCESS";
      payment.razorpayPaymentId = razorpay_payment_id;
      await payment.save();
      return res.json({
        success: true,
        message: "Payment verified and subscription activated",
        subscription
      });
    }

    const plan = await SubscriptionPlan.findById(payment.plan);
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found" });

    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + plan.validityDays);

    subscription = await UserSubscription.create({
      user: req.user._id,
      plan: plan._id,
      startDate,
      expiryDate,
      applicationsUsed: 0,
      applicationsLimit: plan.applicationLimit,
      status: "ACTIVE",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id
    });

    await UserSubscription.updateMany(
      { user: req.user._id, status: "ACTIVE", _id: { $ne: subscription._id } },
      { $set: { status: "EXPIRED" } }
    );

    payment.status = "SUCCESS";
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    res.json({ success: true, message: "Payment verified and subscription activated", subscription });
  } catch (error) {
    next(error);
  }
}

module.exports = { createOrder, verifyPayment };
