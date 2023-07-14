#!/bin/bash
echo "Running"
bin_dir="/home/dzumi/anaconda3/bin";
echo $bin_dir

vcf=$1 #takes in a vcf file
output_dir=$2 #output directory
vcftype=$3 #options include {gangstr,advntr,hipstr,auto}default is auto
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
tabix -p vcf $vcf #indexes the vcf file supplied
if [ $vcftype=="auto" ]; then

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

	${bin_dir}/dumpSTR --vcf $vcf --vcftype $vcftype --zip "${args[@]}" --out ${output_dir}/dump



elif [ $vcftype=="hipstr" ]; then
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
	${bin_dir}/dumpSTR --vcf $vcf --vcftype $vcftype --zip --use-length "${args[@]}" --out ${output_dir}/dump


elif [ $vcftype=="gangstr" ]; then
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

	${bin_dir}/dumpSTR --vcf $vcf --vcftype $vcftype --zip "${args[@]}" --out ${output_dir}/dump

elif [ $vcftype=="advntr" ]; then
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

	${bin_dir}/dumpSTR --vcf $vcf --vcftype $vcftype --zip "${args[@]}" --out ${output_dir}/dump

elif [ $vcftype=="eh" ]; then
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



	${bin_dir}/dumpSTR --vcf $vcf --vcftype $vcftype --zip "${args[@]}" --out ${output_dir}/dump

elif [ $vcftype=="popstr" ]; then
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

	${bin_dir}/dumpSTR --vcf $vcf --vcftype $vcftype --zip "${args[@]}" --out ${output_dir}/dump


fi