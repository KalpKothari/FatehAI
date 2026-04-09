const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { createMeeting } = require("../controllers/meetingController");

router.post("/", authMiddleware, roleMiddleware("admin"), createMeeting);

module.exports = router;