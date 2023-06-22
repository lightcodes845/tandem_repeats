const mongoose = require("mongoose");

// for the file are they delimited? what are the columns

const MergeSTRSchema = new mongoose.Schema(
    {
        useTest: {
            type: Boolean,
            trim: true,
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MergeSTRJob",
            required: true,
        },
        vcftype: {
            type: String,
            required: true,
            trim: true,
            enum: ["gangstr", "advntr", "hipstr", "auto"],
            default: "auto",
        },

        update_sample_from_file: {
            type: String,
            trim: true,
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("MergeSTR", MergeSTRSchema);
