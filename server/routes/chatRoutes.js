const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  startConversation,
  sendMessage,
  finalizeConversation,
  getStudentReportById,
  getStudentHistory,
} = require("../controllers/chatController");

router.post("/start", authMiddleware, roleMiddleware("student"), startConversation);
router.post("/message", authMiddleware, roleMiddleware("student"), sendMessage);
router.post("/finalize", authMiddleware, roleMiddleware("student"), finalizeConversation);

router.get("/report/:id", authMiddleware, roleMiddleware("student"), getStudentReportById);
router.get("/history", authMiddleware, roleMiddleware("student"), getStudentHistory);

module.exports = router;