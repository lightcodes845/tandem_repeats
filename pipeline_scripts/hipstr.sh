#!/bin/bash
echo "Running"
bin_dir="/home/dzumi/HipSTR"
echo $bin_dir
input_dir="/home/dzumi/trFiles/test/Genotyping"

bams=$1 #up to five files at least
regions=$2 #takes a bed file
output_dir=$3 #output directory
haploid_chrs=$4 #integer 1-23,default all
fasta=$5 #takes a fasta file
use_unpaired=$6 #True or False. False by default
bam_samps=$7 #comma seperated list
bam_libs=$8 #float
min_reads=$9 #integer 100 by default
ref_vcf=${10} #takes a vcf file
stutter_in=${11} #takes a vcf file
snp_vcf=${12} #takes a vcf file


files=$bams
for i in ${bams//,/ }
do
samtools index "$i"
done


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

echo $bams
echo $fasta
echo $regions
echo $haploid_chrs
echo $use_unpaired
echo $bam_samps
echo $bam_libs
echo $min_reads

if [ "$fasta" = "hg19" ]; then
${bin_dir}/HipSTR --bams "$bams" --fasta "${input_dir}/hg19.fa" --regions "$regions" --viz-out "${output_dir}/hipstr_calls.viz.gz" --log hipstr_calls.log  --def-stutter-model --output-filters "${args[@]}" --str-vcf "${output_dir}/hipstr_calls.vcf.gz"

elif [ "$fasta" = "hg38" ]; then
${bin_dir}/HipSTR --bams "$bams" --fasta "${input_dir}/hg38.fa" --regions "$regions" --viz-out "${output_dir}/hipstr_calls.viz.gz" --log hipstr_calls.log --def-stutter-model --output-filters "${args[@]}" --str-vcf "${output_dir}/hipstr_calls.vcf.gz"
fi