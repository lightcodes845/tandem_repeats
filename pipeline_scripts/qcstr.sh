#!/bin/bash
echo "Running"
bin_dir="/home/dzumi/anaconda3/bin";
echo $bin_dir

vcf=$1 #takes in a vcf file
output_dir=$2 #output directory
vcftype=$3 #options include {gangstr,advntr,hipstr,auto}default is auto
period=$4 #integer
refbias_binsize=$5 #integer (5 by default)
refbias_metric=$6 #{mean or median} mean by default
refbias_mingts=$7 #integer 100 by default
refbias_xrange_min=$8
refbias_xrange_max=$9

#data preparation
tabix -p vcf $vcf #indexes the vcf file supplied

args=()  
#quality plot options 

    if [ -n "$vcftype" ]; then
        args+=(--vcftype $vcftype)
    fi


    if [ -n "$period" ]; then
        args+=(--period $period)
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

#reference bias plot options
    if [ -n "$refbias_binsize" ]; then
        args+=(--refbias-binsize= $refbias_binsize)
    fi


    if [ -n "$refbias_metric" ]; then
        args+=(--refbias-metric $refbias_metric)
    fi


    if [ -n "$refbias_mingts" ]; then
        args+=(--refbias-mingts $refbias_mingts)
    fi


    if [ -n "$refbias_xrange_min" ]; then
        args+=(--refbias_xrange-min $refbias_xrange_min)
    fi


    if [ -n "$refbias_xrange_max" ]; then
        args+=(--refbias-xrange-max $refbias_xrange_max)
    fi

${bin_dir}/qcSTR --vcf $vcf --quality per-locus --quality per-sample --quality locus-stratified --quality sample-stratified --quality per-call "${args[@]}" --out ${output_dir}/qc