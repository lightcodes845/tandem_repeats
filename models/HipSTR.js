const mongoose = require("mongoose");

// for the file are they delimited? what are the columns

const HipSTRSchema = new mongoose.Schema(
    {
        useTest: {
            type: Boolean,
            trim: true,
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "HipSTRJob",
            required: true,
        },
        haploid_chrs: {
            type: Number,
            required: true,
            trim: true,
            enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "all"],
            default: "all",
        },
        use_unpaired: {
            type: String,
            required: true,
            trim: true,
            enum: ["True", "False"],
            default: "False",
        },
        bam_samps: {
            type: String,
            trim: true,
        },
        bam_libs: {
            type: Number,
            trim: true,
        },
        min_reads: {
            type: Number,
            trim: true,
        },


    },
    { timestamps: true }
);

module.exports = mongoose.model("HipSTR", HipSTRSchema);
