const express = require("express");
const {
    createJob,
    createJobNoAuth,
    getJobs,
    getJob,
    getJobNoAuth,
    deleteJob,
} = require("../controllers/trpstr");
const validate = require("../middlewares/validation");
const jobResults = require("../middlewares/job_results");
const { protect } = require("../middlewares/auths");
const { trpSTRSchema } = require("../validation/trpstr");

const router = express.Router();

router.post("/noauth/jobs", validate(trpSTRSchema), createJobNoAuth);
router.post("/jobs", protect, validate(trpSTRSchema), createJob);
router.get("/jobs", protect, jobResults, getJobs);
router.get("/jobs/:id", protect, getJob).delete(protect, deleteJob);
router.get("/noauth/jobs/:id", getJobNoAuth);

module.exports = router;
