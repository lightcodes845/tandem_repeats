const fs = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");
const { CompareSTRJob, JobStatus } = require("../../models/CompareSTR.jobs");
const CompareSTR = require("../../models/CompareSTR");
const { connectDB, closeDB } = require("../../config/db");
const { deleteFileorFolder, fileOrPathExists, fileSizeMb } = require("../../utils/fileutils");

function sleep(ms) {
  console.log("sleeping");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJobParameters(parameters) {
  return [
    String(parameters.vcftype1),
    String(parameters.vcftype2),
    String(parameters.samples ? parameters.samples : ""),
    String(parameters.regions ? parameters.regions : ""),
    String(parameters.stratify_fields ? parameters.stratify_fields : ""),
    String(parameters.stratify_binsizes ? parameters.stratify_binsizes : ""),
    String(parameters.stratify_file ? parameters.stratify_file : ""),
    String(parameters.bubble_min ? parameters.bubble_min : ""),
    String(parameters.bubble_max ? parameters.bubble_max : ""),

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
  const parameters = await CompareSTR.findOne({
    job: job.data.jobId,
  }).exec();
  const jobParams = await CompareSTRJob.findById(job.data.jobId).exec();

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
    "comparestr",
    "output"
  );
  const jobParameters = getJobParameters(parameters);
  jobParameters.unshift(pathToInputFile, pathToOutputDir);
  // console.log(jobParameters);
  console.log(jobParameters);
  //make output directory
  fs.mkdirSync(pathToOutputDir, { recursive: true });

  // save in mongo database
  await CompareSTRJob.findByIdAndUpdate(
    job.data.jobId,
    {
      status: JobStatus.RUNNING,
      inputFile: filename,
    },
    { new: true }
  );

  const scriptPath = path.join(__dirname, "..", "..", "pipeline_scripts", "comparestr.sh")

  console.log(`bash ${scriptPath}`)

  //spawn process
  await sleep(1000);
  const jobSpawn = spawnSync(
    `./pipeline_scripts/comparestr.sh`,
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

  const comparestr = await fileOrPathExists(
    path.join(pathToOutputDir, "compare.vcf.gz")
  );
  const log = await fileOrPathExists(
    path.join(pathToOutputDir, "compare.samplog.tab")
  );

  closeDB();

  if (comparestr | log) {
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
