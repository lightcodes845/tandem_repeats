#!/bin/bash
echo "Running"
bin_dir="/home/dzumi/anaconda3/bin";
echo $bin_dir


vcf=$1 #takes in a vcf file
output_dir=$2 #output directory
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










#https://github.com/gymreklab/TRTools/tree/362e75d6d87f1c30a290d562d725d7df0b35a1bd/trtools/statSTR
#required parameters
while getopts :a:b:c:d:e:f:g: flag;
do
        case "${flag}" in
        a) vcf=$OPTARG;; #takes in a vcf file
        b) vcftype=$OPTARG;; #options include {gangstr,advntr,hipstr,auto}default is auto
        c) samples=$OPTARG;; #comma seperated list
        d) sample_prefixes=$OPTARG;; #string
        e) region=$OPTARG;; #string chrom:start-end
        f) precision=$OPTARG;; #integer
        g) nalleles_thresh=$OPTARG;; #1% by default
       
        esac
done


#data preparation
tabix -p vcf $vcf #indexes the vcf file supplied

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


statSTR --vcf $vcf --thresh --afreq --acount --nalleles --hwep --het --entropy --mean --mode --var --numcalled "${args[@]}" --out stat

