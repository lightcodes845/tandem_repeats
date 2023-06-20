const mongoose = require("mongoose");

// for the file are they delimited? what are the columns

const StatSTRSchema = new mongoose.Schema(
    {
        useTest: {
            type: Boolean,
            trim: true,
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StatSTRJob",
            required: true,
        },
        vcftype: {
            type: String,
            required: true,
            trim: true,
            enum: ["gangstr", "advntr", "hipstr", "auto"],
            default: "auto",
        },
        samples: {
            type: String,
            trim: true,
        },

        sample_prefixes: {
            type: String,
            trim: true,
        },
        region: {
            type: String,
            trim: true,
        },

        precision: {
            type: Number,
            trim: true,
        },

        nalleles_thresh: {
            type: String,
            trim: true,
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("StatSTR", StatSTRSchema);
