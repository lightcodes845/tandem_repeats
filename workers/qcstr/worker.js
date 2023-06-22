const fs = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");
const { QcSTRJob, JobStatus } = require("../../models/QcSTR.jobs");
const QcSTR = require("../../models/QcSTR");
const { connectDB, closeDB } = require("../../config/db");
const { deleteFileorFolder, fileOrPathExists, fileSizeMb } = require("../../utils/fileutils");

function sleep(ms) {
  console.log("sleeping");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJobParameters(parameters) {
  return [
    String(parameters.vcftype),
    String(parameters.period ? parameters.period : ""),
    String(parameters.refbias_binsize ? parameters.refbias_binsize : ""),
    String(parameters.refbias_metric ? parameters.refbias_metric : ""),
    String(parameters.refbias_mingts ? parameters.refbias_mingts : ""),
    String(parameters.refbias_xrange_min ? parameters.refbias_xrange_min : ""),
    String(parameters.refbias_xrange_max ? parameters.refbias_xrange_max : ""),
  ];
}

module.exports = async (job) => {
  //executed for each job
  console.log(
    "Worker " +
    " processing job " +
    JSON.stringify(job.data.jobId) +
    " Job name: " +
    JSON.stringify(job.data.jobName)
  );

  await connectDB();
  await sleep(2000);

  //fetch job parameters from database
  const parameters = await QcSTR.findOne({
    job: job.data.jobId,
  }).exec();
  const jobParams = await QcSTRJob.findById(job.data.jobId).exec();

  //--1
  let fileInput = jobParams.inputFile;

  //create input file and folder
  let filename;

  //--2
  //extract file name
  if (parameters.useTest === false) {
    const name = fileInput.split(/(\\|\/)/g).pop();
    filename = path.join(
      process.env.TR_WORKDIR,
      jobParams.jobUID,
      "input",
      name
    );
  } else {
    filename = path.join(
      process.env.TR_WORKDIR,
      jobParams.jobUID,
      "input",
      "test.txt"
    );
  }

  //move file to input folder
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.copyFileSync(fileInput, filename);

  if (parameters.useTest === false) {
    deleteFileorFolder(jobParams.inputFile).then(() => {
      console.log("deleted");
    });
  }

  //assemble job parameters
  const pathToInputFile = filename;
  const pathToOutputDir = path.join(
    process.env.TR_WORKDIR,
    jobParams.jobUID,
    "qcstr",
    "output"
  );
  const jobParameters = getJobParameters(parameters);
  jobParameters.unshift(pathToInputFile, pathToOutputDir);
  // console.log(jobParameters);
  console.log(jobParameters);
  //make output directory
  fs.mkdirSync(pathToOutputDir, { recursive: true });

  // save in mongo database
  await QcSTRJob.findByIdAndUpdate(
    job.data.jobId,
    {
      status: JobStatus.RUNNING,
      inputFile: filename,
    },
    { new: true }
  );

  const scriptPath = path.join(__dirname, "..", "..", "pipeline_scripts", "qcstr.sh")

  console.log(`bash ${scriptPath}`)

  //spawn process
  await sleep(1000);
  const jobSpawn = spawnSync(
    `./pipeline_scripts/qcstr.sh`,
    jobParameters
    // { detached: true },
  );

  console.log("Spawn command log");
  console.log(jobSpawn)
  console.log(jobSpawn?.stdout?.toString());
  console.log("=====================================");
  console.log("Spawn error log");
  const error_msg = jobSpawn?.stderr?.toString();
  console.log(error_msg);

  const qcstr = await fileOrPathExists(
    path.join(pathToOutputDir, "qc-diffref-bias.pdf")
  );
  const qcstr2 = await fileOrPathExists(
    path.join(pathToOutputDir, "qc-diffref-histogram.pdf")
  );

  const qcstr3 = await fileOrPathExists(
    path.join(pathToOutputDir, "qc-quality-locus-stratified.pdf")
  );
  const qcstr4 = await fileOrPathExists(
    path.join(pathToOutputDir, "qc-quality-per-call.pdf")
  );

  const qcstr5 = await fileOrPathExists(
    path.join(pathToOutputDir, "qc-quality-per-locus.pdf")
  );
  const qcstr6 = await fileOrPathExists(
    path.join(pathToOutputDir, "qc-quality-per-sample.pdf")
  );

  const qcstr7 = await fileOrPathExists(
    path.join(pathToOutputDir, "qc-quality-sample-stratified.pdf")
  );
  const qcstr8 = await fileOrPathExists(
    path.join(pathToOutputDir, "qc-sample-callnum.pdf")
  );

  const qcstr9 = await fileOrPathExists(
    path.join(pathToOutputDir, "qc-chrom-callnum.pdf")
  );


  closeDB();
  //changes here

  if (qcstr || qcstr2 || qcstr3 || qcstr4 || qcstr5 || qcstr6 || qcstr7 || qcstr8 || qcstr9) {
    console.log(`${job?.data?.jobName} spawn done!`);
    // return true;
    return { success: true, qcFile8: qcstr8, qcFile9: qcstr9 };
  } else {
    throw new Error(
      error_msg ||
      "Job failed to successfully complete. Output files not found."
    );
  }

  return true;
};
