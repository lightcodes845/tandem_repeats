const mongoose = require("mongoose");

const JobStatus = {
    COMPLETED: "completed",
    RUNNING: "running",
    FAILED: "failed",
    ABORTED: "aborted",
    NOTSTARTED: "not-started",
    QUEUED: "queued",
};

const MergeSTRJobSchema = new mongoose.Schema(
    {
        jobUID: {
            type: String,
            required: [true, "Please add a Job UID"],
            unique: true,
            trim: true,
        },

        job_name: {
            type: String,
            required: [true, "Please add a name"],
        },

        inputFile: {
            type: String,
            required: [true, "Please add a input filename"],
            trim: true,
        },



        mergeFile: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: [
                JobStatus.COMPLETED,
                JobStatus.NOTSTARTED,
                JobStatus.RUNNING,
                JobStatus.FAILED,
                JobStatus.ABORTED,
                JobStatus.QUEUED,
            ],
            default: JobStatus.NOTSTARTED,
        },
        longJob: {
            type: Boolean,
            default: false,
        },
        failed_reason: {
            type: String,
            trim: true,
        },
        completionTime: {
            type: Date,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        email: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

//reverse populate jobs with main job parameters
MergeSTRJobSchema.virtual("mergestr", {
    ref: "MergeSTR",
    localField: "_id",
    foreignField: "job",
    required: true,
    justOne: true,
});

module.exports = {
    MergeSTRJob: mongoose.model("MergeSTRJob", MergeSTRJobSchema),
    JobStatus: JobStatus,
};
