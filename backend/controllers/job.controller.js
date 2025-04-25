import { Job } from "../models/job.model.js";
import mongoose from "mongoose"; // ✅ Import mongoose for ID validation

// ✅ Admin posting a job
export const postJob = async (req, res) => {
    try {
        console.log("Received job data:", req.body);

        // Correcting the field names
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "All fields are required.",
                success: false
            });
        }

        const formattedRequirements = Array.isArray(requirements) ? requirements : requirements.split(",");

        const job = await Job.create({
            title,
            description,
            requirements: formattedRequirements,
            salary: Number(salary),
            location,
            jobtype: jobType,  // ✅ Use `jobtype` to match the model
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.error("❌ Error in postJob:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            error: error.message
        });
    }
};

// ✅ Get all jobs for students
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        };

        const jobs = await Job.find(query).populate("company").sort({ createdAt: -1 });

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error("Error in getAllJobs:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// ✅ Get a single job by ID
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        // ✅ Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                message: "Invalid Job ID format.",
                success: false
            });
        }

        const job = await Job.findById(jobId).populate("applications");

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error("Error fetching job:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// ✅ Get all jobs created by the admin
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        
        const jobs = await Job.find({ created_by: adminId })
            .populate("company") // ✅ Populate company details
            .sort({ createdAt: -1 }); // ✅ Sort jobs by latest first

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found for this admin.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.error("Error in getAdminJobs:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};
