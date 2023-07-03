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
stratify_file=${10} #integer from 0 upwards
bubble_min=${11} #float
bubble_max=${12} #float

echo "printing variables"
echo $vcf1
echo $vcf2
echo $stratify_file
echo "done printing variables"


#data preparation
tabix -p vcf $vcf1
tabix -p vcf $vcf2
# tabix -p $vcf1
# tabix -p $vcf2


 args=()
    if [ -n "$vcftype1" ]; then
        args+=(--vcftype1 $vcftype1)
    fi

    echo "if 1"

    if [ -n "$vcftype2" ]; then
        args+=(--vcftype2 $vcftype2)
    fi

    echo "if 2"

    if [ -n "$samples" ]; then
        args+=(--samples $samples)
    fi

    echo "if 3"


    if [ -n "$regions" ]; then
        args+=(--regions $regions)
    fi

    echo "if 4"


    if [ -n "$stratify_fields" ]; then
        args+=(--stratify-fields $stratify_fields)
    fi

    echo "if 5"

    if [ -n "$stratify_binsizes" ]; then
        args+=(--stratify-binsizes $stratify_binsizes)
    fi

    echo "if 6"

    if [ -n "$stratify_file" ]; then
        args+=(--stratify-file $stratify_file)
    fi

    echo "if 7"


    if [ -n "$bubble_min" ]; then
        args+=(--bubble-min $bubble_min)
    fi

    echo "if 8"


    if [ -n "$bubble_max" ]; then
        args+=(--bubble-max $bubble_max)
    fi

    echo "if 9"


    ${bin_dir}/compareSTR --vcf1 $vcf1 --vcf2 $vcf2 --period "${args[@]}" --out ${output_dir}/compare

    echo "if 10"
