const Joi = require("joi");

const statSTRSchema = Joi.object({
    job_name: Joi.string().min(5).max(20).required(),
    useTest: Joi.boolean().required(),
    email: Joi.string().email(),
    vcftype: Joi.string()
        .valid("gangstr", "advntr", "hipstr", "auto", "popstr", "eh")
        .default("auto"),
    samples: Joi.string().allow("").optional(),
    sample_prefixes: Joi.string().allow("").optional(),
    region: Joi.string().allow("").optional(),
    region: Joi.string().allow("").optional(),
    precision: Joi.number().integer().allow("").optional(),
    //*
    nalleles_thresh: Joi.string().allow("").optional(),


});

module.exports = { statSTRSchema };
