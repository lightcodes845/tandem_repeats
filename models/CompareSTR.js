const mongoose = require("mongoose");

// for the file are they delimited? what are the columns

const CompareSTRSchema = new mongoose.Schema(
    {
        useTest: {
            type: Boolean,
            trim: true,
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CompareSTRJob",
            required: true,
        },
        vcftype1: {
            type: String,
            required: true,
            trim: true,
            enum: ["gangstr", "advntr", "hipstr", "auto", "popstr", "eh"],
            default: "auto",
        },
        vcftype2: {
            type: String,
            required: true,
            trim: true,
            enum: ["gangstr", "advntr", "hipstr", "auto", "popstr", "eh"],
            default: "auto",
        },
        samples: {
            type: String,
            trim: true,
        },
        regions: {
            type: String,
            trim: true,
        },
        stratify_fields: {
            type: String,
            trim: true,
        },
        stratify_binsizes: {
            type: String,
            trim: true,
        },
        stratify_file: {
            type: Number,
            trim: true,
        },
        bubble_min: {
            type: Number,
            trim: true,
        },
        bubble_max: {
            type: Number,
            trim: true,
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("CompareSTR", CompareSTRSchema);
