const mongoose = require("mongoose");

// for the file are they delimited? what are the columns

const GangSTRSchema = new mongoose.Schema(
    {
        useTest: {
            type: Boolean,
            trim: true,
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GangSTRJob",
            required: true,
        },
        chrom: {
            type: Number,
            required: true,
            trim: true,
            enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
            default: "auto",
        },

        bam_samps: {
            type: String,
            trim: true,
        },
        samp_sex: {
            type: String,
            trim: true,
        },
        period: {
            type: String,
            trim: true,
        },

        coverage: {
            type: Number,
            trim: true,
        },
        insertmean: {
            type: Number,
            trim: true,
        },
        insertsdev: {
            type: Number,
            trim: true,
        },
        min_sample_reads: {
            type: Number,
            trim: true,
        },
        frrweight: {
            type: Number,
            trim: true,
        },
        spanweight: {
            type: Number,
            trim: true,
        },
        enclweight: {
            type: Number,
            trim: true,
        },
        flankweight: {
            type: Number,
            trim: true,
        },
        ploidy: {
            type: String,
            required: true,
            trim: true,
            enum: ["1", "2"],
            default: "2",
        },

        numbstrap: {
            type: Number,
            trim: true,
        },
        grid_theshold: {
            type: Number,
            trim: true,
        },
        rescue_count: {
            type: Number,
            trim: true,
        },
        max_proc_read: {
            type: Number,
            trim: true,
        },
        minscore: {
            type: Number,
            trim: true,
        },
        minmatch: {
            type: Number,
            trim: true,
        },
        stutterup: {
            type: Number,
            trim: true,
        },
        stutterdown: {
            type: Number,
            trim: true,
        },
        stutterprob: {
            type: Number,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("GangSTR", GangSTRSchema);
