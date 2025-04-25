import { Application } from "../models/application.model.js"; // Correct relative path
import { Job } from "../models/job.model.js"; // Correct relative path
 // Assuming you have a User model if needed

// Apply for a job
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const { id: jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        message: "Job ID is required",
        success: false,
      });
    }

    // Check if the user has already applied for this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId, // Corrected the key from "application" to "applicant"
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // Create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    // Add the application to the job's application list
    job.applications.push(newApplication._id);
    await job.save();

    return res.status(201).json({
      message: "Job successfully applied",
      success: true,
    });
  } catch (error) {
    console.error("Error in applyJob:", error);
    return res.status(500).json({
      message: "An error occurred while applying for the job",
      success: false,
    });
  }
};

// Get all jobs applied by the user
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company",
        },
      });

    if (!applications || applications.length === 0) {
      return res.status(404).json({
        message: "No applications found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Applications fetched successfully",
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Error in getAppliedJobs:", error);
    return res.status(500).json({
      message: "An error occurred while fetching applications",
      success: false,
    });
  }
};

// Get all applicants for a specific job
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      populate: {
        path: "applicant",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job applicants fetched successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.error("Error in getApplicants:", error);
    return res.status(500).json({
      message: "An error occurred while fetching applicants",
      success: false,
    });
  }
};

// Update the status of an application
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }

    // Find the application by its ID
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    application.status = status.toLowerCase(); // Update status
    await application.save();

    return res.status(200).json({
      message: "Status updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in updateStatus:", error);
    return res.status(500).json({
      message: "An error occurred while updating the application status",
      success: false,
    });
  }
};
