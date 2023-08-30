#!/bin/bash
#section A
echo "Running HIPSTR"
bin_dir="/home/dzumi/HipSTR"
echo "$bin_dir"
input_dir="/home/dzumi/trFiles/test/Genotyping"

bams=$1 #up to five files at least
regions=$2 #takes a bed file
output_dir=$3 #output directory
haploid_chrs=$4 #integer 1-23,default all
fasta=$5 #takes a fasta file
# use_unpaired=$6 #True or False. False by default
bam_samps=$6 #comma separated list
bam_libs=$7 #float
min_reads=$8 #integer 100 by default
# ref_vcf=${10} #takes a vcf file
# stutter_in=${11} #takes a vcf file
# snp_vcf=${12} #takes a vcf file

files=$bams
for i in ${bams//,/ }
do
    samtools index "$i"
done

args=()

if [ -n "$ref_vcf" ]; then
    args+=(--ref-vcf "$ref_vcf")
fi

if [ -n "$stutter_in" ]; then
    args+=(--stutter-in "$stutter_in")
fi

if [ -n "$haploid_chrs" ]; then
    args+=(--haploid-chrs "$haploid_chrs")
fi

if [ -n "$use_unpaired" ]; then
    args+=(--use-unpaired "$use_unpaired")
fi

if [ -n "$snp_vcf" ]; then
    args+=(--snp-vcf "$snp_vcf")
fi

if [ -n "$bam_samps" ]; then
    args+=(--bam-samps "$bam_samps")
fi

if [ -n "$bam_libs" ]; then
    args+=(--bam-libs "$bam_libs")
fi

if [ -n "$min_reads" ]; then
    args+=(--min-reads "$min_reads")
fi


if [ "$fasta" = "hg19" ]; then
    eval "${bin_dir}/HipSTR --bams \"$bams\" --fasta \"${input_dir}/hg19.fa\" --regions \"$regions\" --viz-out \"${output_dir}/hipstr_calls.viz.gz\" --log hipstr_calls.log --def-stutter-model ${args[*]} --str-vcf \"${output_dir}/hipstr_calls.vcf.gz\""
elif [ "$fasta" = "hg38" ]; then
    eval "${bin_dir}/HipSTR --bams \"$bams\" --fasta \"${input_dir}/hg38.fa\" --regions \"$regions\" --viz-out \"${output_dir}/hipstr_calls.viz.gz\" --log hipstr_calls.log --def-stutter-model ${args[*]} --str-vcf \"${output_dir}/hipstr_calls.vcf.gz\""
else
    echo "Unknown fasta option: $fasta"
fi

#section B
# Check if the output VCF file exists from the SECTION A
if [ -f ${output_dir}/hipstr_calls.vcf.gz ]; then
    echo "HipSTR output VCF found. Running FIRST QCStr."

echo "Running first QCSTR"
bin_dirB="/home/dzumi/anaconda3/bin";
echo $bin_dirB

vcf_qcstrA=${output_dir}/hipstr_calls.vcf.gz # Use the output VCF from HipSTR
#vcftype_qcstrA=$3 # options include {gangstr, advntr, hipstr, auto} default is auto
period_qcstrA=${9} # integer
refbias_binsize_qcstrA=${10} #integer (5 by default)
refbias_metric_qcstrA=${11} #{mean or median} mean by default
refbias_mingts_qcstrA=${12} # integer 100 by default
refbias_xrange_min_qcstrA=${13}
refbias_xrange_max_qcstrA=${14}

# data preparation
    tabix -p vcf $vcf_qcstrA # indexes the VCF file supplied

    args=()
    # quality plot options

    # if [ -n "$vcftype_qcstrA" ]; then
    #     args+=(--vcftype $vcftype_qcstrA)
    # fi

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

    ${bin_dirB}/qcSTR --vcf $vcf_qcstrA --vcftype hipstr --quality per-locus --quality per-sample --quality locus-stratified --quality sample-stratified --quality per-call "${args[@]}" --out ${output_dir}/first_qc

else
    echo "HipSTR output VCF not found. Skipping First QCStr."
fi



#SECTION C
# Check if the output VCF file exists from the qcstr
if [ -f ${output_dir}/hipstr_calls.vcf.gz ]; then
    echo "HipSTR output VCF found. Running dumpStr."

echo "Running dumpstr"
bin_dirC="/home/dzumi/anaconda3/bin";
echo $bin_dirC

vcf_dumpstr=${output_dir}/hipstr_calls.vcf.gz # Use the output VCF from HipSTR
#vcftype_dumpstr=$3 #options include {gangstr,advntr,hipstr,auto}default is auto
num_records=${15} #integer
min_locus_callrate=${16} #float
min_locus_hwep=${17} #float
min_locus_het=${18} #float
max_locus_het=${19} #float
filter_regions=${20} #takes in a bed file
filter_regions_names=${21} #string
hipstr_max_call_flank_indel=${22} #float
hipstr_max_call_stutter=${23} #float
hipstr_min_supp_reads=${24} #integer
hipstr_min_call_DP=${25} #integer
hipstr_max_call_DP=${26} #integer
hipstr_min_call_Q=${27} #float
# gangstr_min_call_DPl=${29} #integer
# gangstr_max_call_D=${30} #integer
# gangstr_min_call_Q=${31} #float
# gangstr_expansion_prob_het=${32} #float
# gangstr_expansion_prob_hom=${33} #float
# gangstr_expansion_prob_total=${34} #float
# advntr_min_call_DP=${35} #integer
# advntr_max_call_DP=${36} #integer
# advntr_min_spanning=${37} #integer
# advntr_min_flanking=${38} #integer
# advntr_min_ML=${39} #float
# eh_min_call_LC=${40} #integer
# eh_max_call_LC=${41} #integer
# popstr_min_call_DP=${42} #integer
# popstr_max_call_DP=${43} #integer
# popstr_require_support=${44} #integer


#data preparation
tabix -p vcf $vcf_dumpstr #indexes the vcf file supplied
# if [ "$vcftype_dumpstr" = "auto" ]; then

# 	args=()
# 	if [ "$num_records" ]; then
# 		args+=(--num-records $num_records)
# 	fi

# 	if [ -n "$min_locus_callrate" ]; then
# 		args+=(--min-locus-callrate $min_locus_callrate)
# 	fi

# 	if [ -n "$min_locus_hwep" ]; then
# 		args+=(--min-locus-hwep $min_locus_hwep)
# 	fi

# 	if [ -n "$min_locus_het" ]; then
# 		args+=(--min-locus-het $min_locus_het)
# 	fi

# 	if [ -n "$max_locus_het" ]; then
# 		args+=(--max-locus-het $max_locus_het)
# 	fi

# 	if [ -n "$filter_regions" ]; then
# 		args+=(--filter-regions $filter_regions)
# 	fi

# 	if [ -n "$filter_regions_names" ]; then
# 		args+=(--filter-regions-names $filter_regions_names)
# 	fi

# 	${bin_dir}/dumpSTR --vcf $vcf_dumpstr --vcftype $vcftype_dumpstr --zip "${args[@]}" --out ${output_dir}/dump



# elif [ "$vcftype_dumpstr" = "hipstr" ]; then
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
	${bin_dirC}/dumpSTR --vcf $vcf_dumpstr --vcftype hipstr --zip --use-length "${args[@]}" --out ${output_dir}/dump


# elif [ "$vcftype_dumpstr" = "gangstr" ]; then
# 	args=()
# 	if [ "$num_records" ]; then
# 		args+=(--num-records $num_records)
# 	fi

# 	if [ -n "$min_locus_callrate" ]; then
# 		args+=(--min-locus-callrate $min_locus_callrate)
# 	fi

# 	if [ -n "$min_locus_hwep" ]; then
# 		args+=(--min-locus-hwep $min_locus_hwep)
# 	fi

# 	if [ -n "$min_locus_het" ]; then
# 		args+=(--min-locus-het $min_locus_het)
# 	fi

# 	if [ -n "$max_locus_het" ]; then
# 		args+=(--max-locus-het $max_locus_het)
# 	fi

# 	if [ -n "$filter_regions" ]; then
# 		args+=(--filter-regions $filter_regions)
# 	fi

# 	if [ -n "$filter_regions_names" ]; then
# 		args+=(--filter-regions-names $filter_regions_names)
# 	fi

# #gangstr call-level filters
# 	if [ -n "$gangstr_min_call_DPl" ]; then
# 		args+=(--gangstr-min-call-DPl $gangstr_min_call_DPl)
# 	fi

# 	if [ -n "$gangstr_max_call_D" ]; then
# 		args+=(--gangstr-max-call-D $gangstr_max_call_D)
# 	fi

# 	if [ -n "$gangstr_min_call_Q" ]; then
# 		args+=(--gangstr-min-call-Q $gangstr_min_call_Q)
# 	fi

# 	if [ -n "$gangstr_expansion_prob_het" ]; then
# 		args+=(--gangstr-expansion-prob-het $gangstr_expansion_prob_het)
# 	fi

# 	if [ -n "$gangstr_expansion_prob_hom" ]; then
# 		args+=(--gangstr-expansion-prob-hom $gangstr_expansion_prob_hom)
# 	fi

# 	if [ -n "$gangstr_expansion_prob_total" ]; then
# 		args+=(--gangstr-expansion-prob-total $gangstr_expansion_prob_total)
# 	fi

# 	${bin_dir}/dumpSTR --vcf $vcf_dumpstr --vcftype $vcftype_dumpstr --zip "${args[@]}" --out ${output_dir}/dump

# elif [ "$vcftype_dumpstr" = "advntr" ]; then
# 	args=()
# 	if [ "$num_records" ]; then
# 		args+=(--num-records $num_records)
# 	fi

# 	if [ -n "$min_locus_callrate" ]; then
# 		args+=(--min-locus-callrate $min_locus_callrate)
# 	fi

# 	if [ -n "$min_locus_hwep" ]; then
# 		args+=(--min-locus-hwep $min_locus_hwep)
# 	fi

# 	if [ -n "$min_locus_het" ]; then
# 		args+=(--min-locus-het $min_locus_het)
# 	fi

# 	if [ -n "$max_locus_het" ]; then
# 		args+=(--max-locus-het $max_locus_het)
# 	fi

# 	if [ -n "$filter_regions" ]; then
# 		args+=(--filter-regions $filter_regions)
# 	fi

# 	if [ -n "$filter_regions_names" ]; then
# 		args+=(--filter-regions-names $filter_regions_names)
# 	fi

# #advntr call-level filters


# 	if [ -n "$advntr_min_call_DP" ]; then
# 		args+=(--advntr-min-call-DP $advntr_min_call_DP)
# 	fi

# 	if [ -n "$advntr_max_call_DP" ]; then
# 		args+=(--advntr-max-call-DP $advntr_max_call_DP)
# 	fi

# 	if [ -n "$advntr_min_spanning" ]; then
# 		args+=(--advntr-min-spanning $advntr_min_spanning)
# 	fi

# 	if [ -n "$advntr_min_flanking" ]; then
# 		args+=(--advntr-min-flanking $advntr_min_flanking)
# 	fi

# 	if [ -n "$advntr_min_ML" ]; then
# 		args+=(--advntr-min-ML $advntr_min_ML)
# 	fi

# 	${bin_dir}/dumpSTR --vcf $vcf_dumpstr --vcftype $vcftype_dumpstr --zip "${args[@]}" --out ${output_dir}/dump

# elif [ "$vcftype_dumpstr" = "eh" ]; then
# 	args=()
# 	if [ "$num_records" ]; then
# 		args+=(--num-records $num_records)
# 	fi

# 	if [ -n "$min_locus_callrate" ]; then
# 		args+=(--min-locus-callrate $min_locus_callrate)
# 	fi

# 	if [ -n "$min_locus_hwep" ]; then
# 		args+=(--min-locus-hwep $min_locus_hwep)
# 	fi

# 	if [ -n "$min_locus_het" ]; then
# 		args+=(--min-locus-het $min_locus_het)
# 	fi

# 	if [ -n "$max_locus_het" ]; then
# 		args+=(--max-locus-het $max_locus_het)
# 	fi

# 	if [ -n "$filter_regions" ]; then
# 		args+=(--filter-regions $filter_regions)
# 	fi

# 	if [ -n "$filter_regions_names" ]; then
# 		args+=(--filter-regions-names $filter_regions_names)
# 	fi

# #expansionhunter call-level filters


# 	if [ -n "$eh_min_call_LC" ]; then
# 		args+=(--eh-min-call-LC $eh_min_call_LC)
# 	fi

# 	if [ -n "$eh_max_call_LC" ]; then
# 		args+=(--eh-max-call-LC $eh_max_call_LC)
# 	fi



# 	${bin_dir}/dumpSTR --vcf $vcf_dumpstr --vcftype $vcftype_dumpstr --zip "${args[@]}" --out ${output_dir}/dump

# elif [ "$vcftype_dumpstr" = "popstr" ]; then
# 	args=()
# 	if [ "$num_records" ]; then
# 		args+=(--num-records $num_records)
# 	fi

# 	if [ -n "$min_locus_callrate" ]; then
# 		args+=(--min-locus-callrate $min_locus_callrate)
# 	fi

# 	if [ -n "$min_locus_hwep" ]; then
# 		args+=(--min-locus-hwep $min_locus_hwep)
# 	fi

# 	if [ -n "$min_locus_het" ]; then
# 		args+=(--min-locus-het $min_locus_het)
# 	fi

# 	if [ -n "$max_locus_het" ]; then
# 		args+=(--max-locus-het $max_locus_het)
# 	fi

# 	if [ -n "$filter_regions" ]; then
# 		args+=(--filter-regions $filter_regions)
# 	fi

# 	if [ -n "$filter_regions_names" ]; then
# 		args+=(--filter-regions-names $filter_regions_names)
# 	fi

# #expansionhunter call-level filters



# 	if [ -n "$popstr_min_call_DP" ]; then
# 		args+=(--popstr-min-call-DP $popstr_min_call_DP)
# 	fi

# 	if [ -n "$popstr_max_call_DP" ]; then
# 		args+=(--popstr-max-call-DP $popstr_max_call_DP)
# 	fi

# 	if [ -n "$popstr_require_support" ]; then
# 		args+=(--popstr-require-support $popstr_require_support)
# 	fi

# 	${bin_dir}/dumpSTR --vcf $vcf_dumpstr --vcftype $vcftype_dumpstr --zip "${args[@]}" --out ${output_dir}/dump

# fi

else
    echo "HipSTR output VCF not found. Skipping DumpStr."
fi



#Section D
# Check if the output VCF file exists from the SECTION C
if [ -f ${output_dir}/dump.vcf.gz ]; then
    echo "Dumpstr output VCF found. Running Second QCStr."


echo "Running second QCSTR"
bin_dirD="/home/dzumi/anaconda3/bin";
echo $bin_dirD

vcf_qcstrB=${output_dir}/dump.vcf.gz # Use the output VCF from dumpstr
    # vcftype_qcstrB=$3 # options include {gangstr, advntr, hipstr, auto} default is auto
    period_qcstrB=${28} # integer
    refbias_binsize_qcstrB=${29} # integer (5 by default)
    refbias_metric_qcstrB=${30} # {mean or median} mean by default
    refbias_mingts_qcstrB=${31} # integer 100 by default
    refbias_xrange_min_qcstrB=${32}
    refbias_xrange_max_qcstrB=${33}

    # data preparation
    tabix -p vcf $vcf_qcstrB # indexes the VCF file supplied

    args=()
    # quality plot options
    # if [ -n "$vcftype_qcstrB" ]; then
    #     args+=(--vcftype $vcftype_qcstrB)
    # fi

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

    ${bin_dirD}/qcSTR --vcf $vcf_qcstrB --vcftype hipstr --quality per-locus --quality per-sample --quality locus-stratified --quality sample-stratified --quality per-call "${args[@]}" --out ${output_dir}/second_qc
else
    echo "DumpSTR output VCF not found. Skipping Second QCStr."
fi


#SECTION E
# Check if the output VCF file exists from the SECTION D
if [ -f ${output_dir}/dump.vcf.gz ]; then
    echo "Dumpstr output VCF found. Running statStr."

echo "Running"
bin_dirE="/home/dzumi/anaconda3/bin";
echo $bin_dirE


vcf=${output_dir}/dump.vcf.gz # Use the output VCF from dumpstr
# vcftype=$3 #options include {gangstr,advntr,hipstr,auto}default is auto
samples=${34} #comma seperated list
sample_prefixes=${35} #string
region=${36} #string chrom:start-end
precision=${37} #integer
nalleles_thresh=${38} #1% by default



#data preparation
#tabix vcf $vcf #indexes the vcf file supplied
args=()  

    # if [ -n "$vcftype" ]; then
    #     args+=(--vcftype $vcftype)
    # fi


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

${bin_dirE}/statSTR --vcf $vcf --vcftype hipstr --thresh --afreq --acount --nalleles --hwep --het --entropy --mean --mode --var --numcalled "${args[@]}" --out ${output_dir}/stat
else
    echo "DumpSTR output VCF not found. Skipping statStr."
fi

