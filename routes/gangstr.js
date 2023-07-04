const express = require("express");
const {
    createJob,
    createJobNoAuth,
    getJobs,
    getJob,
    getJobNoAuth,
    deleteJob,
} = require("../controllers/gangstr");
const validate = require("../middlewares/validation");
const jobResults = require("../middlewares/job_results");
const { protect } = require("../middlewares/auths");
const { gangSTRSchema } = require("../validation/gangstr");

const router = express.Router();

router.post("/noauth/jobs", validate(gangSTRSchema), createJobNoAuth);
router.post("/jobs", protect, validate(gangSTRSchema), createJob);
router.get("/jobs", protect, jobResults, getJobs);
router.get("/jobs/:id", protect, getJob).delete(protect, deleteJob);
router.get("/noauth/jobs/:id", getJobNoAuth);

module.exports = router;
