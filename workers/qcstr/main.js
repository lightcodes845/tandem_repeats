const { Worker } = require("bullmq");
const path = require("path");
const config = require("../../config/bullmq.config");
const { QcSTRJob, JobStatus } = require("../../models/QcSTR.jobs");
const QcSTR = require("../../models/QcSTR");

const processorFile = path.join(__dirname, "worker.js");

exports.createQcSTRWorkers = async (numWorkers) => {
  for (let i = 0; i < numWorkers; i++) {
    console.log("Creating QcSTR worker " + i);

    const worker = new Worker(config.qcSTRQueueName, processorFile, {
      connection: config.connection,
      limiter: config.limiter,
    });

    worker.on("completed", async (job, returnvalue) => {
      console.log("worker " + i + " completed " + returnvalue);

      // save in mongo database
      // job is complete
      const parameters = await QcSTR.findOne({
        job: job.data.jobId,
      }).exec();

      // const jobParams = await AnnotationJobsModel.findById(job.data.jobId).exec();

      const pathToOutputDir = path.join(
        process.env.TR_WORKDIR,
        job.data.jobUID,
        "qcstr",
        "output"
      );

      const qcFile = `${pathToOutputDir}/qc-diffref-bias.pdf`;
      const qcFile2 = `${pathToOutputDir}/qc-diffref-histogram.pdf`;
      const qcFile3 = `${pathToOutputDir}/qc-quality-locus-stratified.pdf`;
      const qcFile4 = `${pathToOutputDir}/qc-quality-per-call.pdf`;
      const qcFile5 = `${pathToOutputDir}/qc-quality-per-locus.pdf`;
      const qcFile6 = `${pathToOutputDir}/qc-quality-per-sample.pdf`;
      const qcFile7 = `${pathToOutputDir}/qc-quality-sample-stratified.pdf`;

      const qcFile8 = `${pathToOutputDir}/qc-sample-callnum.pdf`;
      const qcFile9 = `${pathToOutputDir}/qc-chrom-callnum.pdf`;


      const finishedJob = await QcSTRJob.findByIdAndUpdate(
        job.data.jobId,
        {
          status: JobStatus.COMPLETED,
          qcFile,
          qcFile2,
          qcFile3,
          qcFile4,
          qcFile5,
          qcFile6,
          qcFile7,

          qcFile8,
          qcFile9,
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
      const finishedJob = await QcSTRJob.findByIdAndUpdate(
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
