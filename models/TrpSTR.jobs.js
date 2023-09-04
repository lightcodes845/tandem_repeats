const mongoose = require("mongoose");

const JobStatus = {
    COMPLETED: "completed",
    RUNNING: "running",
    FAILED: "failed",
    ABORTED: "aborted",
    NOTSTARTED: "not-started",
    QUEUED: "queued",
};

const TrpSTRJobSchema = new mongoose.Schema(
    {
        // section A hipstr
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

        inputFile2: {
            type: String,
            required: [true, "Please add a input filename"],
            trim: true,
        },


        trpFile: {
            type: String,
            trim: true,
        },

        trpFile2: {
            type: String,
            trim: true,
        },

        // section b first qcstr
        trpFile3: {
            type: String,
            trim: true,
        },
        trpFile4: {
            type: String,
            trim: true,
        },
        trpFile5: {
            type: String,
            trim: true,
        },

        trpFile6: {
            type: String,
            trim: true,
        },
        trpFile7: {
            type: String,
            trim: true,
        },
        trpFile8: {
            type: String,
            trim: true,
        },
        trpFile9: {
            type: String,
            trim: true,
        },
        trpFile10: {
            type: String,
            trim: true,
        },
        trpFile11: {
            type: String,
            trim: true,
        },
        trpFile12: {
            type: String,
            trim: true,
        },
        // section c
        trpFile13: {
            type: String,
            trim: true,
        },
        trpFile14: {
            type: String,
            trim: true,
        },

        // section d
        trpFile15: {
            type: String,
            trim: true,
        },
        trpFile16: {
            type: String,
            trim: true,
        },
        trpFile17: {
            type: String,
            trim: true,
        },
        trpFile18: {
            type: String,
            trim: true,
        },
        trpFile19: {
            type: String,
            trim: true,
        },
        trpFile20: {
            type: String,
            trim: true,
        },
        trpFile21: {
            type: String,
            trim: true,
        },
        trpFile22: {
            type: String,
            trim: true,
        },
        // section e
        trpFile23: {
            type: String,
            trim: true,
        },
        trpFile24: {
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
TrpSTRJobSchema.virtual("trpstr", {
    ref: "TrpSTR",
    localField: "_id",
    foreignField: "job",
    required: true,
    justOne: true,
});

module.exports = {
    TrpSTRJob: mongoose.model("TrpSTRJob", TrpSTRJobSchema),
    JobStatus: JobStatus,
};
