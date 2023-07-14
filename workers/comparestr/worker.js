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
  let fileInput2 = jobParams.inputFile2;


  //create input file and folder
  let filename;
  let filename2;

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
      "test.vcf"
    );
  }

  if (fileInput2) {
    const name2 = fileInput2.split(/(\\|\/)/g).pop();
    filename2 = path.join(
      process.env.TR_WORKDIR,
      jobParams.jobUID,
      "input",
      name2
    );
  }

  //move file to input folder
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  fs.copyFileSync(fileInput, filename);

  if (filename2) {
    fs.copyFileSync(fileInput2, filename2);
  }

  if (parameters.useTest === false) {
    deleteFileorFolder(jobParams.inputFile).then(() => {
      console.log("deleted");
    });
    if (filename2) {
      deleteFileorFolder(jobParams.inputFile2).then(() => {
        console.log("deleted");
      });
    }
  }

  //assemble job parameters
  const pathToInputFile = filename;
  const pathToInputFile2 = filename2;

  const pathToOutputDir = path.join(
    process.env.TR_WORKDIR,
    jobParams.jobUID,
    "comparestr",
    "output"
  );
  const jobParameters = getJobParameters(parameters);
  jobParameters.unshift(pathToInputFile, pathToInputFile2, pathToOutputDir);
  // console.log(jobParameters);
  console.log("Job Param");
  console.log(jobParameters);
  //make output directory
  fs.mkdirSync(pathToOutputDir, { recursive: true });

  // save in mongo database
  await CompareSTRJob.findByIdAndUpdate(
    job.data.jobId,
    {
      status: JobStatus.RUNNING,
      inputFile: filename,
      inputFile2: filename2,
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
    path.join(pathToOutputDir, "compare-samplecompare.tab")
  );
  const comparestr2 = await fileOrPathExists(
    path.join(pathToOutputDir, "compare-samplecompare.pdf")
  );
  const comparestr3 = await fileOrPathExists(
    path.join(pathToOutputDir, "compare-overall.tab")
  );
  const comparestr4 = await fileOrPathExists(
    path.join(pathToOutputDir, "compare-locuscompare.tab")
  );
  const comparestr5 = await fileOrPathExists(
    path.join(pathToOutputDir, "compare-locuscompare.pdf")
  );
  const comparestr6 = await fileOrPathExists(
    path.join(pathToOutputDir, "compare-bubble-periodALL.pdf")
  );

  closeDB();

  if (comparestr || comparestr2 || comparestr3 || comparestr4 || comparestr5 || comparestr6) {
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
