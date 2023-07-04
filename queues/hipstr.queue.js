const { Queue } = require("bullmq");
const config = require("../config/bullmq.config");

const queue = new Queue(config.hipSTRQueueName, {
    connection: config.connection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
    },
});

module.exports = queue;
