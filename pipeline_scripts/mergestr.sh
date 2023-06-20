#!/bin/bash
echo "Running"
bin_dir="/home/dzumi/anaconda3/bin";
echo $bin_dir

vcfs=$1 #takes in two vcf files
output_dir=$2 #output directory
vcftype=$3 #options include {gangstr,advntr,hipstr,auto}default is auto
update_sample_from_file=$4


files=$vcfs
for i in ${files//,/ }
do
	tabix -p vcf "$i"

done


 args=()
    if [ -n "$update_sample_from_file" ]; then
        args+=(--update-sample-from-file $update_sample_from_file)
    fi

${bin_dir}/mergeSTR --vcfs $vcfs --vcftype $vcftype "${args[@]}" --out ${output_dir}/merge
# bgzip merge.vcf
# tabix -p vcf merge.vcf.gz











# outputs 2 files:merged.vcf and merged.vcf.gz
#parameters
#vcfs #takes in multiple vcf files to merge
#vcftype #options include {gangstr,advntr,hipstr,auto}default is auto

# while getopts a:b:c: flag
# do
#         case "${flag}" in
#         a) vcfs=$OPTARG;;
#         b) vcftype=$OPTARG;;
# 	c) update_sample_from_file=$OPTARG;;
#         esac

# done

# files=$vcfs
# for i in ${files//,/ }
# do
# 	tabix -p vcf "$i"

# done

#  args=()
#     if [ -n "$update_sample_from_file" ]; then
#         args+=(--update-sample-from-file $update_sample_from_file)
#     fi

# mergeSTR --vcfs $vcfs --vcftype $vcftype "${args[@]}" --out merged
# bgzip merged.vcf
# tabix -p vcf merged.vcf.gz
