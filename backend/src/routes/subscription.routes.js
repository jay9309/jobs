const router = require("express").Router();
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const { getPlans, createPlan, updatePlan, getMySubscription } = require("../controllers/subscription.controller");
router.get("/plans", (req, res, next) => {
  if (req.headers.authorization) return protect(req, res, () => getPlans(req, res, next));
  return getPlans(req, res, next);
});
router.get("/my", protect, getMySubscription);
router.post("/plans", protect, adminOnly, createPlan);
router.put("/plans/:id", protect, adminOnly, updatePlan);
module.exports = router;
