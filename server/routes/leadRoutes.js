const express = require("express");
const router = express.Router();

const {
    createLead,
    getAllLeads,
    updateLead,
    updateLeadStatus,
    deleteLead,
} = require("../controllers/leadController");

const authMiddleware = require("../middleware/authMiddleware");
router.get("/", authMiddleware, getAllLeads);
router.post("/", authMiddleware, createLead);
router.put("/:id", authMiddleware, updateLead);
router.patch("/:id/status", authMiddleware, updateLeadStatus);
router.delete("/:id", authMiddleware, deleteLead);

module.exports = router;