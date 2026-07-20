#!/usr/bin/env bash
set -euo pipefail

URL_FILE="images-urls"
OUTPUT_CSV="resultats_benchmark.csv"
TIMESTAMP=$(date +%s) # Pour le cache busting du serveur d'origine
NUMBER_OF_RUNS=11
CLOUDINARY_CLOUD="di5rp4t2p"
NUMBER_OF_JPG=8

echo "solution,image_id,run,http_code,content_type,size_download,time_starttransfer,time_total,cf_cache_status" > "${OUTPUT_CSV}"

# Fonction de mélange d'un tableau (Fisher-Yates) - portable (pas besoin de shuf)
shuffle_array() {
    local arr=("$@")
    local i j tmp
    for (( i=${#arr[@]}-1; i>0; i-- )); do
        j=$((RANDOM % (i+1)))
        tmp="${arr[i]}"
        arr[i]="${arr[j]}"
        arr[j]="$tmp"
    done
    printf '%s\n' "${arr[@]}"
}

# On s'assure que le fichier a le bon nombre de lignes
TOTAL_LINES=$(wc -l < "${URL_FILE}")
if [[ "$TOTAL_LINES" -ne 12 ]]; then
    echo "Erreur: Le fichier d'URL doit contenir exactement 12 lignes."
    exit 1
fi

# Lecture du fichier ligne par ligne via un descripteur de fichier (FD 3)
exec 3< "${URL_FILE}"

for i in {1..12}; do
    # Détermination du format comme dans ton PHP
    if [[ $i -le $NUMBER_OF_JPG ]]; then format="jpg"; else format="png"; fi
    image_name="image-test-${i}.${format}"
    # Lecture de l'URL imgproxy depuis le fichier
    read -u 3 imgproxy_url
    # Nettoyage d'un éventuel retour chariot
    imgproxy_url="${imgproxy_url%$'\r'}"
    # Génération à la volée des autres URL
    webserverdomain="https://image.chapi.ch"
    raw_url="/wp-content/uploads/raw/v-${TIMESTAMP}/${image_name}"
    image_url="${webserverdomain}${raw_url}"
    cloudinary_url="https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/fetch/f_auto,q_auto/${image_url}"
    cloudflare_url="https://image-resizer.dev/cdn-cgi/image/f=auto,q=auto/${raw_url}"
       # Définition de l'en-tête Accept (navigateur moderne)
    ACCEPT_HEADER="Accept: image/avif,image/webp,image/apng,*/*;q=0.8"

    for (( run=1; run<=NUMBER_OF_RUNS; run++ )); do
        
        # Création d'un tableau avec les 3 solutions et mélange aléatoire (portable)
        solutions=("Imgproxy" "Cloudinary" "Cloudflare")
        # shuffle_array imprime une valeur par ligne -> lire en tableau
        IFS=$'\n' read -r -d '' -a shuffled_solutions < <(shuffle_array "${solutions[@]}" && printf '\0')
        for sol in "${shuffled_solutions[@]}"; do
            case $sol in
                ("Imgproxy")
                    target_url="${imgproxy_url}"
                    ;;
                ("Cloudinary")
                    target_url="${cloudinary_url}"
                    ;;
                ("Cloudflare")
                    target_url="${cloudflare_url}"
                    ;;
            esac
            metrics=$(curl -s -H "${ACCEPT_HEADER}" -o /dev/null -w '%{http_code},%{content_type},%{size_download},%{time_starttransfer},%{time_total},%{header_cf-cache-status}' "${target_url}")
            echo "${sol},${image_name},${run},${metrics}" >> "${OUTPUT_CSV}"    
            sleep 0.5
        done
    done
done
# Fermeture du descripteur de fichier
exec 3<&-
