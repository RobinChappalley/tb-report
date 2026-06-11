#!/usr/bin/env bash

# Script de benchmark pour tester des URL lues depuis un fichier plat.
# Il exécute plusieurs requêtes curl, mesure des métriques, et écrit un CSV.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Fichier contenant une URL par ligne.
URL_FILE="${1:-${SCRIPT_DIR}/image_urls}"

# Nombre d'itérations (passes) par URL.
NUMBER_OF_RUNS=11

# En-tête Accept pour préférer les formats modernes (avif/webp).
ACCEPT_HEADER="image/avif,image/webp,image/apng,*/*;q=0.8"

# Fichier CSV de sortie.
OUTPUT_CSV="${SCRIPT_DIR}/resultats_benchmark_images_urls.csv"

if [[ ! -f "${URL_FILE}" ]]; then
	echo "Fichier introuvable : ${URL_FILE}" >&2
	exit 1
fi

if [[ ! -f "${OUTPUT_CSV}" ]]; then
	printf 'fetch_url,line_number,run_index,http_code,content_type,size_download,time_starttransfer,time_total\n' > "${OUTPUT_CSV}"
fi

benchmark_url() {
	local fetch_url="$1"
	local line_number="$2"
	local run_index="$3"

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

	printf '"%s",%s,%s,%s,"%s",%s,%s,%s\n' \
		"${fetch_url}" \
		"${line_number}" \
		"${run_index}" \
		"${http_code}" \
		"${content_type}" \
		"${size_download}" \
		"${time_starttransfer}" \
		"${time_total}" >> "${OUTPUT_CSV}"
}

benchmark_file() {
	local line_number=0
	local fetch_url
	local run_index

	while IFS= read -r fetch_url || [[ -n "${fetch_url}" ]]; do
		fetch_url="${fetch_url%$'\r'}"

		if [[ -z "${fetch_url//[[:space:]]/}" ]]; then
			continue
		fi

		if [[ "${fetch_url:0:1}" == "#" ]]; then
			continue
		fi

		((line_number++))

		for (( run_index = 1; run_index <= NUMBER_OF_RUNS; run_index++ )); do
			benchmark_url "${fetch_url}" "${line_number}" "${run_index}"
		done
	done < "${URL_FILE}"
}

benchmark_file