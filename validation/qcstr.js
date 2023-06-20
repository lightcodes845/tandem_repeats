const Joi = require("joi");

const qcSTRSchema = Joi.object({
    job_name: Joi.string().min(5).max(20).required(),
    useTest: Joi.boolean().required(),
    email: Joi.string().email(),
    vcftype: Joi.string()
        .valid("gangstr", "advntr", "hipstr", "auto")
        .default("auto"),
    period: Joi.number().integer().allow("").optional(),
    refbias_binsize: Joi.number().integer().allow("").optional(),
    refbias_metric: Joi.string()
        .valid("mean", "medium")
        .default("mean"),
    refbias_mingts: Joi.number().integer().allow("").optional(),
    refbias_xrange_min: Joi.number().integer().allow("").optional(),
    refbias_xrange_max: Joi.number().integer().allow("").optional(),

});

module.exports = { qcSTRSchema };
