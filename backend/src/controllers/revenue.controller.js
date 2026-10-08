const Payment = require("../models/Payment");

async function revenue(req, res, next) {
  try {
    const now = new Date();
    const start = req.query.from ? new Date(req.query.from) : new Date(now.getFullYear(), now.getMonth(), 1);
    const end = req.query.to ? new Date(req.query.to) : now;
    end.setHours(23, 59, 59, 999);

    const payments = await Payment.find({ createdAt: { $gte: start, $lte: end } })
      .populate("user", "name email")
      .populate("plan", "name price validityDays")
      .sort({ createdAt: -1 });

    const successful = payments.filter(p => p.status === "SUCCESS");
    const totalRevenue = successful.reduce((sum, item) => sum + item.amount, 0);
    const successfulCount = successful.length;
    const failedCount = payments.filter(p => p.status === "FAILED").length;
    const refundedAmount = payments.filter(p => p.status === "REFUNDED").reduce((sum, item) => sum + item.amount, 0);

    const daily = {};
    successful.forEach(p => {
      const key = new Date(p.createdAt).toISOString().slice(0, 10);
      daily[key] = (daily[key] || 0) + p.amount;
    });

    res.json({ success: true, totalRevenue, successfulCount, failedCount, refundedAmount, payments, daily });
  } catch (error) { next(error); }
}

module.exports = { revenue };
