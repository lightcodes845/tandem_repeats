const fs = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");
const { HipSTRJob, JobStatus } = require("../../models/HipSTR.jobs");
const HipSTR = require("../../models/HipSTR");
const { connectDB, closeDB } = require("../../config/db");
const { deleteFileorFolder, fileOrPathExists, fileSizeMb } = require("../../utils/fileutils");

function sleep(ms) {
  console.log("sleeping");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJobParameters(parameters) {
  return [
    String(parameters.haploid_chrs),
    String(parameters.fasta),
    // String(parameters.use_unpaired),
    String(parameters.bam_samps ? parameters.bam_samps : ""),
    String(parameters.bam_libs ? parameters.bam_libs : ""),
    String(parameters.min_reads ? parameters.min_reads : ""),

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
  const parameters = await HipSTR.findOne({
    job: job.data.jobId,
  }).exec();
  const jobParams = await HipSTRJob.findById(job.data.jobId).exec();

  //--1
  let fileInput = jobParams.inputFile;
  let fileInput2 = jobParams.inputFile2;



  //create input file and folder
  let filename = [];
  let filename2;


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
  fs.mkdirSync(path.dirname(filename[0]), { recursive: true });
  filename.forEach((dd, i) => {
    fs.copyFileSync(tempPaths[i], dd);
  })

  if (filename2) {
    fs.copyFileSync(fileInput2, filename2);
  }


  if (parameters.useTest === false) {
    tempPaths.forEach((dd) => {
      deleteFileorFolder(dd).then(() => {
        console.log("deleted");
      });
    })
    if (filename2) {
      deleteFileorFolder(jobParams.inputFile2).then(() => {
        console.log("deleted");
      });
    }

  }

  //assemble job parameters
  const pathToInputFile = filename.join(',');
  const pathToInputFile2 = filename2;


  const pathToOutputDir = path.join(
    process.env.TR_WORKDIR,
    jobParams.jobUID,
    "hipstr",
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
  await HipSTRJob.findByIdAndUpdate(
    job.data.jobId,
    {
      status: JobStatus.RUNNING,
      inputFile: filename.join(','),
      inputFile2: filename2,

    },
    { new: true }
  );

  const scriptPath = path.join(__dirname, "..", "..", "pipeline_scripts", "hipstr.sh")

  console.log(`bash ${scriptPath}`)

  //spawn process
  await sleep(1000);
  const jobSpawn = spawnSync(
    `./pipeline_scripts/hipstr.sh`,
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

  const hipstr = await fileOrPathExists(
    path.join(pathToOutputDir, "hipstr_calls.vcf.gz")
  );
  const hipstr2 = await fileOrPathExists(
    path.join(pathToOutputDir, "hipstr_calls.viz.gz")
  );

  closeDB();

  if (hipstr || hipstr2) {
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
