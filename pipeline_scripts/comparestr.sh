#!/bin/bash
echo "Running"
bin_dir="/home/dzumi/anaconda3/bin";
echo $bin_dir


vcf1=$1 #takes in a vcf file
vcf2=$2 #takes in another vcf file
output_dir=$3 #output directory
vcftype1=$4 #options include {gangstr,advntr,hipstr,auto}default is auto
vcftype2=$5 #options include {gangstr,advntr,hipstr,auto}d
samples=$6 #string
regions=$7 #string
stratify_fields=$8 #comma seperated list
stratify_binsizes=$9 #comma seperated list of min:max:binsize values
stratify_file=$10 #integer from 0 upwards
bubble_min=$11 #float
bubble_max=$12 #float

#data preparation
tabix -p $vcf1
tabix -p $vcf2

 args=()
    if [ -n "$vcftype1" ]; then
        args+=(--vcftype1 $vcftype1)
    fi


    if [ -n "$vcftype2" ]; then
        args+=(--vcftype2 $vcftype2)
    fi


    if [ -n "$samples" ]; then
        args+=(--samples $samples)
    fi


    if [ -n "$regions" ]; then
        args+=(--regions $regions)
    fi


    if [ -n "$stratify_fields" ]; then
        args+=(--stratify-fields $stratify_fields)
    fi


    if [ -n "$stratify_binsizes" ]; then
        args+=(--stratify-binsizes $stratify_binsizes)
    fi


    if [ -n "$stratify_file" ]; then
        args+=(--stratify-file $stratify_file)
    fi

    if [ -n "$bubble_min" ]; then
        args+=(--bubble-min $bubble_min)
    fi


    if [ -n "$bubble_max" ]; then
        args+=(--bubble-max $bubble_max)
    fi

    ${bin_dir}/compareSTR --vcf1 $vcf1 --vcf2 $vcf2 --period "${args[@]}" --out ${output_dir}/compare