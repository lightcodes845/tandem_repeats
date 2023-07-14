const { Worker } = require("bullmq");
const path = require("path");
const config = require("../../config/bullmq.config");
const { HipSTRJob, JobStatus } = require("../../models/HipSTR.jobs");
const HipSTR = require("../../models/HipSTR");

const processorFile = path.join(__dirname, "worker.js");

exports.createHipSTRWorkers = async (numWorkers) => {
  for (let i = 0; i < numWorkers; i++) {
    console.log("Creating HipSTR worker " + i);

    const worker = new Worker(config.hipSTRQueueName, processorFile, {
      connection: config.connection,
      limiter: config.limiter,
    });

    worker.on("completed", async (job, returnvalue) => {
      console.log("worker " + i + " completed " + returnvalue);

      // save in mongo database
      // job is complete
      const parameters = await HipSTR.findOne({
        job: job.data.jobId,
      }).exec();

      // const jobParams = await AnnotationJobsModel.findById(job.data.jobId).exec();

      const pathToOutputDir = path.join(
        process.env.TR_WORKDIR,
        job.data.jobUID,
        "hipstr",
        "output"
      );

      const hipFile = `${pathToOutputDir}/compare-samplecompare.tab`;
      const hipFile2 = `${pathToOutputDir}/compare-samplecompare.pdf`;
      const hipFile3 = `${pathToOutputDir}/compare-overall.tab`;
      const hipFile4 = `${pathToOutputDir}/compare-locuscompare.tab`;
      const hipFile5 = `${pathToOutputDir}/compare-locuscompare.pdf`;
      const hipFile6 = `${pathToOutputDir}/compare-bubble-periodALL.pdf`;


      const finishedJob = await HipSTRJob.findByIdAndUpdate(
        job.data.jobId,
        {
          status: JobStatus.COMPLETED,
          hipFile,
          hipFile2,
          hipFile3,
          hipFile4,
          hipFile5,
          hipFile6,
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
      const finishedJob = await HipSTRJob.findByIdAndUpdate(
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
