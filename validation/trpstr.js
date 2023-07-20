const Joi = require("joi");

const trpSTRSchema = Joi.object({
    // section A hipstr
    job_name: Joi.string().min(5).max(20).required(),
    useTest: Joi.boolean().required(),
    email: Joi.string().email(),
    haploid_chrs: Joi.number()
        .valid("1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "all")
        .default("all"),
    fasta: Joi.string()
        .valid("hg19", "hg38")
        .default("hg19"),
    use_unpaired: Joi.string()
        .valid("True", "False")
        .default("False"),
    bam_samps: Joi.string().allow("").optional(),
    regions: Joi.string().allow("").optional(),
    bam_libs: Joi.number().allow("").optional(),
    min_read: Joi.number().allow("").optional(),

    //     section b first qcstr
    vcftype: Joi.string()
        .valid("gangstr", "advntr", "hipstr", "auto", "popstr", "eh")
        .default("auto"),
    period: Joi.number().integer().allow("").optional(),
    refbias_binsize: Joi.number().integer().allow("").optional(),
    refbias_metric: Joi.string()
        .valid("mean", "medium")
        .default("mean"),
    refbias_mingts: Joi.number().integer().allow("").optional(),
    refbias_xrange_min: Joi.number().integer().allow("").optional(),
    refbias_xrange_max: Joi.number().integer().allow("").optional(),

    // section c dumpstr
    vcftype: Joi.string()
        .valid("gangstr", "advntr", "hipstr", "auto", "popstr", "eh")
        .default("auto"),
    num_records: Joi.number().integer().allow("").optional(),
    min_locus_callrate: Joi.number().allow("").optional(),
    min_locus_hwep: Joi.number().allow("").optional(),
    min_locus_het: Joi.number().allow("").optional(),
    max_locus_het: Joi.number().allow("").optional(),
    filter_regions_names: Joi.string().allow("").optional(),
    filter_regions: Joi.string().allow("").optional(),
    hipstr_max_call_flank_indel: Joi.number().allow("").optional(),
    hipstr_max_call_stutter: Joi.number().allow("").optional(),
    hipstr_min_supp_reads: Joi.number().integer().allow("").optional(),
    hipstr_min_call_DP: Joi.number().integer().allow("").optional(),
    hipstr_max_call_DP: Joi.number().integer().allow("").optional(),
    hipstr_min_call_Q: Joi.number().allow("").optional(),
    gangstr_min_call_DPl: Joi.number().integer().allow("").optional(),
    gangstr_max_call_D: Joi.number().integer().allow("").optional(),
    gangstr_min_call_Q: Joi.number().allow("").optional(),
    gangstr_expansion_prob_het: Joi.number().allow("").optional(),
    gangstr_expansion_prob_hom: Joi.number().allow("").optional(),
    gangstr_expansion_prob_total: Joi.number().allow("").optional(),
    advntr_min_call_DP: Joi.number().integer().allow("").optional(),
    advntr_max_call_DP: Joi.number().integer().allow("").optional(),
    advntr_min_spanning: Joi.number().integer().allow("").optional(),
    advntr_min_flanking: Joi.number().integer().allow("").optional(),
    advntr_min_ML: Joi.number().allow("").optional(),
    eh_min_call_LC: Joi.number().integer().allow("").optional(),
    eh_max_call_LC: Joi.number().integer().allow("").optional(),
    popstr_min_call_DP: Joi.number().integer().allow("").optional(),
    popstr_max_call_DP: Joi.number().integer().allow("").optional(),
    popstr_require_support: Joi.number().integer().allow("").optional(),

    // section d second qcstr
    vcftype: Joi.string()
        .valid("gangstr", "advntr", "hipstr", "auto", "popstr", "eh")
        .default("auto"),
    period: Joi.number().integer().allow("").optional(),
    refbias_binsize: Joi.number().integer().allow("").optional(),
    refbias_metric: Joi.string()
        .valid("mean", "medium")
        .default("mean"),
    refbias_mingts: Joi.number().integer().allow("").optional(),
    refbias_xrange_min: Joi.number().integer().allow("").optional(),
    refbias_xrange_max: Joi.number().integer().allow("").optional(),

    // section e statstr
    vcftype: Joi.string()
        .valid("gangstr", "advntr", "hipstr", "auto", "popstr", "eh")
        .default("auto"),
    samples: Joi.string().allow("").optional(),
    sample_prefixes: Joi.string().allow("").optional(),
    region: Joi.string().allow("").optional(),
    region: Joi.string().allow("").optional(),
    precision: Joi.number().integer().allow("").optional(),
    nalleles_thresh: Joi.string().allow("").optional(),
});

module.exports = { trpSTRSchema };
