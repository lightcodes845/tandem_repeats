const Joi = require("joi");

const dumpSTRSchema = Joi.object({
  job_name: Joi.string().min(5).max(20).required(),
  useTest: Joi.boolean().required(),
  email: Joi.string().email(),
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
});

module.exports = { dumpSTRSchema };
