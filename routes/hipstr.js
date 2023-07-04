const express = require("express");
const {
    createJob,
    createJobNoAuth,
    getJobs,
    getJob,
    getJobNoAuth,
    deleteJob,
} = require("../controllers/hipstr");
const validate = require("../middlewares/validation");
const jobResults = require("../middlewares/job_results");
const { protect } = require("../middlewares/auths");
const { hipSTRSchema } = require("../validation/hipstr");

const router = express.Router();

router.post("/noauth/jobs", validate(hipSTRSchema), createJobNoAuth);
router.post("/jobs", protect, validate(hipSTRSchema), createJob);
router.get("/jobs", protect, jobResults, getJobs);
router.get("/jobs/:id", protect, getJob).delete(protect, deleteJob);
router.get("/noauth/jobs/:id", getJobNoAuth);

module.exports = router;
