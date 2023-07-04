#!/bin/bash
echo "Running"
bin_dir= "/home/dzumi/HipSTR/HipSTR"
echo $bin_dir


output_dir=$1
bams=$2 #up to five files at least
fasta=$3 #takes a fasta file
regions=$4 #takes a bed file
ref_vcf=$5 #takes a vcf file
stutter_in=$6 #takes a vcf file
haploid_chrs=$7 #integer 1-23,default all
use_unpaired=$8 #True or False. False by default
snp_vcf=$9 #takes a vcf file
bam_samps=$10 #comma seperated list
bam_libs=$11 #float
min_reads=$12 #integer 100 by default


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

	${bin_dir}/HipSTR --bams $bams --fasta $fasta --regions $regions --viz-out --log --output-filters "${args[@]}" --str-vcf ${output_dir}/hipstr_calls.vcf.gz


