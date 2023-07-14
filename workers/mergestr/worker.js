const fs = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");
const { MergeSTRJob, JobStatus } = require("../../models/MergeSTR.jobs");
const MergeSTR = require("../../models/MergeSTR");
const { connectDB, closeDB } = require("../../config/db");
const { deleteFileorFolder, fileOrPathExists, fileSizeMb } = require("../../utils/fileutils");

function sleep(ms) {
  console.log("sleeping");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJobParameters(parameters) {
  return [
    String(parameters.vcftype),
    String(parameters.update_sample_from_file ? parameters.update_sample_from_file : ""),

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
  const parameters = await MergeSTR.findOne({
    job: job.data.jobId,
  }).exec();
  const jobParams = await MergeSTRJob.findById(job.data.jobId).exec();

  //--1
  let fileInput = jobParams.inputFile;



  //create input file and folder
  let filename = [];

  //--2
  //extract file name
  const tempPaths = fileInput.split(',');
  if (parameters.useTest === false) {
    tempPaths.forEach((dd) => {
      const name = dd.split(/(\\|\/)/g).pop();
      filename.push(path.join(
        process.env.TR_WORKDIR,
        jobParams.jobUID,
        "input",
        name
      ));
    })
  } else {
    filename = path.join(
      process.env.TR_WORKDIR,
      jobParams.jobUID,
      "input",
      "test.vcf"
    );
  }

  //move file to input folder
  fs.mkdirSync(path.dirname(filename[0]), { recursive: true });
  filename.forEach((dd, i) => {
    fs.copyFileSync(tempPaths[i], dd);
  })

  if (parameters.useTest === false) {
    tempPaths.forEach((dd) => {
      deleteFileorFolder(dd).then(() => {
        console.log("deleted");
      });
    })
  }



  //assemble job parameters
  const pathToInputFile = filename.join(',');
  const pathToOutputDir = path.join(
    process.env.TR_WORKDIR,
    jobParams.jobUID,
    "mergestr",
    "output"
  );
  const jobParameters = getJobParameters(parameters);
  jobParameters.unshift(pathToInputFile, pathToOutputDir);
  // console.log(jobParameters);
  console.log(jobParameters);
  //make output directory
  fs.mkdirSync(pathToOutputDir, { recursive: true });

  // save in mongo database
  await MergeSTRJob.findByIdAndUpdate(
    job.data.jobId,
    {
      status: JobStatus.RUNNING,
      inputFile: filename.join(','),
    },
    { new: true }
  );

  const scriptPath = path.join(__dirname, "..", "..", "pipeline_scripts", "mergestr.sh")

  console.log(`bash ${scriptPath}`)

  //spawn process
  await sleep(1000);
  const jobSpawn = spawnSync(
    `./pipeline_scripts/mergestr.sh`,
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

  const mergestr = await fileOrPathExists(
    path.join(pathToOutputDir, "merge.vcf")
  );
  const log = await fileOrPathExists(
    path.join(pathToOutputDir, "merge.vcf")
  );

  closeDB();

  if (mergestr && log) {
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
