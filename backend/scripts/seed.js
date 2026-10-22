require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Complaint = require("../models/Complaint");

const sampleComplaints = [
  {
    title: "Lights not working in corridor",
    description: "The lights on the second-floor corridor have not worked since yesterday evening.",
    category: "Electrical", location: "Academic Block B, Floor 2", reporter: "Aarav Sharma", priority: "High", status: "Pending"
  },
  {
    title: "Water leak near washroom",
    description: "There is a continuous water leak near the washroom entrance. The floor is slippery.",
    category: "Plumbing", location: "Library, Ground Floor", reporter: "Priya Das", priority: "High", status: "In Progress"
  },
  {
    title: "Wi-Fi signal is weak",
    description: "The campus Wi-Fi signal drops frequently in the reading area during afternoon hours.",
    category: "Internet", location: "Central Library", reporter: "Rohan Mehta", priority: "Medium", status: "Resolved"
  },
  {
    title: "Broken classroom chair",
    description: "One chair in the front row has a loose leg and should be repaired before the next class.",
    category: "Furniture", location: "Room A-204", reporter: "Ananya Roy", priority: "Low", status: "Pending"
  }
];

async function seed() {
  try {
    await connectDB();
    await Complaint.insertMany(sampleComplaints);
    console.log("Sample complaints added.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
