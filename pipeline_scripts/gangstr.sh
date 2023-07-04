#!/bin/bash
echo "Running"
bin_dir= "/usr/local/bin/GangSTR";
echo $bin_dir


output_dir=$1
bam=$2 #takes a bam file
ref=$3 #takes a fasta file
regions=$4 #takes a bed file
chrom=$5 #1-23
bam_samps=$6 #Comma separated list of sample IDs for --bam
samp_sex=$7 #Comma separated list of sample sex for each sample ID
str_info=$8 #takes in a tab file
period=$9 #Only genotype loci with periods (motif lengths) in this comma-separated list.
readlength=${10} #integer
coverage=${11} #float
insertmean=${12} #float
insertsdev=${13}  #float
min_sample_reads=${14}  #int
frrweight=${15}  #float 
spanweight=${16}  #float 
enclweight=${17}  #float 
flankweight=${18}  #float 
ploidy=${19}  #1 or 2 (2 by default)
numbstrap=${20}  #INT
grid_theshold=${21}  #int
rescue_count=${22}  #int
max_proc_read=${23}  #int
minscore=${24}  #int
minmatch=${25}  #int
stutterup=${26}  #float 
stutterdown=${27}  #float 
stutterprob=${28}  #float 


	args=()

	if [ -n "$chrom" ]; then
		args+=(--chrom $chrom)
	fi

	if [ -n "$bam_samps" ]; then
		args+=(--bam-samps $bam_samps)
	fi

	if [ -n "$samp_sex" ]; then
		args+=(--samp-sex $samp_sex)
	fi

	if [ -n "$str_info" ]; then
		args+=(--str-info $str_info)
	fi

    if [ -n "$period" ]; then
		args+=(--period $period)
	fi

	if [ -n "$readlength" ]; then
		args+=(--readlength $readlength)
	fi

	if [ -n "$coverage" ]; then
		args+=(--coverage $coverage)
	fi

	if [ -n "$insertmean" ]; then
		args+=(--insertmean $insertmean)
	fi

	if [ -n "$insertsdev" ]; then
		args+=(--insertsdev $insertsdev)
	fi

    if [ -n "$min_sample_reads" ]; then
		args+=(--min-sample-reads $min_sample_reads)
	fi

	if [ -n "$frrweight" ]; then
		args+=(--frrweight $frrweight)
	fi

	if [ -n "$spanweight" ]; then
		args+=(--spanweight $spanweight)
	fi

	if [ -n "$enclweight" ]; then
		args+=(--enclweight $enclweight)
	fi

	if [ -n "$flankweight" ]; then
		args+=(--flankweight $flankweight)
	fi

	if [ -n "$ploidy" ]; then
		args+=(--ploidy $ploidy)
	fi

    if [ -n "$numbstrap" ]; then
		args+=(--min-sample-reads $numbstrap)
	fi

	if [ -n "$grid_theshold" ]; then
		args+=(--grid-theshold $grid_theshold)
	fi

	if [ -n "$rescue_count" ]; then
		args+=(--rescue-count $rescue_count)
	fi

	if [ -n "$max_proc_read" ]; then
		args+=(--max-proc-read $max_proc_read)
	fi

	if [ -n "$minscore" ]; then
		args+=(--minscore $minscore)
	fi

	if [ -n "$minmatch" ]; then
		args+=(--minmatch $minmatch)
	fi

    if [ -n "$stutterup" ]; then
		args+=(--stutterup $stutterup)
	fi

	if [ -n "$stutterdown" ]; then
		args+=(--stutterdown $stutterdown)
	fi

	if [ -n "$stutterprob" ]; then
		args+=(--stutterprob $stutterprob)
	fi

	

	${bin_dir}/GangSTR --bam $bam --ref $ref --regions $regions --output-readinfo --output-bootstraps --include-ggl "${args[@]}"  --out ${output_dir}/gangstr


