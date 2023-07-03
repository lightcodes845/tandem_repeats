const config = {
  concurrency: parseInt(process.env.QUEUE_CONCURRENCY || "1"),
  queueName: process.env.QUEUE_NAME || "tr_queue",
  dumpSTRQueueName: process.env.DUMPSTR_QUEUE_NAME || "dumpstr",

  //*mergestr
  mergeSTRQueueName: process.env.MERGESTR_QUEUE_NAME || "mergestr",
  statSTRQueueName: process.env.STATSTR_QUEUE_NAME || "statstr",
  compareSTRQueueName: process.env.COMPARESTR_QUEUE_NAME || "comparestr",

  connection: {
    host: process.env.REDIS_BULL_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
  limiter: {
    max: parseInt(process.env.MAX_LIMIT || "1"),
    duration: parseInt(process.env.DURATION_LIMIT || "1000"),
    // groupKey: 'annotation',
  },
  numWorkers: process.env.NUMWORKERS || 1,
};

module.exports = config;
