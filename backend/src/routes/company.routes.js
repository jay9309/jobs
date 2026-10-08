const router = require("express").Router();
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");
const { getCompanies, createCompany, updateCompany, deleteCompany } = require("../controllers/company.controller");
router.get("/", getCompanies);
router.post("/", protect, adminOnly, createCompany);
router.put("/:id", protect, adminOnly, updateCompany);
router.delete("/:id", protect, adminOnly, deleteCompany);
module.exports = router;
