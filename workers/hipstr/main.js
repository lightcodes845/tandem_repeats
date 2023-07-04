const { Worker } = require("bullmq");
const path = require("path");
const config = require("../../config/bullmq.config");
const { GangSTRJob, JobStatus } = require("../../models/GangSTR.jobs");
const GangSTR = require("../../models/GangSTR");

const processorFile = path.join(__dirname, "worker.js");

exports.createGangSTRWorkers = async (numWorkers) => {
  for (let i = 0; i < numWorkers; i++) {
    console.log("Creating GangSTR worker " + i);

    const worker = new Worker(config.gangSTRQueueName, processorFile, {
      connection: config.connection,
      limiter: config.limiter,
    });

    worker.on("completed", async (job, returnvalue) => {
      console.log("worker " + i + " completed " + returnvalue);

      // save in mongo database
      // job is complete
      const parameters = await GangSTR.findOne({
        job: job.data.jobId,
      }).exec();

      // const jobParams = await AnnotationJobsModel.findById(job.data.jobId).exec();

      const pathToOutputDir = path.join(
        process.env.TR_WORKDIR,
        job.data.jobUID,
        "gangstr",
        "output"
      );

      const gangFile = `${pathToOutputDir}/compare-samplecompare.tab`;
      const gangFile2 = `${pathToOutputDir}/compare-samplecompare.pdf`;
      const gangFile3 = `${pathToOutputDir}/compare-overall.tab`;
      const gangFile4 = `${pathToOutputDir}/compare-locuscompare.tab`;
      const gangFile5 = `${pathToOutputDir}/compare-locuscompare.pdf`;
      const gangFile6 = `${pathToOutputDir}/compare-bubble-periodALL.pdf`;


      const finishedJob = await GangSTRJob.findByIdAndUpdate(
        job.data.jobId,
        {
          status: JobStatus.COMPLETED,
          gangFile,
          gangFile2,
          gangFile3,
          gangFile4,
          gangFile5,
          gangFile6,
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
      const finishedJob = await GangSTRJob.findByIdAndUpdate(
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
