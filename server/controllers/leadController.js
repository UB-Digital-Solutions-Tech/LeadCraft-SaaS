
const Lead = require("../models/Lead");

const createLead = async (req, res) => {
  try {
    const { name, company, email, phone, status } = req.body;

    if (!name || !company || !email || !phone) {
      return res.status(400).json({
        message: "All fields are required",
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
        const { id } = req.params;

        const { name, company, email, phone, status } = req.body;

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
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteLead = async (req, res) => {
    try {
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

module.exports = {
  createLead,
  getAllLeads,
  updateLead,
   deleteLead,
};