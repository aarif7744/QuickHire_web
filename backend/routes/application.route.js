import express from "express";
import { applyJob, getAppliedJobs, getApplicants, updateStatus } from "../controllers/application.controller.js";
// Corrected import path
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

// Route to apply for a job
router.route("/apply/:id").post(isAuthenticated, applyJob); // Changed GET to POST for applying to a job

// Route to get all jobs applied by the authenticated user
router.route("/get").get(isAuthenticated, getAppliedJobs); // Kept GET for fetching applied jobs

// Route to get all applicants for a specific job
router.route("/:id/applicants").get(isAuthenticated, getApplicants); // Kept GET for fetching applicants

// Route to update the status of an application
router.route("/status/:id/update").post(isAuthenticated, updateStatus); // Changed POST to PATCH for partial update

export default router;
