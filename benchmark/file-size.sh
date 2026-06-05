#!/bin/bash

# On récupère le dossier courant
DOSSIER=$(pwd)

# On créé le fichier CSV
FICHIER_CSV="$DOSSIER/taille_fichiers.csv"

# On écrit l'en-tête du fichier CSV
echo "Nom du fichier;Poids (Bytes)" > "$FICHIER_CSV"

# On boucle sur les fichiers du dossier
for fichier in *; do
  # On vérifie si c'est un fichier (et pas un dossier)
  if [ -f "$fichier" ]; then
    # On récupère la taille du fichier en Bytes
    TAILLE=$(stat -c%s "$fichier")
    # On écrit le nom et la taille du fichier dans le CSV
    echo "$fichier,$TAILLE" >> "$FICHIER_CSV"
  fi
done

echo "Fichier CSV généré : $FICHIER_CSV"