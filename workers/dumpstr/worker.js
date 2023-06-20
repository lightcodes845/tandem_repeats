const fs = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");
const { DumpSTRJob, JobStatus } = require("../../models/DumpSTR.jobs");
const DumpSTR = require("../../models/DumpSTR");
const { connectDB, closeDB } = require("../../config/db");
const { deleteFileorFolder, fileOrPathExists, fileSizeMb } = require("../../utils/fileutils");

function sleep(ms) {
  console.log("sleeping");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJobParameters(parameters) {
  return [
    String(parameters.vcftype),
    String(parameters.num_records ? parameters.num_records : ""),
    String(parameters.min_locus_rate ? parameters.min_locus_rate : ""),
    String(parameters.min_locus_hwep ? parameters.min_locus_hwep : ""),
    String(parameters.min_locus_het ? parameters.min_locus_het : ""),
    String(parameters.max_locus_het ? parameters.max_locus_het : ""),
    String(parameters.filter_regions ? parameters.filter_regions : ""),
    String(parameters.filter_regions_names ? parameters.regions_names : ""),
    String(parameters.hipstr_max_call_flank_indel ? parameters.hipstr_max_call_flank_indel : ""),
    String(parameters.hipstr_max_call_stutter ? parameters.hipstr_max_call_stutter : ""),
    String(parameters.hipstr_min_supp_reads ? parameters.hipstr_min_supp_reads : ""),
    String(parameters.hipstr_min_call_DP ? parameters.hipstr_min_call_DP : ""),
    String(parameters.hipstr_max_call_DP ? parameters.hipstr_max_call_DP : ""),
    String(parameters.hipstr_min_call_Q ? parameters.hipstr_min_call_Q : ""),
    String(parameters.gangstr_min_call_DPl ? parameters.gangstr_min_call_DPl : ""),
    String(parameters.gangstr_max_call_D ? parameters.gangstr_max_call_D : ""),
    String(parameters.gangstr_min_call_Q ? parameters.gangstr_min_call_Q : ""),
    String(parameters.gangstr_expansion_prob_het ? parameters.gangstr_expansion_prob_het : ""),
    String(parameters.gangstr_expansion_prob_hom ? parameters.gangstr_expansion_prob_hom : ""),
    String(parameters.gangstr_expansion_prob_total ? parameters.gangstr_expansion_prob_total : ""),
    String(parameters.advntr_min_call_DP ? parameters.advntr_min_call_DP : ""),
    String(parameters.advntr_max_call_DP ? parameters.advntr_max_call_DP : ""),
    String(parameters.advntr_min_spanning ? parameters.advntr_min_spanning : ""),
    String(parameters.advntr_min_flanking ? parameters.advntr_min_flanking : ""),
    String(parameters.advntr_min_ML ? parameters.advntr_min_ML : ""),
    String(parameters.eh_min_call_LC ? parameters.eh_min_call_LC : ""),
    String(parameters.eh_max_call_LC ? parameters.eh_max_call_LC : ""),
    String(parameters.popstr_min_call_DP ? parameters.popstr_min_call_DP : ""),
    String(parameters.popstr_max_call_DP ? parameters.popstr_max_call_DP : ""),
    String(parameters.popstr_require_support ? parameters.popstr_require_support : ""),
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
  const parameters = await DumpSTR.findOne({
    job: job.data.jobId,
  }).exec();
  const jobParams = await DumpSTRJob.findById(job.data.jobId).exec();

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
    "dumpstr",
    "output"
  );
  const jobParameters = getJobParameters(parameters);
  jobParameters.unshift(pathToInputFile, pathToOutputDir);
  // console.log(jobParameters);
  console.log(jobParameters);
  //make output directory
  fs.mkdirSync(pathToOutputDir, { recursive: true });

  // save in mongo database
  await DumpSTRJob.findByIdAndUpdate(
    job.data.jobId,
    {
      status: JobStatus.RUNNING,
      inputFile: filename,
    },
    { new: true }
  );

  const scriptPath = path.join(__dirname, "..", "..", "pipeline_scripts", "dumpstr.sh")

  console.log(`bash ${scriptPath}`)

  //spawn process
  await sleep(1000);
  const jobSpawn = spawnSync(
    `./pipeline_scripts/dumpstr.sh`,
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

  const dumpstr = await fileOrPathExists(
    path.join(pathToOutputDir, "dump.vcf.gz")
  );
  const log = await fileOrPathExists(
    path.join(pathToOutputDir, "dump.samplog.tab")
  );

  closeDB();

  if (dumpstr && log) {
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
