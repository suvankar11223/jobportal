import express from "express";
import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
import { saveJob, unsaveJob, getSavedJobs, isJobSaved } from "../controllers/saveJob.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";
 
const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);

// Save job routes
router.route("/saveJob/:jobId").post(isAuthenticated, saveJob);
router.route("/unsaveJob/:jobId").delete(isAuthenticated, unsaveJob);
router.route("/savedJobs").get(isAuthenticated, getSavedJobs);
router.route("/isJobSaved/:jobId").get(isAuthenticated, isJobSaved);

export default router;

