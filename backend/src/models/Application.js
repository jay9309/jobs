const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  appliedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["REDIRECTED", "APPLIED", "WITHDRAWN"],
    default: "REDIRECTED"
  }
}, { timestamps: true });

applicationSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
