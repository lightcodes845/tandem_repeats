const fs = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");
const { GangSTRJob, JobStatus } = require("../../models/GangSTR.jobs");
const GangSTR = require("../../models/GangSTR");
const { connectDB, closeDB } = require("../../config/db");
const { deleteFileorFolder, fileOrPathExists, fileSizeMb } = require("../../utils/fileutils");

function sleep(ms) {
  console.log("sleeping");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJobParameters(parameters) {
  return [
    String(parameters.chrom),
    String(parameters.bam_samps ? parameters.bam_samps : ""),
    String(parameters.samp_sex ? parameters.samp_sex : ""),
    String(parameters.period ? parameters.period : ""),
    String(parameters.readlength ? parameters.readlength : ""),
    String(parameters.coverage ? parameters.coverage : ""),
    String(parameters.insertmean ? parameters.insertmean : ""),
    String(parameters.insertsdev ? parameters.insertsdev : ""),
    String(parameters.min_sample_reads ? parameters.min_sample_reads : ""),
    String(parameters.frrweight ? parameters.frrweight : ""),
    String(parameters.spanweight ? parameters.spanweight : ""),
    String(parameters.enclweight ? parameters.enclweight : ""),
    String(parameters.flankweight ? parameters.flankweight : ""),
    String(parameters.ploidy),
    String(parameters.numbstrap ? parameters.numbstrap : ""),
    String(parameters.grid_theshold ? parameters.grid_theshold : ""),
    String(parameters.rescue_count ? parameters.rescue_count : ""),
    String(parameters.max_proc_read ? parameters.max_proc_read : ""),
    String(parameters.minscore ? parameters.minscore : ""),
    String(parameters.minmatch ? parameters.minmatch : ""),
    String(parameters.stutterup ? parameters.stutterup : ""),
    String(parameters.stutterdown ? parameters.stutterdown : ""),
    String(parameters.stutterprob ? parameters.stutterprob : ""),

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
  const parameters = await GangSTR.findOne({
    job: job.data.jobId,
  }).exec();
  const jobParams = await GangSTRJob.findById(job.data.jobId).exec();

  //--1
  let fileInput = jobParams.inputFile;
  let fileInput2 = jobParams.inputFile2;
  let fileInput3 = jobParams.inputFile3;


  //create input file and folder
  let filename;
  let filename2;
  let filename3;

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

  if (fileInput2) {
    const name2 = fileInput2.split(/(\\|\/)/g).pop();
    filename2 = path.join(
      process.env.TR_WORKDIR,
      jobParams.jobUID,
      "input",
      name2
    );
  }

  if (fileInput3) {
    const name3 = fileInput3.split(/(\\|\/)/g).pop();
    filename3 = path.join(
      process.env.TR_WORKDIR,
      jobParams.jobUID,
      "input",
      name3
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
    if (filename3) {
      deleteFileorFolder(jobParams.inputFile3).then(() => {
        console.log("deleted");
      });
    }
  }

  //assemble job parameters
  const pathToInputFile = filename;
  const pathToInputFile2 = filename2;
  const pathToInputFile3 = filename3;

  const pathToOutputDir = path.join(
    process.env.TR_WORKDIR,
    jobParams.jobUID,
    "gangstr",
    "output"
  );
  const jobParameters = getJobParameters(parameters);
  jobParameters.unshift(pathToInputFile, pathToInputFile2, pathToInputFile3, pathToOutputDir);
  // console.log(jobParameters);
  console.log("Job Param");
  console.log(jobParameters);
  //make output directory
  fs.mkdirSync(pathToOutputDir, { recursive: true });

  // save in mongo database
  await GangSTRJob.findByIdAndUpdate(
    job.data.jobId,
    {
      status: JobStatus.RUNNING,
      inputFile: filename,
      inputFile2: filename2,
      inputFile3: filename3,
    },
    { new: true }
  );

  const scriptPath = path.join(__dirname, "..", "..", "pipeline_scripts", "gangstr.sh")

  console.log(`bash ${scriptPath}`)

  //spawn process
  await sleep(1000);
  const jobSpawn = spawnSync(
    `./pipeline_scripts/gangstr.sh`,
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

  const gangstr = await fileOrPathExists(
    path.join(pathToOutputDir, "compare-samplecompare.tab")
  );
  const gangstr2 = await fileOrPathExists(
    path.join(pathToOutputDir, "compare-samplecompare.pdf")
  );
  const gangstr3 = await fileOrPathExists(
    path.join(pathToOutputDir, "compare-overall.tab")
  );
  const gangstr4 = await fileOrPathExists(
    path.join(pathToOutputDir, "compare-locuscompare.tab")
  );
  const gangstr5 = await fileOrPathExists(
    path.join(pathToOutputDir, "compare-locuscompare.pdf")
  );
  const gangstr6 = await fileOrPathExists(
    path.join(pathToOutputDir, "compare-bubble-periodALL.pdf")
  );

  closeDB();

  if (gangstr || gangstr2 || gangstr3 || gangstr4 || gangstr5 || gangstr6) {
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
