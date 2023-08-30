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
      // section a
      const trpFile = `${pathToOutputDir}/hipstr_calls.vcf.gz`;
      const trpFile2 = `${pathToOutputDir}/hipstr_calls.viz.gz`;
      // section b
      const trpFile3 = `${pathToOutputDir}/first_qc-diffref-bias.pdf`;
      const trpFile4 = `${pathToOutputDir}/first_qc-diffref-histogram.pdf`;
      const trpFile5 = `${pathToOutputDir}/first_qc-quality-locus-stratified.pdf`;
      const trpFile6 = `${pathToOutputDir}/first_qc-quality-per-call.pdf`;
      const trpFile7 = `${pathToOutputDir}/first_qc-quality-per-locus.pdf`;
      const trpFile8 = `${pathToOutputDir}/first_qc-quality-per-sample.pdf`;
      const trpFile9 = `${pathToOutputDir}/first_qc-quality-sample-stratified.pdf`;
      const trpFile10 = `${pathToOutputDir}/first_qc-sample-callnum.pdf`;
      const trpFile11 = `${pathToOutputDir}/first_qc-chrom-callnum.pdf`;
      // section c
      const trpFile12 = `${pathToOutputDir}/dump.vcf.gz`;
      const trpFile13 = `${pathToOutputDir}/dump.samplog.tab`;
      // section d
      const trpFile14 = `${pathToOutputDir}/second_qc-diffref-bias.pdf`;
      const trpFile15 = `${pathToOutputDir}/second_qc-diffref-histogram.pdf`;
      const trpFile16 = `${pathToOutputDir}/second_qc-quality-locus-stratified.pdf`;
      const trpFile17 = `${pathToOutputDir}/second_qc-quality-per-call.pdf`;
      const trpFile18 = `${pathToOutputDir}/second_qc-quality-per-locus.pdf`;
      const trpFile19 = `${pathToOutputDir}/second_qc-quality-per-sample.pdf`;
      const trpFile20 = `${pathToOutputDir}/second_qc-quality-sample-stratified.pdf`;
      const trpFile21 = `${pathToOutputDir}/second_qc-sample-callnum.pdf`;
      const trpFile22 = `${pathToOutputDir}/second_qc-chrom-callnum.pdf`;
      // section e
      const trpFile23 = `${pathToOutputDir}/stat.tab`;
      const trpFile24 = `${pathToOutputDir}/stat.samplog.tab`;

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
          trpFile7,
          trpFile8,
          trpFile9,
          trpFile10,
          trpFile11,
          trpFile12,
          trpFile13,
          trpFile14,
          trpFile15,
          trpFile16,
          trpFile17,
          trpFile18,
          trpFile19,
          trpFile20,
          trpFile21,
          trpFile22,
          trpFile23,
          trpFile24,
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




