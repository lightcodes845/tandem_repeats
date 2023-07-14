const Joi = require("joi");

const compareSTRSchema = Joi.object({
    job_name: Joi.string().min(5).max(20).required(),
    useTest: Joi.boolean().required(),
    email: Joi.string().email(),
    vcftype1: Joi.string()
        .valid("gangstr", "advntr", "hipstr", "auto", "popstr", "eh")
        .default("auto"),
    vcftype2: Joi.string()
        .valid("gangstr", "advntr", "hipstr", "auto", "popstr", "eh")
        .default("auto"),
    samples: Joi.string().allow("").optional(),
    regions: Joi.string().allow("").optional(),
    stratify_fields: Joi.string().allow("").optional(),
    stratify_binsizes: Joi.string().allow("").optional(),
    stratify_file: Joi.number().integer().allow("").optional(),
    bubble_min: Joi.number().allow("").optional(),
    bubble_max: Joi.number().allow("").optional(),

});

module.exports = { compareSTRSchema };
