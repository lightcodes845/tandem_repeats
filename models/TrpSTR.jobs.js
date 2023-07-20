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


        hipFile: {
            type: String,
            trim: true,
        },

        hipFile2: {
            type: String,
            trim: true,
        },
        hipFile3: {
            type: String,
            trim: true,
        },
        hipFile4: {
            type: String,
            trim: true,
        },
        hipFile5: {
            type: String,
            trim: true,
        },

        // section b first qcstr
        inputFile: {
            type: String,
            required: [true, "Please add a input filename"],
            trim: true,
        },

        qcFile: {
            type: String,
            trim: true,
        },


        qcFile2: {
            type: String,
            trim: true,
        },

        qcFile3: {
            type: String,
            trim: true,
        },

        qcFile4: {
            type: String,
            trim: true,
        },

        qcFile5: {
            type: String,
            trim: true,
        },

        qcFile6: {
            type: String,
            trim: true,
        },

        qcFile7: {
            type: String,
            trim: true,
        },

        qcFile8: {
            type: String,
            trim: true,
        },

        qcFile9: {
            type: String,
            trim: true,
        },

        // section c dumpstr
        inputFile: {
            type: String,
            required: [true, "Please add a input filename"],
            trim: true,
        },

        dumpFile: {
            type: String,
            trim: true,
        },

        //   section d second qcstr
        inputFile: {
            type: String,
            required: [true, "Please add a input filename"],
            trim: true,
        },

        qcFile: {
            type: String,
            trim: true,
        },


        qcFile2: {
            type: String,
            trim: true,
        },

        qcFile3: {
            type: String,
            trim: true,
        },

        qcFile4: {
            type: String,
            trim: true,
        },

        qcFile5: {
            type: String,
            trim: true,
        },

        qcFile6: {
            type: String,
            trim: true,
        },

        qcFile7: {
            type: String,
            trim: true,
        },

        qcFile8: {
            type: String,
            trim: true,
        },

        qcFile9: {
            type: String,
            trim: true,
        },

        // section e statstr
        inputFile: {
            type: String,
            required: [true, "Please add a input filename"],
            trim: true,
        },

        statFile: {
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
