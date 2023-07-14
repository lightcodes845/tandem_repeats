const Joi = require("joi");

const mergeSTRSchema = Joi.object({
    job_name: Joi.string().min(5).max(20).required(),
    useTest: Joi.boolean().required(),
    email: Joi.string().email(),
    vcftype: Joi.string()
        .valid("gangstr", "advntr", "hipstr", "auto", "popstr", "eh")
        .default("auto"),
    update_sample_from_file: Joi.string().allow("").optional(),

});

module.exports = { mergeSTRSchema };
