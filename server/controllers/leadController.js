const Lead = require("../models/Lead");

const createLead = async (req, res) => {
  try {
    if (req.user.role === "Sales Executive") {
      return res.status(403).json({
        message: "Sales Executives cannot add leads",
      });
    }

    const { name, company, email, phone, status } = req.body;

    if (!name || !company || !email || !phone) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone number must contain exactly 10 digits",
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        message: "Enter a valid email address",
      });
    }

    const existingLead = await Lead.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
    });

    if (existingLead) {
      return res.status(409).json({
        message:
          existingLead.email === email.toLowerCase()
            ? "A lead with this email already exists"
            : "A lead with this phone number already exists",
      });
    }

    const lead = await Lead.create({
      name,
      company,
      email,
      phone,
      status,
    });

    res.status(201).json({
      message: "Lead created successfully",
      lead,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A lead with this email or phone number already exists",
      });
    }
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllLeads = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });

        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const updateLead = async (req, res) => {
    try {
        if (req.user.role === "Sales Executive") {
            return res.status(403).json({
                message: "Sales Executives cannot edit leads",
            });
        }

        const { id } = req.params;

        const { name, company, email, phone, status } = req.body;

        if (!name || !company || !email || !phone) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({
                message: "Phone number must contain exactly 10 digits",
            });
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({
                message: "Enter a valid email address",
            });
        }

        // Exclude this lead's own _id, otherwise saving without changing
        // email/phone would falsely flag itself as a duplicate.
        const existingLead = await Lead.findOne({
            _id: { $ne: id },
            $or: [{ email: email.toLowerCase() }, { phone }],
        });

        if (existingLead) {
            return res.status(409).json({
                message:
                    existingLead.email === email.toLowerCase()
                        ? "Another lead with this email already exists"
                        : "Another lead with this phone number already exists",
            });
        }

        const updatedLead = await Lead.findByIdAndUpdate(
            id,
            {
                name,
                company,
                email,
                phone,
                status,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedLead) {
            return res.status(404).json({
                message: "Lead not found",
            });
        }

        res.status(200).json({
            message: "Lead updated successfully",
            lead: updatedLead,
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "A lead with this email or phone number already exists",
            });
        }
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteLead = async (req, res) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json({
                message: "Only Admin can delete leads",
            });
        }
        const { id } = req.params;

        const deletedLead = await Lead.findByIdAndDelete(id);

        if (!deletedLead) {
            return res.status(404).json({
                message: "Lead not found",
            });
        }

        res.status(200).json({
            message: "Lead deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Lightweight endpoint for the Kanban board drag-and-drop.
// Only touches status, so a drag doesn't need to send/validate the whole lead.
const updateLeadStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!["New", "Contacted", "Qualified"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status value",
            });
        }

        const updatedLead = await Lead.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedLead) {
            return res.status(404).json({
                message: "Lead not found",
            });
        }

        res.status(200).json({
            message: "Status updated successfully",
            lead: updatedLead,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const { parse } = require("csv-parse/sync");

const importLeads = async (req, res) => {
  try {
    if (req.user.role === "Sales Executive") {
      return res.status(403).json({
        message: "Sales Executives cannot import leads",
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No CSV file uploaded" });
    }

    const records = parse(req.file.buffer.toString("utf-8"), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    let inserted = 0;
    let skipped = 0;
    const errors = [];

    for (const row of records) {
      const name = row.Name || row.name;
      const company = row.Company || row.company;
      const email = (row.Email || row.email || "").toLowerCase();
      const phone = row.Phone || row.phone;
      const status = row.Status || row.status || "New";

      if (!name || !company || !email || !phone) {
        skipped++;
        errors.push(`Skipped row (missing fields): ${JSON.stringify(row)}`);
        continue;
      }
      if (!/^\d{10}$/.test(phone)) {
        skipped++;
        errors.push(`Skipped ${email}: invalid phone number`);
        continue;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        skipped++;
        errors.push(`Skipped row: invalid email "${email}"`);
        continue;
      }

      const existingLead = await Lead.findOne({ $or: [{ email }, { phone }] });
      if (existingLead) {
        skipped++;
        errors.push(`Skipped ${email}: already exists`);
        continue;
      }

      await Lead.create({
        name,
        company,
        email,
        phone,
        status: ["New", "Contacted", "Qualified"].includes(status) ? status : "New",
      });
      inserted++;
    }

    res.status(200).json({
      message: `Import complete: ${inserted} added, ${skipped} skipped`,
      inserted,
      skipped,
      errors,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLead,
  getAllLeads,
  updateLead,
  deleteLead,
  updateLeadStatus,
  importLeads,
};