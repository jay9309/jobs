const router = require("express").Router();
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const { dashboard, listUsers, updateUserStatus, listApplications, updateApplicationStatus } = require("../controllers/admin.controller");

router.use(protect, adminOnly);
router.get("/dashboard", dashboard);
router.get("/users", listUsers);
router.patch("/users/:id/status", updateUserStatus);
router.get("/applications", listApplications);
router.patch("/applications/:id/status", updateApplicationStatus);

module.exports = router;
