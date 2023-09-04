const fs = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");
const { TrpSTRJob, JobStatus } = require("../../models/TrpSTR.jobs");
const TrpSTR = require("../../models/TrpSTR");
const { connectDB, closeDB } = require("../../config/db");
const { deleteFileorFolder, fileOrPathExists, fileSizeMb } = require("../../utils/fileutils");

function sleep(ms) {
  console.log("sleeping");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJobParameters(parameters) {
  return [

    // section A hipstr
    String(parameters.haploid_chrs),
    String(parameters.fasta),
    // String(parameters.use_unpaired),
    String(parameters.bam_samps ? parameters.bam_samps : ""),
    String(parameters.bam_libs ? parameters.bam_libs : ""),
    String(parameters.min_reads ? parameters.min_reads : ""),

    // section b first qcstr

    String(parameters.period_qcstrA ? parameters.period_qcstrA : ""),
    String(parameters.refbias_binsize_qcstrA ? parameters.refbias_binsize_qcstrA : ""),
    String(parameters.refbias_metric_qcstrA ? parameters.refbias_metric_qcstrA : ""),
    String(parameters.refbias_mingts_qcstrA ? parameters.refbias_mingts_qcstrA : ""),
    String(parameters.refbias_xrange_min_qcstrA ? parameters.refbias_xrange_min_qcstrA : ""),
    String(parameters.refbias_xrange_max_qcstrA ? parameters.refbias_xrange_max_qcstrA : ""),
    // section c dumpstr
    // String(parameters.vcftype),
    String(parameters.num_records ? parameters.num_records : ""),
    String(parameters.min_locus_callrate ? parameters.min_locus_callrate : ""),
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
    // String(parameters.gangstr_min_call_DPl ? parameters.gangstr_min_call_DPl : ""),
    // String(parameters.gangstr_max_call_D ? parameters.gangstr_max_call_D : ""),
    // String(parameters.gangstr_min_call_Q ? parameters.gangstr_min_call_Q : ""),
    // String(parameters.gangstr_expansion_prob_het ? parameters.gangstr_expansion_prob_het : ""),
    // String(parameters.gangstr_expansion_prob_hom ? parameters.gangstr_expansion_prob_hom : ""),
    // String(parameters.gangstr_expansion_prob_total ? parameters.gangstr_expansion_prob_total : ""),
    // String(parameters.advntr_min_call_DP ? parameters.advntr_min_call_DP : ""),
    // String(parameters.advntr_max_call_DP ? parameters.advntr_max_call_DP : ""),
    // String(parameters.advntr_min_spanning ? parameters.advntr_min_spanning : ""),
    // String(parameters.advntr_min_flanking ? parameters.advntr_min_flanking : ""),
    // String(parameters.advntr_min_ML ? parameters.advntr_min_ML : ""),
    // String(parameters.eh_min_call_LC ? parameters.eh_min_call_LC : ""),
    // String(parameters.eh_max_call_LC ? parameters.eh_max_call_LC : ""),
    // String(parameters.popstr_min_call_DP ? parameters.popstr_min_call_DP : ""),
    // String(parameters.popstr_max_call_DP ? parameters.popstr_max_call_DP : ""),
    // String(parameters.popstr_require_support ? parameters.popstr_require_support : ""),

    // section d second qcstr
    // String(parameters.vcftype),
    String(parameters.period_qcstrB ? parameters.period_qcstrB : ""),
    String(parameters.refbias_binsize_qcstrB ? parameters.refbias_binsize_qcstrB : ""),
    String(parameters.refbias_metric_qcstrB ? parameters.refbias_metric_qcstrB : ""),
    String(parameters.refbias_mingts_qcstrB ? parameters.refbias_mingts_qcstrB : ""),
    String(parameters.refbias_xrange_min_qcstrB ? parameters.refbias_xrange_min_qcstrB : ""),
    String(parameters.refbias_xrange_max_qcstrB ? parameters.refbias_xrange_max_qcstrB : ""),

    // section e statstr
    // String(parameters.vcftype),
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
  const parameters = await TrpSTR.findOne({
    job: job.data.jobId,
  }).exec();
  const jobParams = await TrpSTRJob.findById(job.data.jobId).exec();

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
    "trpstr",
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
  await TrpSTRJob.findByIdAndUpdate(
    job.data.jobId,
    {
      status: JobStatus.RUNNING,
      inputFile: filename.join(','),
      inputFile2: filename2,
    },
    { new: true }
  );

  const scriptPath = path.join(__dirname, "..", "..", "pipeline_scripts", "trpstr.sh")

  console.log(`bash ${scriptPath}`)

  //spawn process
  await sleep(1000);
  const jobSpawn = spawnSync(
    `./pipeline_scripts/trpstr.sh`,
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

  // section A
  const trpstr = await fileOrPathExists(
    path.join(pathToOutputDir, "hipstr_calls.vcf.gz")
  );
  const trpstr2 = await fileOrPathExists(
    path.join(pathToOutputDir, "hipstr_calls.viz.gz")
  );

  // section b
  const trpstr3 = await fileOrPathExists(
    path.join(pathToOutputDir, "first_qc-diffref-bias.pdf")
  );
  const trpstr4 = await fileOrPathExists(
    path.join(pathToOutputDir, "first_qc-diffref-histogram.pdf")
  );
  const trpstr5 = await fileOrPathExists(
    path.join(pathToOutputDir, "first_qc-quality-locus-stratified.pdf")
  );
  const trpstr6 = await fileOrPathExists(
    path.join(pathToOutputDir, "first_qc-quality-per-call.pdf")
  );
  const trpstr7 = await fileOrPathExists(
    path.join(pathToOutputDir, "first_qc-quality-per-locus.pdf")
  );
  const trpstr8 = await fileOrPathExists(
    path.join(pathToOutputDir, "first_qc-quality-per-sample.pdf")
  );

  const trpstr9 = await fileOrPathExists(
    path.join(pathToOutputDir, "first_qc-quality-sample-stratified.pdf")
  );
  const trpstr10 = await fileOrPathExists(
    path.join(pathToOutputDir, "first_qc-sample-callnum.pdf")
  );

  const trpstr11 = await fileOrPathExists(
    path.join(pathToOutputDir, "first_qc-chrom-callnum.pdf")
  );

  // section c

  const trpstr12 = await fileOrPathExists(
    path.join(pathToOutputDir, "dump.vcf.gz")
  );
  const trpstr13 = await fileOrPathExists(
    path.join(pathToOutputDir, "dump.samplog.tab")
  );
  // section d
  const trpstr14 = await fileOrPathExists(
    path.join(pathToOutputDir, "second_qc-diffref-bias.pdf")
  );
  const trpstr15 = await fileOrPathExists(
    path.join(pathToOutputDir, "second_qc-diffref-histogram.pdf")
  );
  const trpstr16 = await fileOrPathExists(
    path.join(pathToOutputDir, "second_qc-quality-locus-stratified.pdf")
  );
  const trpstr17 = await fileOrPathExists(
    path.join(pathToOutputDir, "second_qc-quality-per-call.pdf")
  );
  const trpstr18 = await fileOrPathExists(
    path.join(pathToOutputDir, "second_qc-quality-per-locus.pdf")
  );
  const trpstr19 = await fileOrPathExists(
    path.join(pathToOutputDir, "second_qc-quality-per-sample.pdf")
  );

  const trpstr20 = await fileOrPathExists(
    path.join(pathToOutputDir, "second_qc-quality-sample-stratified.pdf")
  );
  const trpstr21 = await fileOrPathExists(
    path.join(pathToOutputDir, "second_qc-sample-callnum.pdf")
  );

  const trpstr22 = await fileOrPathExists(
    path.join(pathToOutputDir, "second_qc-chrom-callnum.pdf")
  );

  // section e
  const trpstr23 = await fileOrPathExists(
    path.join(pathToOutputDir, "stat.tab")
  );
  const trpstr24 = await fileOrPathExists(
    path.join(pathToOutputDir, "stat.samplog.tab")
  );

  closeDB();

  if (trpstr || trpstr2 || trpstr3 || trpstr4 || trpstr5 || trpstr6) {
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
