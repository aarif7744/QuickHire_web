import { Company } from "../models/company.model.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";

import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";


// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Register a Company
export const registerCompany = async (req, res) => {
  try {
    if (!req.id) {
      return res.status(401).json({
        message: "Unauthorized request. Please log in.",
        success: false,
      });
    }

    const { companyName } = req.body;
    if (!companyName) {
      return res
        .status(400)
        .json({ message: "Company name is required.", success: false });
    }

    let company = await Company.findOne({
      name: { $regex: new RegExp(`^${companyName}$`, "i") },
    });

    if (company) {
      return res.status(400).json({
        message: "A company with this name already exists.",
        success: false,
      });
    }

    company = await Company.create({ name: companyName, userId: req.id });

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// Get all companies registered by the user
export const getCompany = async (req, res) => {
  try {
    if (!req.id) {
      return res.status(401).json({
        message: "Unauthorized request. Please log in.",
        success: false,
      });
    }

    const companies = await Company.find({ userId: req.id });

    if (companies.length === 0) {
      return res
        .status(404)
        .json({ message: "No companies found.", success: false });
    }

    return res.status(200).json({ companies, success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// Get company details by ID
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res
        .status(400)
        .json({ message: "Invalid company ID.", success: false });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found.", success: false });
    }

    return res.status(200).json({ company, success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// Update Company Details
export const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res
        .status(400)
        .json({ message: "Invalid company ID.", success: false });
    }

    const { name, description, website, location } = req.body;
    let logo = null;

    if (req.file) {
      // ✅ Only process if a file is uploaded
      const fileUri = getDataUri(req.file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      logo = cloudResponse.secure_url; // ✅ Store Cloudinary URL
    }

    // Ensure at least one field is provided for update
    if (!name && !description && !website && !location && !req.file) {
      return res.status(400).json({
        message: "At least one field is required for an update.",
        success: false,
      });
    }

    // Create an object with only the fields that are provided
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (website) updateData.website = website;
    if (location) updateData.location = location;
    if (logo) updateData.logo = logo; // ✅ Store Cloudinary URL

    const company = await Company.findByIdAndUpdate(companyId, updateData, {
      new: true,
    });

    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found.", success: false });
    }

    return res.status(200).json({
      message: "Company information updated successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// Multer Middleware for File Upload (Attach to Routes)
export const singleUpload = multer({storage}).single("logo");
