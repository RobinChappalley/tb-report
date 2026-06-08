#!/usr/bin/env bash

# Script de benchmark pour récupérer des images via Cloudinary fetch
# Il exécute plusieurs requêtes curl, mesure des métriques, et écrit un CSV.

# Quit on error, treat unset vars as errors, and fail pipelines on first failing command
set -euo pipefail

# Test id utilisé pour distinguer éventuellement des répertoires temporaires
TEST_ID=$(date +%s)

# --- Configuration ---
# URL de base pour fetcher une image via Cloudinary
BASE_URL="https://image-resizer.dev/cdn-cgi/image"
# En-tête Accept pour préférer les formats modernes (avif/webp)
ACCEPT_HEADER="image/avif,image/webp,image/apng,*/*;q=0.8"
# Fichier CSV de sortie
OUTPUT_CSV="resultats_benchmark_cloudflare.csv"
# Note: la variable TEST_ID est insérée pour générer un dossier unique si nécessaire
IMAGE_BASE_URL="wp-content/uploads/raw/v-${TEST_ID}/image-test-"
# Nombre total d'images à tester
NUMBER_OF_IMAGES=12
# Combien des premières images sont en JPG (les dernières seront en PNG)
NUMBER_OF_JPG_IMAGES=8
# Nombre d'itérations (passes) par image
NUMBER_OF_RUNS=11


# Liste des transformations Cloudinary à tester.
# Chaque élément sera inséré entre la base Cloudinary et l'URL de l'image.
TRANSFORMATIONS=(
	"f=auto,q=auto"  # transformation générique: Cloudinary choisit le format optimal
)

# Si le CSV n'existe pas, on ajoute l'entête. L'ordre des colonnes est choisi
# pour que l'URL finale (fetch_url) soit la première colonne, facile à lire.
if [[ ! -f "${OUTPUT_CSV}" ]]; then
	printf 'fetch_url,image_url,run_index,transformation,http_code,content_type,size_download,time_starttransfer,time_total\n' > "${OUTPUT_CSV}"
fi


## ---------- Fonctions ----------

## Execute curl pour une image + transformation donnée et append les métriques au CSV
## Arguments:
##   $1 = image_url (ex: https://.../image-test-1.jpg)
##   $2 = run_index (numéro d'itération pour cette image)
##   $3 = transformation (chaîne Cloudinary, ex: f_auto,q_auto)
benchmark_variant() {
	local image_url="$1"
	local run_index="$2"
	local transformation="$3"

	# Construire l'URL que Cloudinary va fetcher
	local fetch_url="${BASE_URL}/${transformation}/${image_url}"

	# Exécuter curl en mode silencieux, récupérer plusieurs métriques formatées par tab
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

	# Décomposer la sortie dans des variables individuelles
	IFS=$'\t' read -r http_code content_type size_download time_starttransfer time_total <<< "${metrics}"

	# Écrire une ligne CSV; on quote certains champs pour sécurité
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


## Construit l'URL source de l'image (jpg pour les premières images, png pour la dernière)
build_image_url() {
	local image_index="$1"

	if (( image_index <= NUMBER_OF_JPG_IMAGES )); then
		printf '%s%d.jpg' "${IMAGE_BASE_URL}" "${image_index}"
	else
		printf '%s%d.png' "${IMAGE_BASE_URL}" "${image_index}"
	fi
}


## Pour une image donnée, exécute NUMBER_OF_RUNS passes, et pour chaque passe
## teste toutes les transformations listées.
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


## Boucle principale: itère sur toutes les images configurées
for (( image_index = 1; image_index <= NUMBER_OF_IMAGES; image_index++ )); do
	benchmark_image "${image_index}"
done