import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";

// Save a job
export const saveJob = async (req, res) => {
    try {
        const userId = req.id; // from isAuthenticated middleware
        const jobId = req.params.jobId;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        // Find user and check if job is already saved
        const user = await User.findById(userId);
        if (user.savedJobs.includes(jobId)) {
            return res.status(400).json({
                success: false,
                message: "Job already saved"
            });
        }

        // Add job to savedJobs
        user.savedJobs.push(jobId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Job saved successfully",
            savedJobs: user.savedJobs
        });
    } catch (error) {
        console.error("Error saving job:", error);
        res.status(500).json({
            success: false,
            message: "Failed to save job"
        });
    }
};

// Unsave a job
export const unsaveJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.jobId;

        const user = await User.findById(userId);
        
        // Remove job from savedJobs
        user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Job unsaved successfully",
            savedJobs: user.savedJobs
        });
    } catch (error) {
        console.error("Error unsaving job:", error);
        res.status(500).json({
            success: false,
            message: "Failed to unsave job"
        });
    }
};

// Get all saved jobs for a user
export const getSavedJobs = async (req, res) => {
    try {
        const userId = req.id;

        const user = await User.findById(userId).populate({
            path: 'savedJobs',
            populate: {
                path: 'company',
                select: 'name logo'
            }
        });

        res.status(200).json({
            success: true,
            jobs: user.savedJobs
        });
    } catch (error) {
        console.error("Error getting saved jobs:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get saved jobs"
        });
    }
};

// Check if a job is saved by user
export const isJobSaved = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.jobId;

        const user = await User.findById(userId);
        const isSaved = user.savedJobs.includes(jobId);

        res.status(200).json({
            success: true,
            isSaved
        });
    } catch (error) {
        console.error("Error checking if job is saved:", error);
        res.status(500).json({
            success: false,
            message: "Failed to check job save status"
        });
    }
};
