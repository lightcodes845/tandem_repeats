const { Worker } = require("bullmq");
const path = require("path");
const config = require("../../config/bullmq.config");
const { TrpSTRJob, JobStatus } = require("../../models/TrpSTR.jobs");
const TrpSTR = require("../../models/TrpSTR");

const processorFile = path.join(__dirname, "worker.js");

exports.createTrpSTRWorkers = async (numWorkers) => {
  for (let i = 0; i < numWorkers; i++) {
    console.log("Creating TrpSTR worker " + i);

    const worker = new Worker(config.trpSTRQueueName, processorFile, {
      connection: config.connection,
      limiter: config.limiter,
    });

    worker.on("completed", async (job, returnvalue) => {
      console.log("worker " + i + " completed " + returnvalue);

      // save in mongo database
      // job is complete
      const parameters = await TrpSTR.findOne({
        job: job.data.jobId,
      }).exec();

      // const jobParams = await AnnotationJobsModel.findById(job.data.jobId).exec();

      const pathToOutputDir = path.join(
        process.env.TR_WORKDIR,
        job.data.jobUID,
        "trpstr",
        "output"
      );

      const trpFile = `${pathToOutputDir}/trp-sampletrp.tab`;
      const trpFile2 = `${pathToOutputDir}/trp-sampletrp.pdf`;
      const trpFile3 = `${pathToOutputDir}/trp-overall.tab`;
      const trpFile4 = `${pathToOutputDir}/trp-locustrp.tab`;
      const trpFile5 = `${pathToOutputDir}/trp-locustrp.pdf`;
      const trpFile6 = `${pathToOutputDir}/trp-bubble-periodALL.pdf`;


      const finishedJob = await TrpSTRJob.findByIdAndUpdate(
        job.data.jobId,
        {
          status: JobStatus.COMPLETED,
          trpFile,
          trpFile2,
          trpFile3,
          trpFile4,
          trpFile5,
          trpFile6,
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
      const finishedJob = await TrpSTRJob.findByIdAndUpdate(
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




