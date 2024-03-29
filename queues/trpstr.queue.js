const { Queue } = require("bullmq");
const config = require("../config/bullmq.config");

const queue = new Queue(config.trpSTRQueueName, {
    connection: config.connection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
    },
});

module.exports = queue;
