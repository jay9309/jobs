const router = require("express").Router();
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const { revenue } = require("../controllers/revenue.controller");

router.get("/", protect, adminOnly, revenue);

module.exports = router;
