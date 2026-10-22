const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Complaint title is required."],
      trim: true,
      minlength: [4, "Title must contain at least 4 characters."],
      maxlength: [100, "Title cannot exceed 100 characters."]
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      minlength: [10, "Description must contain at least 10 characters."],
      maxlength: [1000, "Description cannot exceed 1000 characters."]
    },
    category: {
      type: String,
      required: true,
      enum: ["Electrical", "Plumbing", "Cleaning", "Internet", "Furniture", "Other"]
    },
    location: {
      type: String,
      required: [true, "Location is required."],
      trim: true,
      maxlength: [120, "Location cannot exceed 120 characters."]
    },
    reporter: {
      type: String,
      required: [true, "Reporter name is required."],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters."]
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
