const express = require("express");
const {
    createJob,
    createJobNoAuth,
    getJobs,
    getJob,
    getJobNoAuth,
    deleteJob,
} = require("../controllers/statstr");
const validate = require("../middlewares/validation");
const jobResults = require("../middlewares/job_results");
const { protect } = require("../middlewares/auths");
const { statSTRSchema } = require("../validation/statstr");

const router = express.Router();

router.post("/noauth/jobs", validate(statSTRSchema), createJobNoAuth);
router.post("/jobs", protect, validate(statSTRSchema), createJob);
router.get("/jobs", protect, jobResults, getJobs);
router.get("/jobs/:id", protect, getJob).delete(protect, deleteJob);
router.get("/noauth/jobs/:id", getJobNoAuth);

module.exports = router;
