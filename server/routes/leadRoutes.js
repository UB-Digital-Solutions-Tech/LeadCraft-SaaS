const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const {
    createLead,
    getAllLeads,
    updateLead,
    updateLeadStatus,
    deleteLead,
    importLeads,
} = require("../controllers/leadController");

const authMiddleware = require("../middleware/authMiddleware");
router.get("/", authMiddleware, getAllLeads);
router.post("/", authMiddleware, createLead);
router.put("/:id", authMiddleware, updateLead);
router.patch("/:id/status", authMiddleware, updateLeadStatus);
router.delete("/:id", authMiddleware, deleteLead);
router.post("/import", authMiddleware, upload.single("file"), importLeads);

module.exports = router;