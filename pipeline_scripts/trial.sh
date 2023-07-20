#Section A
#!/bin/bash
echo "Running"
bin_dir="/home/dzumi/HipSTR"
echo $bin_dir
input_dir="/home/dzumi/trFiles/test/Genotyping"


#output_dir=$1
bams=$2 #up to five files at least
fasta=$3 #takes a fasta file
regions=$4 #takes a bed file
ref_vcf=$5 #takes a vcf file
stutter_in=$6 #takes a vcf file
haploid_chrs=$7 #integer 1-23,default all
use_unpaired=$8 #True or False. False by default
snp_vcf=$9 #takes a vcf file
bam_samps=${10} #comma seperated list
bam_libs=${11} #float
min_reads=${12} #integer 100 by default


	args=()

	if [ -n "$ref_vcf" ]; then
		args+=(--ref-vcf $ref_vcf)
	fi

	if [ -n "$stutter_in" ]; then
		args+=(--stutter-in $stutter_in)
	fi

	if [ -n "$haploid_chrs" ]; then
		args+=(--haploid-chrs $haploid_chrs)
	fi

	if [ -n "$use_unpaired" ]; then
		args+=(--use-unpaired $use_unpaired)
	fi

    if [ -n "$snp_vcf" ]; then
		args+=(--snp-vcf $snp_vcf)
	fi

	if [ -n "$bam_samps" ]; then
		args+=(--bam-samps $bam_samps)
	fi

	if [ -n "$bam_libs" ]; then
		args+=(--bam-libs $bam_libs)
	fi

	if [ -n "$min_reads" ]; then
		args+=(--min-reads $min_reads)
	fi

if [ $fasta=="hg19" ]; then
${bin_dir}/HipSTR --bams $bams --fasta ${input_dir}/hg19.fa --regions $regions --viz-out hipstr_calls.viz.gz --log hipstr_calls.log  --def-stutter-model --output-filters "${args[@]}" --str-vcf ${output_dir}/hipstr_calls.vcf.gz

elif [ $fasta=="hg38" ]; then
${bin_dir}/HipSTR --bams $bams --fasta ${input_dir}/hg38.fa --regions $regions --viz-out hipstr_calls.viz.gz --log hipstr_calls.log --def-stutter-model --output-filters "${args[@]}" --str-vcf ${output_dir}/hipstr_calls.vcf.gz

fi

#Section B
# Check if the output VCF file exists from the first code
if [ -f ${output_dir}/hipstr_calls.vcf.gz ]; then
    echo "HipSTR output VCF found. Running QCStr."

    bin_dir="/home/dzumi/anaconda3/bin"
    echo $bin_dir

    vcf_qcstrA=${output_dir}/hipstr_calls.vcf.gz # Use the output VCF from HipSTR
    vcftype_qcstrA=$3 # options include {gangstr, advntr, hipstr, auto} default is auto
    period_qcstrA=$4 # integer
    refbias_binsize_qcstrA=$5 # integer (5 by default)
    refbias_metric_qcstrA=$6 # {mean or median} mean by default
    refbias_mingts_qcstrA=$7 # integer 100 by default
    refbias_xrange_min_qcstrA=$8
    refbias_xrange_max_qcstrA=$9



    # data preparation
    tabix -p vcf $vcf_qcstrA # indexes the VCF file supplied

    args=()
    # quality plot options

    if [ -n "$vcftype_qcstrA" ]; then
        args+=(--vcftype $vcftype_qcstrA)
    fi

    if [ -n "$period_qcstrA" ]; then
        args+=(--period $period_qcstrA)
    fi

    # if [ -n "$quality1" ]; then
    #     args+=(--quality $quality1)
    # fi

    # if [ -n "$quality2" ]; then
    #     args+=(--quality $quality2)
    # fi

    # if [ -n "$quality3" ]; then
    #     args+=(--quality $quality3)
    # fi

    # if [ -n "$quality4" ]; then
    #     args+=(--quality $quality4)
    # fi

    # if [ -n "$quality5" ]; then
    #     args+=(--quality $quality5)
    # fi

    # reference bias plot options
    if [ -n "$refbias_binsize_qcstrA" ]; then
        args+=(--refbias-binsize $refbias_binsize_qcstrA)
    fi

    if [ -n "$refbias_metric_qcstrA" ]; then
        args+=(--refbias-metric $refbias_metric_qcstrA)
    fi

    if [ -n "$refbias_mingts_qcstrA" ]; then
        args+=(--refbias-mingts $refbias_mingts_qcstrA)
    fi

    if [ -n "$refbias_xrange_min_qcstrA" ]; then
        args+=(--refbias_xrange-min $refbias_xrange_min_qcstrA)
    fi

    if [ -n "$refbias_xrange_max_qcstrA" ]; then
        args+=(--refbias-xrange-max $refbias_xrange_max_qcstrA)
    fi

    ${bin_dir}/qcSTR --vcf $vcf_qcstrA --quality per-locus --quality per-sample --quality locus-stratified --quality sample-stratified --quality per-call "${args[@]}" --out ${output_dir}/qc

else
    echo "HipSTR output VCF not found. Skipping QCStr."
fi





#SECTION C
# Check if the output VCF file exists from the first code
if [ -f ${output_dir}/hipstr_calls.vcf.gz ]; then
    echo "HipSTR output VCF found. Running dumpStr."

bin_dir="/home/dzumi/anaconda3/bin"
echo $bin_dir

vcf_dumpstr=${output_dir}/hipstr_calls.vcf.gz # Use the output VCF from HipSTR
vcftype_dumpstr=$3 #options include {gangstr,advntr,hipstr,auto}default is auto
num_records=$4 #integer
min_locus_callrate=$5 #float
min_locus_hwep=$6 #float
min_locus_het=$7 #float
max_locus_het=$8 #float
filter_regions=$9 #takes in a bed file
filter_regions_names=$10 #string
hipstr_max_call_flank_indel=${11} #float
hipstr_max_call_stutter=${12} #float
hipstr_min_supp_reads=${13} #integer
hipstr_min_call_DP=${14} #integer
hipstr_max_call_DP=${15} #integer
hipstr_min_call_Q=${16} #float
gangstr_min_call_DPl=${17} #integer
gangstr_max_call_D=${18} #integer
gangstr_min_call_Q=${19} #float
gangstr_expansion_prob_het=${20} #float
gangstr_expansion_prob_hom=${21} #float
gangstr_expansion_prob_total=${22} #float
advntr_min_call_DP=${23} #integer
advntr_max_call_DP=${24} #integer
advntr_min_spanning=${25} #integer
advntr_min_flanking=${26} #integer
advntr_min_ML=${27} #float
eh_min_call_LC=${28} #integer
eh_max_call_LC=${29} #integer
popstr_min_call_DP=${30} #integer
popstr_max_call_DP=${31} #integer
popstr_require_support=${32} #integer




   #data preparation
tabix -p vcf $vcf_dumpstr #indexes the vcf file supplied
if [ "$vcftype_dumpstr" = "auto" ]; then

	args=()
	if [ "$num_records" ]; then
		args+=(--num-records $num_records)
	fi

	if [ -n "$min_locus_callrate" ]; then
		args+=(--min-locus-callrate $min_locus_callrate)
	fi

	if [ -n "$min_locus_hwep" ]; then
		args+=(--min-locus-hwep $min_locus_hwep)
	fi

	if [ -n "$min_locus_het" ]; then
		args+=(--min-locus-het $min_locus_het)
	fi

	if [ -n "$max_locus_het" ]; then
		args+=(--max-locus-het $max_locus_het)
	fi

	if [ -n "$filter_regions" ]; then
		args+=(--filter-regions $filter_regions)
	fi

	if [ -n "$filter_regions_names" ]; then
		args+=(--filter-regions-names $filter_regions_names)
	fi

	${bin_dir}/dumpSTR --vcf $vcf_dumpstr --vcftype $vcftype_dumpstr --zip "${args[@]}" --out ${output_dir}/dump



elif [ "$vcftype_dumpstr" = "hipstr" ]; then
args=()
	if [ "$num_records" ]; then
		args+=(--num-records $num_records)
	fi

	if [ -n "$min_locus_callrate" ]; then
		args+=(--min-locus-callrate $min_locus_callrate)
	fi

	if [ -n "$min_locus_hwep" ]; then
		args+=(--min-locus-hwep $min_locus_hwep)
	fi

	if [ -n "$min_locus_het" ]; then
		args+=(--min-locus-het $min_locus_het)
	fi

	if [ -n "$max_locus_het" ]; then
		args+=(--max-locus-het $max_locus_het)
	fi

	if [ -n "$filter_regions" ]; then
		args+=(--filter-regions $filter_regions)
	fi

	if [ -n "$filter_regions_names" ]; then
		args+=(--filter-regions-names $filter_regions_names)
	fi
#hipstr call-level filters

	if [ -n "$hipstr_max_call_flank_indel" ]; then
		args+=(--hipstr-max-call-flank-indel $hipstr_max_call_flank_indel)
	fi

	if [ -n "$hipstr_max_call_stutter" ]; then
		args+=(--hipstr-max-call-stutter $hipstr_max_call_stutter)
	fi

	if [ -n "$hipstr_min_supp_reads" ]; then
		args+=(--hipstr-min-supp-reads $hipstr_min_supp_reads)
	fi

	if [ -n "$hipstr_min_call_DP" ]; then
		args+=(--hipstr-min-call-DP $hipstr_min_call_DP)
	fi

	if [ -n "$hipstr_max_call_DP" ]; then
		args+=(--hipstr-max-call-DP $hipstr_max_call_DP)
	fi

	if [ -n "$hipstr_min_call_Q" ]; then
		args+=(--hipstr-min-call-Q $hipstr_min_call_Q)
	fi
	${bin_dir}/dumpSTR --vcf $vcf_dumpstr --vcftype $vcftype_dumpstr --zip --use-length "${args[@]}" --out ${output_dir}/dump


elif [ "$vcftype_dumpstr" = "gangstr" ]; then
	args=()
	if [ "$num_records" ]; then
		args+=(--num-records $num_records)
	fi

	if [ -n "$min_locus_callrate" ]; then
		args+=(--min-locus-callrate $min_locus_callrate)
	fi

	if [ -n "$min_locus_hwep" ]; then
		args+=(--min-locus-hwep $min_locus_hwep)
	fi

	if [ -n "$min_locus_het" ]; then
		args+=(--min-locus-het $min_locus_het)
	fi

	if [ -n "$max_locus_het" ]; then
		args+=(--max-locus-het $max_locus_het)
	fi

	if [ -n "$filter_regions" ]; then
		args+=(--filter-regions $filter_regions)
	fi

	if [ -n "$filter_regions_names" ]; then
		args+=(--filter-regions-names $filter_regions_names)
	fi

#gangstr call-level filters
	if [ -n "$gangstr_min_call_DPl" ]; then
		args+=(--gangstr-min-call-DPl $gangstr_min_call_DPl)
	fi

	if [ -n "$gangstr_max_call_D" ]; then
		args+=(--gangstr-max-call-D $gangstr_max_call_D)
	fi

	if [ -n "$gangstr_min_call_Q" ]; then
		args+=(--gangstr-min-call-Q $gangstr_min_call_Q)
	fi

	if [ -n "$gangstr_expansion_prob_het" ]; then
		args+=(--gangstr-expansion-prob-het $gangstr_expansion_prob_het)
	fi

	if [ -n "$gangstr_expansion_prob_hom" ]; then
		args+=(--gangstr-expansion-prob-hom $gangstr_expansion_prob_hom)
	fi

	if [ -n "$gangstr_expansion_prob_total" ]; then
		args+=(--gangstr-expansion-prob-total $gangstr_expansion_prob_total)
	fi

	${bin_dir}/dumpSTR --vcf $vcf_dumpstr --vcftype $vcftype_dumpstr --zip "${args[@]}" --out ${output_dir}/dump

elif [ "$vcftype_dumpstr" = "advntr" ]; then
	args=()
	if [ "$num_records" ]; then
		args+=(--num-records $num_records)
	fi

	if [ -n "$min_locus_callrate" ]; then
		args+=(--min-locus-callrate $min_locus_callrate)
	fi

	if [ -n "$min_locus_hwep" ]; then
		args+=(--min-locus-hwep $min_locus_hwep)
	fi

	if [ -n "$min_locus_het" ]; then
		args+=(--min-locus-het $min_locus_het)
	fi

	if [ -n "$max_locus_het" ]; then
		args+=(--max-locus-het $max_locus_het)
	fi

	if [ -n "$filter_regions" ]; then
		args+=(--filter-regions $filter_regions)
	fi

	if [ -n "$filter_regions_names" ]; then
		args+=(--filter-regions-names $filter_regions_names)
	fi

#advntr call-level filters


	if [ -n "$advntr_min_call_DP" ]; then
		args+=(--advntr-min-call-DP $advntr_min_call_DP)
	fi

	if [ -n "$advntr_max_call_DP" ]; then
		args+=(--advntr-max-call-DP $advntr_max_call_DP)
	fi

	if [ -n "$advntr_min_spanning" ]; then
		args+=(--advntr-min-spanning $advntr_min_spanning)
	fi

	if [ -n "$advntr_min_flanking" ]; then
		args+=(--advntr-min-flanking $advntr_min_flanking)
	fi

	if [ -n "$advntr_min_ML" ]; then
		args+=(--advntr-min-ML $advntr_min_ML)
	fi

	${bin_dir}/dumpSTR --vcf $vcf_dumpstr --vcftype $vcftype_dumpstr --zip "${args[@]}" --out ${output_dir}/dump

elif [ "$vcftype_dumpstr" = "eh" ]; then
	args=()
	if [ "$num_records" ]; then
		args+=(--num-records $num_records)
	fi

	if [ -n "$min_locus_callrate" ]; then
		args+=(--min-locus-callrate $min_locus_callrate)
	fi

	if [ -n "$min_locus_hwep" ]; then
		args+=(--min-locus-hwep $min_locus_hwep)
	fi

	if [ -n "$min_locus_het" ]; then
		args+=(--min-locus-het $min_locus_het)
	fi

	if [ -n "$max_locus_het" ]; then
		args+=(--max-locus-het $max_locus_het)
	fi

	if [ -n "$filter_regions" ]; then
		args+=(--filter-regions $filter_regions)
	fi

	if [ -n "$filter_regions_names" ]; then
		args+=(--filter-regions-names $filter_regions_names)
	fi

#expansionhunter call-level filters


	if [ -n "$eh_min_call_LC" ]; then
		args+=(--eh-min-call-LC $eh_min_call_LC)
	fi

	if [ -n "$eh_max_call_LC" ]; then
		args+=(--eh-max-call-LC $eh_max_call_LC)
	fi



	${bin_dir}/dumpSTR --vcf $vcf_dumpstr --vcftype $vcftype_dumpstr --zip "${args[@]}" --out ${output_dir}/dump

elif [ "$vcftype_dumpstr" = "popstr" ]; then
	args=()
	if [ "$num_records" ]; then
		args+=(--num-records $num_records)
	fi

	if [ -n "$min_locus_callrate" ]; then
		args+=(--min-locus-callrate $min_locus_callrate)
	fi

	if [ -n "$min_locus_hwep" ]; then
		args+=(--min-locus-hwep $min_locus_hwep)
	fi

	if [ -n "$min_locus_het" ]; then
		args+=(--min-locus-het $min_locus_het)
	fi

	if [ -n "$max_locus_het" ]; then
		args+=(--max-locus-het $max_locus_het)
	fi

	if [ -n "$filter_regions" ]; then
		args+=(--filter-regions $filter_regions)
	fi

	if [ -n "$filter_regions_names" ]; then
		args+=(--filter-regions-names $filter_regions_names)
	fi

#expansionhunter call-level filters



	if [ -n "$popstr_min_call_DP" ]; then
		args+=(--popstr-min-call-DP $popstr_min_call_DP)
	fi

	if [ -n "$popstr_max_call_DP" ]; then
		args+=(--popstr-max-call-DP $popstr_max_call_DP)
	fi

	if [ -n "$popstr_require_support" ]; then
		args+=(--popstr-require-support $popstr_require_support)
	fi

	${bin_dir}/dumpSTR --vcf $vcf_dumpstr --vcftype $vcftype_dumpstr --zip "${args[@]}" --out ${output_dir}/dump

fi

else
    echo "HipSTR output VCF not found. Skipping QCStr."
fi



#Section D
# Check if the output VCF file exists from the third code
if [ -f ${output_dir}/dump.vcf.gz ]; then
    echo "Dumpstr output VCF found. Running QCStr."

    bin_dir="/home/dzumi/anaconda3/bin"
    echo $bin_dir

    vcf_qcstrB=${output_dir}/dump.vcf.gz # Use the output VCF from dumpstr
    vcftype_qcstrB=$3 # options include {gangstr, advntr, hipstr, auto} default is auto
    period_qcstrB=$4 # integer
    refbias_binsize_qcstrB=$5 # integer (5 by default)
    refbias_metric_qcstrB=$6 # {mean or median} mean by default
    refbias_mingts_qcstrB=$7 # integer 100 by default
    refbias_xrange_min_qcstrB=$8
    refbias_xrange_max_qcstrB=$9

    # data preparation
    tabix -p vcf $vcf_qcstrB # indexes the VCF file supplied

    args=()
    # quality plot options
    if [ -n "$vcftype_qcstrB" ]; then
        args+=(--vcftype $vcftype_qcstrB)
    fi

    if [ -n "$period_qcstrB" ]; then
        args+=(--period $period_qcstrB)
    fi

    if [ -n "$quality1" ]; then
        args+=(--quality $quality1)
    fi

    if [ -n "$quality2" ]; then
        args+=(--quality $quality2)
    fi

    if [ -n "$quality3" ]; then
        args+=(--quality $quality3)
    fi

    if [ -n "$quality4" ]; then
        args+=(--quality $quality4)
    fi

    if [ -n "$quality5" ]; then
        args+=(--quality $quality5)
    fi

    # reference bias plot options
    if [ -n "$refbias_binsize_qcstrB" ]; then
        args+=(--refbias-binsize $refbias_binsize_qcstrB)
    fi

    if [ -n "$refbias_metric_qcstrB" ]; then
        args+=(--refbias-metric $refbias_metric_qcstrB)
    fi

    if [ -n "$refbias_mingts_qcstrB" ]; then
        args+=(--refbias-mingts $refbias_mingts_qcstrB)
    fi

    if [ -n "$refbias_xrange_min_qcstrB" ]; then
        args+=(--refbias_xrange-min $refbias_xrange_min_qcstrB)
    fi

    if [ -n "$refbias_xrange_max_qcstrB" ]; then
        args+=(--refbias-xrange-max $refbias_xrange_max_qcstrB)
    fi

    ${bin_dir}/qcSTR --vcf $vcf_qcstrB --quality per-locus --quality per-sample --quality locus-stratified --quality sample-stratified --quality per-call "${args[@]}" --out ${output_dir}/qc
else
    echo "DumpSTR output VCF not found. Skipping QCStr."
fi




# Check if the output VCF file exists from the third code
if [ -f ${output_dir}/dump.vcf.gz ]; then
    echo "Dumpstr output VCF found. Running statStr."

    bin_dir="/home/dzumi/anaconda3/bin"
    echo $bin_dir

    vcf=${output_dir}/dump.vcf.gz # Use the output VCF from dumpstr
vcftype=$3 #options include {gangstr,advntr,hipstr,auto}default is auto
samples=$4 #comma seperated list
sample_prefixes=$5 #string
region=$6 #string chrom:start-end
precision=$7 #integer
nalleles_thresh=$8 #1% by default

   #data preparation
#tabix vcf $vcf #indexes the vcf file supplied
args=()  

    if [ -n "$vcftype" ]; then
        args+=(--vcftype $vcftype)
    fi


    if [ -n "$samples" ]; then
        args+=(--samples $samples)
    fi


    if [ -n "$sample_prefixes" ]; then
        args+=(--sample-prefixes $sample_prefixes)
    fi


    if [ -n "$region" ]; then
        args+=(--region $region)
    fi


    if [ -n "$precision" ]; then
        args+=(--precision $precision)
    fi


    if [ -n "$nalleles_thresh" ]; then
        args+=(--nalleles-thresh $nalleles_thresh)
    fi


${bin_dir}/statSTR --vcf $vcf --thresh --afreq --acount --nalleles --hwep --het --entropy --mean --mode --var --numcalled "${args[@]}" --out ${output_dir}/stat
else
    echo "DumpSTR output VCF not found. Skipping statStr."
fi
