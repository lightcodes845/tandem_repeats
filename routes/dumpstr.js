const express = require("express");
const {
  createJob,
  createJobNoAuth,
  getJobs,
  getJob,
  getJobNoAuth,
  deleteJob,
} = require("../controllers/dumpstr");
const validate = require("../middlewares/validation");
const jobResults = require("../middlewares/job_results");
const { protect } = require("../middlewares/auths");
const { dumpSTRSchema } = require("../validation/dumpstr");

const router = express.Router();

router.post("/jobs", protect, validate(dumpSTRSchema), createJob);
router.post("noauth/jobs", validate(dumpSTRSchema), createJobNoAuth);
router.get("/jobs", protect, jobResults, getJobs);
router.get("/jobs/:id", protect, getJob).delete(protect, deleteJob);
router.get("/noauth/jobs/:id", getJobNoAuth);

module.exports = router;
