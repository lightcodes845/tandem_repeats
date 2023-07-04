const Joi = require("joi");

const gangSTRSchema = Joi.object({
    job_name: Joi.string().min(5).max(20).required(),
    useTest: Joi.boolean().required(),
    email: Joi.string().email(),

    chrom: Joi.number()
        .valid("1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"),
    bam_samps: Joi.string().allow("").optional(),
    samp_sex: Joi.string().allow("").optional(),
    period: Joi.string().allow("").optional(),
    readlength: Joi.number().integer().allow("").optional(),
    coverage: Joi.number().allow("").optional(),
    insertmean: Joi.number().allow("").optional(),
    insertsdev: Joi.number().integer().allow("").optional(),
    min_sample_reads: Joi.number().allow("").optional(),
    frrweight: Joi.number().allow("").optional(),
    spanweight: Joi.number().integer().allow("").optional(),
    enclweight: Joi.number().allow("").optional(),
    flankweight: Joi.number().allow("").optional(),
    ploidy: Joi.number()
        .valid("1", "2")
        .default("2"),
    numbstrap: Joi.number().allow("").optional(),
    grid_theshold: Joi.number().allow("").optional(),
    rescue_count: Joi.number().allow("").optional(),
    max_proc_read: Joi.number().allow("").optional(),
    minscore: Joi.number().integer().allow("").optional(),
    minmatch: Joi.number().allow("").optional(),
    stutterup: Joi.number().allow("").optional(),
    stutterdown: Joi.number().integer().allow("").optional(),
    stutterprob: Joi.number().allow("").optional(),


});

module.exports = { gangSTRSchema };
