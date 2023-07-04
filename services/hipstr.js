const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const ErrorResponse = require("../utils/errorResponse");
const HipSTR = require("../models/HipSTR");
const { HipSTRJob, JobStatus } = require("../models/HipSTR.jobs");
const { fileOrPathExists } = require("../utils/fileutils");

exports.createJob = async (req, next, queue, user, email) => {
    // Test file
    const testPath = "test.txt";

    // validate input file
    const file = req.files.file;
    const file2 = req.files.file2;
    const file3 = req.files.file3;


    if (req.body.useTest === "false") {
        if (!file) {
            return next(new ErrorResponse(`Please upload a file`, 400));
        }

        // Check file size
        if (file.size > process.env.MAX_FILE_UPLOAD) {
            return next(
                new ErrorResponse(
                    `Please upload an file less than ${process.env.MAX_FILE_UPLOAD / 1024
                    }MB`,
                    400
                )
            );
        }
        // }

        // Check file2 size
        if (file2 && file2.size > process.env.MAX_FILE_UPLOAD) {
            return next(
                new ErrorResponse(
                    `Please upload file2 less than ${process.env.MAX_FILE_UPLOAD / 1024}MB`,
                    400
                )
            );
        }
        // }

        // Check file3 size
        if (file3 && file3.size > process.env.MAX_FILE_UPLOAD) {
            return next(
                new ErrorResponse(
                    `Please upload file3 less than ${process.env.MAX_FILE_UPLOAD / 1024}MB`,
                    400
                )
            );
        }
    }

    if (!req.user && !req.body.email) {
        return next(
            new ErrorResponse(`Please sign in or provide an email for this job`, 400)
        );
    }

    //create jobUID
    const jobUID = uuidv4();

    //create folder with job uid and create input folder in job uid folder
    const value = await fileOrPathExists(
        path.join(process.env.TR_WORKDIR, jobUID)
    );

    if (!value) {
        fs.mkdirSync(path.join(process.env.TR_WORKDIR, jobUID, "input"), {
            recursive: true,
        });
    } else {
        return next(new ErrorResponse(`Problem with creating job workspace`, 500));
    }


    let filepath = "";
    let filepath2 = "";
    let filepath3 = "";
    let longJob = false;

    if (req.body.useTest === "true" && !file) {
        filepath = testPath;
    } else {
        filepath = file.tempFilePath;
        fs.renameSync(
            filepath,
            path.join(process.env.TR_WORKDIR, "temp", file.name)
        );
        filepath = path.join(process.env.TR_WORKDIR, "temp", file.name);
        longJob = file.size > 50 * 1024 * 1024;
    }

    if (file2) {
        filepath2 = file2.tempFilePath;
        fs.renameSync(
            filepath2,
            path.join(process.env.TR_WORKDIR, "temp", file2.name)
        );
        filepath2 = path.join(process.env.TR_WORKDIR, "temp", file2.name);
        longJob = longJob || file2.size > 50 * 1024 * 1024;
    }

    if (file3) {
        filepath3 = file3.tempFilePath;
        fs.renameSync(
            filepath3,
            path.join(process.env.TR_WORKDIR, "temp", file3.name)
        );
        filepath3 = path.join(process.env.TR_WORKDIR, "temp", file3.name);
        longJob = longJob || file3.size > 50 * 1024 * 1024;
    }

    req.body.inputFile = filepath;
    req.body.inputFile2 = filepath2;
    req.body.inputFile3 = filepath3;
    req.body.status = JobStatus.QUEUED;
    req.body.longJob = longJob;
    req.body.jobUID = jobUID;

    //   Create job

    const sessionJob = await HipSTRJob.startSession();
    const sessionModel = await HipSTR.startSession();
    sessionJob.startTransaction();
    sessionModel.startTransaction();

    let newJob;
    try {
        if (req.user) {
            req.body.user = req.user.id;
            newJob = await HipSTRJob.create([req.body], { session: sessionJob });
        }

        if (req.body.email) {
            req.body.email = req.body.email.toLowerCase();
            newJob = await HipSTRJob.create([req.body], { session: sessionJob });
        }

        if (!newJob) {
            throw new Error("Problem with creating job, check your parameters");
        }

        //   Create job parameters
        req.body.job = newJob[0]._id;
        await HipSTR.create([req.body], { session: sessionModel });

        //   Add job to queue
        if (user) {
            await queue.add(newJob[0]._id, {
                jobId: newJob[0]._id,
                jobName: newJob[0].job_name,
                jobUID: newJob[0].jobUID,
                username: user.username,
                email: user.email,
                noAuth: false,
            });
        }

        if (req.body.email) {
            await queue.add(newJob[0]._id, {
                jobId: newJob[0]._id,
                jobName: newJob[0].job_name,
                jobUID: newJob[0].jobUID,
                username: "User",
                email: req.body.email,
                noAuth: true,
            });
        }

        await sessionJob.commitTransaction();
        await sessionModel.commitTransaction();
        console.log("Job created");

        return {
            success: true,
            jobId: newJob[0]._id,
        };
    } catch (err) {
        await sessionJob.abortTransaction();
        await sessionModel.abortTransaction();

        return next(new ErrorResponse(err.message, 400));
    } finally {
        sessionJob.endSession();
        sessionModel.endSession();
    }
};
