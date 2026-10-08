const router = require("express").Router();
const { protect } = require("../middleware/auth.middleware");
const { applyToJob, myApplications } = require("../controllers/application.controller");

router.get("/my", protect, myApplications);
router.post("/:jobId/apply", protect, applyToJob);

module.exports = router;
