const express = require("express");
const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");

const router = express.Router();
const validStatuses = ["Pending", "In Progress", "Resolved"];
const validPriorities = ["Low", "Medium", "High"];

router.get("/", async (req, res, next) => {
  try {
    const { status, category, search } = req.query;
    const filter = {};

    if (status && validStatuses.includes(status)) filter.status = status;
    if (category) filter.category = category;
    if (search && search.trim()) {
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { location: { $regex: safeSearch, $options: "i" } },
        { reporter: { $regex: safeSearch, $options: "i" } }
      ];
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid complaint ID." });
    }
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }
    res.json({ success: true, data: complaint });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { title, description, category, location, reporter, priority } = req.body;
    if (!title || !description || !category || !location || !reporter) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, description, category, location, and reporter name."
      });
    }
    const complaint = await Complaint.create({
      title, description, category, location, reporter,
      priority: priority || "Medium"
    });
    res.status(201).json({ success: true, message: "Complaint submitted successfully.", data: complaint });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid complaint ID." });
    }
    const updates = {};
    if (req.body.status !== undefined) {
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({ success: false, message: "Invalid status value." });
      }
      updates.status = req.body.status;
    }
    if (req.body.priority !== undefined) {
      if (!validPriorities.includes(req.body.priority)) {
        return res.status(400).json({ success: false, message: "Invalid priority value." });
      }
      updates.priority = req.body.priority;
    }
    if (!Object.keys(updates).length) {
      return res.status(400).json({ success: false, message: "Provide a status or priority to update." });
    }

    const complaint = await Complaint.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }
    res.json({ success: true, message: "Complaint updated successfully.", data: complaint });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid complaint ID." });
    }
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }
    res.json({ success: true, message: "Complaint deleted successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
