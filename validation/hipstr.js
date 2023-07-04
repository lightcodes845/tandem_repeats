const Joi = require("joi");

const hipSTRSchema = Joi.object({
    job_name: Joi.string().min(5).max(20).required(),
    useTest: Joi.boolean().required(),
    email: Joi.string().email(),
    haploid_chrs: Joi.number()
        .valid("1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "all")
        .default("all"),
    use_unpaired: Joi.string()
        .valid("True", "False")
        .default("False"),
    bam_samps: Joi.string().allow("").optional(),
    regions: Joi.string().allow("").optional(),
    bam_libs: Joi.number().allow("").optional(),
    min_read: Joi.number().allow("").optional(),

});

module.exports = { hipSTRSchema };
