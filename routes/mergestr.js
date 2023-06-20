const express = require("express");
const {
    createJob,
    createJobNoAuth,
    getJobs,
    getJob,
    getJobNoAuth,
    deleteJob,
} = require("../controllers/mergestr");
const validate = require("../middlewares/validation");
const jobResults = require("../middlewares/job_results");
const { protect } = require("../middlewares/auths");
const { mergeSTRSchema } = require("../validation/mergestr");

const router = express.Router();

router.post("/noauth/jobs", validate(mergeSTRSchema), createJobNoAuth);
router.post("/jobs", protect, validate(mergeSTRSchema), createJob);
router.get("/jobs", protect, jobResults, getJobs);
router.get("/jobs/:id", protect, getJob).delete(protect, deleteJob);
router.get("/noauth/jobs/:id", getJobNoAuth);

module.exports = router;
