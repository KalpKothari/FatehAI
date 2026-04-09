const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { getAllLeads, getLeadById } = require("../controllers/adminController");

router.get("/leads", authMiddleware, roleMiddleware("admin"), getAllLeads);
router.get("/leads/:id", authMiddleware, roleMiddleware("admin"), getLeadById);

module.exports = router;