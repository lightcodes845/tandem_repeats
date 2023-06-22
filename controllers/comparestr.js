const { v4: uuidv4 } = require("uuid");
const CompareSTR = require("../models/CompareSTR");
const { CompareSTRJob, JobStatus } = require("../models/CompareSTR.jobs");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const { fileOrPathExists } = require("../utils/fileutils");
const { createJob } = require("../services/comparestr");
const queue = require("../queues/comparestr.queue");

// @desc create new CompareSTR job
// @route POST /api/v1/comparestr/jobs
// @access Private
exports.createJob = asyncHandler(async (req, res, next) => {
    const result = await createJob(req, next, queue, req.user, null);

    // send response
    res.status(201).json(result);
});

// @desc create new CompareSTR job
// @route POST /api/v1/comparestr/noauth/jobs
// @access Public
exports.createJobNoAuth = asyncHandler(async (req, res, next) => {
    const result = await createJob(req, next, queue, null, req.body.email);

    // send response
    res.status(201).json(result);
});

// @desc get all jobs
// @route GET /api/v1/comparestr/jobs
// @access Private
exports.getJobs = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.jobResults);
});

// @desc get single job
// @route GET /api/v1/comparestr/jobs/:id
// @access Private
exports.getJob = asyncHandler(async (req, res, next) => {
    const job = await CompareSTRJob.findById(id)
        .populate("comparestr")
        .populate("user");

    if (!job) {
        return next(
            new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
        );
    }

    if (job?.user?.username !== user.username) {
        return next(new ErrorResponse(`Unauthorized to access this job`, 401));
    }

    return res.status(200).json({
        success: true,
        data: job,
    });
});

// @desc get single job no authentication
// @route GET /api/v1/comparestr/noauth/jobs/:id
// @access Public
exports.getJobNoAuth = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    const job = await CompareSTRJob.findById(id)
        .populate("comparestr")
        .populate("user");

    if (!job) {
        return next(
            new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
        );
    }

    if (job?.user?.username) {
        return next(new ErrorResponse(`Unauthorized to access this job`, 401));
    }

    //   return job;
    // });


    return res.status(200).json({
        success: true,
        data: job,
    });
});

// @desc delete job
// @route DELETE /api/v1/comparestr/jobs/:id
// @access Private
exports.deleteJob = asyncHandler(async (req, res, next) => {
    const job = await CompareSTRJob.findById(req.params.id);

    if (!job) {
        return next(
            new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
        );
    }

    if (job?.user?.username !== user.username) {
        return next(new ErrorResponse(`Unauthorized to access this job`, 401));
    }

    //  check if job is running
    if (job.status === JobStatus.RUNNING) {
        return next(
            new ErrorResponse(`Job is currently running, wait for it complete`, 400)
        );
    }

    // if job is not running, delete in database and delete folder
    await job.remove();
    await deleteFileorFolder(path.join(process.env.TR_WORKDIR, jobUID));

    res.status(200).json({
        success: true,
        data: {},
    });
});
