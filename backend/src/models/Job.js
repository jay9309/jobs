const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  title: { type: String, required: true, trim: true },
  location: { type: String, default: "" },
  experience: { type: String, default: "" },
  jobType: { type: String, default: "Full Time" },
  qualification: { type: String, default: "" },
  skills: [{ type: String }],
  salary: { type: String, default: "" },
  description: { type: String, default: "" },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
  sourceUrl: { type: String, required: true },
  published: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  fetchedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
