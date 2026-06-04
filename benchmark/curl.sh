#!/usr/bin/env bash

set -euo pipefail

CLOUDINARY_CLOUD="di5rp4t2p"
CLOUDINARY_BASE_URL="https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/fetch"
ACCEPT_HEADER="image/avif,image/webp,image/apng,*/*;q=0.8"
OUTPUT_CSV="resultats_benchmark.csv"
IMAGE_BASE_URL="https://image.chapi.ch/wp-content/uploads/raw/image-test-"
NUMBER_OF_IMAGES=9
NUMBER_OF_JPG_IMAGES=8
NUMBER_OF_RUNS=11
TEST_ID=$(date +%s)

# List of transformations to benchmark, from the most generic to more specific variants.
TRANSFORMATIONS=(
	"f_auto,q_auto"
)

if [[ ! -f "${OUTPUT_CSV}" ]]; then
	printf 'fetch_url,image_url,run_index,transformation,http_code,content_type,size_download,time_starttransfer,time_total\n' > "${OUTPUT_CSV}"
fi

benchmark_variant() {
	local image_url="$1"
	local run_index="$2"
	local transformation="$3"
	local fetch_url="${CLOUDINARY_BASE_URL}/${transformation}/${image_url}?test=${TEST_ID}"
	local metrics
	local http_code
	local content_type
	local size_download
	local time_starttransfer
	local time_total

	metrics="$({
		curl -s -o /dev/null \
			-H "Accept: ${ACCEPT_HEADER}" \
			-w '%{http_code}\t%{content_type}\t%{size_download}\t%{time_starttransfer}\t%{time_total}' \
			"${fetch_url}"
	})"

	IFS=$'\t' read -r http_code content_type size_download time_starttransfer time_total <<< "${metrics}"

	printf '"%s","%s",%s,"%s",%s,"%s",%s,%s,%s\n' \
		"${fetch_url}" \
		"${image_url}" \
		"${run_index}" \
		"${transformation}" \
		"${http_code}" \
		"${content_type}" \
		"${size_download}" \
		"${time_starttransfer}" \
		"${time_total}" >> "${OUTPUT_CSV}"
}

build_image_url() {
	local image_index="$1"

	if (( image_index <= NUMBER_OF_JPG_IMAGES )); then
		printf '%s%d.jpg' "${IMAGE_BASE_URL}" "${image_index}"
	else
		printf '%s%d.png' "${IMAGE_BASE_URL}" "${image_index}"
	fi
}

benchmark_image() {
	local image_index="$1"
	local image_url
	local run_index
	local transformation

	image_url="$(build_image_url "${image_index}")"

	for (( run_index = 1; run_index <= NUMBER_OF_RUNS; run_index++ )); do
		for transformation in "${TRANSFORMATIONS[@]}"; do
			benchmark_variant "${image_url}" "${run_index}" "${transformation}"
		done
	done
}

for (( image_index = 1; image_index <= NUMBER_OF_IMAGES; image_index++ )); do
	benchmark_image "${image_index}"
done 