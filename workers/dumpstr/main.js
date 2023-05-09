const { Worker } = require("bullmq");
const path = require("path");
const config = require("../../config/bullmq.config");
const { DumpSTRJob, JobStatus } = require("../../models/DumpSTR.jobs");
const DumpSTR = require("../../models/DumpSTR");

const processorFile = path.join(__dirname, "worker.js");

exports.createDumpSTRWorkers = async (numWorkers) => {
  for (let i = 0; i < numWorkers; i++) {
    console.log("Creating DumpSTR worker " + i);

    const worker = new Worker(config.dumpSTRQueueName, processorFile, {
      connection: config.connection,
      limiter: config.limiter,
    });

    worker.on("completed", async (job, returnvalue) => {
      console.log("worker " + i + " completed " + returnvalue);

      // save in mongo database
      // job is complete
      const parameters = await DumpSTR.findOne({
        job: job.data.jobId,
      }).exec();

      // const jobParams = await AnnotationJobsModel.findById(job.data.jobId).exec();

      const pathToOutputDir = path.join(
        process.env.TR_WORKDIR,
        job.data.jobUID,
        "dumpstr",
        "output"
      );
      const finishedJob = await DumpSTRJob.findByIdAndUpdate(
        job.data.jobId,
        {
          status: JobStatus.COMPLETED,

          completionTime: new Date(),
        },
        { new: true }
      );
      //   send email
    });

    worker.on("failed", async (job) => {
      console.log("worker " + i + " failed " + job.failedReason);
      //update job in database as failed
      //save in mongo database
      const finishedJob = await DumpSTRJob.findByIdAndUpdate(
        job.data.jobId,
        {
          status: JobStatus.FAILED,
          failed_reason: job.failedReason,
          completionTime: new Date(),
        },
        { new: true }
      );

      //   send email
    });

    // worker.on('close', () => {
    //   console.log('worker ' + i + ' closed');
    // });

    process.on("SIGINT", () => {
      worker.close();
      console.log("worker " + i + " closed");
    });

    process.on("SIGTERM", () => {
      worker.close();
      console.log("worker " + i + " closed");
    });

    process.on("SIGBREAK", () => {
      worker.close();
      console.log("worker " + i + " closed");
    });

    console.log("Worker " + i + " created");
  }
};
