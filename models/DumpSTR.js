const mongoose = require("mongoose");

// for the file are they delimited? what are the columns

const DumpSTRSchema = new mongoose.Schema(
  {
    useTest: {
      type: Boolean,
      trim: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DumpSTRJob",
      required: true,
    },
    vcftype: {
      type: String,
      required: true,
      trim: true,
      enum: ["gangstr", "advntr", "hipstr", "auto", "popstr", "eh"],
      default: "auto",
    },
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
    gangstr_min_call_DPl: {
      type: Number,
      trim: true,
    },
    gangstr_max_call_D: {
      type: Number,
      trim: true,
    },
    gangstr_min_call_Q: {
      type: Number,
      trim: true,
    },
    gangstr_expansion_prob_het: {
      type: Number,
      trim: true,
    },
    gangstr_expansion_prob_hom: {
      type: Number,
      trim: true,
    },
    gangstr_expansion_prob_total: {
      type: Number,
      trim: true,
    },
    advntr_min_call_DP: {
      type: Number,
      trim: true,
    },
    advntr_max_call_DP: {
      type: Number,
      trim: true,
    },
    advntr_min_spanning: {
      type: Number,
      trim: true,
    },
    advntr_min_flanking: {
      type: Number,
      trim: true,
    },
    advntr_min_ML: {
      type: Number,
      trim: true,
    },
    eh_min_call_LC: {
      type: Number,
      trim: true,
    },
    eh_max_call_LC: {
      type: Number,
      trim: true,
    },
    popstr_min_call_DP: {
      type: Number,
      trim: true,
    },
    eh_max_call_LC: {
      type: Number,
      trim: true,
    },
    eh_max_call_LC: {
      type: Number,
      trim: true,
    },
    popstr_min_call_DP: {
      type: Number,
      trim: true,
    },
    popstr_max_call_DP: {
      type: Number,
      trim: true,
    },
    popstr_require_support: {
      type: Number,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DumpSTR", DumpSTRSchema);
