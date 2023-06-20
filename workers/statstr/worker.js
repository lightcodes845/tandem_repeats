const fs = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");
const { StatSTRJob, JobStatus } = require("../../models/StatSTR.jobs");
const StatSTR = require("../../models/StatSTR");
const { connectDB, closeDB } = require("../../config/db");
const { deleteFileorFolder, fileOrPathExists, fileSizeMb } = require("../../utils/fileutils");

function sleep(ms) {
  console.log("sleeping");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJobParameters(parameters) {
  return [
    String(parameters.vcftype),
    String(parameters.samples ? parameters.samples : ""),
    String(parameters.sample_prefixes ? parameters.sample_prefixes : ""),
    String(parameters.region ? parameters.region : ""),
    String(parameters.precision ? parameters.precision : ""),
    String(parameters.nalleles_thresh ? parameters.nalleles_thresh : ""),

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
  const parameters = await StatSTR.findOne({
    job: job.data.jobId,
  }).exec();
  const jobParams = await StatSTRJob.findById(job.data.jobId).exec();

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
    "statstr",
    "output"
  );
  const jobParameters = getJobParameters(parameters);
  jobParameters.unshift(pathToInputFile, pathToOutputDir);
  // console.log(jobParameters);
  console.log(jobParameters);
  //make output directory
  fs.mkdirSync(pathToOutputDir, { recursive: true });

  // save in mongo database
  await StatSTRJob.findByIdAndUpdate(
    job.data.jobId,
    {
      status: JobStatus.RUNNING,
      inputFile: filename,
    },
    { new: true }
  );

  const scriptPath = path.join(__dirname, "..", "..", "pipeline_scripts", "statstr.sh")

  console.log(`bash ${scriptPath}`)

  //spawn process
  await sleep(1000);
  const jobSpawn = spawnSync(
    `./pipeline_scripts/statstr.sh`,
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

  const statstr = await fileOrPathExists(
    path.join(pathToOutputDir, "stat.tab")
  );
  const log = await fileOrPathExists(
    path.join(pathToOutputDir, "stat.samplog.tab")
  );

  closeDB();

  //*not sure what the log is
  //if (statstr && log) {
  if (statstr | log) {
    console.log(`${job?.data?.jobName} spawn done!`);
    return true;
  } else {
    throw new Error(
      error_msg ||
      "Job failed to successfully complete. Output files not found."
    );
  }

  return true;
};
