const mongoose = require("mongoose");

// for the file are they delimited? what are the columns

const TrpSTRSchema = new mongoose.Schema(
    {
        // section A
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
            type: String,
            required: true,
            trim: true,
            enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "all"],
            default: "all",
        },
        fasta: {
            type: String,
            required: true,
            trim: true,
            enum: ["hg19", "hg38"],
            default: "hg19",
        },
        // use_unpaired: {
        //     type: String,
        //     required: true,
        //     trim: true,
        //     enum: ["True", "False"],
        //     default: "False",
        // },
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

        // section B qcstr
        // vcftype: {
        //     type: String,
        //     required: true,
        //     trim: true,
        //     enum: ["gangstr", "advntr", "hipstr", "auto", "popstr", "eh"],
        //     default: "auto",
        // },
        period_qcstrA: {
            type: Number,
            trim: true,
        },
        refbias_binsize_qcstrA: {
            type: Number,
            trim: true,
        },
        refbias_metric_qcstrA: {
            type: String,
            required: true,
            trim: true,
            enum: ["mean", "medium"],
            default: "mean",
        },
        refbias_mingts_qcstrA: {
            type: Number,
            trim: true,
        },


        refbias_xrange_min_qcstrA: {
            type: Number,
            trim: true,
        },
        refbias_xrange_max_qcstrA: {
            type: Number,
            trim: true,
        },

        // section C dumpstr
        // vcftype: {
        //     type: String,
        //     required: true,
        //     trim: true,
        //     enum: ["gangstr", "advntr", "hipstr", "auto", "popstr", "eh"],
        //     default: "auto",
        // },
        num_records: {
            type: Number,
            trim: true,
        },
        min_locus_callrate: {
            type: Number,
            trim: true,
        },
        min_locus_hwep: {
            type: Number,
            trim: true,
        },
        min_locus_het: {
            type: Number,
            trim: true,
        },
        max_locus_het: {
            type: Number,
            trim: true,
        },
        filter_regions: {
            type: String,
            trim: true,
        },
        filter_regions_names: {
            type: String,
            trim: true,
        },
        hipstr_max_call_flank_indel: {
            type: Number,
            trim: true,
        },
        hipstr_max_call_stutter: {
            type: Number,
            trim: true,
        },
        hipstr_min_supp_reads: {
            type: Number,
            trim: true,
        },
        hipstr_min_call_DP: {
            type: Number,
            trim: true,
        },
        hipstr_max_call_DP: {
            type: Number,
            trim: true,
        },
        hipstr_min_call_Q: {
            type: Number,
            trim: true,
        },
        // gangstr_min_call_DPl: {
        //     type: Number,
        //     trim: true,
        // },
        // gangstr_max_call_D: {
        //     type: Number,
        //     trim: true,
        // },
        // gangstr_min_call_Q: {
        //     type: Number,
        //     trim: true,
        // },
        // gangstr_expansion_prob_het: {
        //     type: Number,
        //     trim: true,
        // },
        // gangstr_expansion_prob_hom: {
        //     type: Number,
        //     trim: true,
        // },
        // gangstr_expansion_prob_total: {
        //     type: Number,
        //     trim: true,
        // },
        // advntr_min_call_DP: {
        //     type: Number,
        //     trim: true,
        // },
        // advntr_max_call_DP: {
        //     type: Number,
        //     trim: true,
        // },
        // advntr_min_spanning: {
        //     type: Number,
        //     trim: true,
        // },
        // advntr_min_flanking: {
        //     type: Number,
        //     trim: true,
        // },
        // advntr_min_ML: {
        //     type: Number,
        //     trim: true,
        // },
        // eh_min_call_LC: {
        //     type: Number,
        //     trim: true,
        // },
        // eh_max_call_LC: {
        //     type: Number,
        //     trim: true,
        // },
        // popstr_min_call_DP: {
        //     type: Number,
        //     trim: true,
        // },
        // eh_max_call_LC: {
        //     type: Number,
        //     trim: true,
        // },
        // eh_max_call_LC: {
        //     type: Number,
        //     trim: true,
        // },
        // popstr_min_call_DP: {
        //     type: Number,
        //     trim: true,
        // },
        // popstr_max_call_DP: {
        //     type: Number,
        //     trim: true,
        // },
        // popstr_require_support: {
        //     type: Number,
        //     trim: true,
        // },


        // section D second qcstr
        // vcftype: {
        //     type: String,
        //     required: true,
        //     trim: true,
        //     enum: ["gangstr", "advntr", "hipstr", "auto", "popstr", "eh"],
        //     default: "auto",
        // },
        period_qcstrB: {
            type: Number,
            trim: true,
        },
        refbias_binsize_qcstrB: {
            type: Number,
            trim: true,
        },
        refbias_metric_qcstrB: {
            type: String,
            required: true,
            trim: true,
            enum: ["mean", "medium"],
            default: "mean",
        },
        refbias_mingts_qcstrB: {
            type: Number,
            trim: true,
        },


        refbias_xrange_min_qcstrB: {
            type: Number,
            trim: true,
        },
        refbias_xrange_max_qcstrB: {
            type: Number,
            trim: true,
        },

        // section e statstr
        // vcftype: {
        //     type: String,
        //     required: true,
        //     trim: true,
        //     enum: ["gangstr", "advntr", "hipstr", "auto", "popstr", "eh"],
        //     default: "auto",
        // },
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

module.exports = mongoose.model("TrpSTR", TrpSTRSchema);
