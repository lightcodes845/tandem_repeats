const mongoose = require("mongoose");

// for the file are they delimited? what are the columns

const QcSTRSchema = new mongoose.Schema(
    {
        useTest: {
            type: Boolean,
            trim: true,
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "QcSTRJob",
            required: true,
        },
        vcftype: {
            type: String,
            required: true,
            trim: true,
            enum: ["gangstr", "advntr", "hipstr", "auto", "popstr", "eh"],
            default: "auto",
        },
        period: {
            type: Number,
            trim: true,
        },
        refbias_binsize: {
            type: Number,
            trim: true,
        },
        refbias_metric: {
            type: String,
            required: true,
            trim: true,
            enum: ["mean", "medium"],
            default: "mean",
        },
        refbias_mingts: {
            type: Number,
            trim: true,
        },


        refbias_xrange_min: {
            type: Number,
            trim: true,
        },
        refbias_xrange_max: {
            type: Number,
            trim: true,
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("QcSTR", QcSTRSchema);
